"use client";

import classes from "./grouped-timeline.module.css";

import { Group } from "@visx/group";
import { ReactElement, ReactNode } from "react";

const GROUP_GAP = 15;

interface GroupedTimelineItemProps {
  width: number;
  height: number;
  date: Date;
  children: ReactNode | ReactNode[];
}

function GroupedTimelineItem({ width, height, children }: GroupedTimelineItemProps) {
  return (
    <Group>
      <foreignObject width={width} height={height}>
        {children}
      </foreignObject>
    </Group>
  );
}

interface GroupedTimelineYearProps {
  width: number;
  height: number;
  startInverted: boolean;
  header?: ReactNode;
  children: ReactElement<GroupedTimelineItemProps>[];
}

function GroupedTimelineYear({ width, height, startInverted, header, children }: GroupedTimelineYearProps) {
  // the line notches are about 90px
  const centerY = height / 2;
  const bottom = centerY + 90;
  const top = centerY - 90;

  const offset = width / (children.length + 1);

  return (
    <>
      <rect height={height} width={width} className={classes.group} rx={50} />
      {children.map((child, idx) => {
        const inverted = idx % 2 == (startInverted ? 1 : 0);

        const childOffset = offset * (idx + 1);
        const childCenter = child.props.width / 2;
        const left = childOffset - childCenter;

        return (
          <Group key={child.props.date.toString()} left={left} top={inverted ? top - child.props.height : bottom}>
            {child}
          </Group>
        );
      })}

      <foreignObject x={50} y={startInverted ? 50 : height - 120} width={100} height={100}>
        {header}
      </foreignObject>
    </>
  );
}

interface LineProps {
  groups: Map<number, GroupedYear>;
}

function Line({ groups }: LineProps) {
  const points: Array<number> = [];

  let cursor = 0;
  for (const [_year, group] of groups.entries()) {
    // get the distance between points within the group
    const distance = group.width / (group.children.length + 1);

    for (let i = 1; i <= group.children.length; i++) {
      cursor += distance;
      points.push(cursor);
    }

    // move cursor to start of the next group
    cursor += distance + GROUP_GAP;
  }

  const lineNotchDown = "q 20,0 20,20 v 40 v -40 q 0,-20, 20,-20";
  const lineNotchUp = "q 20,0 20,-20 v -40 v 40 q 0,20, 20,20";
  const linePath = points.map((point, idx) => `L ${point - 20} 0 ${idx % 2 ? lineNotchUp : lineNotchDown}`).join(" ");

  return (
    <>
      <path d={`M 0 0 ${linePath}`} className={classes.line} />
      {points.map((point, idx) => (
        <circle key={point} cx={point} cy={idx % 2 ? -60 : 60} r={25} className={classes.lineNotch} />
      ))}
    </>
  );
}

interface GroupedYear {
  width: number;
  children: ReactElement<GroupedTimelineItemProps>[];
}

interface GroupedTimelineProps {
  height: number;
  children?: ReactElement<GroupedTimelineItemProps>[];
}

export function GroupedTimeline({ height, children }: GroupedTimelineProps) {
  const years = new Map<number, GroupedYear>();

  // group the timeline items into years
  for (const child of children ?? []) {
    const year = child.props.date.getFullYear();

    const group = years.get(year) || { width: 100, children: [] };
    group.children.push(child);
    group.width += child.props.width;

    years.set(year, group);
  }

  const allGroups = years.entries().reduce((acc, [_key, group]) => (acc += group.width), 0);
  const allMargins = years.keys().toArray().length * GROUP_GAP;
  const totalWidth = allGroups + allMargins;
  let groupLeft = 0;
  let childrenAccumulator = 0;
  let startInverted = false;

  return (
    <svg height={height} width={totalWidth} overflow="visible">
      {years?.entries().map(([year, group]) => {
        const left = groupLeft;
        groupLeft += group.width + GROUP_GAP;

        startInverted = childrenAccumulator % 2 == 0;
        childrenAccumulator += group.children.length;

        return (
          <Group key={year} left={left}>
            <GroupedTimelineYear
              width={group.width}
              height={height}
              startInverted={startInverted}
              header={<text className={classes.itemYear}>{year.toString()}</text>}
            >
              {group.children}
            </GroupedTimelineYear>
          </Group>
        );
      })}
      <Group top={height / 2}>
        <Line groups={years} />
      </Group>
    </svg>
  );
}

GroupedTimeline.Item = GroupedTimelineItem;
