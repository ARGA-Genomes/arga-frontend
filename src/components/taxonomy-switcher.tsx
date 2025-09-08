"use client";

import {
  Accordion,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import * as Humanize from "humanize-plus";

import accClasses from "./taxonomy-switcher-acc.module.css";

import { Dataset, useDatasets } from "@/app/source-provider";
import { Provenance, Taxon, TaxonNode } from "@/generated/types";
import { normalizeLatinRank, RankMap } from "@/helpers/rankHelpers";
import { GET_TAXON_PROVENANCE } from "@/queries/provenance";
import { useQuery } from "@apollo/client";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Attribute, AttributePill, AttributePillContainer, AttributePillValue } from "./data-fields";
import { LoadOverlay } from "./load-overlay";
import RecordHistory from "./record-history";

interface TaxonExtended extends Taxon {
  dataset?: Dataset;
  originalCanonicalNames?: RankMap;
}

interface TaxonomySwitcherProps {
  taxa: TaxonExtended[];
}

function compareTaxons(taxa: TaxonExtended[], baseTaxon: TaxonExtended) {
  // Create a map of normalized rank to canonicalName for the baseTaxon hierarchy
  const baseHierarchyMap: RankMap = {};
  const baseRankNames: RankMap = {};
  baseTaxon.hierarchy.forEach((node) => {
    const normalizedRank = normalizeLatinRank(node.rank);
    baseHierarchyMap[normalizedRank] = node.canonicalName;
    baseRankNames[normalizedRank] = node.rank;
  });

  // For each taxon in taxa
  taxa.forEach((taxon) => {
    const differingRanks: RankMap = {};

    // Create a map of normalized rank to canonicalName for this taxon's hierarchy
    const taxonHierarchyMap: RankMap = {};
    const taxonRankNames: RankMap = {}; // Map normalized rank to the taxon's original rank names
    taxon.hierarchy.forEach((node) => {
      const normalizedRank = normalizeLatinRank(node.rank);
      taxonHierarchyMap[normalizedRank] = node.canonicalName;
      taxonRankNames[normalizedRank] = node.rank;
    });

    // Get the set of all normalized ranks to compare
    const allRanks = new Set([...Object.keys(baseHierarchyMap), ...Object.keys(taxonHierarchyMap)]);

    // Compare the canonicalNames for each normalized rank
    let differenceFound = false;
    for (const rank of allRanks) {
      const baseName = baseHierarchyMap[rank];
      const taxonName = taxonHierarchyMap[rank];

      if (taxonName !== baseName) {
        differenceFound = true;
        if (baseName === undefined && taxonName !== undefined) {
          // Base is missing the rank, taxon has it
          // Use the taxon's rank name (since taxon has it)
          const taxonRankName = taxonRankNames[rank] || rank;
          differingRanks[taxonRankName] = "Missing";
        } else if (taxonName === undefined && baseName !== undefined) {
          // Taxon is missing the rank, base has it
          // Use the base's original rank name (since taxon doesn't have this rank)
          const baseRankName = baseRankNames[rank] || rank;
          differingRanks[baseRankName] = "Missing";
        } else {
          // Both present but different canonicalNames
          // Use the taxon's rank name as the key
          const taxonRankName = taxonRankNames[rank] || rank;
          differingRanks[taxonRankName] = baseName;
        }
      }
    }

    // If any difference is found, add the field with only differing ranks
    if (differenceFound && Object.keys(differingRanks).length > 0) {
      // Add the field to the taxon object
      taxon.originalCanonicalNames = differingRanks;
    }
  });
}

function mapTaxaDatasets(taxa: TaxonExtended[], datasets: Map<string, Dataset>) {
  return taxa.map((taxon) => ({
    ...taxon,
    dataset: datasets.get(taxon.datasetId),
  }));
}

// Function to sort by predefined order and then alphabetically
export function sortTaxaBySources(taxa: TaxonExtended[]) {
  return taxa
    .map((t) => t)
    .filter((t) => t.status === "ACCEPTED")
    .sort((first, second) => {
      const a = first.dataset?.name || "";
      const b = second.dataset?.name || "";

      if (a === "Atlas of Living Australia") return -1;
      if (b === "Atlas of Living Australia") return 1;

      // If neither is in the predefined order, sort alphabetically
      return a.localeCompare(b);
    });
}

function processTaxa(taxa: TaxonExtended[], datasets: Map<string, Dataset>) {
  const taxaWithDatasets = mapTaxaDatasets(taxa, datasets);
  const sorted = sortTaxaBySources(taxaWithDatasets);
  compareTaxons(sorted.slice(1), sorted[0]);

  return sorted;
}

export function TaxonomySwitcher({ taxa: rawTaxa }: TaxonomySwitcherProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [entityId, setEntityId] = useState<string>("");
  const { ids } = useDatasets();
  const theme = useMantineTheme();

  const taxa = useMemo(() => processTaxa(rawTaxa, ids), [rawTaxa, ids]);

  const { loading, data } = useQuery<{ provenance: Provenance }>(GET_TAXON_PROVENANCE, {
    variables: { entityId },
    skip: entityId === "",
  });

  const [active, setActive] = useState<string>(`${taxa[0].scientificName}-${taxa[0].datasetId}`);

  return (
    <>
      <Modal
        radius="lg"
        size="xl"
        opened={opened}
        onClose={close}
        title={
          <>
            Record History - <i>{active.split("-")[0]}</i>
          </>
        }
        zIndex={2000}
        centered
        styles={{
          title: {
            fontFamily: theme.headings.fontFamily,
            fontSize: 22,
            fontWeight: 700,
            marginTop: 12,
          },
        }}
      >
        <LoadOverlay visible={loading} />
        <ScrollArea h={400}>
          <RecordHistory operations={data?.provenance.taxon} />
        </ScrollArea>
      </Modal>
      <Accordion
        value={active}
        onChange={(value) => {
          setActive(value || active);
        }}
        classNames={accClasses}
        loop
      >
        {taxa.map((taxon) => {
          const isActive = `${taxon.scientificName}-${taxon.datasetId}` === active;

          return (
            <Accordion.Item
              key={`${taxon.scientificName}-${taxon.datasetId}`}
              value={`${taxon.scientificName}-${taxon.datasetId}`}
            >
              <Accordion.Control>
                <Group justify="space-between" pr="md">
                  <Text fw={600} c={isActive ? "white" : undefined} fz={isActive ? 26 : "lg"}>
                    {taxon.dataset?.name || "Unknown Dataset"}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  {taxon.hierarchy.length > 0 && (
                    <>
                      <Hierarchy hierarchy={taxon.hierarchy} originalCanonicalNames={taxon.originalCanonicalNames} />
                      <Divider opacity={0.1} mt="xs" mb="sm" />
                    </>
                  )}
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
                    {taxon.entityId && (
                      <UnstyledButton
                        onClick={() => {
                          setEntityId(taxon.entityId || "");
                          open();
                        }}
                      >
                        <Attribute>
                          <AttributePillValue
                            color="midnight.12"
                            hoverColor="midnight.10"
                            textColor="white"
                            value="Record history"
                            popoverDisabled
                          />
                        </Attribute>
                      </UnstyledButton>
                    )}
                  </Group>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}

function Hierarchy({
  hierarchy,
  originalCanonicalNames,
}: {
  hierarchy: TaxonNode[];
  originalCanonicalNames?: RankMap;
}) {
  return (
    <Group gap="lg">
      {hierarchy
        .map((t) => t)
        .reverse()
        .map((node, idx) => {
          const originalCanonicalName = originalCanonicalNames?.[node.rank];
          const isDifferent = Boolean(originalCanonicalName);

          return (
            <AttributePill
              key={idx}
              labelColor="white"
              popoverDisabled={!isDifferent}
              popoverLabel={
                isDifferent ? (
                  <>
                    <b>ALA: </b> {originalCanonicalName}
                  </>
                ) : (
                  ""
                )
              }
              color={isDifferent ? "white" : undefined}
              hoverColor="midnight.0"
              label={Humanize.capitalize(node.rank.toLowerCase()) + (isDifferent ? "*" : "")}
              value={node.canonicalName}
              href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
              icon={IconArrowUpRight}
              showIconOnHover
              miw={100}
            />
          );
        })}
    </Group>
  );
}
