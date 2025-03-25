"use client";

import classes from "./completion-stepper.module.css";

import { gql, useQuery } from "@apollo/client";
import { TaxonomicRankStatistic } from "@/queries/stats";
import { Stepper, StepperStep } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

const GET_TAXONOMIC_RANK_STATS = gql`
  query TaxonomicRankStats($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $ranks: [TaxonomicRank]) {
    stats {
      taxonomicRanks(taxonRank: $taxonRank, taxonCanonicalName: $taxonCanonicalName, ranks: $ranks) {
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
    taxonomicRanks: TaxonomicRankStatistic[];
  };
};

export function CompletionStepper() {
  const { data } = useQuery<TaxonomicRankStatsQuery>(GET_TAXONOMIC_RANK_STATS, {
    variables: {
      taxonRank: "DOMAIN",
      taxonCanonicalName: "Eukaryota",
      ranks: ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"],
    },
  });

  const stats = data?.stats.taxonomicRanks;
  const completed = stats?.reduce((acc, val) => acc + (val.atLeastOne / val.children === 1.0 ? 1 : 0), 0);

  return (
    <Stepper classNames={classes} completedIcon={<IconCircleCheck size={32} />} color="moss" active={completed ?? 0}>
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Domain" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Kingdom" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Phylum" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Class" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Order" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Family" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Genus" />
      <StepperStep icon={<IconCircleCheck size={36} color="lightgrey" />} label="Species" />
    </Stepper>
  );
}
