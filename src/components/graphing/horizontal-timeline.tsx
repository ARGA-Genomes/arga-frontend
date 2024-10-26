import * as d3 from "d3";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export enum TimelineItemType {
  Bar,
  Instant,
}

export interface TimelineItem {
  label: string;
  subtitle?: string;
  year?: number;
  date: Date;
  endDate?: Date;
  type: TimelineItemType;
  colour?: string;
  act: string;
}

interface TimelineBarProps {
  item: TimelineItem;
  width: number;
  acceptedWidth?: number;
}

export function TimelineBar({ item, width, acceptedWidth }: TimelineBarProps) {
  const itemHeight = 40;
  return (
    <>
      {acceptedWidth && (
        <rect
          y={5}
          width={width}
          height={itemHeight - 10}
          fill="#ff5757"
          rx={15}
        />
      )}
      <rect
        y={5}
        width={acceptedWidth || width}
        height={itemHeight - 10}
        fill="#b9d291"
        rx={15}
      />
      <rect y={5} fill="#b9d291" width={20} height={itemHeight - 10} />
      {acceptedWidth && (
        <rect
          y={5}
          x={acceptedWidth - 20}
          fill="#b9d291"
          width={20}
          height={itemHeight - 10}
        />
      )}
      <text
        x={5}
        dominantBaseline="bottom"
        y={itemHeight - 40}
        filter="url(#solid)"
      >
        <tspan fontWeight={600} fontStyle="italic" fontSize={14}>
          {item.label}
        </tspan>
      </text>
    </>
  );
}

export function TimelineInstant({ item }: { item: TimelineItem }) {
  const itemHeight = 40;

  const hover = {
    initial: { scale: 1, width: 26 },
    hover: { scale: 1.4, width: 150 },
    tapped: {
      scale: 0.8,
      borderRadius: "100%",
    },
  };
  const textHover = {
    initial: { opacity: 0 },
    hover: { opacity: 1 },
    tapped: {},
  };

  return (
    <g transform={`translate(2, ${itemHeight / 2})`}>
      <motion.g
        initial="initial"
        animate="initial"
        whileHover="hover"
        whileTap="tapped"
      >
        <motion.rect
          variants={hover}
          x={-13}
          y={-13}
          width="26"
          height="26"
          rx="13"
          fill="#ffffff"
          stroke="#febb19"
          stroke-width={4}
        />

        <motion.text variants={textHover} dominantBaseline="middle">
          <tspan fontSize={14} fontWeight={500}>
            {item.subtitle}
          </tspan>
        </motion.text>
      </motion.g>
    </g>
  );
}

interface TimelineGroupProps {
  group: ItemGroup;
  x: d3.ScaleLinear<number, number>;
  endDate: Date;
}

export function TimelineGroup({ group, x, endDate }: TimelineGroupProps) {
  const right = x(endDate);

  return (
    <>
      {group.bars.map((item, idx) => (
        <g
          key={`${item.label}-${item.year}-${item.type}-${idx}`}
          transform={`translate(${x(item.date)}, 0)`}
        >
          <TimelineBar
            item={item}
            width={right - x(item.date)}
            acceptedWidth={item.endDate && x(item.endDate) - x(item.date)}
          />
        </g>
      ))}
      {group.instants.map((item, idx) => (
        <g
          key={`${item.label}-${item.year}-${item.type}-${idx}`}
          transform={`translate(${x(item.date)}, 0)`}
        >
          <TimelineInstant item={item} />
        </g>
      ))}
    </>
  );
}

interface TimelineDateGuide {
  x?: number;
  top: number;
  bottom: number;
  value: Date;
}

export function TimelineDateGuide({
  x,
  top,
  bottom,
  value,
}: TimelineDateGuide) {
  const peek = 10;

  return (
    <>
      <line
        x1={x || 2}
        y1={bottom}
        x2={x || 2}
        y2={top - peek}
        stroke="currentColor"
        strokeDasharray="1"
      />
      <circle r={3} cx={x || 2} cy={top - peek} />
      <g transform={`translate(${x || 2}, ${top - peek - 35})`}>
        <TimeAxisDateLabel date={value} />
      </g>
    </>
  );
}

interface HorizontalTimelineProps {
  data: TimelineItem[];
}

export default function HorizontalTimeline({ data }: HorizontalTimelineProps) {
  const bars = deriveTaxonBars(data);

  // sort the items by they're date first and then by the type of item
  // so that instant's always show above bars
  const items = [...data, ...bars].sort((a, b) => {
    if (a.date < b.date) return -1;
    else if (a.date == b.date) {
      if (a.type == TimelineItemType.Instant) return -1;
      else if (b.type == TimelineItemType.Instant) return 1;
      else return 0;
    } else return 1;
  });

  const groups = groupItems(items);

  const itemHeight = 80;
  const barHeight = 40;
  const axisHeight = 70;
  const graphHeight = groups.length * itemHeight;
  const minHeight = axisHeight + graphHeight;

  const [ref, dimension] = useChartDimensions<HTMLDivElement>({
    height: minHeight,
  });

  // get the domains from the timeline items and remove any empty decades.
  // we also replace the last date with the current year
  const currentYear = new Date();
  let domains = domainDecades(data);
  domains[domains.length - 1].end = currentYear;

  // flattent the domain for d3
  let domain = domains.map((domain) => [domain.start, domain.end]).flat();
  const range = rangeYears(domains, dimension.boundedWidth);
  const dividers = domainContractions(domains);

  const x = useMemo(
    () => d3.scaleLinear().domain(domain).range(range),
    [dimension.boundedWidth],
  );

  return (
    <div className="timelineWrapper" ref={ref} style={{ height: minHeight }}>
      <svg width={dimension.width} height={dimension.height}>
        <defs>
          <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood flood-color="rgba(255, 255, 255, 1)" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>

          <filter x="0" y="0" width="1" height="1" id="faded">
            <feFlood flood-color="rgba(255, 255, 255, 1)" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>

        <g
          transform={`translate(${dimension.marginLeft}, ${dimension.marginTop})`}
        >
          <TimeAxis domain={domain} range={x.range()} />

          <g transform={`translate(0, ${axisHeight})`}>
            <rect
              width={dimension.boundedWidth}
              height={dimension.boundedHeight - axisHeight}
              fill="white"
            />
            {groups.map((group, idx) =>
              group.instants.map((item) => (
                <g
                  key={`${group.label}-guide`}
                  transform={`translate(${x(item.date)}, ${idx * itemHeight})`}
                >
                  <TimelineDateGuide
                    x={0}
                    top={idx * -itemHeight - axisHeight / 2}
                    bottom={barHeight / 2}
                    value={item.date}
                  />
                </g>
              )),
            )}

            {groups.map((group, idx) => (
              <g
                key={`${group.bars[0].label}-${idx}`}
                transform={`translate(0, ${idx * itemHeight})`}
              >
                <TimelineGroup group={group} endDate={currentYear} x={x} />
              </g>
            ))}
          </g>
          {dividers.map((divider) => (
            <TimeAxisContraction
              key={`${divider[0]}-${divider[1]}`}
              x={x(new Date(divider[0], 0, 1))}
              height={dimension.boundedHeight}
              lowest={new Date(divider[0], 0, 1)}
              highest={new Date(divider[1], 0, 1)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

interface TimeAxisProps {
  domain: Date[];
  range: number[];
}

export function TimeAxis({ range }: TimeAxisProps) {
  return (
    <svg>
      <circle r={2} cx={range[0]} cy={40} />
      <line
        x1={range[0]}
        y1={40}
        x2={range[range.length - 1]}
        y2={40}
        stroke="currentColor"
        strokeDasharray={1}
      />
    </svg>
  );
}

interface TimeAxisContractionProps {
  x: number;
  height: number;
  lowest: Date;
  highest: Date;
}

export function TimeAxisContraction({
  x,
  height,
  lowest,
  highest,
}: TimeAxisContractionProps) {
  const strokeColor = "#2F4554";

  return (
    <>
      <defs>
        <pattern
          id="ContractionPattern"
          x="0"
          y="0"
          width="30"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <g fill="transparent" stroke={strokeColor} strokeWidth={2}>
            <path d="M5 0 l10 20 l-10 20 M15 0 l10 20 l-10 20" />
          </g>
        </pattern>
      </defs>

      <g transform={`translate(${x}, 0)`}>
        <TimeAxisDateLabel date={lowest} />
        <g transform={`translate(10 0)`}>
          <rect width={30} height={height} fill="url(#ContractionPattern)" />
        </g>
        <g transform={`translate(50 0)`}>
          <TimeAxisDateLabel date={highest} />
        </g>
      </g>
    </>
  );
}

export function TimeAxisDateLabel({ date }: { date: Date }) {
  return (
    <g transform={`translate(0, 10) rotate(-90)`}>
      <text
        dominantBaseline="central"
        style={{
          fontSize: "14px",
          fontWeight: 600,
          textAnchor: "middle",
        }}
      >
        {date.getFullYear()}
      </text>
    </g>
  );
}

interface ChartDimensions {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  width?: number;
  height?: number;
}

interface BoundedChartDimensions extends ChartDimensions {
  boundedWidth: number;
  boundedHeight: number;
}

// derived from https://2019.wattenberger.com/blog/react-and-d3
export function useChartDimensions<T>(
  settings: ChartDimensions,
): [RefObject<T>, BoundedChartDimensions] {
  const ref = useRef(null);
  const dimensions = combineChartDimensions(settings);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return () => {};

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      if (width != rect.width) setWidth(rect.width);
      if (height != rect.height) setHeight(rect.height);
    });

    const element = ref.current;
    if (element) resizeObserver.observe(element);

    // cleanup
    return () => element && resizeObserver.unobserve(element);
  }, []);

  const bounded = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, bounded];
}

function combineChartDimensions(
  dimensions: ChartDimensions,
): BoundedChartDimensions {
  const dim = {
    ...dimensions,
    marginTop: dimensions.marginTop || 20,
    marginRight: dimensions.marginRight || 20,
    marginBottom: dimensions.marginBottom || 20,
    marginLeft: dimensions.marginLeft || 20,
    width: dimensions.width || 0,
    height: dimensions.height || 0,
  };

  return {
    ...dim,
    boundedHeight: Math.max(dim.height - dim.marginTop - dim.marginBottom, 0),
    boundedWidth: Math.max(dim.width - dim.marginLeft - dim.marginRight, 0),
  };
}

type ItemGroup = {
  label: string;
  bars: TimelineItem[];
  instants: TimelineItem[];
};

function groupItems(items: TimelineItem[]): ItemGroup[] {
  let groups: Record<string, ItemGroup> = {};

  for (const item of items) {
    groups[item.label] ||= { label: item.label, bars: [], instants: [] };
    if (item.type == TimelineItemType.Bar) {
      groups[item.label].bars.push(item);
    } else if (item.type == TimelineItemType.Instant) {
      groups[item.label].instants.push(item);
    }
  }

  return Object.values(groups);
}

function deriveTaxonBars(items: TimelineItem[]): TimelineItem[] {
  let map = new Map<string, TimelineItem>();

  let currentAccepted = null;

  for (const item of items) {
    if (
      currentAccepted &&
      currentAccepted.label != item.label &&
      item.act === "NAME_USAGE"
    ) {
      currentAccepted.endDate = item.date;
    }

    // we add a new taxon bar for new species
    if (currentAccepted && item.act === "HETEROTYPIC_SYNONYMY") {
      currentAccepted.endDate = item.date;
    }

    // we add a new taxon bar for new species
    if (item.act === "SPECIES_NOVA" || item.act === "ORIGINAL_DESCRIPTION") {
      currentAccepted = {
        ...item,
        type: TimelineItemType.Bar,
        colour: "#b9d291",
      };
      map.set(item.label, currentAccepted);
    }

    // also add bars for name usages as they represent a taxonomic status
    if (item.act === "NAME_USAGE" && !map.has(item.label)) {
      currentAccepted = {
        ...item,
        type: TimelineItemType.Bar,
        colour: "#b9d291",
      };
      map.set(item.label, currentAccepted);
    }
  }

  return Array.from(map.values());
}

type Domain = {
  start: Date;
  end: Date;
};

/**
 * Create a domain from the timeline items as decades.
 * This will effectively 'contract' decades that dont have any data to present
 * so that long stretches between taxonomic activity can be condensed as its not
 * particularly helpful for the visualisation
 */
function domainDecades(items: TimelineItem[]): Domain[] {
  let decades = items.map((item) => Math.floor(item.date.getFullYear() / 40));
  let deduped = new Set(decades);

  let starts: number[] = [];
  let ends: number[] = [];
  for (const decade of deduped) {
    const lastDecade = ends[ends.length - 1];
    // if the current decade isn't consecutive with the last value in the domains array then
    // we want to add it so that the decades in between can be contracted as they don't have
    // anything to represent
    if (lastDecade !== decade) {
      starts.push(decade);
      ends.push(decade + 1);
    } else {
      ends.pop();
      ends.push(decade + 1);
    }
  }

  // zip of the domain ranges and convert them into dates at the beginning of the decade
  const domains = starts.map((start, idx) => ({
    start: new Date(start * 40, 0, 1),
    end: new Date(ends[idx] * 40, 0, 1),
  }));

  return domains;
}

function rangeYears(domains: Domain[], width: number): number[] {
  const domainYears = domains.map(
    (domain) => domain.end.getFullYear() - domain.start.getFullYear(),
  );

  const totalYears = domainYears.reduce((acc, val) => acc + val, 0);

  let range: number[] = [];
  for (const years of domainYears) {
    // the start of the domain should either be 0 or the last
    // range plus the contraction width
    const lastRange = range[range.length - 1] || 0;
    const currentRange = width * (years / totalYears);
    range.push(lastRange);
    range.push(lastRange + currentRange);
  }

  return range;
}

function domainContractions(domains: Domain[]) {
  // nothing to contract
  if (domains.length <= 1) return [];

  // for dividers the start is the end of a domain, and the end
  // is the start of the next domain
  let starts: number[] = [];
  let ends: number[] = [];
  for (const domain of domains) {
    starts.push(domain.end.getFullYear());
    ends.push(domain.start.getFullYear());
  }

  // get the ends of the next domain as that represents the start of the domain
  // and we want the range between the end of the first and the start of the second
  const dividers = starts.map((start, idx) => [start, ends[idx + 1]]);

  // remove the last element as the end is the current year and cant be contracted
  dividers.pop();

  return dividers;
}
