import { TaxonTreeNodeStatistics } from "@/generated/types";
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

    species
    fullGenomesCoverage
  }
`;

export function findChildren(root: TaxonTreeNodeStatistics, scientificName: string): TaxonTreeNodeStatistics[] {
  if (root.scientificName === scientificName) {
    return root.children || [];
  }

  for (const child of root.children || []) {
    const children = findChildren(child, scientificName);
    if (children.length > 0) return children;
  }

  return [];
}

export function findChildrenCanonical(root: TaxonTreeNodeStatistics, canonicalName: string): TaxonTreeNodeStatistics[] {
  if (root.canonicalName === canonicalName) {
    return root.children || [];
  }

  for (const child of root.children || []) {
    const children = findChildrenCanonical(child, canonicalName);
    if (children.length > 0) return children;
  }

  return [];
}
