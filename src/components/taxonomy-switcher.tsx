"use client";

import * as Humanize from "humanize-plus";
import {
  Accordion,
  Badge,
  Divider,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Timeline,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";

import accClasses from "./taxonomy-switcher-acc.module.css";
import tmlnClasses from "./taxonomy-switcher-tmln.module.css";

import { Taxon } from "@/queries/taxa";
import {
  Attribute,
  AttributePill,
  AttributePillContainer,
  AttributePillValue,
} from "./data-fields";
import { Dataset, useDatasets } from "@/app/source-provider";
import { useMemo, useState } from "react";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "@apollo/client";
import { GET_TAXON_PROVENANCE, ProvenanceQuery } from "@/queries/provenance";
import { useDisclosure } from "@mantine/hooks";
import { LoadOverlay } from "./load-overlay";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [entityId, setEntityId] = useState<string>("");
  const datasets = useDatasets();
  const theme = useMantineTheme();

  const taxaWithDatasets = mapTaxaDatasets(taxa, datasets);
  const sorted = sortTaxaBySources(taxaWithDatasets);

  const { loading, error, data } = useQuery<ProvenanceQuery>(
    GET_TAXON_PROVENANCE,
    {
      variables: { entityId },
    }
  );

  console.log(data);

  const first = useMemo(
    () =>
      sorted.find(
        (taxon) => taxon.dataset?.name === "Atlas of Living Australia"
      ) || sorted[0],
    [sorted]
  );

  const [active, setActive] = useState<string>(
    `${first.scientificName}-${first.datasetId}`
  );

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
          <Timeline
            bulletSize={28}
            classNames={tmlnClasses}
            color="midnight.9"
            active={data?.provenance.taxon.length || 0}
          >
            {data?.provenance.taxon.map((taxon, idx) => {
              return (
                <Timeline.Item
                  fz="lg"
                  fw={700}
                  bullet={
                    taxon.action.toString() === "UPDATE" ? (
                      <IconEdit size={14} />
                    ) : (
                      <IconPlus size={14} />
                    )
                  }
                  key={idx}
                  title={
                    <Group align="center">
                      <Text size="lg" fw={600} c="midnight.9">
                        {Humanize.capitalize(
                          taxon.action.toString().toLowerCase()
                        )}
                      </Text>
                      <Badge color="shellfish" variant="light">
                        {taxon.dataset.name}
                      </Badge>
                    </Group>
                  }
                  c="midnight.7"
                >
                  <Stack gap={0}>
                    {taxon.action.toString() === "UPDATE" && (
                      <Flex gap="xs">
                        <Text size="sm" fw={600}>
                          {taxon.atom.type}
                        </Text>
                        <IconArrowRight size={18} />
                        <Text size="sm">{taxon.atom.value}</Text>
                      </Flex>
                    )}
                    <Text size="sm" c="dimmed">
                      {new Date(taxon.loggedAt).toLocaleString()}
                    </Text>
                  </Stack>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </ScrollArea>
      </Modal>
      <Accordion
        value={active}
        onChange={(value) => setActive(value || active)}
        classNames={accClasses}
        loop
      >
        {sorted.map((taxon) => {
          const isActive =
            `${taxon.scientificName}-${taxon.datasetId}` === active;

          return (
            <Accordion.Item
              key={`${taxon.scientificName}-${taxon.datasetId}`}
              value={`${taxon.scientificName}-${taxon.datasetId}`}
            >
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
                  {taxon.hierarchy.length > 0 && (
                    <>
                      <Hierarchy hierarchy={taxon.hierarchy} />
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
                          setEntityId(taxon.entityId);
                          open();
                        }}
                      >
                        <Attribute>
                          <AttributePillValue
                            color="midnight.12"
                            hoverColor="midnight.10"
                            textColor="white"
                            value="record history"
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
            popoverDisabled
            hoverColor="midnight.0"
            label={Humanize.capitalize(node.rank.toLowerCase())}
            value={node.canonicalName}
            href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
            icon={IconArrowUpRight}
            showIconOnHover
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
    .filter((t) => t.status === "ACCEPTED")
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
