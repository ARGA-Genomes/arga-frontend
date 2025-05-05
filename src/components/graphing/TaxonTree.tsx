"use client";

import classes from "./TaxonTree.module.css";

import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { Tree } from "@visx/hierarchy";
import { hierarchy } from "d3";

import { TaxonStatTreeNode } from "@/queries/stats";
import { Group } from "@visx/group";
import { LinkVertical } from "@visx/shape";
import { Text } from "@visx/text";
import { motion } from "framer-motion";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { ParentSize } from "@visx/responsive";

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

  // whether or not to render a spinner to indicate the node is loading
  isLoader: boolean;
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
    onToggle && onToggle(node.expanded);

    result.then((resp) => {
      const loadedNode = resp.data && convertToNode(resp.data?.stats.taxonBreakdown[0]);
      onLoad && loadedNode && onLoad(loadedNode);
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

  return (
    <motion.g style={{ cursor: "pointer" }} whileHover={{ scale: 1.4 }} onClick={() => toggleNode(data)}>
      <rect x={-50} y={-10} width={100} height={30} fill="black" style={{ opacity: 0 }} />
      <circle r={6} fill="white" />

      <motion.g variants={variants} animate={query.loading ? "loading" : "initial"}>
        <circle r={6} className={nodeClassName(data)} strokeWidth={pinned ? 4 : 1} />
        <Text
          angle={depth === 0 ? 0 : 70}
          dy={depth === 0 ? "-1.5em" : "1.0em"}
          className={classes.nodeLabel}
          fontWeight={pinned ? 600 : 400}
          filter="url(#text-bg)"
        >
          {data.canonicalName}
        </Text>
        {query.loading && (
          <Text dy="2.5em" className={classes.loadingLabel}>
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
  initialExpanded?: TaxonStatTreeNode[];
}

export function TaxonTree({ height, minWidth, data, pinned, initialExpanded }: TaxonTreeProps) {
  const [expanded, handlers] = useListState<Node>(initialExpanded?.map((n) => convertToNode(n, [])) || []);

  // we maintain two trees for this graph. the graphql results are cached in tree which
  // gets updated when an incremental load of a tree node happens.
  // a separate tree converted to interactive nodes is derived from the cached tree.
  const [rawTree, setRawTree] = useState(data);
  const [tree, setTree] = useState(convertToNode(rawTree, expanded, pinned));
  const [root, setRoot] = useState(hierarchy(tree));

  /* let root = hierarchy(data); */
  /* const [root, setRoot] = useState(hierarchy(tree)); */

  const target = root.find((node) => node.data.canonicalName == "Macropus");

  const margin = { top: 50, bottom: 100, left: 50, right: 50 };
  const minNodeWidth = 20;
  const minTreeWidth = (tree.children?.length || 0) * minNodeWidth;
  const totalWidth = (minTreeWidth > minWidth ? minTreeWidth : minWidth) - margin.left - margin.right;
  const totalHeight = height;

  /* separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth} */
  function onToggle(expanded: boolean) {
    console.log(expanded);
  }

  function onLoad(node: Node) {
    let targetNode = findNode(tree.children, node);
    if (targetNode) {
      targetNode.children = node.children;
      setRoot(hierarchy(tree));
    }
  }

  return (
    <svg width={totalWidth + margin.left + margin.right} height={totalHeight}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="text-bg">
          <feFlood floodColor="rgba(255, 255, 255, .7)" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      <Group left={0} top={margin.top}>
        <Tree
          root={root}
          size={[totalWidth, totalHeight - (margin.top + margin.bottom)]}
          separation={(a, b) => (a.parent === b.parent ? 1 : 2)}
        >
          {(tree) => (
            <Group top={0} left={0}>
              {tree
                .links()
                .filter((n) => !n.target.data.isLoader)
                .map((link, i) => (
                  <LinkVertical
                    key={i}
                    data={link}
                    className={linkClassName(link.target.data)}
                    strokeWidth={link.target === target ? 5 : 1}
                  />
                ))}

              {tree
                .descendants()
                .filter((n) => !n.data.isLoader)
                .map((node, key) => (
                  <Group top={node.y} left={node.x} key={key}>
                    <TaxonNode
                      data={node.data}
                      depth={node.depth}
                      pinned={node === target}
                      onToggle={onToggle}
                      onLoad={onLoad}
                    />
                  </Group>
                ))}
            </Group>
          )}
        </Tree>
      </Group>
    </svg>
  );
}

function findNode(children: Node[] | undefined, target: Node): Node | null {
  if (!children) return null;

  for (let child of children) {
    if (child.canonicalName === target.canonicalName) return child;
    else {
      let node = findNode(child.children, target);
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
  const shouldExpand =
    !!expanded?.find((n) => n.canonicalName === node.canonicalName) ||
    !!pinned?.find((name) => name === node.canonicalName) ||
    node.rank !== "GENUS";

  const loaded = !!node.children?.length;
  const children = loaded && node.children?.map((child) => convertToNode(child, expanded));

  return {
    visible: true,
    expanded: shouldExpand,
    pinned: !!pinned?.find((name) => name === node.canonicalName),
    loaded: !!node.children?.length,
    allChildren: node.children?.map((child) => convertToNode(child, expanded)),
    isLoader: false,

    canonicalName: node.canonicalName,
    rank: node.rank,
    species: node.species ?? 0,
    fullGenomesCoverage: node.fullGenomesCoverage ?? 0,

    // if the node is expanded then we want to convert all the children to nodes as well,
    // otherwise we add a stub node that will load the data when expanded
    children: children || [
      {
        visible: false,
        expanded: false,
        pinned: false,
        loaded: false,
        canonicalName: "",
        rank: "",
        species: 0,
        fullGenomesCoverage: 0,
        isLoader: true,
      },
    ],
  };
}
