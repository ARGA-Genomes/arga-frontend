import { gql } from "@apollo/client";

export const TAXON_TREE_NODE_STATISTICS = gql`
  fragment TaxonStatTreeNode on TaxonTreeNodeStatistics {
    scientificName
    canonicalName
    rank
    loci
    genomes
    specimens
    other
    totalGenomic
  }
`;

export interface TaxonStatTreeNode {
  scientificName: string;
  canonicalName: string;
  rank: string;
  loci?: number;
  genomes?: number;
  specimens?: number;
  other?: number;
  totalGenomic?: number;
  children?: TaxonStatTreeNode[];
}

export interface TaxonomicRankStatistic {
  rank: string;
  children: number;
  coverage: number;
  atLeastOne: number;
}

export function findChildren(root: TaxonStatTreeNode, scientificName: string): TaxonStatTreeNode[] {
  if (root.scientificName === scientificName) {
    return root.children || [];
  }

  for (const child of root.children || []) {
    const children = findChildren(child, scientificName);
    if (children.length > 0) return children;
  }

  return [];
}

export function findChildrenCanonical(root: TaxonStatTreeNode, canonicalName: string): TaxonStatTreeNode[] {
  if (root.canonicalName === canonicalName) {
    return root.children || [];
  }

  for (const child of root.children || []) {
    const children = findChildrenCanonical(child, canonicalName);
    if (children.length > 0) return children;
  }

  return [];
}
