"use client";

import * as Humanize from "humanize-plus";
import { Group, Stack, Text } from "@mantine/core";

import classes from "./taxonomy-switcher.module.css";
import { Taxon } from "@/queries/taxa";
import {
  Attribute,
  AttributePill,
  AttributePillContainer,
} from "./data-fields";
import { useDatasets } from "@/app/source-provider";
import { useState } from "react";
import { motion } from "framer-motion";

type ClassificationNode = {
  canonicalName: string;
  rank: string;
  depth: number;
};

interface TaxonomySwitcherProps {
  taxa: Taxon[];
}

export function TaxonomySwitcher({ taxa }: TaxonomySwitcherProps) {
  const [active, setActive] = useState(0);

  const rowSelected = (index: number, taxon: Taxon) => {
    setActive(index);
  };

  return (
    <Stack className={classes.switcher}>
      {sortTaxaBySources(taxa).map((taxon, idx) => (
        <TaxonomyRow
          taxon={taxon}
          key={idx}
          active={idx == active}
          onClick={(taxon) => rowSelected(idx, taxon)}
        />
      ))}
    </Stack>
  );
}

interface TaxonomyRowProps {
  taxon: Taxon;
  active: boolean;
  onClick: (taxon: Taxon) => void;
}

function TaxonomyRow({ taxon, active, onClick }: TaxonomyRowProps) {
  const datasets = useDatasets();

  const variants = {
    active: {
      backgroundColor: "var(--mantine-color-midnight-8)",
      color: "white",
      opacity: 1.0,
    },
    inactive: { backgrondColor: "#bdc5c9", color: "black", opacity: 0.5 },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, opacity: 1.0 }}
      whileTap={{ scale: 1.01 }}
      animate={active ? "active" : "inactive"}
      variants={variants}
    >
      <Group className={classes.record} onClick={() => onClick(taxon)}>
        <Text className={classes.source}>
          {datasets.get(taxon.datasetId)?.name}
        </Text>
        <Stack>
          <Hierarchy hierarchy={taxon.hierarchy} />
          <Group>
            <Attribute label="Scientific name">
              <AttributePillContainer className={classes.scientificName}>
                <Text fw={600} size="sm">
                  <em>{taxon.canonicalName}</em> {taxon.authorship}
                </Text>
              </AttributePillContainer>
            </Attribute>
          </Group>
        </Stack>
      </Group>
    </motion.div>
  );
}

function Hierarchy({ hierarchy }: { hierarchy: ClassificationNode[] }) {
  return (
    <Group>
      {hierarchy.map((node, idx) => (
        <AttributePill
          key={idx}
          label={Humanize.capitalize(node.rank.toLowerCase())}
          value={node.canonicalName}
          href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
        />
      ))}
    </Group>
  );
}

const TAXA_SOURCE_PRIORITIES = ["Australian Living Atlas", "AFD", "APC"];

export function sortTaxaBySources(taxa: Taxon[]) {
  return taxa
    .map((t) => t)
    .sort((a: Taxon, b: Taxon): number => {
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
}
