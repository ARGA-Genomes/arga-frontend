"use client";

import classes from "../../components/record-list.module.css";
import tabsClasses from "../../components/event-timeline-tabs.module.css";

import * as Humanize from "humanize-plus";
import { ApolloError, gql, useQuery } from "@apollo/client";
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
  Divider,
} from "@mantine/core";
import { Layout } from "@nivo/tree";
import { Taxonomy, IndigenousEcologicalKnowledge, Photo } from "@/app/type";

import {
  IconArrowUpRight,
  IconBinaryTree2,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";
import { AttributePillValue, DataField } from "@/components/data-fields";
import { TaxonomyTree } from "@/components/graphing/taxon-tree";
import {
  EventTimeline,
  LineStyle,
  TimelineIcon,
} from "@/components/event-timeline";
import { useDisclosure } from "@mantine/hooks";
import {
  TaxonStatTreeNode,
  findChildren,
  findChildrenCanonical,
} from "@/queries/stats";
import { TaxonomySwitcher } from "@/components/taxonomy-switcher";
import { Taxon } from "@/queries/taxa";
import HorizontalTimeline, {
  TimelineItem,
  TimelineItemType,
} from "@/components/graphing/horizontal-timeline";
import { Publication } from "@/queries/publication";
import { Specimen } from "@/queries/specimen";
import { AnalysisMap } from "@/components/mapping";
import { ExternalLinkButton } from "@/components/button-link-external";
import { getCanonicalName } from "@/helpers/getCanonicalName";
import { InternalLinkButton } from "@/components/button-link-internal";
import RecordHistory from "@/components/record-history";
import {
  Action,
  GET_NOMENCLATURAL_ACT_PROVENANCE,
  Operation,
} from "@/queries/provenance";

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

type TaxaQuery = {
  taxa: {
    records: Taxon[];
  };
};

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

type ClassificationNode = {
  canonicalName: string;
  rank: string;
  depth: number;
};

type TaxonomicAct = {
  entityId: string;
  sourceUrl: string;
  taxon: {
    canonicalName: string;
    authorship?: string;
    status: string;
  };
};

type NomenclaturalAct = {
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
};

type NamePublication = {
  publishedYear?: number;
  citation?: string;
  sourceUrl?: string;
  typeCitation?: string;
};

type TaxonQuery = {
  taxon: Taxon & {
    hierarchy: ClassificationNode[];
    nomenclaturalActs: NomenclaturalAct[];
  };
};

type SynonymsQuery = {
  taxon: {
    taxonomicActs: TaxonomicAct[];
  };
};

type TypeSpecimenQuery = {
  taxon: {
    typeSpecimens: {
      specimen: Specimen;
      name: { scientificName: string };
    }[];
  };
};

const GET_PROVENANCE = gql`
  query NomenclaturalActProvenance($entityId: String) {
    provenance {
      nomenclaturalAct(by: { entityId: $entityId }) {
        operationId
        parentId
        action
        atom {
          ... on NomenclaturalActAtomText {
            type
            value
          }
          ... on NomenclaturalActAtomType {
            type
            value
          }
          ... on NomenclaturalActAtomDateTime {
            type
            value
          }
        }
        datasetVersion {
          datasetId
          version
          createdAt
          importedAt
        }
        dataset {
          id
          name
          shortName
          rightsHolder
          citation
          license
          description
          url
        }
      }
    }
  }
`;

enum AtomTextType {
  Empty,
  ScientificName,
  ActedOn,
  Act,
  SourceUrl,
  Publication,
  PublicationDate,
}

enum AtomType {
  NomenclaturalActType,
}

enum AtomDateTimeType {
  CreatedAt,
  UpdatedAt,
}

interface AtomText {
  type: AtomTextType;
  value: string;
}

interface AtomNomenclaturalType {
  type: AtomType;
  value: string;
}

interface AtomDateTime {
  type: AtomDateTimeType;
  value: string;
}

interface Dataset {
  id: string;
  name: string;
  shortName?: string;
  rightsHolder?: string;
  citation?: string;
  license?: string;
  description?: string;
  url?: string;
}

type ProvenanceQuery = {
  provenance: {
    nomenclaturalAct: Operation[];
  };
};

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

type VernacularName = {
  datasetId: string;
  vernacularName: string;
  citation?: string;
  sourceUrl?: string;
};

type Synonym = {
  scientificName: string;
  canonicalName: string;
  authorship?: string;
};

type TaxonNode = {
  canonicalName: string;
  rank: string;
};

type Species = {
  taxonomy: Taxonomy[];
  hierarchy: TaxonNode[];
  vernacularNames: VernacularName[];
  synonyms: Synonym[];
  photos: Photo[];
  indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[];
};

type QueryResults = {
  species: Species;
};

const GET_TAXON_TREE_STATS = gql`
  query TaxonTreeStats(
    $taxonRank: TaxonomicRank
    $taxonCanonicalName: String
    $includeRanks: [TaxonomicRank]
  ) {
    stats {
      taxonBreakdown(
        taxonRank: $taxonRank
        taxonCanonicalName: $taxonCanonicalName
        includeRanks: $includeRanks
      ) {
        ...TaxonStatTreeNode
        children {
          ...TaxonStatTreeNode
          children {
            ...TaxonStatTreeNode
            children {
              ...TaxonStatTreeNode
              children {
                ...TaxonStatTreeNode
                children {
                  ...TaxonStatTreeNode
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

type TaxonTreeStatsQuery = {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
};

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
        const response = await fetch(
          `https://api.ala.org.au/species/guid/${encodeURIComponent(
            canonicalName
          )}`
        );
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(
          matches.map(({ acceptedIdentifier }) => acceptedIdentifier)
        );
      } catch (error) {
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
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<IconExternalLink size="1rem" />}
          >
            View on&nbsp;<b>FrogID</b>
          </Button>
        )}
        {hasAFD && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<IconExternalLink size="1rem" />}
          >
            View on&nbsp;<b>AFD</b>
          </Button>
        )}
      </Group>
    </Paper>
  );
}

function Synonyms({ taxonomy }: { taxonomy: Taxonomy }) {
  const { loading, error, data } = useQuery<SynonymsQuery>(GET_SYNONYMS, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const acts = data?.taxon.taxonomicActs.filter(
    (act) => act.taxon.status !== "ACCEPTED"
  );

  // Object.groupBy is not available for a es2017 target so we manually implement it here
  let synonyms: Record<string, TaxonomicAct[]> = {};
  for (const act of acts || []) {
    synonyms[act.taxon.status] ||= [];
    synonyms[act.taxon.status].push(act);
  }

  return (
    <Paper>
      {Object.entries(synonyms).map(([status, acts]) => (
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
      ))}
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
  synonyms: Synonym[];
  commonNames: VernacularName[];
  tree?: TaxonTreeStatsQuery;
  isSubspecies?: boolean;
}

function findSubspecies(node: TaxonStatTreeNode[] | TaxonStatTreeNode) {
  if (Array.isArray(node)) {
  }
}

function Details({
  taxonomy,
  synonyms,
  commonNames,
  tree,
  isSubspecies,
}: DetailsProps) {
  const { loading, error, data } = useQuery<TypeSpecimenQuery>(
    GET_TYPE_SPECIMENS,
    {
      variables: {
        rank: taxonomy.rank,
        canonicalName: taxonomy.canonicalName,
      },
    }
  );

  const specimens = data?.taxon.typeSpecimens;

  const typeSpecimens = specimens?.filter(
    (typeSpecimen) =>
      typeSpecimen.name.scientificName == taxonomy.scientificName &&
      typeSpecimen.specimen.typeStatus != "no voucher"
  );
  const typeSpecimen = typeSpecimens && typeSpecimens[0]?.specimen;

  const subspecies =
    tree?.stats.taxonBreakdown[0] &&
    findChildrenCanonical(tree.stats.taxonBreakdown[0], taxonomy.canonicalName);

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
              <DataTableRow label="Status">
                <AttributePillValue value={taxonomy.status.toLowerCase()} />
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
                    value={[
                      typeSpecimen?.locality,
                      typeSpecimen?.stateProvince,
                      typeSpecimen?.country,
                    ]
                      .filter((t) => t)
                      .join(", ")}
                  />
                  {typeSpecimen?.locationSource && (
                    <SourcePill value={typeSpecimen?.locationSource} />
                  )}
                </Flex>
              </DataTableRow>
              {typeSpecimen &&
                typeSpecimen.latitude &&
                typeSpecimen.longitude && (
                  <DataTableRow label="Type location (geo)">
                    <Group>
                      <DataField
                        value={[typeSpecimen?.latitude, typeSpecimen?.longitude]
                          .filter((t) => t)
                          .join(", ")}
                      />

                      <Popover
                        width={500}
                        position="right"
                        withArrow
                        shadow="md"
                      >
                        <Popover.Target>
                          <Button
                            variant="subtle"
                            leftSection={<IconSearch />}
                            color="shellfish"
                          >
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
              Synonyms
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
              <Text fw={600} fz="sm" c="midnight.8">
                {commonNames.length > 0 ? (
                  commonNames.map((r) => r.vernacularName).join("; ")
                ) : (
                  <Text fw={700} size="sm" c="dimmed">
                    No data
                  </Text>
                )}
              </Text>
            </Paper>
            {!isSubspecies && (
              <Paper radius={16} p="sm" withBorder>
                <Text fw={300} fz="sm">
                  Subspecies
                </Text>
                {tree ? (
                  <Stack gap={4}>
                    {(subspecies || []).length > 0 ? (
                      subspecies?.map((species, idx) => (
                        <InternalLinkButton
                          key={`${species.scientificName}-${idx}`}
                          url={`/subspecies/${species.scientificName}`}
                          externalLinkName={species.scientificName}
                          icon={IconArrowUpRight}
                          outline
                        />
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
  SPECIES_NOVA: "/timeline-icons/original_description.svg",
  SUBSPECIES_NOVA: "/timeline-icons/original_description.svg",
  GENUS_SPECIES_NOVA: "/timeline-icons/original_description.svg",
  COMBINATIO_NOVA: "/timeline-icons/recombination.svg",
  REVIVED_STATUS: "/timeline-icons/orignal_description.svg",
  NAME_USAGE: "/timeline-icons/name_usage.svg",
  SUBGENUS_PLACEMENT: "/timeline-icons/recombination.svg",
  ORIGINAL_DESCRIPTION: "/timeline-icons/original_description.svg",
  REDESCRIPTION: "/timeline-icons/original_description.svg",
  DEMOTION: "/timeline-icons/recombination.svg",
  PROMOTION: "/timeline-icons/recombination.svg",
  SYNONYMISATION: "/timeline-icons/synonymy.svg",
  HETEROTYPIC_SYNONYMY: "/timeline-icons/synonymy.svg",
  HOMOTYPIC_SYNONYMY: "/timeline-icons/synonymy.svg",
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
  let aYear = a.publication.publishedYear;
  let bYear = b.publication.publishedYear;

  // always return acts with dates first
  if (aYear && !bYear) return -1;
  if (bYear && !aYear) return 1;
  if (!aYear && !bYear) return 0;

  if (aYear && bYear) {
    if (aYear > bYear) return 1;
    if (aYear < bYear) return -1;

    let order = ACT_TYPE_ORDER[a.act] - ACT_TYPE_ORDER[b.act];
    if (order === 0)
      return a.name.scientificName.localeCompare(b.name.scientificName);
    return order;
  }

  return 0;
}

function History({ taxonomy }: { taxonomy: Taxonomy }) {
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
  let itemSet = new Map<string, TimelineItem>();
  for (const item of acts) {
    const date =
      (item.publication.publishedDate &&
        new Date(item.publication.publishedDate)) ||
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
  let items: TimelineItem[] = [...itemSet.values()];

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
          {timelineItems.length === 0 && (
            <Text className={classes.emptyList}>no data</Text>
          )}

          {timelineItems.length > 0 && (
            <HorizontalTimeline data={timelineItems} />
          )}
        </Stack>
      </Paper>
      <Paper radius={16} p="md" withBorder>
        <Text fw={600} size="lg" pb="lg">
          Nomenclatural timeline
        </Text>
        {acts.length === 0 && (
          <Text className={classes.emptyList}>no data</Text>
        )}

        <EventTimeline>
          {acts.map((act, idx) => (
            <EventTimeline.Item
              key={idx}
              icon={
                <TimelineIcon
                  icon={ACT_ICON[act.act]}
                  lineStyle={
                    idx < acts.length - 1 ? LineStyle.Solid : LineStyle.None
                  }
                />
              }
              header={<NomenclaturalActHeader item={act} />}
              body={<NomenclaturalActBody item={act} protonym={protonym} />}
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
      id={`${item.name.canonicalName.replaceAll(" ", "-").toLowerCase()}-${
        item.publication.publishedYear
      }`}
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
}

function NomenclaturalActBody({ item, protonym }: NomenclaturalActBodyProps) {
  const { loading, error, data } = useQuery<ProvenanceQuery>(
    GET_NOMENCLATURAL_ACT_PROVENANCE,
    {
      variables: { entityId: item.entityId },
    }
  );

  const specimens = useQuery<TypeSpecimenQuery>(GET_TYPE_SPECIMENS, {
    variables: {
      rank: "SPECIES",
      canonicalName: item.name.canonicalName,
    },
  });

  const typeSpecimens = specimens.data?.taxon.typeSpecimens.filter(
    (typeSpecimen) =>
      typeSpecimen.name.scientificName == item.name.scientificName &&
      typeSpecimen.specimen.typeStatus != "no voucher"
  );

  function humanize(text: string) {
    return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
  }

  const act = humanize(item.act);
  const items = data?.provenance.nomenclaturalAct.filter(
    (item) => item.action !== Action.CREATE
  );

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
            value={item.publication.title}
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
            {item.name.taxa[0]?.status == "SYNONYM" && (
              <AttributePillValue value="Unaccepted" />
            )}
            <AttributePillValue value={humanize(item.name.taxa[0]?.status)} />
          </Group>
        </DataTableRow>

        {item.act == "ORIGINAL_DESCRIPTION" && (
          <DataTableRow label="Type material" key={item.entityId}>
            <Group gap={5}>
              {typeSpecimens?.map((specimen) => (
                <TypeSpecimenPill
                  specimen={specimen.specimen}
                  key={specimen.specimen.entityId}
                />
              ))}
            </Group>
          </DataTableRow>
        )}
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
  hierarchy: TaxonNode[];
  pin?: string;
  tree: ReturnType<typeof useQuery<TaxonTreeStatsQuery>>;
}

function FamilyTaxonTree({ hierarchy, pin, tree }: FamilyTaxonTreeProps) {
  const [layout, setLayout] = useState<Layout>("top-to-bottom");

  const { loading, error, data } = tree;

  const treeData = data?.stats.taxonBreakdown[0];
  const pinned = hierarchy.map((h) => h.canonicalName).concat(pin || "");

  const expandedFamily = hierarchy
    .filter((h) => h.rank === "FAMILY" || h.rank === "FAMILIA")
    .map((h) => h.canonicalName);
  const expandedGenera = treeData && findChildren(treeData, expandedFamily[0]);

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
            const newLayout =
              layout === "top-to-bottom" ? "right-to-left" : "top-to-bottom";
            setLayout(newLayout);
          }}
        >
          <IconBinaryTree2
            style={{
              transform:
                layout === "top-to-bottom" ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </Button>
      </Group>

      {error && <Text>{error.message}</Text>}
      <LoadOverlay visible={loading} />
      <Box h={800}>
        {treeData && (
          <TaxonomyTree
            layout={layout}
            data={treeData}
            pinned={pinned}
            initialExpanded={expandedGenera}
          />
        )}
      </Box>
    </Paper>
  );
}

const TAXA_SOURCE_PRIORITIES = [
  "Australian Living Atlas",
  "Australian Faunal Directory",
];

const sortTaxaBySources = (taxonomy: Taxonomy[]) => {
  return taxonomy
    .map((t) => t)
    .sort((a: Taxonomy, b: Taxonomy): number => {
      let indexA = TAXA_SOURCE_PRIORITIES.indexOf(a.source || "");
      let indexB = TAXA_SOURCE_PRIORITIES.indexOf(b.source || "");

      if (indexA == -1) indexA = TAXA_SOURCE_PRIORITIES.length;
      if (indexB == -1) indexB = TAXA_SOURCE_PRIORITIES.length;

      if (indexA < indexB) return -1;
      else if (indexA > indexB) return 1;
      else {
        const sourceA = a.source || "";
        const sourceB = b.source || "";
        return sourceA.localeCompare(sourceB);
      }
    });
};

export default function TaxonomyPage({
  params,
  isSubspecies,
}: {
  params: { name: string };
  isSubspecies?: boolean;
}) {
  const canonicalName = getCanonicalName(params);

  const { loading, error, data } = useQuery<QueryResults>(
    isSubspecies ? GET_SUMMARY : GET_SUMMARY_HIERARCHY,
    {
      variables: { canonicalName },
    }
  );

  const species = data?.species;
  const taxonomy = species && sortTaxaBySources(species.taxonomy)[0];
  const hierarchy = species?.hierarchy;

  const results = useQuery<TaxaQuery>(GET_TAXA, {
    variables: { filters: [{ canonicalName }] },
  });

  const subfamily = hierarchy?.find(
    (node) =>
      node.rank === "SUBFAMILY" ||
      node.rank === "SUBFAMILIA" ||
      node.rank === "FAMILY" ||
      node.rank === "FAMILIA"
  );

  const tree = useQuery<TaxonTreeStatsQuery>(GET_TAXON_TREE_STATS, {
    variables: {
      taxonRank: subfamily?.rank || "SUBFAMILY",
      taxonCanonicalName: subfamily?.canonicalName,
      includeRanks: [
        "FAMILY",
        "FAMILIA",
        "SUBFAMILY",
        "SUBFAMILIA",
        "TRIBE",
        "SUBTRIBE",
        "GENUS",
        "SUBGENUS",
        "SPECIES",
        "SUBSPECIES",
      ],
    },
    skip: !hierarchy,
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  console.log(tree.data);

  return (
    <Stack>
      <Grid>
        <Grid.Col span={12}>
          <Stack gap={20} pos="relative">
            <LoadOverlay visible={loading} />
            {species && taxonomy && (
              <Details
                taxonomy={taxonomy}
                synonyms={species.synonyms}
                commonNames={species.vernacularNames}
                tree={tree.data}
                isSubspecies={isSubspecies}
              />
            )}
            {results.data && (
              <TaxonomySwitcher taxa={results.data.taxa.records} />
            )}
          </Stack>
        </Grid.Col>
      </Grid>
      {hierarchy && (
        <FamilyTaxonTree
          hierarchy={hierarchy}
          pin={taxonomy?.canonicalName}
          tree={tree}
        />
      )}
      <ExternalLinks canonicalName={canonicalName} species={data?.species} />

      {taxonomy && <History taxonomy={taxonomy} />}
    </Stack>
  );
}

function TypeSpecimenPill({ specimen }: { specimen: Specimen }) {
  const [opened, { close, open }] = useDisclosure(false);
  const bg = "#d6e4ed";
  const popover = "#ecf7fe";
  const geo =
    specimen.latitude && `${specimen.latitude}, ${specimen.longitude}`;

  function humanize(text: string) {
    return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
  }

  return (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      radius="md"
    >
      <Popover.Target>
        <Paper
          py={5}
          px={15}
          bg={opened ? bg : bg}
          radius="xl"
          style={{ border: "none" }}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Group>
            <Text
              fw={600}
              size="sm"
              style={{
                whiteSpace: "nowrap",
                transition: "ease all 250ms",
              }}
              truncate
            >
              {specimen.recordId}
            </Text>
            <Text size="xs">{humanize(specimen.typeStatus || "")}</Text>
          </Group>
        </Paper>
      </Popover.Target>
      <Popover.Dropdown bg={popover}>
        <DataTable>
          <DataTableRow label="Type location (source)">
            <DataField value={specimen.locality} />
          </DataTableRow>
          <DataTableRow label="Type location (geo)">
            <DataField value={geo} />
          </DataTableRow>
        </DataTable>
      </Popover.Dropdown>
    </Popover>
  );
}
