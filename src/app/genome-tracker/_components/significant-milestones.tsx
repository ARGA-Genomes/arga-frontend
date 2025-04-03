"use client";

import classes from "./significant-milestones.module.css";

import { gql, useQuery } from "@apollo/client";
import { Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";
import { Group, Text } from "@mantine/core";
import { GroupedTimeline } from "@/components/grouped-timeline";
import { IconArrowRight, IconBook } from "@tabler/icons-react";
import Link from "next/link";

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
  visible: boolean;
}

function MilestoneItemDetails({ milestone, visible }: MilestoneItemDetails) {
  const variants = {
    expanded: {
      opacity: 1,
      height: 100,
      /* scale: 1, */
    },
    compact: {
      /* opacity: 0, */
      height: 0,
      /* scale: 0, */
    },
  };

  return (
    <Paper
      component={motion.div}
      className={classes.itemDetails}
      animate={visible ? "expanded" : "compact"}
      variants={variants}
    >
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
    </Paper>
  );
}

interface MilestoneItemHeaderProps {
  milestone: Milestone;
  compact: boolean;
}

function MilestoneItemHeader({ milestone, compact }: MilestoneItemHeaderProps) {
  const variants = {
    expanded: {
      height: 140,
    },
    compact: {
      height: 40,
      paddingTop: 10,
    },
    visible: {
      opacity: 1,
    },
    invisible: {
      opacity: 0,
    },
  };

  return (
    <Paper component={motion.div} animate={compact ? "compact" : "expanded"} variants={variants}>
      <Center h="inherit">
        <Stack px="sm" pb="xs" gap={0}>
          <Text className={classes.text}>{milestone.vernacularName}</Text>
          <Text
            component={motion.span}
            animate={compact ? "invisible" : "visible"}
            variants={variants}
            className={classes.text}
            fz="xs"
            fs="italic"
          >
            {milestone.canonicalName}
          </Text>
        </Stack>
      </Center>
    </Paper>
  );
}

interface MilestoneItemProps {
  milestone: Milestone;
  inverted?: boolean;
}

function MilestoneItem({ milestone, inverted }: MilestoneItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const genomeHref = `/species/${milestone.canonicalName.replaceAll(" ", "_")}/whole_genomes/${milestone.accession}`;

  const details = <MilestoneItemDetails milestone={milestone} visible={hovered} />;

  return (
    <Center>
      <Link href={genomeHref}>
        <Paper
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
          h={140}
          withBorder
          className={classes.item}
        >
          <Stack gap={0}>
            {details}
            <MilestoneItemHeader milestone={milestone} compact={hovered} />
          </Stack>
        </Paper>
      </Link>
    </Center>
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
