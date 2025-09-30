import { gql } from "@apollo/client";
import { DateTime } from "luxon";
import { Sorting } from "./common";

export const ORGANISM = gql`
  fragment OrganismDetails on Organism {
    entityId
    organismId
    sex
    genotypicSex
    phenotypicSex
    lifeStage
    reproductiveCondition
    behavior
    liveState
    remarks
    identifiedBy
    identificationDate
    disposition
    firstObservedAt
    lastKnownAliveAt
    biome
    habitat
    bioregion
    ibraImcra
    latitude
    longitude
    coordinateSystem
    locationSource
    holding
    holdingId
    holdingPermit
    recordCreatedAt
    recordUpdatedAt
  }
`;

export const SPECIMEN = gql`
  fragment SpecimenDetails on Specimen {
    entityId
    organismId
    canonicalName
  }
`;

export const SPECIMEN_SUMMARY = gql`
  fragment SpecimenSummary on SpecimenSummary {
    entityId
    organismId
    collectionRepositoryId
    collectionRepositoryCode
    institutionCode
    institutionName
    typeStatus
    country
    latitude
    longitude
    collectedAt
    sequences
    loci
    otherGenomic
    fullGenomes
    partialGenomes
    completeGenomes
    assemblyChromosomes
    assemblyScaffolds
    assemblyContigs
  }
`;

export const SPECIMEN_OVERVIEW = gql`
  fragment SpecimenOverviewDetails on SpecimensOverview {
    total
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
    topCountries {
      label
      value
    }
  }
`;

export interface YearValue<T> {
  year: number;
  value: T;
}

export interface StringValue<T> {
  label: string;
  value: T;
}

export const SPECIMEN_MAP_MARKER = gql`
  fragment SpecimenMapMarkerDetails on SpecimenMapMarker {
    entityId
    collectionRepositoryId
    institutionCode
    typeStatus
    latitude
    longitude
  }
`;

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

export const COLLECTION = gql`
  fragment CollectionDetails on Collection {
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

export const REGISTRATION = gql`
  fragment RegistrationDetails on Registration {
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

export const TISSUE = gql`
  fragment TissueDetails on Tissue {
    entityId
    specimenId
    materialSampleId
    tissueId
    identificationVerified
    referenceMaterial
    custodian
    institution
    institutionCode
    samplingProtocol
    tissueType
    disposition
    fixation
    storage
  }
`;

export const SPECIMEN_STATS = gql`
  fragment SpecimenStatsDetails on SpecimenStats {
    sequences
    wholeGenomes
    loci
    otherGenomic
    fullGenomes
    partialGenomes
    completeGenomes
    assemblyChromosomes
    assemblyScaffolds
    assemblyContigs
  }
`;

export enum HasData {
  Genomes = "GENOMES",
  Loci = "LOCI",
  GenomicData = "GENOMIC_DATA",
}

export type SpecimenFilterItem =
  | { institution: string[] }
  | { country: string[] }
  | { collectedBetween: { after: string; before: string } }
  | { data: HasData[] };

export function getFilterLabel(filter: SpecimenFilterItem) {
  if ("institution" in filter) return "Institution";
  else if ("country" in filter) return "Country";
  else if ("collectedBetween" in filter) return "Collected between";
  else if ("data" in filter) return "Has data";
}

export function getFilterValues(filter: SpecimenFilterItem) {
  if ("institution" in filter) return filter.institution.join(", ");
  else if ("country" in filter) return filter.country.join(", ");
  else if ("data" in filter) return filter.data.join(", ").toLocaleLowerCase().replace("_", " ");
  else if ("collectedBetween" in filter) {
    const after = DateTime.fromFormat(filter.collectedBetween.after, "yyyy-mm-dd");
    const before = DateTime.fromFormat(filter.collectedBetween.before, "yyyy-mm-dd");
    return `${after.year} - ${before.year}`;
  }
}

export enum SpecimenSortable {
  Status = "STATUS",
  Voucher = "VOUCHER",
  Institution = "INSTITUTION",
  Country = "COUNTRY",
  CollectionDate = "COLLECTION_DATE",
  MetadataScore = "METADATA_SCORE",
  Genomes = "GENOMES",
  Loci = "LOCI",
  GenomicData = "GENOMIC_DATA",
}

export type SpecimenSorting = Sorting<SpecimenSortable>;

export interface SpecimenOptions {
  institutions: string[];
  countries: string[];
}
