"use client";

import tabsClasses from "../../components/event-timeline-tabs.module.css";
import classes from "../../components/record-list.module.css";

import { gql, useQuery } from "@apollo/client";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Indicator,
  Paper,
  Popover,
  ScrollArea,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Layout } from "@nivo/tree";
import * as Humanize from "humanize-plus";

import { Dataset, useDatasets } from "@/app/source-provider";
import { ExternalLinkButton } from "@/components/button-link-external";
import { InternalLinkButton } from "@/components/button-link-internal";
import { AttributePillValue, DataField } from "@/components/data-fields";
import { DataTable, DataTableRow } from "@/components/data-table";
import { EventTimeline, LineStyle, TimelineIcon } from "@/components/event-timeline";
import HorizontalTimeline, { TimelineItem, TimelineItemType } from "@/components/graphing/horizontal-timeline";
import { Node, TaxonTree } from "@/components/graphing/TaxonTree";
import { LoadOverlay } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";
import RecordHistory from "@/components/record-history";
import { TaxonomySwitcher } from "@/components/taxonomy-switcher";
import {
  NomenclaturalAct,
  Provenance,
  Statistics,
  Taxa,
  Taxon,
  TaxonomicAct,
  TaxonTreeNodeStatistics,
  TypeSpecimen,
  VernacularName,
} from "@/generated/types";
import { getCanonicalName } from "@/helpers/getCanonicalName";
import { GET_NOMENCLATURAL_ACT_PROVENANCE } from "@/queries/provenance";

import { useDisclosure, useResizeObserver } from "@mantine/hooks";
import {
  IconArrowUpRight,
  IconBinaryTree2,
  IconDna,
  IconDnaOff,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

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

const GET_TAXON = gql`
  query TaxonSpecies($rank: TaxonomicRank, $canonicalName: String, $datasetId: UUID) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      ...TaxonName
      ...TaxonSource
      rank

      hierarchy {
        canonicalName
        rank
        depth
      }

      typeSpecimens {
        name {
          scientificName
        }
        accession {
          ...AccessionEventDetails
        }
        collection {
          ...CollectionEventDetails
        }
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

const GET_TYPE_SPECIMENS = gql`
  query TaxonTypeSpecimens($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      typeSpecimens {
        name {
          scientificName
        }
        accession {
          ...AccessionEventDetails
        }
        collection {
          ...CollectionEventDetails
        }
      }
    }
  }
`;

interface SpecimenRecordNumbers {
  markers: number;
  sequences: number;
  wholeGenomes: number;
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

interface TaxonMatch {
  identifier: string;
  name: string;
  acceptedIdentifier: string;
  acceptedName: string;
}

interface ExternalLinksProps {
  canonicalName: string;
}

function ExternalLinks({ canonicalName }: ExternalLinksProps) {
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

function Synonyms({ taxonomy }: { taxonomy: Taxon }) {
  const acts = taxonomy.taxonomicActs.filter((act) => act.taxon.status !== "ACCEPTED");

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
  taxonomy: Taxon;
  dataset: Dataset;
  commonNames: VernacularName[];
  subspecies?: TaxonTreeNodeStatistics[];
  isSubspecies?: boolean;
}

function Details({ taxonomy, dataset, commonNames, subspecies, isSubspecies }: DetailsProps) {
  const typeSpecimens = taxonomy.typeSpecimens?.filter(
    (typeSpecimen) =>
      typeSpecimen.name.scientificName == taxonomy.scientificName && typeSpecimen.accession.typeStatus != "no voucher"
  );

  // TODO: change this to show multiple type specimens for things like syntypes
  const typeAccession = typeSpecimens?.[0]?.accession;
  const typeCollection = typeSpecimens?.[0]?.collection;

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
          <ExternalLinkButton url={dataset.url} externalLinkName={dataset.name} outline icon={IconArrowUpRight} />
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
                <AttributePillValue
                  value={`${typeAccession?.institutionCode} ${typeAccession?.collectionRepositoryId}`}
                />
              </DataTableRow>
              <DataTableRow label="Type location (from source)">
                <Flex justify="space-between" align="center">
                  <DataField
                    value={[typeCollection?.locality, typeCollection?.stateProvince, typeCollection?.country]
                      .filter((t) => t)
                      .join(", ")}
                  />
                  {typeCollection?.locationSource && <SourcePill value={typeCollection.locationSource} />}
                </Flex>
              </DataTableRow>
              {typeCollection?.latitude && typeCollection.longitude && (
                <DataTableRow label="Type location (geo)">
                  <Group>
                    <DataField
                      value={[typeCollection.latitude, typeCollection.longitude].filter((t) => t).join(", ")}
                    />

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
                                tooltip: typeAccession?.collectionRepositoryId ?? "",
                                latitude: typeCollection.latitude,
                                longitude: typeCollection.longitude,
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

function History({ taxonomy }: { taxonomy: Taxon }) {
  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const { loading, error, data } = useQuery<{ taxon: Taxon }>(GET_TAXON, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
      datasetId,
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
      new Date(item.publication.publishedYear ?? 0, 0, 1);

    const key = `${date}-${item.act}-${item.name.canonicalName}`;

    itemSet.set(key, {
      label: item.name.canonicalName,
      subtitle: ACT_LABEL[item.act],
      year: item.publication.publishedYear ?? 0,
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
}

function NomenclaturalActBody({ item, protonym }: NomenclaturalActBodyProps) {
  const { loading, data } = useQuery<{ provenance: Provenance }>(GET_NOMENCLATURAL_ACT_PROVENANCE, {
    variables: { entityId: item.entityId },
  });

  const specimens = useQuery<{ taxon: Taxon }>(GET_TYPE_SPECIMENS, {
    variables: {
      rank: "SPECIES",
      canonicalName: item.name.canonicalName,
    },
  });

  const holotype = specimens.data?.taxon.typeSpecimens.find(
    (specimen) => specimen.accession.typeStatus?.toLowerCase() == "holotype"
  );

  function humanize(text: string) {
    return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
  }

  const act = humanize(item.act);
  const items = data?.provenance.nomenclaturalAct.filter((item) => item.action !== "CREATE");

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
            href={item.publication.sourceUrls?.at(0)}
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
              {specimens.data?.taxon.typeSpecimens?.map((specimen) => (
                <TypeSpecimenPill key={specimen.accession.entityId} specimen={specimen} />
              ))}
            </Group>
          </DataTableRow>
        )}
        <DataTableRow label="Type location (source)">
          <DataField value={holotype?.collection.locality} />
        </DataTableRow>
        <DataTableRow label="Type location (geo)">
          <DataField value={`${holotype?.collection.latitude}, ${holotype?.collection.longitude}`} />
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
  family: TaxonTreeNodeStatistics;
  datasetId: string;
  pinned?: string[];
}

function FamilyTaxonTree({ family, datasetId, pinned }: FamilyTaxonTreeProps) {
  const [ref, rect] = useResizeObserver();
  const [layout, setLayout] = useState<Layout>("top-to-bottom");

  // auto-expand the tree if there aren't that many total species
  const includeRanks = ["CLASS", "FAMILY", "SUBFAMILY", "GENUS"];
  if ((family.species || 0) < 100) includeRanks.push("SPECIES");

  const { loading, error, data } = useQuery<{ stats: Statistics }>(GET_TAXON_TREE_NODE, {
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

export default function TaxonomyPage({ params, isSubspecies }: { params: { name: string }; isSubspecies?: boolean }) {
  const { names } = useDatasets();
  const dataset = names.get("Atlas of Living Australia");

  const canonicalName = getCanonicalName(params);

  const { loading, error, data } = useQuery<{ taxon: Taxon }>(GET_TAXON, {
    variables: { canonicalName, rank: "SPECIES", datasetId: dataset?.id },
  });

  // get the taxonomy and build the pinned taxonomy hierarchy path for the tree
  const taxonomy = data?.taxon;
  const hierarchy = taxonomy?.hierarchy;
  const pinned = hierarchy ? [canonicalName, ...hierarchy.map((h) => h.canonicalName)] : [canonicalName];

  const results = useQuery<{ taxa: Taxa }>(GET_TAXA, {
    variables: { filters: [{ canonicalName }] },
  });

  const family = hierarchy?.find((node) => node.rank === "FAMILY" || node.rank === "FAMILIA");

  const familyStats = useQuery<{ stats: Statistics }>(GET_TAXON_TREE_NODE, {
    variables: {
      taxonRank: "FAMILY",
      taxonCanonicalName: family?.canonicalName,
      includeRanks: ["FAMILY"],
      datasetId: dataset?.id,
    },
  });

  const subspecies = useQuery<{ stats: Statistics }>(GET_TAXON_TREE_STATS, {
    variables: {
      taxonRank: "SPECIES",
      taxonCanonicalName: canonicalName,
      descendantRank: "SUBSPECIES",
    },
    skip: isSubspecies,
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
            {taxonomy && dataset && (
              <Details
                taxonomy={taxonomy}
                dataset={dataset}
                commonNames={[]}
                subspecies={subspecies.data?.stats.taxonBreakdown}
                isSubspecies={isSubspecies}
              />
            )}
            {results.data && <TaxonomySwitcher taxa={results.data.taxa.records} />}
          </Stack>
        </Grid.Col>
      </Grid>
      {familyStats.data && dataset && (
        <FamilyTaxonTree family={familyStats.data.stats.taxonBreakdown[0]} datasetId={dataset.id} pinned={pinned} />
      )}
      <ExternalLinks canonicalName={canonicalName} />

      {taxonomy && <History taxonomy={taxonomy} />}
    </Stack>
  );
}

function humanize(text: string) {
  return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
}

function TypeSpecimenPill({ specimen, records }: { specimen: TypeSpecimen; records?: SpecimenRecordNumbers }) {
  const [opened, { close, open }] = useDisclosure(false);

  const hasData = Boolean(records);
  const recordId = `${specimen.accession.institutionCode} ${specimen.accession.collectionRepositoryId}`;

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
            url={`specimens/${recordId}`}
            color={"#d6e4ed"}
            textColor="midnight.8"
            onMouseEnter={hasData ? open : undefined}
            onMouseLeave={hasData ? close : undefined}
          >
            {recordId}
            <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
              {humanize(specimen.accession.typeStatus ?? "")}
            </span>
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
