"use client";

import classes from "./completion-stepper.module.css";

import { Statistics } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Stepper, StepperStep } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import * as Humanize from "humanize-plus";

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

interface CompletionStepperProps {
  rank?: string;
  canonicalName?: string;
}

const ALL_RANKS = ["DOMAIN", "KINGDOM", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS", "SPECIES"];

export function CompletionStepper({ rank, canonicalName }: CompletionStepperProps) {
  const ranks = rank ? ALL_RANKS.slice(ALL_RANKS.indexOf(rank)) : ALL_RANKS;

  const { data } = useQuery<{ stats: Statistics }>(GET_TAXONOMIC_RANK_STATS, {
    variables: {
      taxonRank: rank || "DOMAIN",
      taxonCanonicalName: canonicalName || "Eukaryota",
      ranks,
    },
  });

  const stats = data?.stats.taxonomicRanks;
  const completed = stats?.reduce((acc, val) => acc + (val.atLeastOne / val.children === 1.0 ? 1 : 0), 0);

  return (
    <Stepper classNames={classes} completedIcon={<IconCircleCheck size={32} />} color="moss" active={completed ?? 0}>
      {ranks.map((rank) => (
        <StepperStep
          key={rank}
          icon={<IconCircleCheck size={36} color="lightgrey" />}
          label={Humanize.capitalize(rank.toLowerCase())}
        />
      ))}
    </Stepper>
  );
}
