"use client";

import classes from "./significant-milestones.module.css";

import { gql, useQuery } from "@apollo/client";
import { Center, Paper, ScrollArea, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";
import { Group, Text } from "@mantine/core";
import { GroupedTimeline } from "@/components/grouped-timeline";
import { IconArrowRight } from "@tabler/icons-react";
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
};

function getAccession(attrs: Attribute[]): string | undefined {
  return attrs.find((attr) => attr.name == "milestone_assembly_accession")?.value;
}

function getReleaseDate(attrs: Attribute[]): Date | undefined {
  const value = attrs.find((attr) => attr.name == "milestone_assembly_release_date")?.value;
  return value ? new Date(value) : undefined;
}

interface MilestoneItemProps {
  milestone: Milestone;
  inverted?: boolean;
}

function MilestoneItem({ milestone, inverted }: MilestoneItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const genomeHref = `/species/${milestone.canonicalName.replaceAll(" ", "_")}/whole_genomes/${milestone.accession}`;

  const variants = {
    expanded: {
      opacity: 1.0,
      height: 130,
    },
    compact: {
      opacity: 0.7,
      height: 80,
    },
    visible: {
      opacity: 1.0,
      scale: 1.0,
    },
    invisible: {
      opacity: 0.0,
      scale: 0.0,
    },
  };

  return (
    <Center>
      <Paper
        component={motion.div}
        className={classes.item}
        animate={hovered ? "expanded" : "compact"}
        variants={variants}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        <Link href={genomeHref}>
          <Stack px="sm" pt="md" pb="xs" justify="space-between" h={130}>
            <Text className={classes.text}>
              <i>{milestone.canonicalName}</i>
            </Text>

            <motion.div animate={hovered ? "visible" : "invisible"} variants={variants}>
              <Group component={motion.span} justify="space-around" wrap="nowrap">
                <Text className={classes.buttonText}>view genome</Text>
                <IconArrowRight className={classes.buttonText} />
              </Group>
            </motion.div>
          </Stack>
        </Link>
      </Paper>
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
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ScrollArea.Autosize>
      <GroupedTimeline height={500}>
        {milestones?.map((milestone) => (
          <GroupedTimeline.Item width={200} height={150} date={milestone.date} key={milestone.accession}>
            <MilestoneItem milestone={milestone} />
          </GroupedTimeline.Item>
        ))}
      </GroupedTimeline>
    </ScrollArea.Autosize>
  );
}
