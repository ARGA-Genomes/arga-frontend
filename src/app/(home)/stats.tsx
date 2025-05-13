"use client";

import { DataField } from "@/components/highlight-stack";
import { DataTable, DataTableRow } from "@/components/data-table";
import { TachoChart } from "@/components/graphing/tacho";
import { gql, useQuery } from "@apollo/client";
import { Grid, Paper, Stack, Title, Text, Skeleton, Box } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { BarChart, StackedBarGraph } from "@/components/graphing/bar";
import { LoadOverlay } from "@/components/load-overlay";
import { CircularPackingChart } from "@/components/graphing/circular-packing";
import { SunburstChart } from "@/components/graphing/sunburst";
import { useState } from "react";
import { useDatasets } from "../source-provider";
import { TaxonomicRankStatistic } from "@/queries/stats";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";

import classes from "./stats.module.css";

const RANK_PLURALS: Record<string, string> = {
  DOMAIN: "Domain",
  KINGDOM: "Kingdoms",
  PHYLUM: "Phyla",
  CLASS: "Classes",
  ORDER: "Orders",
  FAMILY: "Families",
  GENUS: "Genera",
  SPECIES: "Species",
};

const GET_TAXON = gql`
  query HomeStats($datasetId: UUID) {
    taxon(by: { classification: { rank: DOMAIN, canonicalName: "Eukaryota", datasetId: $datasetId } }) {
      speciesSummary: summary(rank: SPECIES) {
        total
        genomes
        genomicData
      }

      speciesGenomesSummary {
        canonicalName
        genomes
        totalGenomic
      }
    }
  }
`;

interface DataBreakdown {
  canonicalName: string;
  genomes: number;
  totalGenomic: number;
}

interface Taxonomy {
  speciesGenomesSummary: DataBreakdown[];
  speciesSummary: {
    total: number;
    genomes: number;
    genomicData: number;
  };
}

interface TaxonResults {
  taxon: Taxonomy;
}

const GET_DESCENDANTS = gql`
  query DescendantStats {
    eukaryotaTaxon: taxon(rank: DOMAIN, canonicalName: "Eukaryota") {
      canonicalName
      summary {
        species
      }
    }

    animaliaTaxon: taxon(rank: KINGDOM, canonicalName: "Animalia") {
      canonicalName
      summary {
        species
      }
      descendants(rank: PHYLUM) {
        canonicalName
        species
      }
    }

    protistaTaxon: taxon(rank: SUPERKINGDOM, canonicalName: "Protista") {
      canonicalName
      summary {
        species
      }
      descendants(rank: PHYLUM) {
        canonicalName
        species
      }
    }

    fungiTaxon: taxon(rank: REGNUM, canonicalName: "Fungi") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }

    plantaeTaxon: taxon(rank: REGNUM, canonicalName: "Plantae") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }

    chromistaTaxon: taxon(rank: REGNUM, canonicalName: "Chromista") {
      canonicalName
      summary {
        species
      }
      descendants(rank: DIVISION) {
        canonicalName
        species
      }
    }
  }
`;

interface EukaryotaDescendantResults {
  eukaryotaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
  };
  animaliaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  protistaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  fungiTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  plantaeTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
  chromistaTaxon: {
    canonicalName: string;
    summary: {
      species: number;
    };
    descendants: {
      canonicalName: string;
      species: number;
    }[];
  };
}

const GET_EUKARYOTA_TREE = gql`
  query TaxonHierarchy {
    animaliaTree: stats {
      taxonBreakdown(taxonRank: KINGDOM, taxonCanonicalName: "Animalia", includeRanks: [PHYLUM, CLASS]) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    plantaeTree: stats {
      taxonBreakdown(taxonRank: REGNUM, taxonCanonicalName: "Plantae", includeRanks: [DIVISION, CLASSIS]) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    fungiTree: stats {
      taxonBreakdown(taxonRank: REGNUM, taxonCanonicalName: "Fungi", includeRanks: [DIVISION, CLASSIS]) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    protistaTree: stats {
      taxonBreakdown(taxonRank: KINGDOM, taxonCanonicalName: "Protista", includeRanks: [PHYLUM, CLASS]) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }

    chromistaTree: stats {
      taxonBreakdown(taxonRank: REGNUM, taxonCanonicalName: "Chromista", includeRanks: [DIVISION, CLASSIS]) {
        name: canonicalName
        rank
        children {
          name: canonicalName
          rank
          value: species
        }
      }
    }
  }
`;

interface TaxonTreeNode {
  name: string;
  rank: string;
  value?: number;
  children?: TaxonTreeNode[];
}

interface EukaryotaTreeResults {
  animaliaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  plantaeTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  fungiTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  protistaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
  chromistaTree: {
    taxonBreakdown: TaxonTreeNode[];
  };
}

export function ShowStats() {
  const { names } = useDatasets();
  const datasetId = names.get("Atlas of Living Australia")?.id;

  const taxonResults = useQuery<TaxonResults>(GET_TAXON, {
    variables: {
      datasetId,
    },
  });

  const taxon = taxonResults.data?.taxon;

  const thresholds = [
    { name: "low", color: "#f47625", start: 0, end: 25 },
    { name: "decent", color: "#febb1e", start: 25, end: 75 },
    { name: "great", color: "#97bc5d", start: 75, end: 100 },
  ];

  const speciesGenomes = taxon?.speciesGenomesSummary
    .filter((i) => i.genomes > 0)
    .map((summary) => {
      const linkName = encodeURIComponent(summary.canonicalName.replaceAll(" ", "_"));
      return {
        name: summary.canonicalName || "",
        value: summary.genomes,
        href: `/species/${linkName}`,
      };
    })
    .sort((a, b) => b.value - a.value);

  const genomePercentile = taxon && (taxon.speciesSummary.genomes / taxon.speciesSummary.total) * 100;

  return (
    <Paper
      component={Link}
      href="/genome-tracker"
      className={classes.stats}
      pos="relative"
      radius="lg"
      style={{ width: 640, height: 608 }}
    >
      <Box className={classes.message}>
        <IconArrowUpRight size="2rem" />
        <Text style={{ fontSize: 24 }} fw={600}>
          Go to genome tracker
        </Text>
        <Text>Track progress for Australian biodiversity genomics</Text>
      </Box>
      <LoadOverlay visible={taxonResults.loading} />
      <Grid p={20}>
        <Grid.Col span={12}>
          <Title order={4}>Data summary</Title>
        </Grid.Col>
        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Percentage of species with genomes</Title>
            {taxon && <TachoChart h={115} thresholds={thresholds} value={Math.round(genomePercentile || 0)} />}
          </Stack>
        </Grid.Col>

        <Grid.Col span={6} mb={10}>
          <Stack gap="sm">
            <Title order={6}>Taxonomic breakdown</Title>

            <DataTable my={2}>
              <DataTableRow label="Number of species/OTUs">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.total || 0)} />
              </DataTableRow>

              <DataTableRow label="Species with genomes">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.genomes || 0)} />
              </DataTableRow>

              <DataTableRow label="Species with data">
                <DataField value={Humanize.formatNumber(taxon?.speciesSummary.genomicData || 0)} />
              </DataTableRow>
            </DataTable>
          </Stack>
        </Grid.Col>

        <Grid.Col span={12} pt={10}>
          <Stack>
            <Title order={6}>Species with genomes</Title>
            {speciesGenomes && <BarChart h={250} data={speciesGenomes.slice(0, 10)} spacing={0.1} labelWidth={200} />}
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fz={10} c="midnight.6">
            Note: these statistics summarise the content indexed within ARGA. The values relate to the species deemed
            relevant to Australia (either by endemicity or economic and social value), and for repositories that are
            indexed by ARGA. The values may not be indicative of global values for all research.
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

interface TreeNode {
  name: string;
  value?: number;
  color?: string;
  children?: TreeNode[];
}

export function ShowCircularTaxonomy() {
  const [treeData, setTreeData] = useState<TreeNode>();

  const { loading } = useQuery<EukaryotaDescendantResults>(GET_DESCENDANTS, {
    onCompleted: (data) => {
      const kingdomsRegnaTaxa = [
        data.animaliaTaxon,
        data.protistaTaxon,
        data.plantaeTaxon,
        data.fungiTaxon,
        data.chromistaTaxon,
      ];
      const tData: TreeNode = {
        name: data.eukaryotaTaxon.canonicalName,
        children: kingdomsRegnaTaxa.map((taxon) => {
          return {
            name: taxon.canonicalName,
            children: taxon.descendants.map((descendant) => {
              return {
                name: descendant.canonicalName,
                value: descendant.species,
              };
            }),
          };
        }),
      };
      setTreeData(tData);
    },
  });

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <>
      {treeData && (
        // <CircularPacking data={treeData} width={1000} height={700} />

        <CircularPackingChart data={treeData} width={520} height={520} />
      )}
    </>
  );
}

export function ShowSunburstTaxonomy() {
  const [treeData, setTreeData] = useState<TaxonTreeNode>();

  const { loading } = useQuery<EukaryotaTreeResults>(GET_EUKARYOTA_TREE, {
    onCompleted: (data) => {
      const kingdomsRegnaTaxa = [
        {
          name: "Animalia",
          rank: "KINGDOM",
          children: data.animaliaTree.taxonBreakdown,
        },
        {
          name: "Plantae",
          rank: "REGNUM",
          children: data.plantaeTree.taxonBreakdown,
        },
        {
          name: "Fungi",
          rank: "REGNUM",
          children: data.fungiTree.taxonBreakdown,
        },
        {
          name: "Protista",
          rank: "KINGDOM",
          children: data.protistaTree.taxonBreakdown,
        },
        {
          name: "Chromista",
          rank: "REGNUM",
          children: data.chromistaTree.taxonBreakdown,
        },
      ];
      const tData: TaxonTreeNode = {
        name: "Eukaryota",
        rank: "DOMAIN",
        children: kingdomsRegnaTaxa,
      };
      setTreeData(tData);
    },
  });

  return (
    <Skeleton visible={loading} circle>
      {treeData && <SunburstChart data={treeData} width={520} height={520} />}
    </Skeleton>
  );
}

const GET_TAXONOMIC_RANK_STATS = gql`
  query TaxonomicRankStats($ranks: [TaxonomicRank]) {
    stats {
      animalia: taxonomicRanks(taxonRank: "KINGDOM", taxonCanonicalName: "Animalia", ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
      plantae: taxonomicRanks(taxonRank: "KINGDOM", taxonCanonicalName: "Plantae", ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
      fungi: taxonomicRanks(taxonRank: "KINGDOM", taxonCanonicalName: "Fungi", ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
      chromista: taxonomicRanks(taxonRank: "KINGDOM", taxonCanonicalName: "Chromista", ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
      protista: taxonomicRanks(taxonRank: "KINGDOM", taxonCanonicalName: "Protista", ranks: $ranks) {
        rank
        children
        coverage
        atLeastOne
      }
    }
  }
`;

type TaxonomicRankStatsQuery = {
  stats: {
    animalia: TaxonomicRankStatistic[];
    plantae: TaxonomicRankStatistic[];
    fungi: TaxonomicRankStatistic[];
    chromista: TaxonomicRankStatistic[];
    protista: TaxonomicRankStatistic[];
  };
};

export function TaxonomicComposition() {
  const ranks = ["KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

  const { loading, data } = useQuery<TaxonomicRankStatsQuery>(GET_TAXONOMIC_RANK_STATS, {
    variables: { ranks },
  });

  function getSegments(rank: string, stats: TaxonomicRankStatsQuery) {
    return [
      { label: "Animalia", value: stats.stats.animalia.find((stat) => stat.rank === rank)?.children || 0 },
      { label: "Plantae", value: stats.stats.plantae.find((stat) => stat.rank === rank)?.children || 0 },
      { label: "Fungi", value: stats.stats.fungi.find((stat) => stat.rank === rank)?.children || 0 },
      { label: "Chromista", value: stats.stats.chromista.find((stat) => stat.rank === rank)?.children || 0 },
      { label: "Protista", value: stats.stats.protista.find((stat) => stat.rank === rank)?.children || 0 },
    ];
  }

  const groups =
    data && ranks.map((rank) => ({ label: RANK_PLURALS[rank].toLocaleLowerCase(), segments: getSegments(rank, data) }));

  return (
    <Paper
      w={800}
      radius="lg"
      p="xl"
      bg="midnight.9"
      withBorder
      style={{ borderColor: "var(--mantine-color-midnight-8)" }}
    >
      <Stack>
        <Skeleton radius="lg" visible={loading}>
          <Box h={520}>{groups && <StackedBarGraph data={groups} />}</Box>
        </Skeleton>
        <Stack gap={4}>
          <Text c="midnight.1" fw={700}>
            Number of taxa per rank, coloured by kingdom
          </Text>
          <Text c="midnight.4" size="sm">
            Each bar shows the total count of taxa at that rank, with colours representing the proportional contribution
            of each kingdom. This graph highlights both the scope of data at each taxonomic level and the shifting
            kingdom comparison across the breadth of the Australian eukaryotic biodiversity.
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}
