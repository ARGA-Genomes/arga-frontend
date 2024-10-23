"use client";

import * as Humanize from "humanize-plus";
import { Accordion, Center, Divider, Group, Stack, Text } from "@mantine/core";

import classes from "./taxonomy-switcher.module.css";
import accClasses from "./taxonomy-switcher-acc.module.css";

import { Taxon } from "@/queries/taxa";
import {
  Attribute,
  AttributePill,
  AttributePillContainer,
} from "./data-fields";
import { Dataset, useDatasets } from "@/app/source-provider";
import { useState } from "react";

type ClassificationNode = {
  canonicalName: string;
  rank: string;
  depth: number;
};

interface TaxonomySwitcherProps {
  taxa: Taxon[];
}

interface TaxonWithDataset extends Taxon {
  dataset?: Dataset;
}

export function TaxonomySwitcher({ taxa }: TaxonomySwitcherProps) {
  const datasets = useDatasets();
  const taxaWithDatasets = mapTaxaDatasets(taxa, datasets);
  const sorted = sortTaxaBySources(taxaWithDatasets);

  const [active, setActive] = useState<string>(
    (
      sorted.find(
        (taxon) => taxon.dataset?.name === "Atlas of Living Australia"
      ) || sorted[0]
    ).datasetId
  );

  return (
    <Accordion
      value={active}
      onChange={(value) => setActive(value || active)}
      classNames={accClasses}
      defaultValue={sorted[0].datasetId}
      loop
    >
      {sorted.map((taxon) => {
        const isActive = taxon.datasetId === active;
        return (
          <Accordion.Item key={taxon.datasetId} value={taxon.datasetId}>
            <Accordion.Control>
              <Text
                fw={600}
                c={isActive ? "white" : undefined}
                fz={isActive ? 26 : "lg"}
              >
                {taxon.dataset?.name || "Unknown Dataset"}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                <Hierarchy hierarchy={taxon.hierarchy} />
                <Divider opacity={0.1} mt="xs" mb="sm" />
                <Group justify="space-between">
                  <Group>
                    <Text c="white" fw={600}>
                      Scientific name
                    </Text>
                    <Attribute>
                      <AttributePillContainer>
                        <Text fz="lg" fw={600} size="sm" p={4}>
                          <em>{taxon.canonicalName}</em> {taxon.authorship}
                        </Text>
                      </AttributePillContainer>
                    </Attribute>
                  </Group>
                  <Attribute>
                    <AttributePillContainer bg="midnight.11">
                      <Text fw={600} size="sm" c="white">
                        record history
                      </Text>
                    </AttributePillContainer>
                  </Attribute>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

function Hierarchy({ hierarchy }: { hierarchy: ClassificationNode[] }) {
  return (
    <Group gap="lg">
      {hierarchy
        .map((t) => t)
        .reverse()
        .map((node, idx) => (
          <AttributePill
            key={idx}
            labelColor="white"
            label={Humanize.capitalize(node.rank.toLowerCase())}
            value={node.canonicalName}
            href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
            miw={100}
          />
        ))}
    </Group>
  );
}

const TAXA_SOURCE_PRIORITIES = [
  "Australian Algae List",
  "Australian Faunal Directory endemic species",
  "Australian Faunal Directory: Ecology",
  "Australian Faunal Directory: Regions",
  "Australian Faunal Directory: Specimens",
  "Australian Faunal Directorys",
  "Australian Fungi List",
  "Australian Lichen List",
  "Australian Plant Census",
  "Australian Plant Census: Australian Bryophyte Census",
  "Australian Plant Census: Australian Vascular Plants Common Names",
  "Australian Plant Name Index (APNI): Australian Vascular Plants Names",
];

function mapTaxaDatasets(taxa: Taxon[], datasets: Map<string, Dataset>) {
  return taxa.map((taxon) => ({
    ...taxon,
    dataset: datasets.get(taxon.datasetId),
  }));
}

// Function to sort by predefined order and then alphabetically
export function sortTaxaBySources(taxa: TaxonWithDataset[]) {
  return taxa
    .map((t) => t)
    .sort((first, second) => {
      const a = first.dataset?.name || "";
      const b = second.dataset?.name || "";

      // Get index of each item in the predefined order array
      const indexA = TAXA_SOURCE_PRIORITIES.indexOf(a);
      const indexB = TAXA_SOURCE_PRIORITIES.indexOf(b);

      // If both items are in the predefined order, sort by the order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one item is in the predefined order, that one comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither is in the predefined order, sort alphabetically
      return a.localeCompare(b);
    });
}
