"use client";

import classes from "./significant-milestones.module.css";

import { gql, useQuery } from "@apollo/client";
import { Box, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear, scaleTime } from "@visx/scale";
import { Circle, Line } from "@visx/shape";
import { Text as SvgText } from "@visx/text";
import d3, { max, min } from "d3";
import { motion } from "framer-motion";
import { useState } from "react";

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
  date?: Date;
};

interface MilestoneItemProps {
  milestone: Milestone;
  x: number;
  y: number;
  height: number;
}

function getAccession(attrs: Attribute[]): string | undefined {
  return attrs.find((attr) => attr.name == "milestone_assembly_accession")?.value;
}

function getReleaseDate(attrs: Attribute[]): Date | undefined {
  const value = attrs.find((attr) => attr.name == "milestone_assembly_release_date")?.value;
  return value ? new Date(value) : undefined;
}

function MilestoneItem({ milestone, x, y, height }: MilestoneItemProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  const bulletOffset = { x: 30, y: height / 2 };
  /* const text = `${milestone.date?.getFullYear()}: ${milestone.canonicalName} - ${milestone.accession}`; */
  const text = `${milestone.canonicalName}`;
  const textFull = `${milestone.date?.getFullYear()}: ${milestone.canonicalName} - ${milestone.accession}`;

  const variants = {
    expanded: {
      width: textFull.length * 10 + bulletOffset.x,
      opacity: 1.0,
    },
    compact: {
      width: text.length * 10 + bulletOffset.x,
      opacity: 0.5,
    },
    visible: {
      opacity: 1.0,
    },
    invisible: {
      opacity: 0.0,
    },
  };

  return (
    <Group left={x - bulletOffset.x} top={y} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
      <motion.rect
        className={classes.item}
        height={height}
        ry={20}
        animate={hovered ? "expanded" : "compact"}
        variants={variants}
      />
      <Group left={bulletOffset.x} top={bulletOffset.y}>
        <Circle r={6} className={classes.bullet} />

        <motion.g animate={hovered ? "invisible" : "visible"} variants={variants}>
          <SvgText x={30} className={classes.text}>
            {text}
          </SvgText>
        </motion.g>

        <motion.g animate={hovered ? "visible" : "invisible"} variants={variants}>
          <SvgText x={30} className={classes.text}>
            {textFull}
          </SvgText>
        </motion.g>
      </Group>

      <Group left={textFull.length * 10 + bulletOffset.x + 10}>
        <motion.rect
          ry={20}
          height={height}
          width={80}
          className={classes.itemButton}
          animate={hovered ? "visible" : "invisible"}
          variants={variants}
        />
        <motion.g animate={hovered ? "visible" : "invisible"} variants={variants}>
          <SvgText x={23} y={height / 3} className={classes.buttonText}>
            view
          </SvgText>
          <SvgText x={13} y={(height / 3) * 2} className={classes.buttonText}>
            genome
          </SvgText>
        </motion.g>
      </Group>
    </Group>
  );
}

interface SignificantMilestonesProps {
  domain: [Date, Date];
}

export function SignificantMilestones({ domain }: SignificantMilestonesProps) {
  const { data } = useQuery<SignificantMilestonesQuery>(GET_SIGNIFICANT_MILESTONES);

  const milestones = data?.source.species.records
    .map((record) => ({
      canonicalName: record.taxonomy.canonicalName,
      accession: getAccession(record.taxonomy.attributes),
      date: getReleaseDate(record.taxonomy.attributes) || new Date(),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reverse();

  const maxY = milestones?.length ?? 0;
  const height = 40;
  const yScale = scaleLinear({ range: [0, maxY * (height + 10)], domain: [0, maxY] });
  const totalHeight = yScale(maxY);

  return (
    <ScrollArea h={300}>
      <ParentSize>
        {(parent) => {
          const xScale = scaleTime({ range: [0, parent.width], domain });

          return (
            <svg height={totalHeight} width={parent.width} overflow="visible">
              {milestones?.map((milestone, idx) => (
                <MilestoneItem
                  key={milestone.canonicalName}
                  milestone={milestone}
                  x={xScale(milestone.date)}
                  y={yScale(milestones.length - idx)}
                  height={height}
                />
              ))}
            </svg>
          );
        }}
      </ParentSize>
    </ScrollArea>
  );
}
