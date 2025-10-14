import { createContext, useContext } from "react";
import classes from "./TimelineNavbar.module.css";

import { Box, Center, Container, Group, Paper, Stack, Text } from "@mantine/core";
import { MAX_WIDTH } from "@/app/constants";
import { useElementSize } from "@mantine/hooks";
import Link from "next/link";

const HighlightContext = createContext(false);
const ITEM_WIDTH = 200;
const ITEM_ICON_SIZE = 60;

interface TimelineNavbarProps {
  selected?: number;
  onSelected?: (index: number) => void;
  children: React.ReactElement<TimelineNavbarItemProps>[];
}

export function TimelineNavbar({ selected, onSelected, children }: TimelineNavbarProps) {
  const { ref, width } = useElementSize();
  const linkStart = !!children.at(0)?.props.href;
  const linkEnd = !!children.at(children.length - 1)?.props.href;

  return (
    <Paper className={classes.navbar}>
      <Container maw={MAX_WIDTH} px="xl" ref={ref}>
        <Connector width={width} linkStart={linkStart} linkEnd={linkEnd} />
        <Group justify="space-between">
          {children.map((child, idx) => (
            <HighlightContext key={idx} value={idx === selected}>
              <Box onClick={() => onSelected && onSelected(idx)}>{child}</Box>
            </HighlightContext>
          ))}
        </Group>
      </Container>
    </Paper>
  );
}

interface TimelineNavbarItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
}

function TimelineNavbarItem({ icon, label, href }: TimelineNavbarItemProps) {
  const selected = useContext(HighlightContext);

  return (
    <Paper
      component={href ? Link : undefined}
      href={href ?? ""}
      w={ITEM_WIDTH}
      bg={selected ? "midnight.1" : undefined}
      radius="lg"
      p="md"
      className={classes.item}
    >
      <Stack justify="space-between" gap={4}>
        <Center h={ITEM_ICON_SIZE} className={classes.icon}>
          {icon}
        </Center>
        <Text className={classes.label}>{label}</Text>
      </Stack>
    </Paper>
  );
}

TimelineNavbar.Item = TimelineNavbarItem;

interface TimelineConnectorProps {
  width: number;
  linkStart?: boolean;
  linkEnd?: boolean;
}

function Connector({ width, linkStart, linkEnd }: TimelineConnectorProps) {
  const offset = ITEM_ICON_SIZE / 2;

  let x = ITEM_WIDTH / 2;
  let w = width - ITEM_WIDTH;

  if (linkStart) {
    x *= 2;
    w -= ITEM_WIDTH / 2;
  }
  if (linkEnd) {
    w -= ITEM_WIDTH / 2;
  }

  return (
    <Box className={classes.connector} top={offset + 2}>
      <svg width={width} height={30}>
        <g transform={`translate(${x}, 15)`}>
          {linkStart && (
            <g transform={"translate(-15, -15)"}>
              <path d="M 3,15 27,3 27,27 Z" className={classes.arrow} />
            </g>
          )}
          <rect x={0} y={-3} width={w} height="6" className={classes.connectorLine} />

          {linkEnd && (
            <g transform={`translate(${w - 15}, -15)`}>
              <path d="M 27,15 3,27 3,3 z" className={classes.arrow} />
            </g>
          )}
        </g>
      </svg>
    </Box>
  );
}
