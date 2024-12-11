import { Badge, Group, Paper, Text } from "@mantine/core";
import { useTheme } from "@nivo/core";
import {
  LabelComponentProps,
  Layout,
  LinkComponentProps,
  NodeComponentProps,
  Tree,
  useLinkMouseEventHandlers,
  useNodeMouseEventHandlers,
} from "@nivo/tree";

import { useEffect, useState } from "react";
import {
  EventTimeline,
  LineStyle,
  TimelineIcon,
} from "@/components/event-timeline";
import { useListState } from "@mantine/hooks";
import { TaxonStatTreeNode } from "@/queries/stats";
import { animated, to } from "@react-spring/web";

const NODE_WIDTH = 20;

type Node = {
  visible: boolean;
  expanded: boolean;
  pinned: boolean;
  children?: Node[];
  allChildren?: Node[];

  canonicalName: string;
  rank: string;
  family?: string;
  loci?: number;
  genomes?: number;
  specimens?: number;
  other?: number;
  totalGenomic?: number;
};

function convertToNode(
  node: TaxonStatTreeNode,
  expanded?: Node[],
  pinned?: string[],
): Node {
  const shouldExpand =
    !!expanded?.find((n) => n.canonicalName === node.canonicalName) ||
    !!pinned?.find((name) => name === node.canonicalName) ||
    node.rank !== "GENUS";

  return {
    visible: true,
    expanded: shouldExpand,
    pinned: !!pinned?.find((name) => name === node.canonicalName),
    children: shouldExpand
      ? node.children?.map((child) => convertToNode(child, expanded, pinned))
      : [
          {
            visible: false,
            expanded: false,
            pinned: false,
            canonicalName: "",
            rank: "",
          },
        ],
    allChildren: node.children?.map((child) => convertToNode(child, expanded)),

    canonicalName: node.canonicalName,
    rank: node.rank,
    loci: node.loci,
    genomes: node.genomes,
    specimens: node.specimens,
    other: node.other,
    totalGenomic: node.totalGenomic,
  };
}

interface TaxonomyTreeProps {
  layout: Layout;
  data: TaxonStatTreeNode;
  pinned?: string[];
  initialExpanded?: TaxonStatTreeNode[];
}

export function TaxonomyTree({
  layout,
  data,
  pinned,
  initialExpanded,
}: TaxonomyTreeProps) {
  const [expanded, handlers] = useListState<Node>(
    initialExpanded?.map((n) => convertToNode(n, [])) || [],
  );
  const [root, setRoot] = useState(convertToNode(data, expanded, pinned));

  useEffect(() => {
    setRoot(convertToNode(data, expanded, pinned));
  }, [expanded]);

  const minWidth = calculateMinWidth(root);

  return (
    <Tree
      width={minWidth}
      height={800}
      layout={layout}
      mode="tree"
      data={root}
      identity="canonicalName"
      activeNodeSize={24}
      inactiveNodeSize={12}
      nodeColor={{ scheme: "tableau10" }}
      fixNodeColorAtDepth={2}
      linkThickness={2}
      activeLinkThickness={8}
      inactiveLinkThickness={2}
      linkColor={{
        from: "target.color",
        modifiers: [["opacity", 0.4]],
      }}
      margin={{
        top: layout === "top-to-bottom" ? 100 : 10,
        bottom: layout === "top-to-bottom" ? 200 : 10,
        right: layout === "right-to-left" ? 100 : 10,
        left: layout === "right-to-left" ? 200 : 10,
      }}
      motionConfig="stiff"
      meshDetectionRadius={80}
      nodeTooltip={(item) =>
        item.node.data.visible && (
          <Paper
            p="md"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Group align="baseline">
              <Text size="xs">{item.node.data.rank}</Text>
              <Text fs="italic">{item.node.data.canonicalName}</Text>
            </Group>
            <Group justify="center" my="xs">
              <StatBadge label="Loci" stat={item.node.data.loci} />
              <StatBadge label="Genomes" stat={item.node.data.genomes} />
              <StatBadge label="Specimens" stat={item.node.data.specimens} />
            </Group>
            <Group justify="center">
              <StatBadge label="Other" stat={item.node.data.other} />
              <StatBadge
                label="Total genomic"
                stat={item.node.data.totalGenomic}
              />
            </Group>
          </Paper>
        )
      }
      onNodeClick={(item) => {
        item.data.expanded = !item.data.expanded;
        if (item.data.expanded) {
          handlers.append(item.data);
        } else {
          handlers.remove(
            expanded.findIndex(
              (n) => n.canonicalName == item.data.canonicalName,
            ),
          );
        }
      }}
      onLinkMouseEnter={() => {}}
      onLinkMouseMove={() => {}}
      onLinkMouseLeave={() => {}}
      onLinkClick={() => {}}
      /* @ts-ignore */
      linkTooltip={undefined}
      linkTooltipAnchor={"center"}
      nodeComponent={CustomNode}
      linkComponent={CustomLink}
      labelComponent={CustomLabel}
      debugMesh={false}
      isInteractive={true}
      useMesh={true}
    />
  );
}

function CustomLink({
  link,
  linkGenerator,
  isInteractive,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
  tooltip,
  tooltipAnchor,
  animatedProps,
}: LinkComponentProps<Node>) {
  const pinned = link.target.data.pinned;
  const eventHandlers = useLinkMouseEventHandlers<Node>(link, {
    isInteractive,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
    tooltip,
    tooltipAnchor,
  });

  if (!link.target.data.visible) {
    return;
  }

  return (
    <animated.path
      data-testid={`link.${link.id}`}
      d={to(
        [
          animatedProps.sourceX,
          animatedProps.sourceY,
          animatedProps.targetX,
          animatedProps.targetY,
        ],
        (sourceX, sourceY, targetX, targetY) => {
          return linkGenerator({
            source: [sourceX, sourceY],
            target: [targetX, targetY],
          });
        },
      )}
      fill="none"
      strokeWidth={pinned ? 8 : animatedProps.thickness}
      stroke={animatedProps.color}
      {...eventHandlers}
    />
  );
}

function CustomLabel({ label, animatedProps }: LabelComponentProps<Node>) {
  const theme = useTheme();
  const pinned = label.node.data.pinned;

  if (!label.node.data.visible) {
    return;
  }

  return (
    <animated.g
      data-testid={`label.${label.id}`}
      transform={to(
        [animatedProps.x, animatedProps.y],
        (x, y) => `translate(${x},${y})`,
      )}
    >
      <animated.g
        transform={animatedProps.rotation.to(
          (rotation) => `rotate(${rotation})`,
        )}
      >
        {theme.labels.text.outlineWidth > 0 && (
          <text
            style={{
              ...theme.labels.text,
              fill: theme.labels.text.outlineColor,
            }}
            stroke={theme.labels.text.outlineColor}
            strokeWidth={theme.labels.text.outlineWidth * 2}
            strokeLinejoin="round"
            textAnchor={label.textAnchor}
            dominantBaseline={label.baseline}
          >
            {label.label}
          </text>
        )}
        <text
          data-testid={`label.${label.id}.label`}
          style={theme.labels.text}
          textAnchor={label.textAnchor}
          fontWeight={pinned ? 800 : 500}
          dominantBaseline={label.baseline}
        >
          {label.label}
        </text>
      </animated.g>
    </animated.g>
  );
}

function CustomNode({
  node,
  isInteractive,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
  setCurrentNode,
  tooltip,
  tooltipPosition,
  tooltipAnchor,
  margin,
  animatedProps,
}: NodeComponentProps<Node>) {
  const pinned = node.data.pinned;
  const eventHandlers = useNodeMouseEventHandlers<Node>(node, {
    isInteractive,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
    setCurrentNode,
    tooltip,
    tooltipPosition,
    tooltipAnchor,
    margin,
  });

  if (!node.data.visible) {
    return;
  }

  return (
    <animated.circle
      data-testid={`node.${node.uid}`}
      r={pinned ? 12 : animatedProps.size.to((size) => size / 2)}
      fill={animatedProps.color}
      cx={animatedProps.x}
      cy={animatedProps.y}
      {...eventHandlers}
    />
  );
}

function StatBadge({ label, stat }: { label: string; stat?: number }) {
  return (
    <Badge variant="light" color={stat || 0 > 0 ? "moss" : "bushfire"}>
      {label}: {stat || 0}
    </Badge>
  );
}

function calculateMinWidth(data: Node): number {
  const genera = filterToRank("GENUS", data);

  // also get the species that are visible from an expanded genus node
  const expanded = genera.filter((node) => node.expanded);
  const visibleSpecies = expanded.flatMap((node) => {
    let species = filterToRank("SPECIES", node);
    // because the tree has enough room to show one direct descendant we always pop one
    // item off to effectively reduce to the overall minimum width
    species.pop();
    return species;
  });

  return (genera.length + visibleSpecies.length) * NODE_WIDTH;
}

// A recursive filter to pull out all genera no matter how deep they are in the tree
function filterToRank(rank: string, data: Node): Node[] {
  if (data.rank == rank) return [data];
  return data.children?.flatMap((node) => filterToRank(rank, node)) || [];
}
