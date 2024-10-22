"use client";

import classes from "../../../../components/record-list.module.css";

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
  Table,
  Tooltip,
  Tabs,
  ScrollArea,
  Box,
} from "@mantine/core";
import { Layout } from "@nivo/tree";
import { Taxonomy, IndigenousEcologicalKnowledge, Photo } from "@/app/type";

import { IconBinaryTree2, IconExternalLink } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";
import Link from "next/link";
import { AttributePillValue, DataField } from "@/components/data-fields";
import { TaxonomyTree } from "@/components/graphing/taxon-tree";
import {
  EventTimeline,
  LineStyle,
  TimelineIcon,
} from "@/components/event-timeline";
import { useDisclosure } from "@mantine/hooks";
import { TaxonStatTreeNode, findChildren } from "@/queries/stats";
import { TaxonomySwitcher } from "@/components/taxonomy-switcher";
import { Taxon } from "@/queries/taxa";
import HorizontalTimeline, {
  TimelineItem,
  TimelineItemType,
} from "@/components/graphing/horizontal-timeline";
import { Publication } from "@/queries/publication";

const GET_TAXA = gql`
  query TaxaTaxonomyPage($filters: [TaxaFilter]) {
    taxa(filters: $filters) {
      records {
        datasetId

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
    nomenclaturalAct: [
      {
        operationId: string;
        action: string;
        atom: AtomText | AtomNomenclaturalType | AtomDateTime;
        dataset: Dataset;
      },
    ];
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
      }
      hierarchy {
        canonicalName
        rank
      }
      vernacularNames {
        datasetId
        vernacularName
        citation
        sourceUrl
      }
      synonyms {
        scientificName
        canonicalName
        authorship
      }
      photos {
        url
        source
        publisher
        license
        rightsHolder
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
      }
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

function ExternalLinks(props: ExternalLinksProps) {
  const [matchedTaxon, setMatchedTaxon] = useState<string[] | null>(null);
  const hasFrogID = false;
  const hasAFD = false;

  // Fetch the taxon UID from the given name
  useEffect(() => {
    async function matchTaxon() {
      try {
        const response = await fetch(
          `https://api.ala.org.au/species/guid/${encodeURIComponent(props.canonicalName)}`,
        );
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(
          matches.map(({ acceptedIdentifier }) => acceptedIdentifier),
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
        <Button
          component="a"
          radius="md"
          color="gray"
          variant="light"
          size="xs"
          leftSection={<IconExternalLink size="1rem" color="black" />}
          loading={!matchedTaxon}
          disabled={Array.isArray(matchedTaxon) && matchedTaxon.length === 0}
          href={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
          target="_blank"
        >
          <Text>
            View on&nbsp;<b>ALA</b>
          </Text>
        </Button>

        {props.species?.indigenousEcologicalKnowledge?.map((iek) => (
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

interface DetailsProps {
  taxonomy: Taxonomy;
  commonNames: VernacularName[];
}

function Details({ taxonomy, commonNames }: DetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { loading, error, data } = useQuery<SynonymsQuery>(GET_SYNONYMS, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const acts = data?.taxon.taxonomicActs.filter(
    (act) => act.taxon.status !== "ACCEPTED",
  );

  const synonyms = Object.groupBy(acts || [], (act) => act.taxon.status);

  return (
    <Paper radius={16} p="md" withBorder>
      <Group mb={10} align="baseline">
        <Text fw={600} size="lg">
          Taxonomy
        </Text>
        <Text fz="sm" fw={300}>
          Source:&nbsp;
          {taxonomy.sourceUrl ? (
            <Link href={taxonomy.sourceUrl} target="_blank">
              {taxonomy.source}
            </Link>
          ) : (
            taxonomy.source
          )}
        </Text>
      </Group>

      <SimpleGrid cols={3}>
        <Paper p="sm">
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
              <Text fw={600} fz="sm">
                {taxonomy.status.toLowerCase()}
              </Text>
            </DataTableRow>
          </DataTable>
        </Paper>

        <Paper p="sm">
          {Object.entries(synonyms).map(([status, acts]) => (
            <Stack gap={0} key={status}>
              <Text fw={300} fz="sm">
                {Humanize.capitalize(status.toLowerCase().replace("_", " "))}
              </Text>
              {acts.map((act) => (
                <Group key={act.taxon.canonicalName} gap={5}>
                  <Text fw={600} fz="sm" fs="italic">
                    {act.taxon.canonicalName}
                    {act.taxon.authorship && ","}
                  </Text>
                  <Text fw={600} fz="sm">
                    {act.taxon.authorship}
                  </Text>
                </Group>
              ))}
            </Stack>
          ))}
        </Paper>

        <Stack>
          <Paper p="sm">
            <Text fw={300} fz="sm">
              Common names
            </Text>
            <Text fw={600} fz="sm" truncate="end">
              {commonNames.map((r) => r.vernacularName).join(", ")}
            </Text>
          </Paper>

          <Paper p="sm">
            <Text fw={300} fz="sm">
              Subspecies
            </Text>
          </Paper>
        </Stack>
      </SimpleGrid>
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
};

const ACT_LABEL: Record<string, string> = {
  SPECIES_NOVA: "new species",
  SUBSPECIES_NOVA: " new subspecies",
  GENUS_SPECIES_NOVA: "new genus",
  COMBINATIO_NOVA: "generic recombination",
  SUBGENUS_PLACEMENT: "subgenus placement",
  REVIVED_STATUS: "revived",
  NAME_USAGE: "name usage",
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

function HistoryItem({ act }: { act: NomenclaturalAct }) {
  return <Text>{act.publication.publishedYear}</Text>;
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
    <Paper radius={16} p="md" withBorder>
      <LoadOverlay visible={loading} />
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

        <Text fw={600} size="lg">
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
      </Stack>
    </Paper>
  );
}

function NomenclaturalActHeader({ item }: { item: NomenclaturalAct }) {
  return (
    <Stack mt={5}>
      {item.publication.publishedYear ? (
        <Text fz="xs" fw={700} c="dimmed">
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
  const [opened, { open, close }] = useDisclosure(false);
  const { loading, error, data } = useQuery<ProvenanceQuery>(GET_PROVENANCE, {
    variables: { entityId: item.entityId },
  });

  function humanize(text: string) {
    return Humanize.capitalize(text.toLowerCase().replaceAll("_", " "));
  }

  const act = humanize(item.act);
  const items = data?.provenance.nomenclaturalAct.filter(
    (item) => item.action !== "CREATE",
  );

  return (
    <SimpleGrid cols={2}>
      <DataTable mt="lg">
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
            <AttributePillValue value={humanize(item.name.taxa[0]?.status)} />
          </Group>
        </DataTableRow>
      </DataTable>

      <Tabs
        defaultValue="history"
        variant="pills"
        orientation="vertical"
        placement="right"
        color="midnight.5"
        radius={0}
        w={800}
        style={{ background: "#e9eced", borderRadius: "15px 0 0 15px" }}
      >
        <Tabs.List bg="#d3d8db">
          <Tabs.Tab value="history">Record History</Tabs.Tab>
        </Tabs.List>

        <ScrollArea.Autosize mah={300} mx="auto" type="auto">
          <Tabs.Panel value="history" p="lg">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Td>
                    <Text fz="xs" fw={600}>
                      Atom
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fz="xs" fw={600}>
                      Dataset
                    </Text>
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items?.map((op) => (
                  <Table.Tr key={op.operationId}>
                    <Table.Td>
                      <Text fz="xs" fw={600}>
                        {humanize(op.atom.type.toString())}
                      </Text>
                      <Text fz="xs" fw={400}>
                        {op.atom.type.toString() === "NOMENCLATURAL_ACT_TYPE"
                          ? humanize(op.atom.value)
                          : op.atom.value}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="xs" fw={400}>
                        <Tooltip label={op.dataset.name}>
                          <Link href={op.dataset.url || "#"}>
                            {op.dataset.shortName}
                          </Link>
                        </Tooltip>
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Tabs.Panel>
        </ScrollArea.Autosize>
      </Tabs>
    </SimpleGrid>
  );
}

interface FamilyTaxonTreeProps {
  hierarchy: TaxonNode[];
  pin?: string;
}

function FamilyTaxonTree({ hierarchy, pin }: FamilyTaxonTreeProps) {
  const [layout, setLayout] = useState<Layout>("top-to-bottom");

  const order = hierarchy.find(
    (node) => node.rank === "ORDER" || node.rank === "ORDO",
    /* (node) => node.rank === "FAMILY" || node.rank === "FAMILIA", */
  );
  const { loading, error, data } = useQuery<TaxonTreeStatsQuery>(
    GET_TAXON_TREE_STATS,
    {
      variables: {
        taxonRank: order?.rank || "ORDER",
        taxonCanonicalName: order?.canonicalName,
        includeRanks: [
          "ORDER",
          "ORDO",
          /* "SUBORDER", */
          /* "SUBORDO", */
          "FAMILY",
          "FAMILIA",
          /* "SUBFAMILY", */
          /* "SUBFAMILIA", */
          "GENUS",
          /* "SUBGENUS", */
          "SPECIES",
        ],
      },
    },
  );

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

const TAXA_SOURCE_PRIORITIES = ["Australian Living Atlas", "AFD", "APC"];

export default function TaxonomyPage({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  const results = useQuery<TaxaQuery>(GET_TAXA, {
    variables: { filters: [{ canonicalName }] },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

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

  const species = data?.species;
  const taxonomy = species && sortTaxaBySources(species.taxonomy)[0];
  const hierarchy = species?.hierarchy;

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
              />
            )}
            {results.data && (
              <TaxonomySwitcher taxa={results.data.taxa.records} />
            )}
          </Stack>
        </Grid.Col>
      </Grid>
      {hierarchy && (
        <FamilyTaxonTree hierarchy={hierarchy} pin={taxonomy?.canonicalName} />
      )}
      <ExternalLinks canonicalName={canonicalName} species={data?.species} />

      {taxonomy && <History taxonomy={taxonomy} />}
    </Stack>
  );
}
