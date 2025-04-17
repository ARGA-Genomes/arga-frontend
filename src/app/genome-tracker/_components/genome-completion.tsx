"use client";

import { gql, useQuery } from "@apollo/client";
import { LineBarGraph } from "@/components/graphing/LineBarGraph";
import { ParentSize } from "@visx/responsive";

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
  domain: [Date, Date];
  milestones?: [];
  disabledHighlight?: boolean;
}

export function GenomeCompletion({ taxonRank, taxonCanonicalName, domain, disabledHighlight }: GenomeCompletionProps) {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(GET_COMPLETE_GENOMES_YEAR_STATS, {
    variables: {
      taxonRank,
      taxonCanonicalName,
    },
  });
  let accum = 0;

  const stats = data?.stats.completeGenomesByYear.filter(
    (stat) => stat.year >= domain[0].getFullYear() && stat.year <= domain[1].getFullYear(),
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
