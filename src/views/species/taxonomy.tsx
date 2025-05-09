"use client";

import classes from "../../components/record-list.module.css";
import tabsClasses from "../../components/event-timeline-tabs.module.css";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tabs,
  ScrollArea,
  Box,
  Popover,
  Flex,
  Center,
  Divider,
  ThemeIcon,
  Indicator,
  Badge,
} from "@mantine/core";
import { Layout } from "@nivo/tree";
import { Taxonomy, IndigenousEcologicalKnowledge, Photo } from "@/app/type";

import {
  IconArrowUpRight,
  IconBinaryTree2,
  IconDna,
  IconDnaOff,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";
import { AttributePillValue, DataField } from "@/components/data-fields";
import { TaxonTree, Node } from "@/components/graphing/TaxonTree";
import { EventTimeline, LineStyle, TimelineIcon } from "@/components/event-timeline";
import { useDisclosure, useResizeObserver } from "@mantine/hooks";
import { TaxonStatTreeNode } from "@/queries/stats";
import { TaxonomySwitcher } from "@/components/taxonomy-switcher";
import { Taxon } from "@/queries/taxa";
import HorizontalTimeline, { TimelineItem, TimelineItemType } from "@/components/graphing/horizontal-timeline";
import { Publication } from "@/queries/publication";
import { Specimen } from "@/queries/specimen";
import { AnalysisMap } from "@/components/mapping";
import { ExternalLinkButton } from "@/components/button-link-external";
import { getCanonicalName } from "@/helpers/getCanonicalName";
import { InternalLinkButton } from "@/components/button-link-internal";
import RecordHistory from "@/components/record-history";
import { Action, GET_NOMENCLATURAL_ACT_PROVENANCE, Operation } from "@/queries/provenance";
import { useDatasets } from "@/app/source-provider";

const GET_TAXA = gql`
  query TaxaTaxonomyPage($filters: [TaxaFilter]) {
    taxa(filters: $filters) {
      records {
        datasetId
        entityId

        ...TaxonName
        ...TaxonSource

        hierarchy {
          ...TaxonNode
        }
      }
    }
  }
`;

interface TaxaQuery {
  taxa: {
    records: Taxon[];
  };
}

const GET_TAXON = gql`
  query TaxonSpecies($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      ...TaxonName
      ...TaxonSource

      hierarchy {
        canonicalName
        rank
        depth
      }

      taxonomicActs {
        entityId
        sourceUrl
        taxon {
          canonicalName
          authorship
          status
        }
      }

      nomenclaturalActs {
        entityId
        act
        sourceUrl
        publication {
          ...Publication
        }
        name {
          scientificName
          canonicalName
          authorship
          taxa {
            canonicalName
            authorship
            status
            citation
          }
        }
        actedOn {
          scientificName
          canonicalName
          authorship
        }
      }
    }
  }
`;

const GET_SYNONYMS = gql`
  query TaxonSynonyms($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      taxonomicActs {
        entityId
        sourceUrl
        taxon {
          canonicalName
          authorship
          status
        }
      }
    }
  }
`;

const GET_TYPE_SPECIMENS = gql`
  query TaxonTypeSpecimens($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      typeSpecimens {
        name {
          scientificName
        }
        specimen {
          typeStatus
          recordId
          materialSampleId
          collectionCode
          institutionCode
          institutionName
          recordedBy
          identifiedBy
          locality
          country
          stateProvince
          latitude
          longitude
        }
      }
    }
  }
`;

interface ClassificationNode {
  canonicalName: string;
  rank: string;
  depth: number;
}

interface TaxonomicAct {
  entityId: string;
  sourceUrl: string;
  taxon: {
    canonicalName: string;
    authorship?: string;
    status: string;
  };
}

interface NomenclaturalAct {
  entityId: string;
  act: string;
  sourceUrl: string;
  publication: Publication;
  name: {
    scientificName: string;
    canonicalName: string;
    authorship?: string;
    taxa: {
      canonicalName: string;
      authorship?: string;
      status: string;
      citation?: string;
    }[];
  };
  actedOn: {
    scientificName: string;
    canonicalName: string;
    authorship?: string;
  };
}

interface TaxonQuery {
  taxon: Taxon & {
    hierarchy: ClassificationNode[];
    nomenclaturalActs: NomenclaturalAct[];
  };
}

interface SynonymsQuery {
  taxon: {
    taxonomicActs: TaxonomicAct[];
  };
}

interface TypeSpecimenQuery {
  taxon: {
    typeSpecimens: {
      specimen: Specimen;
      name: { scientificName: string };
    }[];
  };
}

interface SpecimenRecordNumbers {
  markers: number;
  sequences: number;
  wholeGenomes: number;
}

interface ProvenanceQuery {
  provenance: {
    nomenclaturalAct: Operation[];
  };
}

const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authorship
        status
        rank
        source
        sourceUrl
        __typename
      }
      vernacularNames {
        datasetId
        vernacularName
        citation
        sourceUrl
        __typename
      }
      synonyms {
        scientificName
        canonicalName
        authorship
        __typename
      }
      photos {
        url
        source
        publisher
        license
        rightsHolder
        __typename
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
        __typename
      }
      dataSummary {
        genomes
        loci
        __typename
      }
      __typename
    }
  }
`;

const GET_SUMMARY_HIERARCHY = gql`
  query SpeciesSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authorship
        status
        rank
        source
        sourceUrl
        __typename
      }
      hierarchy {
        canonicalName
        rank
        __typename
      }
      vernacularNames {
        datasetId
        vernacularName
        citation
        sourceUrl
        __typename
      }
      synonyms {
        scientificName
        canonicalName
        authorship
        __typename
      }
      photos {
        url
        source
        publisher
        license
        rightsHolder
        __typename
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
        __typename
      }
      dataSummary {
        genomes
        loci
        __typename
      }
      __typename
    }
  }
`;

interface VernacularName {
  datasetId: string;
  vernacularName: string;
  citation?: string;
  sourceUrl?: string;
}

interface Synonym {
  scientificName: string;
  canonicalName: string;
  authorship?: string;
}

interface TaxonNode {
  canonicalName: string;
  rank: string;
}

interface Species {
  taxonomy: Taxonomy[];
  hierarchy: TaxonNode[];
  vernacularNames: VernacularName[];
  synonyms: Synonym[];
  photos: Photo[];
  indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[];
  specimens: {
    total: number;
    records: Specimen[];
  };
}

interface QueryResults {
  species: Species;
}

const GET_TAXON_TREE_STATS = gql`
  query TaxonTreeStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $includeRanks: [TaxonomicRank]) {
    stats {
      taxonBreakdown(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, includeRanks: $includeRanks) {
        ...TaxonStatTreeNode

        # family children
        children {
          ...TaxonStatTreeNode

          # subfamily children
          children {
            ...TaxonStatTreeNode

            # genus children
            children {
              ...TaxonStatTreeNode

              # subgenus children
              children {
                ...TaxonStatTreeNode

                # species children
                children {
                  ...TaxonStatTreeNode

                  # subspecies children
                  children {
                    ...TaxonStatTreeNode

                    children {
                      ...TaxonStatTreeNode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_SPECIMENS = gql`
  query SpeciesSpecimens($canonicalName: String, $page: Int, $pageSize: Int) {
    species(canonicalName: $canonicalName) {
      specimens(page: $page, pageSize: $pageSize) {
        total
        records {
          id
          recordId
          datasetName
          accession
          institutionCode
          typeStatus
          locality
          country
          sequences
          wholeGenomes
          markers
          latitude
          longitude
        }
      }
    }
  }
`;

interface TaxonTreeStatsQuery {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
}

// Gets details for the specified taxon and the immediate decendants
const GET_TAXON_TREE_NODE = gql`
  query TaxonTreeNode($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $includeRanks: [TaxonomicRank]) {
    stats {
      taxonBreakdown(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, includeRanks: $includeRanks) {
        # family
        ...TaxonStatTreeNode

        # subfamilies
        children {
          ...TaxonStatTreeNode

          # genera
          children {
            ...TaxonStatTreeNode

            # species
            children {
              ...TaxonStatTreeNode
            }
          }
        }
      }
    }
  }
`;

interface TaxonTreeNodeQuery {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
}

interface TaxonMatch {
  identifier: string;
  name: string;
  acceptedIdentifier: string;
  acceptedName: string;
}

interface ExternalLinksProps {
  canonicalName: string;
  species?: Species;
}

function ExternalLinks({ canonicalName, species }: ExternalLinksProps) {
  const [matchedTaxon, setMatchedTaxon] = useState<string[] | null>(null);
  const hasFrogID = false;
  const hasAFD = false;

  // Fetch the taxon UID from the given name
  useEffect(() => {
    async function matchTaxon() {
      try {
        const response = await fetch(`https://api.ala.org.au/species/guid/${encodeURIComponent(canonicalName)}`);
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(matches.map(({ acceptedIdentifier }) => acceptedIdentifier));
      } catch {
        setMatchedTaxon([]);
      }
    }

    matchTaxon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={600} mb={10} size="lg">
        External links
      </Text>
      <Group mt="md" gap="xs">
        <ExternalLinkButton
          url={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
          externalLinkName="View on ALA"
          icon={IconArrowUpRight}
        />

        {species?.indigenousEcologicalKnowledge?.map((iek) => (
          <Button
            key={iek.id}
            component="a"
            radius="md"
            color="gray"
            variant="light"
            size="xs"
            leftSection={<IconExternalLink size="1rem" color="black" />}
            href={iek.sourceUrl}
            target="_blank"
          >
            <Text>
              View on&nbsp;<b>Profiles</b>
            </Text>
          </Button>
        ))}

        {hasFrogID && (
          <Button radius="md" color="midnight" size="xs" leftSection={<IconExternalLink size="1rem" />}>
            View on&nbsp;<b>FrogID</b>
          </Button>
        )}
        {hasAFD && (
          <Button radius="md" color="midnight" size="xs" leftSection={<IconExternalLink size="1rem" />}>
            View on&nbsp;<b>AFD</b>
          </Button>
        )}
      </Group>
    </Paper>
  );
}

function Synonyms({ taxonomy }: { taxonomy: Taxonomy }) {
  const { data } = useQuery<SynonymsQuery>(GET_SYNONYMS, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const acts = data?.taxon.taxonomicActs.filter((act) => act.taxon.status !== "ACCEPTED");

  // Object.groupBy is not available for a es2017 target so we manually implement it here
  const synonyms: Record<string, TaxonomicAct[]> = {};
  for (const act of acts || []) {
    synonyms[act.taxon.status] ||= [];
    synonyms[act.taxon.status].push(act);
  }

  const entries = Object.entries(synonyms);

  return (
    <Paper>
      {entries.length > 0 ? (
        entries.map(([status, acts]) => (
          <Stack gap={0} key={status}>
            {acts.map((act) => (
              <Group key={act.taxon.canonicalName} gap={10}>
                <Text fw={600} fz="sm" fs="italic" c="midnight.8">
                  {act.taxon.canonicalName}
                </Text>
                <Text fw={600} fz="sm" c="midnight.8">
                  {act.taxon.authorship}
                </Text>
              </Group>
            ))}
          </Stack>
        ))
      ) : (
        <Text fw={700} size="sm" c="dimmed">
          No synonyms
        </Text>
      )}
    </Paper>
  );
}

interface SourcePillProps {
  value: string;
}

function SourcePill({ value }: SourcePillProps) {
  return (
    <AttributePillValue
      color="transparent"
      value={value}
      textColor="shellfish"
      style={{
        border: "1px solid var(--mantine-color-shellfish-5)",
        minWidth: 90,
      }}
      popoverDisabled
    />
  );
}

interface DetailsProps {
  taxonomy: Taxonomy;
  commonNames: VernacularName[];
  subspecies?: TaxonStatTreeNode[];
  isSubspecies?: boolean;
}

function Details({ taxonomy, commonNames, subspecies, isSubspecies }: DetailsProps) {
  const { data } = useQuery<TypeSpecimenQuery>(GET_TYPE_SPECIMENS, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const specimens = data?.taxon.typeSpecimens;

  const typeSpecimens = specimens?.filter(
    (typeSpecimen) =>
      typeSpecimen.name.scientificName == taxonomy.scientificName && typeSpecimen.specimen.typeStatus != "no voucher",
  );
  const typeSpecimen = typeSpecimens?.[0]?.specimen;

  return (
    <Paper radius={16} p="md" withBorder>
      <Group justify="space-between" mb={10} align="baseline" gap="xl">
        <Text fw={600} size="lg">
          Taxonomy
        </Text>
        <Group>
          <Text fw={300} size="xs">
            Source
          </Text>
          <ExternalLinkButton
            url={taxonomy.sourceUrl}
            externalLinkName={taxonomy.source}
            outline
            icon={IconArrowUpRight}
          />
        </Group>
      </Group>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 5 }}>
          <Paper radius={16} p="sm" h="100%" withBorder>
            <DataTable>
              <DataTableRow label="Scientific name">
                <Group gap={10}>
                  <Text fw={600} fz="sm" fs="italic">
                    {taxonomy.canonicalName}
                  </Text>
                  <Text fw={600} fz="sm">
                    {taxonomy.authorship}
                  </Text>
                </Group>
              </DataTableRow>
              <DataTableRow label="Taxonomic status">
                <AttributePillValue value={taxonomy.status.toLowerCase()} />
              </DataTableRow>
              <DataTableRow label="Nomenclatural status">
                <AttributePillValue value={undefined} />
              </DataTableRow>
              <DataTableRow label="Protonym/Basionym">
                <AttributePillValue value={undefined} />
              </DataTableRow>
              <DataTableRow label="Original description">
                <DataField value={undefined} />
              </DataTableRow>
              <DataTableRow label="Type material">
                <AttributePillValue value={typeSpecimen?.recordId} />
              </DataTableRow>
              <DataTableRow label="Type location (from source)">
                <Flex justify="space-between" align="center">
                  <DataField
                    value={[typeSpecimen?.locality, typeSpecimen?.stateProvince, typeSpecimen?.country]
                      .filter((t) => t)
                      .join(", ")}
                  />
                  {typeSpecimen?.locationSource && <SourcePill value={typeSpecimen.locationSource} />}
                </Flex>
              </DataTableRow>
              {typeSpecimen?.latitude && typeSpecimen.longitude && (
                <DataTableRow label="Type location (geo)">
                  <Group>
                    <DataField value={[typeSpecimen.latitude, typeSpecimen.longitude].filter((t) => t).join(", ")} />

                    <Popover width={500} position="right" withArrow shadow="md">
                      <Popover.Target>
                        <Button variant="subtle" leftSection={<IconSearch />} color="shellfish">
                          View map
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown
                        p={0}
                        m={0}
                        style={{
                          borderRadius: "var(--mantine-radius-lg)",
                          overflow: "hidden",
                        }}
                      >
                        <Box pos="relative" h="500">
                          <AnalysisMap
                            markers={[
                              {
                                recordId: typeSpecimen.recordId,
                                latitude: typeSpecimen.latitude,
                                longitude: typeSpecimen.longitude,
                                color: [103, 151, 180, 220],
                              },
                            ]}
                            style={{
                              borderRadius: "var(--mantine-radius-lg)",
                              overflow: "hidden",
                            }}
                          ></AnalysisMap>
                        </Box>
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                </DataTableRow>
              )}
            </DataTable>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 3.5 }}>
          <Paper radius={16} p="sm" h="100%" withBorder>
            <Text fw={300} fz="sm">
              Taxonomic synonyms
            </Text>
            <Synonyms taxonomy={taxonomy} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 3.5 }}>
          <Stack>
            <Paper radius={16} p="sm" withBorder>
              <Text fw={300} fz="sm">
                Common names
              </Text>
              {commonNames.length > 0 ? (
                <Text fw={600} fz="sm" c="midnight.8">
                  {commonNames.map((r) => r.vernacularName).join("; ")}
                </Text>
              ) : (
                <Text fw={700} size="sm" c="dimmed">
                  No data
                </Text>
              )}
            </Paper>
            {!isSubspecies && (
              <Paper radius={16} p="sm" withBorder>
                <Text fw={300} fz="sm" pb={(subspecies || []).length > 0 ? "sm" : undefined}>
                  Subspecies
                </Text>
                {subspecies ? (
                  <Stack gap={8}>
                    {(subspecies || []).length > 0 ? (
                      subspecies.map((species, idx) => (
                        <InternalLinkButton
                          key={`${species.scientificName}-${idx}`}
                          url={`/subspecies/${species.scientificName}`}
                          icon={IconArrowUpRight}
                          color={"#d6e4ed"}
                          textColor="midnight.8"
                        >
                          {species.scientificName}
                        </InternalLinkButton>
                      ))
                    ) : (
                      <Text fw={700} size="sm" c="dimmed">
                        No subspecies
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text fw={700} size="sm" c="dimmed">
                    No subspecies
                  </Text>
                )}
              </Paper>
            )}
            {/* <Group justify="space-between" align="center">
              <AttributePillValue
                color="midnight.12"
                hoverColor="midnight.10"
                textColor="white"
                value="record history"
                popoverDisabled
              />
            </Group> */}
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

const ACT_TYPE_ORDER: Record<string, number> = {
  SPECIES_NOVA: 0,
  SUBSPECIES_NOVA: 1,
  GENUS_SPECIES_NOVA: 2,
  COMBINATIO_NOVA: 3,
  SUBGENUS_PLACEMENT: 4,
  REVIVED_STATUS: 5,
  NAME_USAGE: 6,
};

const ACT_ICON: Record<string, string> = {
  SPECIES_NOVA: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  SUBSPECIES_NOVA: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  GENUS_SPECIES_NOVA: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  COMBINATIO_NOVA: "/icons/taxonomic-act/Taxonomic act_ recombination.svg",
  REVIVED_STATUS: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  NAME_USAGE: "/icons/taxonomic-act/Taxonomic act_ name usage.svg",
  SUBGENUS_PLACEMENT: "/icons/taxonomic-act/Taxonomic act_ subgenus assignment.svg",
  ORIGINAL_DESCRIPTION: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  REDESCRIPTION: "/icons/taxonomic-act/Taxonomic act_ original description.svg",
  DEMOTION: "/icons/taxonomic-act/Taxonomic act_ demotion in rank.svg",
  PROMOTION: "/icons/taxonomic-act/Taxonomic act_ promotion in rank.svg",
  SYNONYMISATION: "/icons/taxonomic-act/Taxonomic act_ synonymy.svg",
  HETEROTYPIC_SYNONYMY: "/icons/taxonomic-act/Taxonomic act_ synonymy.svg",
  HOMOTYPIC_SYNONYMY: "/icons/taxonomic-act/Taxonomic act_ synonymy.svg",
};

const ACT_LABEL: Record<string, string> = {
  SPECIES_NOVA: "new species",
  SUBSPECIES_NOVA: " new subspecies",
  GENUS_SPECIES_NOVA: "new genus",
  COMBINATIO_NOVA: "generic recombination",
  SUBGENUS_PLACEMENT: "subgenus placement",
  REVIVED_STATUS: "revived",
  NAME_USAGE: "name usage",
  ORIGINAL_DESCRIPTION: "original description",
  REDESCRIPTION: "redescription",
  DEMOTION: "demotion",
  PROMOTION: "promotion",
  SYNONYMISATION: "synonymisation",
  HETEROTYPIC_SYNONYMY: "heterotypic synonymy",
  HOMOTYPIC_SYNONYMY: "homotypic synonymy",
};

// sort by publication year first, then by the type of the act, and lastly by scientific name
function compareAct(a: NomenclaturalAct, b: NomenclaturalAct): number {
  const aYear = a.publication.publishedYear;
  const bYear = b.publication.publishedYear;

  // always return acts with dates first
  if (aYear && !bYear) return -1;
  if (bYear && !aYear) return 1;
  if (!aYear && !bYear) return 0;

  if (aYear && bYear) {
    if (aYear > bYear) return 1;
    if (aYear < bYear) return -1;

    const order = ACT_TYPE_ORDER[a.act] - ACT_TYPE_ORDER[b.act];
    if (order === 0) return a.name.scientificName.localeCompare(b.name.scientificName);
    return order;
  }

  return 0;
}

function History({ taxonomy, specimens }: { taxonomy: Taxonomy; specimens?: Specimen[] }) {
  const { loading, error, data } = useQuery<TaxonQuery>(GET_TAXON, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const acts = data?.taxon.nomenclaturalActs.map((it) => it).sort(compareAct);

  if (!acts) {
    return;
  }

  const protonym = acts[0];

  // turn all nomenclatural acts into timeline items
  const itemSet = new Map<string, TimelineItem>();
  for (const item of acts) {
    const date =
      (item.publication.publishedDate && new Date(item.publication.publishedDate)) ||
      new Date(item.publication.publishedYear, 0, 1);

    const key = `${date}-${item.act}-${item.name.canonicalName}`;

    itemSet.set(key, {
      label: item.name.canonicalName,
      subtitle: ACT_LABEL[item.act],
      year: item.publication.publishedYear,
      act: item.act,
      date,
      type: TimelineItemType.Instant,
    });
  }
  const items: TimelineItem[] = [...itemSet.values()];

  const timelineItems = [...items];

  return (
    <>
      <LoadOverlay visible={loading} />
      <Paper radius={16} p="md" withBorder>
        <Stack>
          {error && <Text>Error : {error.message}</Text>}

          <Text fw={600} size="lg">
            Taxon History
          </Text>
          {timelineItems.length === 0 && <Text className={classes.emptyList}>no data</Text>}

          {timelineItems.length > 0 && <HorizontalTimeline data={timelineItems} />}
        </Stack>
      </Paper>
      <Paper radius={16} p="md" withBorder>
        <Text fw={600} size="lg" pb="lg">
          Nomenclatural timeline
        </Text>
        {acts.length === 0 && <Text className={classes.emptyList}>no data</Text>}

        <EventTimeline>
          {acts.map((act, idx) => (
            <EventTimeline.Item
              key={idx}
              icon={
                <TimelineIcon
                  icon={ACT_ICON[act.act]}
                  lineStyle={idx < acts.length - 1 ? LineStyle.Solid : LineStyle.None}
                />
              }
              header={<NomenclaturalActHeader item={act} />}
              body={<NomenclaturalActBody item={act} protonym={protonym} specimensWithData={specimens} />}
            />
          ))}
        </EventTimeline>
      </Paper>
    </>
  );
}

function NomenclaturalActHeader({ item }: { item: NomenclaturalAct }) {
  return (
    <Stack
      id={`${item.name.canonicalName.replaceAll(" ", "-").toLowerCase()}-${item.publication.publishedYear}`}
      mt={5}
    >
      {item.publication.publishedYear ? (
        <Text fz="xs" fw={700} c="dimmed" mt="sm">
          Year {item.publication.publishedYear}
        </Text>
      ) : (
        <Text fz="xs" fw={700} c="dimmed" style={{ fontVariant: "small-caps" }}>
          no date
        </Text>
      )}
    </Stack>
  );
}

interface NomenclaturalActBodyProps {
  item: NomenclaturalAct;
  protonym: NomenclaturalAct;
  specimensWithData?: Specimen[];
}

function NomenclaturalActBody({ item, protonym, specimensWithData }: NomenclaturalActBodyProps) {
  const { loading, data } = useQuery<ProvenanceQuery>(GET_NOMENCLATURAL_ACT_PROVENANCE, {
    variables: { entityId: item.entityId },
  });

  const specimens = useQuery<TypeSpecimenQuery>(GET_TYPE_SPECIMENS, {
    variables: {
      rank: "SPECIES",
      canonicalName: item.name.canonicalName,
    },
  });

  const typeSpecimens = specimens.data?.taxon.typeSpecimens.filter(
    (typeSpecimen) =>
      typeSpecimen.name.scientificName == item.name.scientificName && typeSpecimen.specimen.typeStatus != "no voucher",
  );

  const locality = useMemo(() => typeSpecimens?.find(({ specimen }) => specimen.locality !== null), [typeSpecimens]);
  const geo = useMemo(() => typeSpecimens?.find(({ specimen }) => specimen.latitude !== null), [typeSpecimens]);

  const specimenMap: Record<string, SpecimenRecordNumbers> = useMemo(() => {
    if (specimensWithData)
      return specimensWithData
        .filter((specimen) => (specimen.markers || 0) + (specimen.sequences || 0) + (specimen.wholeGenomes || 0) > 0)
        .reduce(
          (prev, specimen) => ({
            ...prev,
            [specimen.recordId]: {
              markers: specimen.markers,
              sequences: specimen.sequences,
              wholeGenomes: specimen.wholeGenomes,
            },
          }),
          {},
        );
    return {};
  }, [specimensWithData]);

  function humanize(text: string) {
    return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
  }

  const act = humanize(item.act);
  const items = data?.provenance.nomenclaturalAct.filter((item) => item.action !== Action.CREATE);

  return (
    <SimpleGrid cols={2} py="md">
      <LoadOverlay visible={loading} />
      <DataTable>
        <DataTableRow label="Scientific name">
          <Text fz="sm" fw={700} ml="sm">
            <i>{item.name.canonicalName}</i> {item.name.authorship}
          </Text>
        </DataTableRow>
        <DataTableRow label="Nomenclatural act">
          <Group>
            <AttributePillValue value={act} />
          </Group>
        </DataTableRow>
        <DataTableRow label="Publication">
          <DataField
            value={
              <Flex gap="sm" align="center">
                <ThemeIcon color="shellfish.6">
                  <IconExternalLink size="1rem" />
                </ThemeIcon>
                {item.publication.title}
              </Flex>
            }
            href={item.publication.sourceUrls[0]}
          />
        </DataTableRow>
        <DataTableRow label="Protonym/Basionym">
          <Text fz="sm" fw={700} ml="sm">
            <i>{protonym.name.canonicalName}</i> {protonym.name.authorship}
          </Text>
        </DataTableRow>
        <DataTableRow label="Current status">
          <Group>
            {item.name.taxa[0]?.status == "SYNONYM" && <AttributePillValue value="Unaccepted" />}
            <AttributePillValue value={humanize(item.name.taxa[0]?.status)} />
          </Group>
        </DataTableRow>
        {item.act == "ORIGINAL_DESCRIPTION" && (
          <DataTableRow label="Type material" key={item.entityId}>
            <Group gap={12}>
              {typeSpecimens?.map(({ specimen }) => (
                <TypeSpecimenPill
                  key={specimen.entityId}
                  specimen={specimen}
                  records={specimenMap?.[specimen.recordId]}
                />
              ))}
            </Group>
          </DataTableRow>
        )}
        <DataTableRow label="Type location (source)">
          <DataField value={locality?.specimen.locality} />
        </DataTableRow>
        <DataTableRow label="Type location (geo)">
          <DataField value={`${geo?.specimen.latitude}, ${geo?.specimen.longitude}`} />
        </DataTableRow>
      </DataTable>

      <Paper h={369} pt="md" radius="lg" withBorder>
        <Tabs classNames={tabsClasses} defaultValue="history">
          <Tabs.List px="md">
            <Tabs.Tab value="history">Record history</Tabs.Tab>
            <Tabs.Tab value="identifiers">Taxon identifiers</Tabs.Tab>
          </Tabs.List>
          <Divider mt="md" />
          <ScrollArea.Autosize h={300} pl="md" type="auto">
            <Tabs.Panel value="history">
              <RecordHistory operations={items} />
            </Tabs.Panel>
            <Tabs.Panel value="identifiers">
              <Text>Taxon identifiers here</Text>
            </Tabs.Panel>
          </ScrollArea.Autosize>
        </Tabs>
      </Paper>
    </SimpleGrid>
  );
}

interface FamilyTaxonTreeProps {
  family: TaxonStatTreeNode;
  datasetId: string;
  pinned?: string[];
}

function FamilyTaxonTree({ family, datasetId, pinned }: FamilyTaxonTreeProps) {
  const [ref, rect] = useResizeObserver();
  const [layout, setLayout] = useState<Layout>("top-to-bottom");

  // auto-expand the tree if there aren't that many total species
  const includeRanks = ["CLASS", "FAMILY", "SUBFAMILY", "GENUS"];
  if ((family.species || 0) < 100) includeRanks.push("SPECIES");

  const { loading, error, data } = useQuery<TaxonTreeNodeQuery>(GET_TAXON_TREE_NODE, {
    variables: {
      taxonRank: "FAMILY",
      taxonCanonicalName: family.canonicalName,
      includeRanks,
      datasetId,
    },
  });

  const treeData = data?.stats.taxonBreakdown[0];

  return (
    <Paper radius={16} p="md" withBorder>
      <Group justify="space-between">
        <Text fw={600} mb={10} size="lg">
          Interactive higher classification
        </Text>
        <Button
          color="midnight.8"
          radius="md"
          onClick={() => {
            const newLayout = layout === "top-to-bottom" ? "right-to-left" : "top-to-bottom";
            setLayout(newLayout);
          }}
        >
          <IconBinaryTree2
            style={{
              transform: layout === "top-to-bottom" ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </Button>
      </Group>

      {error && <Text>{error.message}</Text>}
      <LoadOverlay visible={loading} />
      <ScrollArea.Autosize ref={ref}>
        <Center>
          {treeData && (
            <TaxonTree
              minWidth={rect.width}
              height={900}
              data={treeData}
              pinned={pinned}
              onTooltip={(node) => <NodeTooltip node={node} />}
            />
          )}
        </Center>
      </ScrollArea.Autosize>
    </Paper>
  );
}

function NodeTooltip({ node }: { node: Node }) {
  return (
    <Paper p="md" bg="wheat.0" radius="lg" w={400} h={120}>
      <Group align="baseline" wrap="nowrap">
        <Text size="xs">{node.rank}</Text>
        <Text fs="italic">{node.canonicalName}</Text>
      </Group>
      <Group justify="center" my="xs">
        <StatBadge label="Loci" stat={node.loci} />
        <StatBadge label="Genomes" stat={node.genomes} />
        <StatBadge label="Specimens" stat={node.specimens} />
      </Group>
      <Group justify="center">
        <StatBadge label="Other" stat={node.other} />
        <StatBadge label="Total genomic" stat={node.totalGenomic} />
      </Group>
    </Paper>
  );
}

function StatBadge({ label, stat }: { label: string; stat?: number }) {
  return (
    <Badge variant="light" color={stat || 0 > 0 ? "moss" : "bushfire"}>
      {label}: {stat || 0}
    </Badge>
  );
}

const TAXA_SOURCE_PRIORITIES = ["Australian Living Atlas", "Australian Faunal Directory"];

const sortTaxaBySources = (taxonomy: Taxonomy[]) => {
  return taxonomy
    .map((t) => t)
    .sort((a: Taxonomy, b: Taxonomy): number => {
      let indexA = TAXA_SOURCE_PRIORITIES.indexOf(a.source ?? "");
      let indexB = TAXA_SOURCE_PRIORITIES.indexOf(b.source ?? "");

      if (indexA == -1) indexA = TAXA_SOURCE_PRIORITIES.length;
      if (indexB == -1) indexB = TAXA_SOURCE_PRIORITIES.length;

      if (indexA < indexB) return -1;
      else if (indexA > indexB) return 1;
      else {
        const sourceA = a.source ?? "";
        const sourceB = b.source ?? "";
        return sourceA.localeCompare(sourceB);
      }
    });
};

export default function TaxonomyPage({ params, isSubspecies }: { params: { name: string }; isSubspecies?: boolean }) {
  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const canonicalName = getCanonicalName(params);

  const { loading, error, data } = useQuery<QueryResults>(isSubspecies ? GET_SUMMARY : GET_SUMMARY_HIERARCHY, {
    variables: { canonicalName },
  });

  const species = data?.species;
  const taxonomy = species && sortTaxaBySources(species.taxonomy)[0];
  const hierarchy = species?.hierarchy;
  const pinned = hierarchy ? [canonicalName, ...hierarchy.map((h) => h.canonicalName)] : [canonicalName];

  const results = useQuery<TaxaQuery>(GET_TAXA, {
    variables: { filters: [{ canonicalName }] },
  });

  const family = hierarchy?.find((node) => node.rank === "FAMILY" || node.rank === "FAMILIA");

  const familyStats = useQuery<TaxonTreeNodeQuery>(GET_TAXON_TREE_NODE, {
    variables: {
      taxonRank: "FAMILY",
      taxonCanonicalName: family?.canonicalName,
      includeRanks: ["FAMILY"],
      datasetId,
    },
  });

  const subspecies = useQuery<TaxonTreeStatsQuery>(GET_TAXON_TREE_STATS, {
    variables: {
      taxonRank: "SPECIES",
      taxonCanonicalName: canonicalName,
      descendantRank: "SUBSPECIES",
    },
    skip: isSubspecies,
  });

  const { data: specimens } = useQuery<QueryResults>(GET_SPECIMENS, {
    variables: {
      canonicalName: canonicalName,
      page: 1,
      pageSize: 500,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Stack>
      <Grid>
        <Grid.Col span={12}>
          <Stack gap={20} pos="relative">
            <LoadOverlay visible={loading} />
            {species && taxonomy && (
              <Details
                taxonomy={taxonomy}
                commonNames={species.vernacularNames}
                subspecies={subspecies.data?.stats.taxonBreakdown}
                isSubspecies={isSubspecies}
              />
            )}
            {results.data && <TaxonomySwitcher taxa={results.data.taxa.records} />}
          </Stack>
        </Grid.Col>
      </Grid>
      {familyStats.data && datasetId && (
        <FamilyTaxonTree family={familyStats.data.stats.taxonBreakdown[0]} datasetId={datasetId} pinned={pinned} />
      )}
      <ExternalLinks canonicalName={canonicalName} species={data?.species} />

      {taxonomy && <History taxonomy={taxonomy} specimens={specimens?.species.specimens.records} />}
    </Stack>
  );
}

function humanize(text: string) {
  return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
}

function TypeSpecimenPill({ specimen, records }: { specimen: Specimen; records?: SpecimenRecordNumbers }) {
  const [opened, { close, open }] = useDisclosure(false);

  const hasData = Boolean(records);

  return (
    <Popover position="right" withArrow shadow="md" opened={opened && hasData} radius="md">
      <Popover.Target>
        <Indicator
          disabled={!hasData}
          offset={4}
          label={hasData ? <IconDna size={14} /> : <IconDnaOff size={14} />}
          size={24}
          color={hasData ? "moss" : "bushfire"}
        >
          <InternalLinkButton
            url={`specimens/${specimen.recordId}`}
            icon={IconArrowUpRight}
            color={"#d6e4ed"}
            textColor="midnight.8"
            onMouseEnter={hasData ? open : undefined}
            onMouseLeave={hasData ? close : undefined}
          >
            {specimen.recordId}
            <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>{humanize(specimen.typeStatus ?? "")}</span>
          </InternalLinkButton>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <DataTable>
          <DataTableRow label="Markers">
            <DataField value={records?.markers.toString()} />
          </DataTableRow>
          <DataTableRow label="Sequences">
            <DataField value={records?.markers.toString()} />
          </DataTableRow>
          <DataTableRow label="Whole genomes">
            <DataField value={records?.wholeGenomes.toString()} />
          </DataTableRow>
        </DataTable>
      </Popover.Dropdown>
    </Popover>
  );
}
