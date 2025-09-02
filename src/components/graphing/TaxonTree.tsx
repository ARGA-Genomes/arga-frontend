"use client";

import classes from "./TaxonTree.module.css";

import { gql, useLazyQuery } from "@apollo/client";
import { Cluster } from "@visx/hierarchy";
import { hierarchy } from "d3";

import { Statistics, TaxonTreeNodeStatistics } from "@/generated/types";
import { Group } from "@visx/group";
import { HierarchyNode, HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkVertical } from "@visx/shape";
import { Text } from "@visx/text";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

// A node in the tree. This represents the visual node of a taxon and maintains
// a heirarchy of child tree nodes. It should contain both the data to present as
// well as transient functional data such as expansion or pinning.
export interface Node {
  visible: boolean;
  loaded: boolean;
  children?: Node[];

  canonicalName: string;
  rank: string;
  species: number;
  fullGenomesCoverage: number;

  loci?: number;
  genomes?: number;
  specimens?: number;
  other?: number;
  totalGenomic?: number;
}

interface TaxonNodeProps {
  data: Node;
  depth: number;
  pinned?: boolean;
  onToggle?: (data: Node) => void;
  onLoad?: (data: Node) => void;
  onHover?: (data: Node | null) => void;
}

function TaxonNode({ data, depth, pinned, onToggle, onLoad, onHover }: TaxonNodeProps) {
  const [childTree, setChildTree] = useState<Node[] | undefined>(data.children);

  const [loadNode, query] = useLazyQuery<{ stats: Statistics }>(GET_TAXON_TREE_NODE, {
    variables: {
      taxonRank: data.rank,
      taxonCanonicalName: data.canonicalName,
      descendantRank: "SPECIES",
    },
  });

  // there are two responsibilities for this function. the first is to load any children if the
  // node only has a placeholder. and the other is to collapse and expand the node by removing
  // and inserting children on the tree.
  function toggleNode(node: Node) {
    // do nothing for leaf nodes
    if (node.rank === "SPECIES") return;

    if (!data.loaded && !query.called) {
      loadNode().then((resp) => {
        const loadedNode = resp.data && convertToNode(resp.data?.stats.taxonBreakdown[0]);

        if (loadedNode) {
          setChildTree(loadedNode.children);
          if (onLoad) onLoad(loadedNode);
        }
      });
    } else {
      // collapse if there are any visible children. its a bit awkward but having a placeholder
      // as a child is needed for the dendrogram calculations in d3.
      // to avoid reloading the data we use the previously loaded `childTree` if we are expanding
      // the node
      if (node.children && node.children.filter((n) => n.visible).length > 0 && !pinned) {
        node.children = [nodePlaceholder()];
      } else {
        node.children = childTree;
      }
      if (onToggle) onToggle(node);
    }
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
    <motion.g
      style={{ cursor: "pointer" }}
      onClick={() => toggleNode(data)}
      onMouseOver={() => onHover && onHover(data)}
      onMouseOut={() => onHover && onHover(null)}
    >
      <rect x={-10} y={inverted ? -180 : -50} width={40} height={inverted ? 200 : 300} style={{ opacity: 0.0 }} />
      <circle r={6} fill="white" />

      <motion.g variants={variants} animate={query.loading ? "loading" : "initial"}>
        <circle r={6} className={nodeClassName(data)} strokeWidth={pinned ? 4 : 1} />

        {depth === 0 && (
          <Text dy={"-1.5em"} dominantBaseline="middle" textAnchor="middle" fontWeight={600} filter="url(#text-bg)">
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
  data: TaxonTreeNodeStatistics;
  pinned?: string[];
  onTooltip?: (node: Node) => React.ReactNode;
}

export function TaxonTree({ height, minWidth, data, pinned, onTooltip }: TaxonTreeProps) {
  // we maintain two trees for this graph. the graphql results are cached in tree which
  // gets updated when an incremental load of a tree node happens.
  // a separate tree converted to interactive nodes is derived from the cached tree.
  const [tree, _setTree] = useState(convertToNode(data));
  const [root, setRoot] = useState(hierarchy(tree));
  const [hoverPath, setHoverPath] = useState<HierarchyNode<Node>[]>([]);
  const [hoverNode, setHoverNode] = useState<HierarchyNode<Node> | null>(null);
  const [hoverNodePos, setHoverNodePos] = useState<[number, number] | null>(null);

  const [totalWidth, setTotalWidth] = useState(0);
  const [rootOffset, setRootOffset] = useState(0);
  const totalHeight = height;

  const path = pinned || [];

  const margin = { top: 50, bottom: 200, left: 50, right: 50 };

  useEffect(() => {
    const bounds = minWidth - margin.left - margin.right;
    const leaves = root.leaves();
    const first = leaves[0];
    const last = leaves[leaves.length - 1];
    const treeWidth = (last.x || 0) - (first.x || 0);

    const viewWidth = treeWidth > bounds ? treeWidth : bounds;

    // the dendrogram is not balanced which means the root node won't always be at the
    // center of the tree, which means that we have to find the center position of the root node
    // to provide an offset for the tree when rendering. since the root node is always at 0,0 the
    // easiest way to do this is to simply get the first leaf since it'd be -1234 or some such value
    setRootOffset((first.x || 0) * -1);

    if (treeWidth < viewWidth) {
      setRootOffset(viewWidth / 2);
    }

    setTotalWidth(viewWidth + margin.left + margin.right);
  }, [root, setTotalWidth, setRootOffset]);

  function onLoad(node: Node) {
    const targetNode = findNode(tree.children, node);
    if (targetNode) {
      targetNode.children = node.children;
      setRoot(hierarchy(tree));
    }
  }

  function onHover(node: Node | null) {
    if (!node || node.rank !== "SPECIES") {
      setHoverPath([]);
      setHoverNode(null);
      setHoverNodePos(null);
      return;
    }

    const target = root.find((n) => n.data === node);
    if (target) {
      const path = root.path(target);
      setHoverPath(path);
      setHoverNode(target);
      setHoverNodePos((target.x && target.y && [target.x, target.y]) || null);
    }
  }

  function onToggle(node: Node) {
    const targetNode = findNode(tree.children, node);
    if (targetNode) {
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

      <Group left={margin.left} top={margin.top}>
        <Cluster root={root} nodeSize={[10, 200]} separation={nodeSeparator}>
          {(tree) => (
            <Group top={0} left={rootOffset}>
              {tree
                .links()
                .filter((n) => n.target.data.visible)
                .map((link, i) => (
                  <LinkVertical
                    key={i}
                    data={link}
                    className={linkClassName(link.target.data)}
                    strokeWidth={
                      path.indexOf(link.target.data.canonicalName) > -1 || hoverPath.indexOf(link.target) > -1 ? 5 : 1
                    }
                    strokeOpacity={path.indexOf(link.target.data.canonicalName) > -1 ? 1 : 0.4}
                  />
                ))}

              <Group
                left={(hoverNodePos && hoverNodePos[0] - 200) || -1000}
                top={(hoverNodePos && hoverNodePos[1] - 140) || -1000}
              >
                <foreignObject width={400} height={150}>
                  {hoverNode && onTooltip && onTooltip(hoverNode.data)}
                </foreignObject>
              </Group>

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
                      onHover={onHover}
                      onToggle={onToggle}
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
function convertToNode(node: TaxonTreeNodeStatistics): Node {
  const children = node.children?.map((child) => convertToNode(child));

  return {
    visible: true,
    loaded: !!node.children?.length,

    canonicalName: node.canonicalName,
    rank: node.rank,
    species: node.species ?? 0,
    fullGenomesCoverage: node.fullGenomesCoverage ?? 0,
    specimens: node.specimens ?? 0,
    loci: node.loci ?? 0,
    genomes: node.genomes ?? 0,
    totalGenomic: node.totalGenomic ?? 0,

    // if the node is expanded then we want to convert all the children to nodes as well,
    // otherwise we add a stub node that will load the data when expanded
    children: (children ?? []).length > 0 || node.rank === "SPECIES" ? children || [] : [nodePlaceholder()],
  };
}

function nodePlaceholder() {
  return {
    visible: false,
    loaded: false,
    canonicalName: "",
    rank: "",
    species: 0,
    fullGenomesCoverage: 0,
  };
}
