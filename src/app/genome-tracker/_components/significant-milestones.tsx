"use client";

import classes from "./significant-milestones.module.css";

import { GroupedTimeline } from "@/components/grouped-timeline";
import { Source } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Center, Group, Image, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { motion, Transition } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const TAXON_GROUP_COLOR: Record<string, string> = {
  mammals: "moss",
  "plants and crops": "moss",
  "reptiles and amphibians": "moss",
  "invasive species": "moss",
  fishes: "wheat",
  "microbes and pests": "wheat",
  birds: "wheat",
};

const GET_SIGNIFICANT_MILESTONES = gql`
  query SignificantMilestones {
    source(by: { name: "ARGA Milestone Species" }) {
      species(page: 1, pageSize: 50) {
        records {
          taxonomy {
            canonicalName
            attributes
          }
        }
      }
    }
  }
`;

type SignificantMilestonesQuery = {
  source: {
    species: {
      records: {
        taxonomy: {
          canonicalName: string;
          attributes: Attribute[];
        };
      }[];
    };
  };
};

interface Attribute {
  name: string;
  value: string;
}

type Milestone = {
  canonicalName: string;
  accession?: string;
  date: Date;
  publicationDoi?: string;
  vernacularName?: string;
  firsts?: string;
  significance?: string;
  taxonGroup?: string;
};

function getAttrString(attrs: Attribute[], name: string): string | undefined {
  return attrs.find((attr) => attr.name == name)?.value;
}

function getAttrDate(attrs: Attribute[], name: string): Date | undefined {
  const value = attrs.find((attr) => attr.name == name)?.value;
  return value ? new Date(value) : undefined;
}

function getAccession(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "milestone_assembly_accession");
}

function getPublicationDOI(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "publication_doi");
}

function getVernacularName(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "vernacular_name");
}

function getFirsts(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "firsts");
}

function getSignificance(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "significance");
}

function getTaxonGroup(attrs: Attribute[]): string | undefined {
  return getAttrString(attrs, "taxon group");
}

function getReleaseDate(attrs: Attribute[]): Date | undefined {
  return getAttrDate(attrs, "milestone_assembly_release_date");
}

interface MilestoneItemDetails {
  milestone: Milestone;
  onFlip?: () => void;
}

function MilestoneItemDetails({ milestone, onFlip }: MilestoneItemDetails) {
  const colour = TAXON_GROUP_COLOR[milestone.taxonGroup ?? ""] || "moss";

  return (
    <Stack justify="space-between" py="md" h="100%">
      <Stack gap={0}>
        <Group wrap="nowrap" justify="space-between" mb="sm">
          <Paper radius="xl" px="md" py={4} w="80%" bg={`${colour}.1`} c={colour}>
            <Text className={classes.itemDetailsHeader}>{milestone.taxonGroup?.toUpperCase()}</Text>
          </Paper>

          <Stack
            style={{ position: "absolute", right: 15, top: 15 }}
            gap={0}
            p={15}
            className={classes.flipButton}
            onClick={onFlip}
          >
            <Image
              src="/icons/misc/arrow.svg"
              w={30}
              h={30}
              alt="flip card"
              fit="contain"
              style={{ rotate: "180deg" }}
            />
            <Center>
              <Text fz="xs" fw={700}>
                FLIP
              </Text>
            </Center>
          </Stack>
        </Group>

        <Box pl="lg">
          <div style={{ position: "relative", width: 0, height: 0 }}>
            <svg width={10} height={10} style={{ position: "absolute", left: -20, top: 4 }}>
              <circle cx={5} cy={5} r={5} fill={`var(--mantine-color-${colour}-5)`} />
            </svg>
          </div>

          <Text className={classes.detailsText}>{milestone.firsts}</Text>
          <Text className={classes.detailsText} fs="italic" fz=".6em">
            {milestone.significance}
          </Text>
        </Box>
      </Stack>

      {milestone.publicationDoi && (
        <Button
          variant="subtle"
          rightSection={<IconBook className={classes.buttonTextInverted} />}
          justify="space-between"
          radius="lg"
          color={colour}
          component={Link}
          href={milestone.publicationDoi}
          target="_blank"
        >
          <Text className={classes.buttonTextInverted}>view publication</Text>
        </Button>
      )}
    </Stack>
  );
}

interface MilestoneItemHeaderProps {
  milestone: Milestone;
  onFlip?: () => void;
}

const DISABLED_ACCESSIONS = [
  undefined,
  "GCA_000004035.1",
  "GCA_000612305.1",
  "GCA_000827275.1",
  "GCA_900303285.1",
  "GCA_009430485.1",
  "GCA_008360975.2",
];

function MilestoneItemHeader({ milestone, onFlip }: MilestoneItemHeaderProps) {
  const genomeHref = `/species/${milestone.canonicalName.replaceAll(" ", "_")}/assemblies/`;

  return (
    <Center h="inherit">
      <Stack px="sm" pb="xs" gap="lg">
        <Stack gap={0}>
          <Text className={classes.text}>{milestone.vernacularName}</Text>
          <Text component={motion.span} className={classes.text} fz="xs" fs="italic">
            {milestone.canonicalName}
          </Text>
        </Stack>
        {!DISABLED_ACCESSIONS.includes(milestone.accession) && (
          <Button color="midnight.8" radius="xl" component={Link} href={genomeHref}>
            <Text className={classes.buttonText}>view genome</Text>
          </Button>
        )}
      </Stack>

      <Stack
        style={{ position: "absolute", right: 15, bottom: 5 }}
        gap={0}
        p={15}
        className={classes.flipButton}
        onClick={onFlip}
      >
        <Image src="/icons/misc/arrow.svg" w={30} h={30} alt="flip card" fit="contain" />
        <Center>
          <Text fz="xs" fw={700}>
            FLIP
          </Text>
        </Center>
      </Stack>
    </Center>
  );
}

interface MilestoneItemProps {
  milestone: Milestone;
  inverted?: boolean;
}

function MilestoneItem({ milestone, inverted }: MilestoneItemProps) {
  const [flipped, setFlipped] = useState<boolean>(false);
  const colour = TAXON_GROUP_COLOR[milestone.taxonGroup ?? ""] || "moss";

  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 40,
  } as unknown as Transition;

  return (
    <motion.div
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? -180 : 0 }}
        transition={spring}
        style={{
          backfaceVisibility: "hidden",
          position: "absolute",
          width: "100%",
          height: "100%",
          padding: "var(--mantine-spacing-sm)",
        }}
      >
        <Paper withBorder className={classes.item}>
          <MilestoneItemHeader milestone={milestone} onFlip={() => setFlipped(true)} />
        </Paper>
      </motion.div>
      <motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: flipped ? 0 : 180 }}
        transition={spring}
        style={{
          backfaceVisibility: "hidden",
          position: "absolute",
          width: "100%",
          height: "100%",
          padding: "var(--mantine-spacing-sm)",
        }}
      >
        <Paper withBorder className={classes.itemDetails} bg={`${colour}.0`}>
          <MilestoneItemDetails milestone={milestone} onFlip={() => setFlipped(false)} />
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export function SignificantMilestones() {
  const { data } = useQuery<{ source: Source }>(GET_SIGNIFICANT_MILESTONES);

  const milestones = data?.source.species.records
    .map((record) => {
      const attributes = (record.taxonomy.attributes || []) as Attribute[];
      return {
        canonicalName: record.taxonomy.canonicalName,
        accession: getAccession(attributes),
        date: getReleaseDate(attributes) || new Date(),
        publicationDoi: getPublicationDOI(attributes),
        vernacularName: getVernacularName(attributes),
        firsts: getFirsts(attributes),
        significance: getSignificance(attributes),
        taxonGroup: getTaxonGroup(attributes),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ScrollArea.Autosize>
      <Group wrap="nowrap" gap={0}>
        <GroupedTimeline height={540}>
          {milestones?.map((milestone, idx) => (
            <GroupedTimeline.Item width={300} height={200} date={milestone.date} key={milestone.accession}>
              <MilestoneItem milestone={milestone} inverted={idx % 2 == 1} />
            </GroupedTimeline.Item>
          ))}
        </GroupedTimeline>
      </Group>
    </ScrollArea.Autosize>
  );
}
