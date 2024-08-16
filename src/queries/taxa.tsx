import { gql } from "@apollo/client";

export const TAXON_NAME = gql`
  fragment TaxonName on Taxon {
    scientificName
    canonicalName
    authorship
    status
    nomenclaturalCode
  }
`;

export const TAXON_SOURCE = gql`
  fragment TaxonSource on Taxon {
    citation
    source
    sourceUrl
  }
`;

export const TAXON_NODE = gql`
  fragment TaxonNode on TaxonNode {
    scientificName
    canonicalName
    rank
    depth
  }
`;

export type TaxonName = {
  scientificName: string;
  canonicalName: string;
  authorship?: string;
  status: string;
  nomenclaturalCode: string;
};

export type TaxonSource = {
  citation?: string;
  source?: string;
  sourceUrl?: string;
};

export type TaxonNode = {
  scientificName: string;
  canonicalName: string;
  rank: string;
  depth: number;
};

export type Taxon = TaxonName &
  TaxonSource & {
    datasetId: string;
    hierarchy: TaxonNode[];
  };
