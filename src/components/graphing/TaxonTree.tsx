"use client";

import classes from "./TaxonTree.module.css";

import { gql, useLazyQuery } from "@apollo/client";
import { Cluster } from "@visx/hierarchy";
import { hierarchy } from "d3";

import { TaxonStatTreeNode } from "@/queries/stats";
import { Group } from "@visx/group";
import { LinkVertical } from "@visx/shape";
import { Text } from "@visx/text";
import { motion } from "framer-motion";
import { useState } from "react";
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";

// Gets details for the specified taxon and the immediate decendants
const GET_TAXON_TREE_NODE = gql`
  query TaxonTreeNode($taxonRank: TaxonomicRank, $taxonCanonicalName: String, $descendantRank: TaxonomicRank) {
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

interface TaxonTreeNodeQuery {
  stats: {
    taxonBreakdown: TaxonStatTreeNode[];
  };
}

// A node in the tree. This represents the visual node of a taxon and maintains
// a heirarchy of child tree nodes. It should contain both the data to present as
// well as transient functional data such as expansion or pinning.
interface Node {
  visible: boolean;
  expanded: boolean;
  pinned: boolean;
  loaded: boolean;
  children?: Node[];
  allChildren?: Node[];

  canonicalName: string;
  rank: string;
  species: number;
  fullGenomesCoverage: number;
}

interface TaxonNodeProps {
  data: Node;
  depth: number;
  pinned?: boolean;
  onToggle?: (expanded: boolean) => void;
  onLoad?: (data: Node) => void;
}

function TaxonNode({ data, depth, pinned, onToggle, onLoad }: TaxonNodeProps) {
  const [loadNode, query] = useLazyQuery<TaxonTreeNodeQuery>(GET_TAXON_TREE_NODE, {
    variables: {
      taxonRank: data.rank,
      taxonCanonicalName: data.canonicalName,
      descendantRank: "SPECIES",
    },
  });

  function toggleNode(node: Node) {
    const result = loadNode();
    node.expanded = !node.expanded;
    if (onToggle) onToggle(node.expanded);

    result.then((resp) => {
      const loadedNode = resp.data && convertToNode(resp.data?.stats.taxonBreakdown[0]);
      if (onLoad && loadedNode) onLoad(loadedNode);
    });
  }

  const variants = {
    initial: {
      opacity: 1.0,
    },
    loading: {
      opacity: [0.3, 1.0, 0.3],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // use the appropriate node label depending on where in the tree the node is
  // we want root nodes to have horizontal labels, inner nodes to have
  // vertical labels that move depending on the expanded state, and leaf nodes as
  // vertical labels that are always positioned after the node
  const children = data.children?.filter((n) => n.visible) || [];
  const inverted = query.loading || children.length > 0;

  // kick off a load if this node is marked as autoload. this should only be the case
  // for pinned paths where species can't be loaded due to the size of the tree
  if (pinned && !query.called && children.length === 0 && data.rank != "SPECIES") {
    toggleNode(data);
  }

  return (
    <motion.g style={{ cursor: "pointer" }} whileHover={{ scale: 1.4 }} onClick={() => toggleNode(data)}>
      <rect x={-10} y={inverted ? -180 : -50} width={40} height={inverted ? 200 : 300} style={{ opacity: 0.0 }} />
      <circle r={6} fill="white" />

      <motion.g variants={variants} animate={query.loading ? "loading" : "initial"}>
        <circle r={6} className={nodeClassName(data)} strokeWidth={pinned ? 4 : 1} />

        {depth === 0 && (
          <Text dy={"-1.5em"} className={classes.nodeLabelRoot} fontWeight={600} filter="url(#text-bg)">
            {data.canonicalName}
          </Text>
        )}

        {depth > 0 && (
          <Text
            angle={90}
            fontSize="1em"
            dominantBaseline="middle"
            textAnchor={query.loading || children.length > 0 ? "end" : "start"}
            dy={query.loading || children.length > 0 ? -15 : "1em"}
            fontWeight={pinned ? 600 : 400}
            filter="url(#text-bg)"
          >
            {data.canonicalName}
          </Text>
        )}

        {query.loading && (
          <Text dy="2.5em" angle={90} className={classes.loadingLabel}>
            loading..
          </Text>
        )}
      </motion.g>
    </motion.g>
  );
}

// The taxonomy tree properties
interface TaxonTreeProps {
  height: number;
  minWidth: number;
  data: TaxonStatTreeNode;
  pinned?: string[];
}

export function TaxonTree({ height, minWidth, data, pinned }: TaxonTreeProps) {
  // we maintain two trees for this graph. the graphql results are cached in tree which
  // gets updated when an incremental load of a tree node happens.
  // a separate tree converted to interactive nodes is derived from the cached tree.
  const [tree, _setTree] = useState(convertToNode(data));
  const [root, setRoot] = useState(hierarchy(tree));

  const path = pinned || [];

  const margin = { top: 50, bottom: 200, left: 50, right: 50 };
  const minNodeWidth = 20;

  const minTreeWidth = (root.descendants().length || 0) * minNodeWidth;
  const treeWidth = minTreeWidth > minWidth ? minTreeWidth : minWidth;
  const totalWidth = treeWidth + margin.left + margin.right;
  const totalHeight = height;

  function onLoad(node: Node) {
    const targetNode = findNode(tree.children, node);
    if (targetNode) {
      targetNode.children = node.children;
      setRoot(hierarchy(tree));
    }
  }

  function nodeSeparator(a: HierarchyPointNode<Node>, b: HierarchyPointNode<Node>): number {
    return a.parent === b.parent ? 2 : 4;
  }

  return (
    <svg width={totalWidth} height={totalHeight}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="text-bg">
          <feFlood floodColor="rgba(255, 255, 255, .7)" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <Group left={0} top={margin.top}>
        <Cluster root={root} nodeSize={[10, 200]} separation={nodeSeparator}>
          {(tree) => (
            <Group top={0} left={totalWidth / 2}>
              {tree
                .links()
                .filter((n) => n.target.data.visible)
                .map((link, i) => (
                  <LinkVertical
                    key={i}
                    data={link}
                    className={linkClassName(link.target.data)}
                    strokeWidth={path.indexOf(link.target.data.canonicalName) > -1 ? 5 : 1}
                    strokeOpacity={path.indexOf(link.target.data.canonicalName) > -1 ? 1 : 0.4}
                  />
                ))}

              {tree
                .descendants()
                .filter((n) => n.data.visible)
                .map((node, key) => (
                  <Group top={node.y} left={node.x} key={key}>
                    <TaxonNode
                      data={node.data}
                      depth={node.depth}
                      pinned={path.indexOf(node.data.canonicalName) > -1}
                      onLoad={onLoad}
                    />
                  </Group>
                ))}
            </Group>
          )}
        </Cluster>
      </Group>
    </svg>
  );
}

function findNode(children: Node[] | undefined, target: Node): Node | null {
  if (!children) return null;

  for (const child of children) {
    if (child.canonicalName === target.canonicalName) return child;
    else {
      const node = findNode(child.children, target);
      if (node) return node;
    }
  }

  return null;
}

function linkClassName(data: Node) {
  const percent = data.species && data.fullGenomesCoverage ? data.species / data.fullGenomesCoverage : 0;

  if (percent >= 0.75) return classes.nodeLinkMoss;
  else if (percent >= 0.5) return classes.nodeLinkWheat;
  else return classes.nodeLinkBushfire;
}

function nodeClassName(data: Node) {
  const percent = data.species && data.fullGenomesCoverage ? data.species / data.fullGenomesCoverage : 0;

  if (percent >= 0.75) return classes.nodeGlyphMoss;
  else if (percent >= 0.5) return classes.nodeGlyphWheat;
  else return classes.nodeGlyphBushfire;
}

// Converts a `TreeStatTreeNode` into a `Node`. This essentially copies the data
// from the taxon tree statistics query into a presentable tree by injecting and
// defaulting variables used for tree interaction.
function convertToNode(node: TaxonStatTreeNode, expanded?: Node[], pinned?: string[]): Node {
  const children = node.children?.map((child) => convertToNode(child, expanded));

  return {
    visible: true,
    expanded: !!node.children?.length,
    pinned: !!pinned?.find((name) => name === node.canonicalName),
    loaded: !!node.children?.length,
    allChildren: node.children?.map((child) => convertToNode(child, expanded)),

    canonicalName: node.canonicalName,
    rank: node.rank,
    species: node.species ?? 0,
    fullGenomesCoverage: node.fullGenomesCoverage ?? 0,

    // if the node is expanded then we want to convert all the children to nodes as well,
    // otherwise we add a stub node that will load the data when expanded
    children:
      (children ?? []).length > 0 || node.rank === "SPECIES"
        ? children
        : [
            {
              visible: false,
              expanded: false,
              pinned: false,
              loaded: false,
              canonicalName: "",
              rank: "",
              species: 0,
              fullGenomesCoverage: 0,
            },
          ],
  };
}
