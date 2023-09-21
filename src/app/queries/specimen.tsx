import { gql } from "@apollo/client";

export const SPECIMEN = gql`
  fragment SpecimenDetails on Specimen {
    accession
    organismId
    materialSampleId
    collectionCode
    institutionName
    institutionCode
    recordedBy
    identifiedBy
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
    remarks
    identificationRemarks
  }
`;

export type Specimen = {
  accession: string,
  organismId?: string,
  materialSampleId?: string,
  collectionCode?: string,
  institutionName?: string,
  institutionCode?: string,
  recordedBy?: string,
  identifiedBy?: string,
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
  remarks?: string,
  identificationRemarks?: string,
};

export const COLLECTION_EVENT = gql`
  fragment CollectionEventDetails on CollectionEvent {
    behavior
    catalogNumber
    degreeOfEstablishment
    envBroadScale
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
    sourceMatId
    specificHost
    strain
  }
`;

export type CollectionEvent = {
  behavior?: string,
  catalogNumber?: string,
  degreeOfEstablishment?: string,
  envBroadScale?: string,
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
  sourceMatId?: string,
  specificHost?: string,
  strain?: string,
}

export const ACCESSION_EVENT = gql`
  fragment AccessionEventDetails on AccessionEvent {
    institutionName
    institutionCode
    materialSampleId
    typeStatus
  }
`;

export type AccessionEvent = {
  institutionName?: string,
  institutionCode?: string,
  materialSampleId?: string,
  typeStatus?: string,
}
