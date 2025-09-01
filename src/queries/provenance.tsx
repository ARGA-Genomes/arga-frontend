import { gql } from "@apollo/client";

export const GET_TAXON_PROVENANCE = gql`
  query TaxonProvenance($entityId: String) {
    provenance {
      taxon(by: { entityId: $entityId }) {
        operationId
        parentId
        action
        atom {
          __typename
          ... on TaxonAtomText {
            type
            value
          }
          ... on TaxonAtomRank {
            type
            value
          }
          ... on TaxonAtomStatus {
            type
            value
          }
        }
        datasetVersion {
          datasetId
          version
          createdAt
          importedAt
        }
        dataset {
          id
          name
          shortName
          rightsHolder
          citation
          license
          description
          url
        }
        loggedAt
      }
    }
  }
`;

export const GET_SPECIMEN_PROVENANCE = gql`
  query SpecimenProvenance($entityId: String) {
    provenance {
      specimen(by: { entityId: $entityId }) {
        operationId
        parentId
        action
        datasetVersion {
          datasetId
          version
          createdAt
          importedAt
        }
        dataset {
          id
          name
          shortName
          rightsHolder
          citation
          license
          description
          url
        }
      }
    }
  }
`;

export const GET_NOMENCLATURAL_ACT_PROVENANCE = gql`
  query NomenclaturalActProvenance($entityId: String) {
    provenance {
      nomenclaturalAct(by: { entityId: $entityId }) {
        operationId
        parentId
        action
        atom {
          __typename
          ... on NomenclaturalActAtomText {
            type
            value
          }
          ... on NomenclaturalActAtomType {
            type
            value
          }
          ... on NomenclaturalActAtomDateTime {
            type
            value
          }
        }
        datasetVersion {
          datasetId
          version
          createdAt
          importedAt
        }
        dataset {
          id
          name
          shortName
          rightsHolder
          citation
          license
          description
          url
        }
        loggedAt
      }
    }
  }
`;
