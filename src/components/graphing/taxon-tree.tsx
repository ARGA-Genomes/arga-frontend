"use client";

import { ApolloError, gql, useApolloClient, useQuery } from "@apollo/client";
import { Badge, Group, Loader, Paper, Text } from "@mantine/core";
import { useTheme } from "@nivo/core";
import {
  ComputedNode,
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
import { animated, to, useSpring } from "@react-spring/web";

const NODE_WIDTH = 20;

// Gets details for the specified taxon and the immediate decendants
const GET_TAXON_TREE_NODE = gql`
  query TaxonTreeNode(
    $taxonRank: TaxonomicRank
    $taxonCanonicalName: String
    $descendantRank: TaxonomicRank
  ) {
    stats {
      taxonBreakdown(
        taxonRank: $taxonRank
        taxonCanonicalName: $taxonCanonicalName
        includeRanks: [$taxonRank, $descendantRank]
      ) {
        ...TaxonStatTreeNode
        children {
          ...TaxonStatTreeNode
        }
      }
    }
  }
`;

type TaxonTreeNodeQuery = {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
};

// A node in the tree. This represents the visual node of a taxon and maintains
// a heirarchy of child tree nodes. It should contain both the data to present as
// well as transient functional data such as expansion or pinning.
type Node = {
  visible: boolean;
  expanded: boolean;
  pinned: boolean;
  loaded: boolean;
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

  // whether or not to render a spinner to indicate the node is loading
  isLoader: boolean;
};

// Converts a `TreeStatTreeNode` into a `Node`. This essentially copies the data
// from the taxon tree statistics query into a presentable tree by injecting and
// defaulting variables used for tree interaction.
function convertToNode(
  node: TaxonStatTreeNode,
  expanded?: Node[],
  pinned?: string[],
): Node {
  const shouldExpand =
    !!expanded?.find((n) => n.canonicalName === node.canonicalName) ||
    !!pinned?.find((name) => name === node.canonicalName) ||
    node.rank !== "GENUS";

  const loaded = !!node.children?.length;
  const children = loaded
    ? node.children?.map((child) => convertToNode(child, expanded))
    : node.rank !== "SPECIES" && [
        {
          visible: true,
          expanded: false,
          pinned: false,
          loaded: false,
          isLoader: true,
          canonicalName: "Loading...",
          rank: "",
        },
      ];

  return {
    visible: true,
    expanded: shouldExpand,
    pinned: !!pinned?.find((name) => name === node.canonicalName),
    loaded: !!node.children?.length,
    allChildren: node.children?.map((child) => convertToNode(child, expanded)),
    isLoader: false,

    canonicalName: node.canonicalName,
    rank: node.rank,
    loci: node.loci,
    genomes: node.genomes,
    specimens: node.specimens,
    other: node.other,
    totalGenomic: node.totalGenomic,

    // if the node is expanded then we want to convert all the children to nodes as well,
    // otherwise we add a stub node that will load the data when expanded
    children: shouldExpand
      ? children || []
      : [
          {
            visible: false,
            expanded: false,
            pinned: false,
            loaded: false,
            isLoader: false,
            canonicalName: "Loading...",
            rank: "",
          },
        ],
  };
}

// The taxonomy tree properties
interface TaxonomyTreeProps {
  minWidth: number;
  layout: Layout;
  data: TaxonStatTreeNode;
  pinned?: string[];
  initialExpanded?: TaxonStatTreeNode[];
}

// The interactive taxonomy tree. We use a nivo tree as the base but then also make
// it responsive ourselves since we require certain min-width logic to allow for scrollbars
// for very large taxon families.
export function TaxonomyTree({
  minWidth,
  layout,
  data,
  pinned,
  initialExpanded,
}: TaxonomyTreeProps) {
  const [expanded, handlers] = useListState<Node>(
    initialExpanded?.map((n) => convertToNode(n, [])) || [],
  );
  const client = useApolloClient();

  // we maintain two trees for this graph. the graphql results are cached in tree which
  // gets updated when an incremental load of a tree node happens.
  // a separate tree converted to interactive nodes is derived from the cached tree.
  const [tree, setTree] = useState(data);
  const [root, setRoot] = useState(convertToNode(tree, expanded, pinned));

  useEffect(() => {
    setRoot(convertToNode(tree, expanded, pinned));
  }, [expanded, tree]);

  // expand and load children when a node is expanded
  function nodeClicked(item: ComputedNode<Node>) {
    item.data.expanded = !item.data.expanded;
    if (item.data.expanded) {
      handlers.append(item.data);

      const result = client.query<TaxonTreeNodeQuery>({
        query: GET_TAXON_TREE_NODE,
        variables: {
          taxonRank: item.data.rank,
          taxonCanonicalName: item.data.canonicalName,
          descendantRank: "SPECIES",
        },
      });

      // slot the loaded data into the tree and kick of a re-render
      result.then((res) => {
        const children = res.data.stats.taxonBreakdown[0]?.children || [];

        // clone the underlying data tree and find the taxon node being loaded
        const newTree = structuredClone(tree);
        const parent = newTree.children?.find(
          (node) => node.canonicalName == item.data.canonicalName,
        );

        // if we found the loaded node we insert the children and reload
        // both the data cache and the tree root to effect the display changes
        if (parent) {
          parent.children = children;
          setTree(newTree);
        }
      });
    } else {
      handlers.remove(
        expanded.findIndex((n) => n.canonicalName == item.data.canonicalName),
      );
    }
  }

  // make the tree fill the space available but ensure that it doesn't
  // squish up by giving a minimum amount of space for each expanded node
  const minTreeWidth = calculateMinWidth(root);
  const width = minWidth > minTreeWidth ? minWidth : minTreeWidth;

  return (
    <>
      <svg>
        <defs>
          <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood floodColor="rgba(255, 255, 255, .7)" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <Tree
        width={width}
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
        onNodeClick={nodeClicked}
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
    </>
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
      strokeDasharray={link.target.data.isLoader ? "10,10" : undefined}
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
          filter="url(#solid)"
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

  const props = useSpring({
    to: [
      { opacity: 1, r: 6 },
      { opacity: 0.4, r: 3 },
    ],
    loop: true,
  });

  if (!node.data.visible) {
    return;
  }

  // to animate the loading node. svg animation is not that performant
  // style={node.data.isLoader ? props : undefined}
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
    const species = filterToRank("SPECIES", node);
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
