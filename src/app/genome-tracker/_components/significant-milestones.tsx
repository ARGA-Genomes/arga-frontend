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
  publicationDoi?: string;
  vernacularName?: string;
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

function getReleaseDate(attrs: Attribute[]): Date | undefined {
  return getAttrDate(attrs, "milestone_assembly_release_date");
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
    },
    compact: {
      opacity: 0.7,
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
              {milestone.vernacularName} (<i>{milestone.canonicalName}</i>) genome published
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
      publicationDoi: getPublicationDOI(record.taxonomy.attributes),
      vernacularName: getVernacularName(record.taxonomy.attributes),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ScrollArea.Autosize>
      <GroupedTimeline height={450}>
        {milestones?.map((milestone) => (
          <GroupedTimeline.Item width={250} height={150} date={milestone.date} key={milestone.accession}>
            <MilestoneItem milestone={milestone} />
          </GroupedTimeline.Item>
        ))}
      </GroupedTimeline>
    </ScrollArea.Autosize>
  );
}
