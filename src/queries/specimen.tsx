import { gql } from "@apollo/client";

export const SPECIMEN = gql`
  fragment SpecimenDetails on Specimen {
    entityId
    organismId
    canonicalName
  }
`;

export interface Specimen {
  entityId: string;
  organismId: string;
  canonicalName: string;
}

export const SPECIMEN_SUMMARY = gql`
  fragment SpecimenSummary on SpecimenSummary {
    entityId
    collectionRepositoryId
    collectionRepositoryCode
    institutionCode
    institutionName
    typeStatus
    locality
    country
    latitude
    longitude
    sequences
    wholeGenomes
    markers
  }
`;

export interface SpecimenSummary {
  entityId: string;
  collectionRepositoryId?: string;
  collectionRepositoryCode?: string;
  institutionCode?: string;
  institutionName?: string;
  typeStatus?: string;
  locality?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  sequences?: number;
  wholeGenomes?: number;
  markers?: number;
}

export const SPECIMEN_OVERVIEW = gql`
  fragment SpecimenOverviewDetails on SpecimensOverview {
    total
    majorCollections
    holotype
    otherTypes
    formalVouchers
    tissues
    genomicDna
    australianMaterial
    nonAustralianMaterial
    collectionYears {
      year
      value
    }
  }
`;

export interface SpecimenOverview {
  total: number;
  majorCollections: string[];
  holotype?: string;
  otherTypes?: number;
  formalVouchers?: number;
  tissues?: number;
  genomicDna?: number;
  australianMaterial?: number;
  nonAustralianMaterial?: number;
  collectionYears: YearValue<number>[];
}

export interface YearValue<T> {
  year: number;
  value: T;
}

export const SPECIMEN_MAP_MARKER = gql`
  fragment SpecimenMapMarkerDetails on SpecimenMapMarker {
    collectionRepositoryId
    typeStatus
    latitude
    longitude
  }
`;

export interface SpecimenMapMarker {
  collectionRepositoryId?: string;
  typeStatus?: string;
  latitude: number;
  longitude: number;
}

export const COLLECTION_EVENT = gql`
  fragment CollectionEventDetails on CollectionEvent {
    entityId
    fieldCollectingId
    eventDate
    eventTime
    collectedBy
    collectionRemarks
    identifiedBy
    identifiedDate
    identificationRemarks
    locality
    country
    countryCode
    stateProvince
    county
    municipality
    latitude
    longitude
    elevation
    depth
    elevationAccuracy
    depthAccuracy
    locationSource
    preparation
    environmentBroadScale
    environmentLocalScale
    environmentMedium
    habitat
    specificHost
    individualCount
    organismQuantity
    organismQuantityType
    strain
    isolate
    fieldNotes
  }
`;

export interface CollectionEvent {
  entityId: string;
  fieldCollectingId?: string;
  eventDate?: Date;
  eventTime?: string;
  collectedBy?: string;
  collectionRemarks?: string;
  identifiedBy?: string;
  identifiedDate?: Date;
  identificationRemarks?: string;
  locality?: string;
  country?: string;
  countryCode?: string;
  stateProvince?: string;
  county?: string;
  municipality?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  depth?: number;
  elevationAccuracy?: number;
  depthAccuracy?: number;
  locationSource?: string;
  preparation?: string;
  environmentBroadScale?: string;
  environmentLocalScale?: string;
  environmentMedium?: string;
  habitat?: string;
  specificHost?: string;
  individualCount?: string;
  organismQuantity?: string;
  organismQuantityType?: string;
  strain?: string;
  isolate?: string;
  fieldNotes?: string;
}

export const ACCESSION_EVENT = gql`
  fragment AccessionEventDetails on AccessionEvent {
    entityId
    typeStatus
    eventDate
    eventTime
    collectionRepositoryId
    collectionRepositoryCode
    institutionName
    institutionCode
    disposition
    preparation
    accessionedBy
    preparedBy
    identifiedBy
    identifiedDate
    identificationRemarks
    otherCatalogNumbers
  }
`;

export interface AccessionEvent {
  entityId: string;
  typeStatus?: string;
  eventDate?: Date;
  eventTime?: string;
  collectionRepositoryId?: string;
  collectionRepositoryCode?: string;
  institutionName?: string;
  institutionCode?: string;
  disposition?: string;
  preparation?: string;
  accessionedBy?: string;
  preparedBy?: string;
  identifiedBy?: string;
  identifiedDate?: Date;
  identificationRemarks?: string;
  otherCatalogNumbers?: string;
}
