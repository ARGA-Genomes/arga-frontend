"use client";

import { FilterItem } from "@/components/filtering-redux/filters/common";
import { LineBarGraph } from "@/components/graphing/LineBarGraph";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ParentSize } from "@visx/responsive";

const GET_COMPLETE_GENOMES_YEAR_STATS = gql`
  query CompleteGenomesYearStats($name: String, $filters: [FilterItem]) {
    stats {
      completeGenomesByYearForSource(name: $name, filters: $filters) {
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
  filters?: FilterItem[];
  domain: [Date, Date];
  milestones?: [];
  disabledHighlight?: boolean;
}

export function GenomeCompletion({
  name,
  filters,
  domain,
  disabledHighlight,
}: GenomeCompletionProps) {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(
    GET_COMPLETE_GENOMES_YEAR_STATS,
    {
      variables: {
        name,
        filters,
      },
      skip: !name,
    },
  );
  let accum = 0;

  const stats = data?.stats.completeGenomesByYearForSource.filter(
    (stat) =>
      stat.year >= domain[0].getFullYear() &&
      stat.year <= domain[1].getFullYear(),
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
