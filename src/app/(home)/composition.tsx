// Types
import { TaxonomicRankStatistic } from "@/generated/types";

// Imports
import { StackedBarGraph } from "@/components/graphing/bar";
import { getClient } from "@/lib/ApolloClient";
import { gql } from "@apollo/client";
import { Box, Paper, Stack, Text } from "@mantine/core";

const ranks = ["KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];
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

interface TaxonomicRankStatsQuery {
  stats: {
    animalia: TaxonomicRankStatistic[];
    plantae: TaxonomicRankStatistic[];
    fungi: TaxonomicRankStatistic[];
    chromista: TaxonomicRankStatistic[];
    protista: TaxonomicRankStatistic[];
  };
}

const client = getClient();
const { data } = await client.query<TaxonomicRankStatsQuery>({ query: GET_TAXONOMIC_RANK_STATS, variables: { ranks } });

export function TaxonomicComposition() {
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
        <Box h={520}>{groups && <StackedBarGraph data={groups} />}</Box>
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
