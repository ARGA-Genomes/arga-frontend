"use client";

import { gql, useQuery } from "@apollo/client";
import { LineBarGraph } from "@/components/graphing/LineBarGraph";

const GET_COMPLETE_GENOMES_YEAR_STATS = gql`
  query CompleteGenomesYearStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String) {
    stats {
      completeGenomesByYear(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName) {
        year
        total
      }
    }
  }
`;

type CompleteGenomesYearStatsQuery = {
  stats: {
    completeGenomesByYear: {
      year: number;
      total: number;
    }[];
  };
};

interface GenomeCompletionProps {
  taxonRank: string;
  taxonCanonicalName: string;
}

export function GenomeCompletion({ taxonRank, taxonCanonicalName }: GenomeCompletionProps) {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(GET_COMPLETE_GENOMES_YEAR_STATS, {
    variables: {
      taxonRank,
      taxonCanonicalName,
    },
  });
  let accum = 0;

  const lineData = data?.stats.completeGenomesByYear.map((stat) => ({
    x: stat.year,
    y: (accum += stat.total),
  }));

  const barData = data?.stats.completeGenomesByYear.map((stat) => ({
    x: stat.year,
    y: stat.total,
  }));

  return <LineBarGraph lineData={lineData ?? []} barData={barData ?? []} />;
}
