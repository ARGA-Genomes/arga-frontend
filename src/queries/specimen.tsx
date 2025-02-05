import { gql } from "@apollo/client";

export const SPECIMEN = gql`
  fragment SpecimenDetails on Specimen {
    recordId
    entityId
    organismId
    materialSampleId
    collectionCode
    institutionName
    institutionCode
    recordedBy
    identifiedBy
    identifiedDate
    typeStatus
    latitude
    longitude
    locationSource
    locality
    country
    countryCode
    county
    municipality
    stateProvince
    depth
    elevation
    depthAccuracy
    elevationAccuracy
    details
    remarks
    identificationRemarks
  }
`;

export interface Specimen {
  recordId: string;
  entityId?: string;
  organismId?: string;
  materialSampleId?: string;
  collectionCode?: string;
  institutionName?: string;
  institutionCode?: string;
  recordedBy?: string;
  identifiedBy?: string;
  identifiedDate?: string;
  typeStatus?: string;
  latitude?: number;
  longitude?: number;
  locationSource?: string;
  locality?: string;
  country?: string;
  countryCode?: string;
  county?: string;
  municipality?: string;
  stateProvince?: string;
  depth?: string;
  elevation?: string;
  depthAccuracy?: string;
  elevationAccuracy?: string;
  details?: string;
  remarks?: string;
  identificationRemarks?: string;
  markers?: number;
  sequences?: number;
  wholeGenomes?: number;
}

export const COLLECTION_EVENT = gql`
  fragment CollectionEventDetails on CollectionEvent {
    eventDate
    eventTime
    collectedBy
    behavior
    catalogNumber
    degreeOfEstablishment
    envBroadScale
    envLocalScale
    envMedium
    habitat
    establishmentMeans
    individualCount
    isolate
    lifeStage
    occurrenceStatus
    organismQuantity
    organismQuantityType
    otherCatalogNumbers
    pathway
    preparation
    recordNumber
    refBiomaterial
    reproductiveCondition
    sex
    genotypicSex
    phenotypicSex
    sourceMatId
    specificHost
    strain
    fieldNumber
    fieldNotes
    remarks
  }
`;

export interface CollectionEvent {
  eventDate?: string;
  eventTime?: string;
  collectedBy?: string;
  behavior?: string;
  catalogNumber?: string;
  degreeOfEstablishment?: string;
  envBroadScale?: string;
  envLocalScale?: string;
  envMedium?: string;
  habitat?: string;
  establishmentMeans?: string;
  individualCount?: string;
  isolate?: string;
  lifeStage?: string;
  occurrenceStatus?: string;
  organismQuantity?: string;
  organismQuantityType?: string;
  otherCatalogNumbers?: string;
  pathway?: string;
  preparation?: string;
  recordNumber?: string;
  refBiomaterial?: string;
  reproductiveCondition?: string;
  sex?: string;
  genotypicSex?: string;
  phenotypicSex?: string;
  sourceMatId?: string;
  specificHost?: string;
  strain?: string;
  fieldNumber?: string;
  fieldNotes?: string;
  remarks?: string;
}

export const ACCESSION_EVENT = gql`
  fragment AccessionEventDetails on AccessionEvent {
    eventDate
    eventTime
    accession
    accessionedBy
    institutionName
    institutionCode
    materialSampleId
    typeStatus
  }
`;

export interface AccessionEvent {
  eventDate?: string;
  eventTime?: string;
  accession?: string;
  accessionedBy?: string;
  institutionName?: string;
  institutionCode?: string;
  materialSampleId?: string;
  typeStatus?: string;
}
