"use client";

import { LineBarGraph } from "@/components/graphing/LineBarGraph";
import { gql, useQuery } from "@apollo/client";
import { ParentSize } from "@visx/responsive";

const GET_COMPLETE_GENOMES_YEAR_STATS = gql`
  query CompleteGenomesYearStats($name: String) {
    stats {
      completeGenomesByYearForSource(name: $name) {
        year
        total
      }
    }
  }
`;

type CompleteGenomesYearStatsQuery = {
  stats: {
    completeGenomesByYearForSource: {
      year: number;
      total: number;
    }[];
  };
};

interface GenomeCompletionProps {
  name?: string;
  domain: [Date, Date];
  milestones?: [];
  disabledHighlight?: boolean;
}

export function GenomeCompletion({ name, domain, disabledHighlight }: GenomeCompletionProps) {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(GET_COMPLETE_GENOMES_YEAR_STATS, {
    variables: {
      name,
    },
    skip: !name,
  });
  let accum = 0;

  const stats = data?.stats.completeGenomesByYearForSource.filter(
    (stat) => stat.year >= domain[0].getFullYear() && stat.year <= domain[1].getFullYear()
  );

  const lineData = stats?.map((stat) => ({
    x: new Date(`${stat.year}-01-01`),
    y: (accum += stat.total),
  }));

  const barData = stats?.map((stat) => ({
    x1: new Date(`${stat.year}-01-01`),
    x2: new Date(`${stat.year + 1}-01-01`),
    y: stat.total,
  }));

  return (
    <ParentSize>
      {(parent) => (
        <LineBarGraph
          width={parent.width}
          height={parent.height}
          lineData={lineData ?? []}
          barData={barData ?? []}
          dateDomain={domain}
          disabledHighlight={disabledHighlight}
        />
      )}
    </ParentSize>
  );
}
