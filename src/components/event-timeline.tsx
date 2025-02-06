import { DateTime } from "luxon";
import classes from "./event-timeline.module.css";

import {
  Table,
  Text,
  Stack,
  Box,
  Center,
  Paper,
  Image,
  MantineSize,
  Title,
} from "@mantine/core";

export enum LineStyle {
  None = "none",
  Solid = "solid",
}

interface TimelineDatedIcon {
  size?: MantineSize;
  date?: number;
  lineStyle?: LineStyle;
}

export function TimelineDatedIcon({
  size,
  date,
  lineStyle,
}: TimelineDatedIcon) {
  const iconSize = size || 70;
  const style = lineStyle || LineStyle.Solid;

  return (
    <Stack h="100%" gap={0}>
      <Center>
        <Box w={iconSize} h={iconSize}>
          <svg
            viewBox={`0 0 ${iconSize} ${iconSize}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50%" cy="50%" r="50%" style={{ fill: "#233c4b" }} />
          </svg>
        </Box>
      </Center>
      <Paper mt={-2} p={5} radius="md" bg="#233c4b" style={{ border: "none" }}>
        <Center>
          <Text
            fz="xs"
            fw={600}
            c="white"
            style={{ fontVariant: "small-caps" }}
          >
            {date || "no date"}
          </Text>
        </Center>
      </Paper>
      {style !== LineStyle.None && (
        <Center h="100%">
          <svg
            width={4}
            height="100%"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            display="block"
          >
            <rect height={1} width={1} style={{ fill: "#233c4b" }}></rect>
          </svg>
        </Center>
      )}
    </Stack>
  );
}

interface TimelineIcon {
  icon?: string;
  size?: MantineSize;
  lineStyle?: LineStyle;
}

export function TimelineIcon({ icon, size, lineStyle }: TimelineIcon) {
  const iconSize = size || 70;
  const style = lineStyle || LineStyle.Solid;

  return (
    <Stack h="100%" gap={0}>
      <Center>
        <Box w={iconSize} h={iconSize}>
          {icon && <Image w={iconSize} h={iconSize} src={icon} alt="" />}
          {/* <svg viewBox={`0 0 ${iconSize} ${iconSize}`} xmlns="http://www.w3.org/2000/svg">
             <circle cx="50%" cy="50%" r="50%" style={{ fill: "#233c4b" }} />
           </svg> */}
        </Box>
      </Center>
      {style !== LineStyle.None && (
        <Center h="100%">
          <svg
            width={4}
            height="100%"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            display="block"
          >
            <rect height={1} width={1} style={{ fill: "#233c4b" }}></rect>
          </svg>
        </Center>
      )}
    </Stack>
  );
}

interface EventTimelineProps {
  children: React.ReactNode;
}

export function EventTimeline({ children }: EventTimelineProps) {
  return (
    <Table className={classes.timeline} h={1}>
      <Table.Tbody>{children}</Table.Tbody>
    </Table>
  );
}

interface EventTimelineItemProps {
  icon: React.ReactNode;
  header: React.ReactNode;
  body: React.ReactNode;
}

export function EventTimelineItem({
  icon,
  header,
  body,
}: EventTimelineItemProps) {
  return (
    <Table.Tr className={classes.itemRow}>
      <Table.Td className={classes.itemIcon} height="100%">
        {icon}
      </Table.Td>
      <Table.Td className={classes.itemHeader}>{header}</Table.Td>
      <Table.Td className={classes.itemBody} width="100%">
        {body}
      </Table.Td>
    </Table.Tr>
  );
}

interface HorizontalEventTimelineProps {
  years?: number[];
  children: React.ReactNode[];
}

export function HorizontalEventTimeline({
  years,
  children,
}: HorizontalEventTimelineProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {years?.map((year, idx) => (
            <Table.Td key={idx}>
              <Title order={3}>{year}</Title>
            </Table.Td>
          ))}
          <Table.Td w="1%">
            <Title order={3}>{DateTime.now().year}</Title>
          </Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{children}</Table.Tbody>
    </Table>
  );
}

interface HorizontalEventTimelineItemProps {
  span?: number;
  children: React.ReactNode;
}

export function HorizontalEventTimelineItem({
  span,
  children,
}: HorizontalEventTimelineItemProps) {
  return (
    <Table.Tr style={{ border: "none" }}>
      <Table.Td className={classes.itemBody} width="100%" colSpan={span}>
        {children}
      </Table.Td>
    </Table.Tr>
  );
}

EventTimeline.Item = EventTimelineItem;
HorizontalEventTimeline.Item = HorizontalEventTimelineItem;
