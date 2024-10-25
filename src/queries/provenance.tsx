import { gql } from "@apollo/client";

export enum Action {
  CREATE,
  UPDATE,
}

export enum AtomTextType {
  Empty,
  ScientificName,
  ActedOn,
  Act,
  SourceUrl,
  Publication,
  PublicationDate,
}

export enum AtomType {
  NomenclaturalActType,
}

export enum AtomDateTimeType {
  CreatedAt,
  UpdatedAt,
}

export interface AtomText {
  type: AtomTextType;
  value: string;
}

export interface AtomNomenclaturalType {
  type: AtomType;
  value: string;
}

export interface AtomDateTime {
  type: AtomDateTimeType;
  value: string;
}

export interface Dataset {
  id: string;
  name: string;
  shortName?: string;
  rightsHolder?: string;
  citation?: string;
  license?: string;
  description?: string;
  url?: string;
}

export interface DatasetVersion {
  id: string;
  datasetId: string;
  version: string;
  createdAt: string;
  importedAt: string;
}

export interface Atom {
  type: string;
  value: string;
}

export interface Operation {
  operationId: number;
  parentId: number;
  entityId: string;
  datasetVersion: DatasetVersion;
  dataset: Dataset;
  action: Action;
  atom: Atom;
  loggedAt: string;
}

export type ProvenanceQuery = {
  provenance: {
    // TODO: Split out to specimen, taxon & nomenclaturalAct operations
    nomenclaturalAct: Operation[];
    taxon: Operation[];
    specimen: Operation[];
  };
};

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
    nomenclaturalAct {
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
