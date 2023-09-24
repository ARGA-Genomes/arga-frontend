import { gql } from "@apollo/client";

export const SPECIMEN = gql`
  fragment SpecimenDetails on Specimen {
    recordId
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

export type Specimen = {
  recordId: string,
  organismId?: string,
  materialSampleId?: string,
  collectionCode?: string,
  institutionName?: string,
  institutionCode?: string,
  recordedBy?: string,
  identifiedBy?: string,
  identifiedDate?: string,
  typeStatus?: string,
  latitude?: string,
  longitude?: string,
  locationSource?: string,
  locality?: string,
  country?: string,
  countryCode?: string,
  county?: string,
  municipality?: string,
  stateProvince?: string,
  depth?: string,
  elevation?: string,
  depthAccuracy?: string,
  elevationAccuracy?: string,
  details?: string,
  remarks?: string,
  identificationRemarks?: string,
};

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

export type CollectionEvent = {
  eventDate?: string,
  eventTime?: string,
  collectedBy?: string,
  behavior?: string,
  catalogNumber?: string,
  degreeOfEstablishment?: string,
  envBroadScale?: string,
  envLocalScale?: string,
  envMedium?: string,
  habitat?: string,
  establishmentMeans?: string,
  individualCount?: string,
  isolate?: string,
  lifeStage?: string,
  occurrenceStatus?: string,
  organismQuantity?: string,
  organismQuantityType?: string,
  otherCatalogNumbers?: string,
  pathway?: string,
  preparation?: string,
  recordNumber?: string,
  refBiomaterial?: string,
  reproductiveCondition?: string,
  sex?: string,
  genotypicSex?: string,
  phenotypicSex?: string,
  sourceMatId?: string,
  specificHost?: string,
  strain?: string,
  fieldNumber?: string,
  fieldNotes?: string,
  remarks?: string,
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

export type AccessionEvent = {
  eventDate?: string,
  eventTime?: string,
  accession?: string,
  accessionedBy?: string,
  institutionName?: string,
  institutionCode?: string,
  materialSampleId?: string,
  typeStatus?: string,
}
