"use client";

import classes from "./significant-milestones.module.css";

import { gql, useQuery } from "@apollo/client";
import { Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";
import { Group, Text } from "@mantine/core";
import { GroupedTimeline } from "@/components/grouped-timeline";
import { IconArrowRight, IconBook } from "@tabler/icons-react";

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

function getReleaseDate(attrs: Attribute[]): Date | undefined {
  return getAttrDate(attrs, "milestone_assembly_release_date");
}

interface MilestoneItemDetails {
  milestone: Milestone;
}

function MilestoneItemDetails({ milestone }: MilestoneItemDetails) {
  return (
    <Stack justify="space-between">
      <Stack gap={0}>
        <Text className={classes.detailsText}>{milestone.firsts}</Text>
        <Text className={classes.detailsText}>{milestone.significance}</Text>
      </Stack>

      <Stack gap={0}>
        <Group component={motion.span} justify="space-between" wrap="nowrap">
          <Text className={classes.buttonText}>view publication</Text>
          <IconBook className={classes.buttonText} />
        </Group>
        <Group component={motion.span} justify="space-between" wrap="nowrap">
          <Text className={classes.buttonText}>view genome</Text>
          <IconArrowRight className={classes.buttonText} />
        </Group>
      </Stack>
    </Stack>
  );
}

interface MilestoneItemHeaderProps {
  milestone: Milestone;
}

function MilestoneItemHeader({ milestone }: MilestoneItemHeaderProps) {
  return (
    <Center h="inherit">
      <Stack px="sm" pb="xs" gap={0}>
        <Text className={classes.text}>{milestone.vernacularName}</Text>
        <Text component={motion.span} className={classes.text} fz="xs" fs="italic">
          {milestone.canonicalName}
        </Text>
      </Stack>
    </Center>
  );
}

interface MilestoneItemProps {
  milestone: Milestone;
  inverted?: boolean;
}

function MilestoneItem({ milestone, inverted }: MilestoneItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const genomeHref = `/species/${milestone.canonicalName.replaceAll(" ", "_")}/whole_genomes/${milestone.accession}`;

  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 40,
  };

  return (
    <motion.div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        animate={{ rotateY: hovered ? -180 : 0 }}
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
          <MilestoneItemHeader milestone={milestone} />
        </Paper>
      </motion.div>
      <motion.div
        initial={{ rotateY: 180 }}
        animate={{ rotateY: hovered ? 0 : 180 }}
        transition={spring}
        style={{
          backfaceVisibility: "hidden",
          position: "absolute",
          width: "100%",
          height: "100%",
          padding: "var(--mantine-spacing-sm)",
        }}
      >
        <Paper withBorder className={classes.itemDetails}>
          <MilestoneItemDetails milestone={milestone} />
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export function SignificantMilestones() {
  const { data } = useQuery<SignificantMilestonesQuery>(GET_SIGNIFICANT_MILESTONES);

  const milestones = data?.source.species.records
    .map((record) => ({
      canonicalName: record.taxonomy.canonicalName,
      accession: getAccession(record.taxonomy.attributes),
      date: getReleaseDate(record.taxonomy.attributes) || new Date(),
      publicationDoi: getPublicationDOI(record.taxonomy.attributes),
      vernacularName: getVernacularName(record.taxonomy.attributes),
      firsts: getFirsts(record.taxonomy.attributes),
      significance: getSignificance(record.taxonomy.attributes),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ScrollArea.Autosize>
      <GroupedTimeline height={450}>
        {milestones?.map((milestone, idx) => (
          <GroupedTimeline.Item width={250} height={150} date={milestone.date} key={milestone.accession}>
            <MilestoneItem milestone={milestone} inverted={idx % 2 == 1} />
          </GroupedTimeline.Item>
        ))}
      </GroupedTimeline>
    </ScrollArea.Autosize>
  );
}
