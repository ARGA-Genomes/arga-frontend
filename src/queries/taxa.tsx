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
