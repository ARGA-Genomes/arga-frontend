import { gql } from "@apollo/client";

export const SEQUENCE = gql`
  fragment SequenceDetails on Sequence {
    recordId
    datasetName
  }
`;

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

export const SEQUENCING_RUN_EVENT = gql`
  fragment SequencingRunEventDetails on SequencingRunEvent {
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

export const LIBRARY = gql`
  fragment LibraryDetails on Library {
    entityId
    libraryId
    eventDate
    eventTime
    preparedBy
    concentration
    concentrationUnit
    pcrCycles
    layout
    selection
    baitSetName
    baitSetReference
    constructionProtocol
    source
    insertSize
    designDescription
    strategy
    indexTag
    indexDualTag
    indexOligo
    indexDualOligo
    location
    remarks
    dnaTreatment
    numberOfLibrariesPooled
    pcrReplicates
  }
`;

export const ASSEMBLY = gql`
  fragment AssemblyDetails on Assembly {
    assemblyId
    eventDate
    eventTime
    type
    assemblyName
    level
    method
    methodVersion
    methodLink
    size
    sizeUngapped
    minimumGapLength
    guanineCytosinePercent
    completeness
    completenessMethod
    coverage
    representation
    sourceMolecule
    referenceGenomeUsed
    referenceGenomeLink
    numberOfScaffolds
    numberOfContigs
    numberOfReplicons
    numberOfChromosomes
    numberOfComponentSequences
    numberOfOrganelles
    numberOfGapsBetweenScaffolds
    numberOfGuanineCytosine
    numberOfAtgc
    hybrid
    hybridInformation
    polishingOrScaffoldingData
    polishingOrScaffoldingMethod
    computationalInfrastructure
    systemUsed
    assemblyN50
    contigN50
    contigL50
    scaffoldN50
    scaffoldL50
    longestContig
    longestScaffold
    totalContigSize
    totalScaffoldSize
  }
`;

export const ANNOTATION = gql`
  fragment AnnotationDetails on Annotation {
    entityId
    assemblyId
    name
    provider
    eventDate
    numberOfGenes
    numberOfCodingProteins
    numberOfNonCodingProteins
    numberOfOtherGenes
    numberOfPseudogenes
  }
`;

export const DEPOSITION = gql`
  fragment DepositionDetails on Deposition {
    entityId
    assemblyId
    eventDate
    url
    institution
  }
`;
