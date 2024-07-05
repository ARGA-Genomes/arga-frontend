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

export type TaxonStatTreeNode = {
  scientificName: string;
  canonicalName: string;
  rank: string;
  loci?: number;
  genomes?: number;
  specimens?: number;
  other?: number;
  totalGenomic?: number;
  children?: TaxonStatTreeNode[];
};
