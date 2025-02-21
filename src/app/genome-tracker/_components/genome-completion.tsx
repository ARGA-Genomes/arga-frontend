"use client";


import { gql, useQuery } from "@apollo/client";
import { LineBarGraph } from "@/components/graphing/LineBarGraph";

const GET_COMPLETE_GENOMES_YEAR_STATS = gql`
  query CompleteGenomesYearStats {
    stats {
      completeGenomesByYear {
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

export function GenomeCompletion() {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(GET_COMPLETE_GENOMES_YEAR_STATS);
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
