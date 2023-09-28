import { gql } from "@apollo/client";

export const SEQUENCE = gql`
  fragment SequenceDetails on Sequence {
    recordId
    datasetName
  }
`;

export type Sequence = {
  id: string,
  recordId: string,
  datasetName: string,
};

export const SEQUENCING_EVENT = gql`
  fragment SequencingEventDetails on SequencingEvent {
    eventDate
    eventTime
    materialSampleId
    sequencedBy
    targetGene
    ampliconSize
    estimatedSize
    concentration
    baitSetName
    baitSetReference
    dnaSequence
  }
`;

export type SequencingEvent = {
  eventDate?: string,
  eventTime?: string,
  materialSampleId?: string,
  sequencedBy?: string,
  targetGene?: string,
  ampliconSize?: string,
  estimatedSize?: string,
  concentration?: string,
  baitSetName?: string,
  baitSetReference?: string,
  dnaSequence?: string,
}

export const SEQUENCING_RUN_EVENT = gql`
  fragment SequencingRunEventDetails on SequencingRunEvent {
    traceName
    traceId
    traceLink
    targetGene
    sequencingDate
    sequencingEventId
    sequencingMethod
    sequencingCenter
    sequencingCenterCode
    sequencePrimerForwardName
    sequencePrimerReverseName
    pcrPrimerNameForward
    pcrPrimerNameReverse
    direction
    analysisSoftware
    analysisDescription
    libraryProtocol
  }
`;

export type SequencingRunEvent = {
  traceName?: string,
  traceId?: string,
  traceLink?: string,
  targetGene?: string,
  sequencingDate?: string,
  sequencingEventId?: string,
  sequencingMethod?: string,
  sequencingCenter?: string,
  sequencingCenterCode?: string,
  sequencePrimerForwardName?: string,
  sequencingPrimerReverseName?: string,
  direction?: string,
  analysisSoftware?: string,
  analysisDescription?: string,
  libraryProtocol?: string,
}

export const ASSEMBLY_EVENT = gql`
  fragment AssemblyEventDetails on AssemblyEvent {
    eventDate
    eventTime
    name
    quality
    assemblyType
    genomeSize
    assembledBy
    versionStatus
  }
`;

export type AssemblyEvent = {
  eventDate?: string,
  eventTime?: string,
  name?: string,
  quality?: string,
  assemblyType?: string,
  genomeSize?: number,
  assembledBy?: string,
  versionStatus?: string,
}

export const ANNOTATIONS_EVENT = gql`
  fragment AnnotationEventDetails on AnnotationEvent {
    eventDate
    eventTime
    representation
    releaseType
    replicons
    coverage
    standardOperatingProcedures
    annotatedBy
  }
`;

export type AnnotationEvent = {
  eventDate?: string,
  eventTime?: string,
  representation?: string,
  releaseType?: string,
  replicons?: string,
  coverage?: string,
  standardOperatingProcedures?: string,
  annotatedBy?: string,
}

export const DATA_DEPOSITION_EVENT = gql`
  fragment DataDepositionEventDetails on DataDepositionEvent {
    eventDate
    eventTime
    accession
    dataType
    institutionName
    collectionName
    collectionCode
    materialSampleId
    submittedBy
    asmNotLiveDate
    excludedFromRefseq
    lastUpdated

    title
    url
    fundingAttribution
    reference
    accessRights
    rightsHolder
    sourceUri
  }
`;

export type DataDepositionEvent = {
  eventDate?: string,
  eventTime?: string,
  accession?: string,
  dataType?: string,
  institutionName?: string,
  collectionName?: string,
  collectionCode?: string,
  materialSampleId?: string,
  submittedBy?: string,
  asmNotLiveDate?: string,
  excludedFromRefseq?: string,
  lastUpdated?: string,
  title?: string,
  url?: string,
  fundingAttribution?: string,
  reference?: string,
  accessRights?: string,
  rightsHolder?: string,
  sourceUri?: string,
}
