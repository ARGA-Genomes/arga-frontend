export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
  NaiveDate: { input: string; output: string; }
  NaiveDateTime: { input: string; output: string; }
  NaiveTime: { input: string; output: string; }
  UUID: { input: string; output: string; }
};

export type AccessRightsStatus =
  | 'CONDITIONAL'
  | 'OPEN'
  | 'RESTRICTED'
  | 'VARIABLE';

export type AccessionEvent = {
  __typename?: 'AccessionEvent';
  accessionedBy?: Maybe<Scalars['String']['output']>;
  collectionRepositoryCode?: Maybe<Scalars['String']['output']>;
  collectionRepositoryId?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  identificationRemarks?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  identifiedDate?: Maybe<Scalars['NaiveDate']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionName?: Maybe<Scalars['String']['output']>;
  otherCatalogNumbers?: Maybe<Scalars['String']['output']>;
  preparation?: Maybe<Scalars['String']['output']>;
  preparedBy?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  typeStatus?: Maybe<Scalars['String']['output']>;
};

export type Action =
  | 'CREATE'
  | 'UPDATE';

export type Agent = {
  __typename?: 'Agent';
  entityId: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  orcid?: Maybe<Scalars['String']['output']>;
};

export type Annotation = {
  __typename?: 'Annotation';
  assemblyId: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  numberOfGenes?: Maybe<Scalars['Int']['output']>;
  numberOfProteins?: Maybe<Scalars['Int']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
};

export type AnnotationEvent = {
  __typename?: 'AnnotationEvent';
  annotatedBy?: Maybe<Scalars['String']['output']>;
  coverage?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  releaseType?: Maybe<Scalars['String']['output']>;
  replicons?: Maybe<Scalars['Int']['output']>;
  representation?: Maybe<Scalars['String']['output']>;
  standardOperatingProcedures?: Maybe<Scalars['String']['output']>;
};

export type Assembly = {
  __typename?: 'Assembly';
  annotations: Array<Annotation>;
  assemblyId: Scalars['String']['output'];
  assemblyN50?: Maybe<Scalars['String']['output']>;
  assemblyName?: Maybe<Scalars['String']['output']>;
  completeness?: Maybe<Scalars['String']['output']>;
  completenessMethod?: Maybe<Scalars['String']['output']>;
  computationalInfrastructure?: Maybe<Scalars['String']['output']>;
  contigL50?: Maybe<Scalars['Int']['output']>;
  contigN50?: Maybe<Scalars['Int']['output']>;
  coverage?: Maybe<Scalars['String']['output']>;
  depositions: Array<Deposition>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  guanineCytosinePercent?: Maybe<Scalars['Float']['output']>;
  hybrid?: Maybe<Scalars['String']['output']>;
  hybridInformation?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  libraries: Array<Library>;
  longestContig?: Maybe<Scalars['Int']['output']>;
  longestScaffold?: Maybe<Scalars['Int']['output']>;
  method?: Maybe<Scalars['String']['output']>;
  methodLink?: Maybe<Scalars['String']['output']>;
  methodVersion?: Maybe<Scalars['String']['output']>;
  minimumGapLength?: Maybe<Scalars['Int']['output']>;
  name: NameDetails;
  numberOfAtgc?: Maybe<Scalars['Int']['output']>;
  numberOfChromosomes?: Maybe<Scalars['Int']['output']>;
  numberOfComponentSequences?: Maybe<Scalars['Int']['output']>;
  numberOfContigs?: Maybe<Scalars['Int']['output']>;
  numberOfGapsBetweenScaffolds?: Maybe<Scalars['Int']['output']>;
  numberOfGuanineCytosine?: Maybe<Scalars['Int']['output']>;
  numberOfOrganelles?: Maybe<Scalars['Int']['output']>;
  numberOfReplicons?: Maybe<Scalars['Int']['output']>;
  numberOfScaffolds?: Maybe<Scalars['Int']['output']>;
  polishingOrScaffoldingData?: Maybe<Scalars['String']['output']>;
  polishingOrScaffoldingMethod?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  referenceGenomeLink?: Maybe<Scalars['String']['output']>;
  referenceGenomeUsed?: Maybe<Scalars['String']['output']>;
  representation?: Maybe<Scalars['String']['output']>;
  scaffoldL50?: Maybe<Scalars['Int']['output']>;
  scaffoldN50?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  sizeUngapped?: Maybe<Scalars['Int']['output']>;
  sourceMolecule?: Maybe<Scalars['String']['output']>;
  specimens: Array<Specimen>;
  systemUsed?: Maybe<Scalars['String']['output']>;
  totalContigSize?: Maybe<Scalars['Int']['output']>;
  totalScaffoldSize?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AssemblyBy = {
  entityId?: InputMaybe<Scalars['String']['input']>;
};

export type AssemblyDetails = {
  __typename?: 'AssemblyDetails';
  assemblyId: Scalars['String']['output'];
  assemblyN50?: Maybe<Scalars['String']['output']>;
  assemblyName?: Maybe<Scalars['String']['output']>;
  completeness?: Maybe<Scalars['String']['output']>;
  completenessMethod?: Maybe<Scalars['String']['output']>;
  computationalInfrastructure?: Maybe<Scalars['String']['output']>;
  contigL50?: Maybe<Scalars['Int']['output']>;
  contigN50?: Maybe<Scalars['Int']['output']>;
  coverage?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  guanineCytosinePercent?: Maybe<Scalars['Float']['output']>;
  hybrid?: Maybe<Scalars['String']['output']>;
  hybridInformation?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  longestContig?: Maybe<Scalars['Int']['output']>;
  longestScaffold?: Maybe<Scalars['Int']['output']>;
  method?: Maybe<Scalars['String']['output']>;
  methodLink?: Maybe<Scalars['String']['output']>;
  methodVersion?: Maybe<Scalars['String']['output']>;
  minimumGapLength?: Maybe<Scalars['Int']['output']>;
  numberOfAtgc?: Maybe<Scalars['Int']['output']>;
  numberOfChromosomes?: Maybe<Scalars['Int']['output']>;
  numberOfComponentSequences?: Maybe<Scalars['Int']['output']>;
  numberOfContigs?: Maybe<Scalars['Int']['output']>;
  numberOfGapsBetweenScaffolds?: Maybe<Scalars['Int']['output']>;
  numberOfGuanineCytosine?: Maybe<Scalars['Int']['output']>;
  numberOfOrganelles?: Maybe<Scalars['Int']['output']>;
  numberOfReplicons?: Maybe<Scalars['Int']['output']>;
  numberOfScaffolds?: Maybe<Scalars['Int']['output']>;
  polishingOrScaffoldingData?: Maybe<Scalars['String']['output']>;
  polishingOrScaffoldingMethod?: Maybe<Scalars['String']['output']>;
  referenceGenomeLink?: Maybe<Scalars['String']['output']>;
  referenceGenomeUsed?: Maybe<Scalars['String']['output']>;
  representation?: Maybe<Scalars['String']['output']>;
  scaffoldL50?: Maybe<Scalars['Int']['output']>;
  scaffoldN50?: Maybe<Scalars['Int']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  sizeUngapped?: Maybe<Scalars['Int']['output']>;
  sourceMolecule?: Maybe<Scalars['String']['output']>;
  systemUsed?: Maybe<Scalars['String']['output']>;
  totalContigSize?: Maybe<Scalars['Int']['output']>;
  totalScaffoldSize?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type AssemblyEvent = {
  __typename?: 'AssemblyEvent';
  assembledBy?: Maybe<Scalars['String']['output']>;
  assemblyType?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  genomeSize?: Maybe<Scalars['Int']['output']>;
  id: Scalars['UUID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  versionStatus?: Maybe<Scalars['String']['output']>;
};

export type AssemblyPage = {
  __typename?: 'AssemblyPage';
  records: Array<AssemblyDetails>;
  total: Scalars['Int']['output'];
};

export type AttributeCategory =
  | 'BUSHFIRE_RECOVERY'
  | 'VENOMOUS_SPECIES';

export type AttributeValueType =
  | 'BOOLEAN'
  | 'DECIMAL'
  | 'INTEGER'
  | 'STRING'
  | 'TIMESTAMP';

export type BreakdownItem = {
  __typename?: 'BreakdownItem';
  name?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type Classification = {
  __typename?: 'Classification';
  class?: Maybe<Scalars['String']['output']>;
  classis?: Maybe<Scalars['String']['output']>;
  division?: Maybe<Scalars['String']['output']>;
  familia?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Scalars['String']['output']>;
  genus?: Maybe<Scalars['String']['output']>;
  kingdom?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['String']['output']>;
  ordo?: Maybe<Scalars['String']['output']>;
  phylum?: Maybe<Scalars['String']['output']>;
  regnum?: Maybe<Scalars['String']['output']>;
};

export type ClassificationFilter = {
  aggregateGenera?: InputMaybe<Scalars['String']['input']>;
  aggregateSpecies?: InputMaybe<Scalars['String']['input']>;
  biovar?: InputMaybe<Scalars['String']['input']>;
  class?: InputMaybe<Scalars['String']['input']>;
  classis?: InputMaybe<Scalars['String']['input']>;
  cohort?: InputMaybe<Scalars['String']['input']>;
  division?: InputMaybe<Scalars['String']['input']>;
  domain?: InputMaybe<Scalars['String']['input']>;
  epifamily?: InputMaybe<Scalars['String']['input']>;
  familia?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  forma?: InputMaybe<Scalars['String']['input']>;
  genus?: InputMaybe<Scalars['String']['input']>;
  gigaclass?: InputMaybe<Scalars['String']['input']>;
  higherTaxon?: InputMaybe<Scalars['String']['input']>;
  hyporder?: InputMaybe<Scalars['String']['input']>;
  incertaeSedis?: InputMaybe<Scalars['String']['input']>;
  infraclass?: InputMaybe<Scalars['String']['input']>;
  infragenus?: InputMaybe<Scalars['String']['input']>;
  infrakingdom?: InputMaybe<Scalars['String']['input']>;
  infraorder?: InputMaybe<Scalars['String']['input']>;
  infraphylum?: InputMaybe<Scalars['String']['input']>;
  infraspecies?: InputMaybe<Scalars['String']['input']>;
  kingdom?: InputMaybe<Scalars['String']['input']>;
  megaclass?: InputMaybe<Scalars['String']['input']>;
  minorder?: InputMaybe<Scalars['String']['input']>;
  mutatio?: InputMaybe<Scalars['String']['input']>;
  natio?: InputMaybe<Scalars['String']['input']>;
  nothovarietas?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['String']['input']>;
  ordo?: InputMaybe<Scalars['String']['input']>;
  parvorder?: InputMaybe<Scalars['String']['input']>;
  parvphylum?: InputMaybe<Scalars['String']['input']>;
  pathovar?: InputMaybe<Scalars['String']['input']>;
  phylum?: InputMaybe<Scalars['String']['input']>;
  regio?: InputMaybe<Scalars['String']['input']>;
  regnum?: InputMaybe<Scalars['String']['input']>;
  sectio?: InputMaybe<Scalars['String']['input']>;
  section?: InputMaybe<Scalars['String']['input']>;
  series?: InputMaybe<Scalars['String']['input']>;
  serovar?: InputMaybe<Scalars['String']['input']>;
  specialForm?: InputMaybe<Scalars['String']['input']>;
  species?: InputMaybe<Scalars['String']['input']>;
  subclass?: InputMaybe<Scalars['String']['input']>;
  subclassis?: InputMaybe<Scalars['String']['input']>;
  subcohort?: InputMaybe<Scalars['String']['input']>;
  subdivision?: InputMaybe<Scalars['String']['input']>;
  subfamilia?: InputMaybe<Scalars['String']['input']>;
  subfamily?: InputMaybe<Scalars['String']['input']>;
  subforma?: InputMaybe<Scalars['String']['input']>;
  subgenus?: InputMaybe<Scalars['String']['input']>;
  subkingdom?: InputMaybe<Scalars['String']['input']>;
  suborder?: InputMaybe<Scalars['String']['input']>;
  subordo?: InputMaybe<Scalars['String']['input']>;
  subphylum?: InputMaybe<Scalars['String']['input']>;
  subsectio?: InputMaybe<Scalars['String']['input']>;
  subsection?: InputMaybe<Scalars['String']['input']>;
  subseries?: InputMaybe<Scalars['String']['input']>;
  subspecies?: InputMaybe<Scalars['String']['input']>;
  subterclass?: InputMaybe<Scalars['String']['input']>;
  subtribe?: InputMaybe<Scalars['String']['input']>;
  subvarietas?: InputMaybe<Scalars['String']['input']>;
  subvariety?: InputMaybe<Scalars['String']['input']>;
  superclass?: InputMaybe<Scalars['String']['input']>;
  supercohort?: InputMaybe<Scalars['String']['input']>;
  superfamily?: InputMaybe<Scalars['String']['input']>;
  superkingdom?: InputMaybe<Scalars['String']['input']>;
  superorder?: InputMaybe<Scalars['String']['input']>;
  superordo?: InputMaybe<Scalars['String']['input']>;
  superphylum?: InputMaybe<Scalars['String']['input']>;
  superspecies?: InputMaybe<Scalars['String']['input']>;
  supertribe?: InputMaybe<Scalars['String']['input']>;
  tribe?: InputMaybe<Scalars['String']['input']>;
  unranked?: InputMaybe<Scalars['String']['input']>;
  varietas?: InputMaybe<Scalars['String']['input']>;
  variety?: InputMaybe<Scalars['String']['input']>;
};

export type Collection = {
  __typename?: 'Collection';
  collectedBy?: Maybe<Scalars['String']['output']>;
  collectionRemarks?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  depth?: Maybe<Scalars['Float']['output']>;
  depthAccuracy?: Maybe<Scalars['Float']['output']>;
  elevation?: Maybe<Scalars['Float']['output']>;
  elevationAccuracy?: Maybe<Scalars['Float']['output']>;
  entityId: Scalars['String']['output'];
  environmentBroadScale?: Maybe<Scalars['String']['output']>;
  environmentLocalScale?: Maybe<Scalars['String']['output']>;
  environmentMedium?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  fieldCollectingId?: Maybe<Scalars['String']['output']>;
  fieldNotes?: Maybe<Scalars['String']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  identificationRemarks?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  identifiedDate?: Maybe<Scalars['NaiveDate']['output']>;
  individualCount?: Maybe<Scalars['String']['output']>;
  isolate?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  locality?: Maybe<Scalars['String']['output']>;
  locationSource?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  organismId: Scalars['String']['output'];
  organismQuantity?: Maybe<Scalars['String']['output']>;
  organismQuantityType?: Maybe<Scalars['String']['output']>;
  preparation?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  specificHost?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  stateProvince?: Maybe<Scalars['String']['output']>;
  strain?: Maybe<Scalars['String']['output']>;
};

export type CollectionEvent = {
  __typename?: 'CollectionEvent';
  collectedBy?: Maybe<Scalars['String']['output']>;
  collectionRemarks?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  depth?: Maybe<Scalars['Float']['output']>;
  depthAccuracy?: Maybe<Scalars['Float']['output']>;
  elevation?: Maybe<Scalars['Float']['output']>;
  elevationAccuracy?: Maybe<Scalars['Float']['output']>;
  entityId: Scalars['String']['output'];
  environmentBroadScale?: Maybe<Scalars['String']['output']>;
  environmentLocalScale?: Maybe<Scalars['String']['output']>;
  environmentMedium?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  fieldCollectingId?: Maybe<Scalars['String']['output']>;
  fieldNotes?: Maybe<Scalars['String']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  identificationRemarks?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  identifiedDate?: Maybe<Scalars['NaiveDate']['output']>;
  individualCount?: Maybe<Scalars['String']['output']>;
  isolate?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  locality?: Maybe<Scalars['String']['output']>;
  locationSource?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  materialSampleId?: Maybe<Scalars['String']['output']>;
  municipality?: Maybe<Scalars['String']['output']>;
  organismId: Scalars['String']['output'];
  organismQuantity?: Maybe<Scalars['String']['output']>;
  organismQuantityType?: Maybe<Scalars['String']['output']>;
  preparation?: Maybe<Scalars['String']['output']>;
  specificHost?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  stateProvince?: Maybe<Scalars['String']['output']>;
  strain?: Maybe<Scalars['String']['output']>;
};

export type CompleteGenomesByYearStatistic = {
  __typename?: 'CompleteGenomesByYearStatistic';
  total: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type DataBreakdown = {
  __typename?: 'DataBreakdown';
  canonicalName: Scalars['String']['output'];
  genomes: Scalars['Int']['output'];
  loci: Scalars['Int']['output'];
  other: Scalars['Int']['output'];
  scientificName: Scalars['String']['output'];
  specimens: Scalars['Int']['output'];
  totalGenomic: Scalars['Int']['output'];
};

export type DataDepositionEvent = {
  __typename?: 'DataDepositionEvent';
  accessRights?: Maybe<Scalars['String']['output']>;
  accession?: Maybe<Scalars['String']['output']>;
  asmNotLiveDate?: Maybe<Scalars['String']['output']>;
  collectionCode?: Maybe<Scalars['String']['output']>;
  collectionName?: Maybe<Scalars['String']['output']>;
  dataType?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  excludedFromRefseq?: Maybe<Scalars['String']['output']>;
  fundingAttribution?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  institutionName?: Maybe<Scalars['String']['output']>;
  lastUpdated?: Maybe<Scalars['NaiveDate']['output']>;
  materialSampleId?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  sourceUri?: Maybe<Scalars['String']['output']>;
  submittedBy?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DataProduct = {
  __typename?: 'DataProduct';
  access?: Maybe<Scalars['String']['output']>;
  context?: Maybe<Scalars['String']['output']>;
  custodian?: Maybe<Agent>;
  entityId: Scalars['String']['output'];
  extractId?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  licence?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  sequenceAnalysisId?: Maybe<Scalars['String']['output']>;
  sequenceRunId?: Maybe<Scalars['String']['output']>;
  sequenceSampleId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DataReuseStatus =
  | 'LIMITED'
  | 'NONE'
  | 'UNLIMITED'
  | 'VARIABLE';

export type DataSummary = {
  __typename?: 'DataSummary';
  genomes: Scalars['Int']['output'];
  loci: Scalars['Int']['output'];
  other: Scalars['Int']['output'];
  specimens: Scalars['Int']['output'];
  totalGenomic: Scalars['Int']['output'];
};

export type DataType =
  | 'GENOME'
  | 'LOCUS'
  | 'OTHER'
  | 'SPECIMEN';

export type Dataset = {
  __typename?: 'Dataset';
  accessPill?: Maybe<AccessRightsStatus>;
  citation?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<SourceContentType>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  license?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  publicationYear?: Maybe<Scalars['Int']['output']>;
  reusePill?: Maybe<DataReuseStatus>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  species: SpeciesCardPage;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type DatasetSpeciesArgs = {
  page: Scalars['Int']['input'];
};

export type DatasetBy = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DatasetDetails = {
  __typename?: 'DatasetDetails';
  accessPill?: Maybe<AccessRightsStatus>;
  citation?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<SourceContentType>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  license?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  publicationYear?: Maybe<Scalars['Int']['output']>;
  reusePill?: Maybe<DataReuseStatus>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type DatasetStatistics = {
  __typename?: 'DatasetStatistics';
  /** A breakdown of species and the amount of data for it */
  breakdown: Array<BreakdownItem>;
  /** The total amount of species that have data records */
  speciesWithData: Scalars['Int']['output'];
  /** The total amount of species */
  totalSpecies: Scalars['Int']['output'];
};

export type DatasetVersion = {
  __typename?: 'DatasetVersion';
  createdAt: Scalars['DateTime']['output'];
  datasetId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  importedAt: Scalars['DateTime']['output'];
  version: Scalars['String']['output'];
};

export type DateRange = {
  after: Scalars['NaiveDate']['input'];
  before: Scalars['NaiveDate']['input'];
};

export type Deposition = {
  __typename?: 'Deposition';
  assemblyId: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  institution?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  url?: Maybe<Scalars['String']['output']>;
};

export type DnaExtract = {
  __typename?: 'DnaExtract';
  absorbance260230Ratio?: Maybe<Scalars['Float']['output']>;
  absorbance260280Ratio?: Maybe<Scalars['Float']['output']>;
  actionExtracted?: Maybe<Scalars['String']['output']>;
  cellLysisMethod?: Maybe<Scalars['String']['output']>;
  concentration?: Maybe<Scalars['Float']['output']>;
  concentrationMethod?: Maybe<Scalars['String']['output']>;
  concentrationUnit?: Maybe<Scalars['String']['output']>;
  conformation?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  extractId: Scalars['String']['output'];
  extractedBy?: Maybe<Agent>;
  extractionMethod?: Maybe<Scalars['String']['output']>;
  materialExtractedBy?: Maybe<Scalars['String']['output']>;
  nucleicAcidType?: Maybe<Scalars['String']['output']>;
  numberOfExtractsPooled?: Maybe<Scalars['String']['output']>;
  preparationType?: Maybe<Scalars['String']['output']>;
  preservationMethod?: Maybe<Scalars['String']['output']>;
  preservationType?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  quantification?: Maybe<Scalars['String']['output']>;
  subsampleId: Scalars['String']['output'];
};

export type DnaExtractBy = {
  id?: InputMaybe<Scalars['String']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
  specimenRecordId?: InputMaybe<Scalars['String']['input']>;
};

export type FilterAction =
  | 'EXCLUDE'
  | 'INCLUDE';

/** An all purpose filter to apply to queries for species. */
export type FilterItem = {
  action: FilterAction;
  filter: FilterType;
  value: Scalars['JSON']['input'];
};

export type FilterOptions = {
  __typename?: 'FilterOptions';
  drainageBasin: Array<Scalars['String']['output']>;
  ecology: Array<Scalars['String']['output']>;
  ibra: Array<Scalars['String']['output']>;
  imcra: Array<Scalars['String']['output']>;
  state: Array<Scalars['String']['output']>;
};

export type FilterType =
  | 'ATTRIBUTE'
  | 'CLASS'
  | 'CLASSIS'
  | 'COHORT'
  | 'DATASET'
  | 'DIVISION'
  | 'DOMAIN'
  | 'FAMILIA'
  | 'FAMILY'
  | 'FORMA'
  | 'GENUS'
  | 'HAS_DATA'
  | 'HYPORDER'
  | 'KINGDOM'
  | 'ORDER'
  | 'ORDO'
  | 'PHYLUM'
  | 'REGIO'
  | 'REGNUM'
  | 'SECTIO'
  | 'SECTION'
  | 'SERIES'
  | 'SUBCLASS'
  | 'SUBCLASSIS'
  | 'SUBCOHORT'
  | 'SUBDIVISION'
  | 'SUBFAMILIA'
  | 'SUBFAMILY'
  | 'SUBGENUS'
  | 'SUBKINGDOM'
  | 'SUBORDER'
  | 'SUBORDO'
  | 'SUBPHYLUM'
  | 'SUBTRIBE'
  | 'SUPERCLASS'
  | 'SUPERFAMILY'
  | 'SUPERKINGDOM'
  | 'SUPERORDER'
  | 'SUPERORDO'
  | 'SUPERTRIBE'
  | 'TRIBE'
  | 'VERNACULAR_GROUP';

export type FullTextSearchItem = GenomeItem | LocusItem | SpecimenItem | TaxonItem;

export type FullTextSearchResult = {
  __typename?: 'FullTextSearchResult';
  records: Array<FullTextSearchItem>;
  total: Scalars['Int']['output'];
};

export type FullTextType =
  | 'GENOME'
  | 'LOCUS'
  | 'SPECIMEN'
  | 'TAXON';

export type GenomeItem = {
  __typename?: 'GenomeItem';
  accession: Scalars['String']['output'];
  assemblyType?: Maybe<Scalars['String']['output']>;
  canonicalName?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  genomeRep?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  referenceGenome: Scalars['Boolean']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  sourceUri?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  type: FullTextType;
};

export type GenomeRelease = {
  __typename?: 'GenomeRelease';
  canonicalName: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['NaiveDate']['output']>;
  scientificName: Scalars['String']['output'];
};

export type GenomicComponent = {
  __typename?: 'GenomicComponent';
  accessRights?: Maybe<Scalars['String']['output']>;
  accession?: Maybe<Scalars['String']['output']>;
  dataType?: Maybe<Scalars['String']['output']>;
  datasetName: Scalars['String']['output'];
  depositedBy?: Maybe<Scalars['String']['output']>;
  dnaExtractId: Scalars['String']['output'];
  estimatedSize?: Maybe<Scalars['String']['output']>;
  fundingAttribution?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  materialSampleId?: Maybe<Scalars['String']['output']>;
  recordId: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  sequenceId: Scalars['UUID']['output'];
  sequencedBy?: Maybe<Scalars['String']['output']>;
  sourceUri?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type GenomicComponentPage = {
  __typename?: 'GenomicComponentPage';
  records: Array<GenomicComponent>;
  total: Scalars['Int']['output'];
};

export type HasData =
  | 'GENOMES'
  | 'GENOMIC_DATA'
  | 'LOCI';

export type KingdomPhylumCount = {
  __typename?: 'KingdomPhylumCount';
  count: Scalars['Int']['output'];
  kingdom: Scalars['String']['output'];
  phylum: Scalars['String']['output'];
};

export type Library = {
  __typename?: 'Library';
  baitSetName?: Maybe<Scalars['String']['output']>;
  baitSetReference?: Maybe<Scalars['String']['output']>;
  concentration?: Maybe<Scalars['Float']['output']>;
  concentrationUnit?: Maybe<Scalars['String']['output']>;
  constructionProtocol?: Maybe<Scalars['String']['output']>;
  designDescription?: Maybe<Scalars['String']['output']>;
  dnaTreatment?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  indexDualOligo?: Maybe<Scalars['String']['output']>;
  indexDualTag?: Maybe<Scalars['String']['output']>;
  indexOligo?: Maybe<Scalars['String']['output']>;
  indexTag?: Maybe<Scalars['String']['output']>;
  insertSize?: Maybe<Scalars['String']['output']>;
  layout?: Maybe<Scalars['String']['output']>;
  libraryId: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name: NameDetails;
  numberOfLibrariesPooled?: Maybe<Scalars['Int']['output']>;
  pcrCycles?: Maybe<Scalars['Int']['output']>;
  pcrReplicates?: Maybe<Scalars['Int']['output']>;
  preparedBy?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  remarks?: Maybe<Scalars['String']['output']>;
  selection?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  strategy?: Maybe<Scalars['String']['output']>;
};

export type LocusItem = {
  __typename?: 'LocusItem';
  accession: Scalars['String']['output'];
  canonicalName?: Maybe<Scalars['String']['output']>;
  dataSource?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventLocation?: Maybe<Scalars['String']['output']>;
  locusType?: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  type: FullTextType;
  voucherStatus?: Maybe<Scalars['String']['output']>;
};

export type Maps = {
  __typename?: 'Maps';
  ibra: Scalars['String']['output'];
  imcraMesoscale: Scalars['String']['output'];
  imcraProvincial: Scalars['String']['output'];
};


export type MapsIbraArgs = {
  regions: Array<Scalars['String']['input']>;
};


export type MapsImcraMesoscaleArgs = {
  regions: Array<Scalars['String']['input']>;
};


export type MapsImcraProvincialArgs = {
  regions: Array<Scalars['String']['input']>;
};

export type Marker = {
  __typename?: 'Marker';
  accession?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  datasetName: Scalars['String']['output'];
  dnaExtractId: Scalars['String']['output'];
  materialSampleId?: Maybe<Scalars['String']['output']>;
  recordId: Scalars['String']['output'];
  sequenceId: Scalars['UUID']['output'];
  sequencedBy?: Maybe<Scalars['String']['output']>;
  targetGene: Scalars['String']['output'];
};

export type Markers = {
  __typename?: 'Markers';
  species: Array<SpeciesMarker>;
};


export type MarkersSpeciesArgs = {
  canonicalName: Scalars['String']['input'];
};

export type Name = {
  __typename?: 'Name';
  authorship?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  scientificName: Scalars['String']['output'];
  taxa: Array<TaxonDetails>;
};

/** Attributes for a specific species */
export type NameAttribute = {
  __typename?: 'NameAttribute';
  category: AttributeCategory;
  datasetId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  valueBool?: Maybe<Scalars['Boolean']['output']>;
  valueDecimal?: Maybe<Scalars['String']['output']>;
  valueInt?: Maybe<Scalars['Int']['output']>;
  valueStr?: Maybe<Scalars['String']['output']>;
  valueTimestamp?: Maybe<Scalars['NaiveDateTime']['output']>;
  valueType: AttributeValueType;
};

export type NameDetails = {
  __typename?: 'NameDetails';
  authorship?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  scientificName: Scalars['String']['output'];
};

export type NomenclaturalAct = {
  __typename?: 'NomenclaturalAct';
  act: NomenclaturalActType;
  actedOn: NameDetails;
  entityId: Scalars['String']['output'];
  name: Name;
  publication: Publication;
  sourceUrl: Scalars['String']['output'];
};

export type NomenclaturalActAtom = NomenclaturalActAtomDateTime | NomenclaturalActAtomText | NomenclaturalActAtomType;

export type NomenclaturalActAtomActType =
  | 'NOMENCLATURAL_ACT_TYPE';

export type NomenclaturalActAtomDateTime = {
  __typename?: 'NomenclaturalActAtomDateTime';
  type: NomenclaturalActAtomDateTimeType;
  value: Scalars['DateTime']['output'];
};

export type NomenclaturalActAtomDateTimeType =
  | 'CREATED_AT'
  | 'UPDATED_AT';

export type NomenclaturalActAtomText = {
  __typename?: 'NomenclaturalActAtomText';
  type: NomenclaturalActAtomTextType;
  value: Scalars['String']['output'];
};

export type NomenclaturalActAtomTextType =
  | 'ACT'
  | 'ACTED_ON'
  | 'AUTHORITY_NAME'
  | 'AUTHORITY_YEAR'
  | 'AUTHORSHIP'
  | 'BASIONYM_AUTHORITY_NAME'
  | 'BASIONYM_AUTHORITY_YEAR'
  | 'CANONICAL_NAME'
  | 'EMPTY'
  | 'ENTITY_ID'
  | 'GENUS'
  | 'PUBLICATION'
  | 'PUBLICATION_DATE'
  | 'RANK'
  | 'SCIENTIFIC_NAME'
  | 'SOURCE_URL'
  | 'SPECIFIC_EPITHET';

export type NomenclaturalActAtomType = {
  __typename?: 'NomenclaturalActAtomType';
  type: NomenclaturalActAtomActType;
  value: NomenclaturalActType;
};

export type NomenclaturalActOperation = {
  __typename?: 'NomenclaturalActOperation';
  action: Action;
  atom: NomenclaturalActAtom;
  dataset: DatasetDetails;
  datasetVersion: DatasetVersion;
  entityId: Scalars['String']['output'];
  loggedAt: Scalars['DateTime']['output'];
  operationId: Scalars['Int']['output'];
  parentId: Scalars['Int']['output'];
};

export type NomenclaturalActType =
  | 'COMBINATIO_NOVA'
  | 'DEMOTION'
  | 'GENUS_SPECIES_NOVA'
  | 'HETEROTYPIC_SYNONYMY'
  | 'HOMOTYPIC_SYNONYMY'
  | 'NAME_USAGE'
  | 'ORIGINAL_DESCRIPTION'
  | 'PROMOTION'
  | 'REDESCRIPTION'
  | 'REVIVED_STATUS'
  | 'SPECIES_NOVA'
  | 'SUBGENUS_PLACEMENT'
  | 'SUBSPECIES_NOVA'
  | 'SYNONYMISATION';

export type OperationBy = {
  entityId?: InputMaybe<Scalars['String']['input']>;
};

export type Organism = {
  __typename?: 'Organism';
  behavior?: Maybe<Scalars['String']['output']>;
  biome?: Maybe<Scalars['String']['output']>;
  bioregion?: Maybe<Scalars['String']['output']>;
  collections: Array<Collection>;
  coordinateSystem?: Maybe<Scalars['String']['output']>;
  dataProducts: Array<DataProduct>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  extractions: Array<DnaExtract>;
  firstObservedAt?: Maybe<Scalars['NaiveDate']['output']>;
  genotypicSex?: Maybe<Scalars['String']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  holding?: Maybe<Scalars['String']['output']>;
  holdingId?: Maybe<Scalars['String']['output']>;
  holdingPermit?: Maybe<Scalars['String']['output']>;
  ibraImcra?: Maybe<Scalars['String']['output']>;
  identificationDate?: Maybe<Scalars['NaiveDate']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  lastKnownAliveAt?: Maybe<Scalars['NaiveDate']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  lifeStage?: Maybe<Scalars['String']['output']>;
  liveState?: Maybe<Scalars['String']['output']>;
  locationSource?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: NameDetails;
  organismId: Scalars['String']['output'];
  phenotypicSex?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  recordCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  recordUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  registrations: Array<Registration>;
  remarks?: Maybe<Scalars['String']['output']>;
  reproductiveCondition?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  subsamples: Array<Subsample>;
  tissues: Array<Tissue>;
};

export type OrganismBy = {
  entityId?: InputMaybe<Scalars['String']['input']>;
};

export type OrganismDetails = {
  __typename?: 'OrganismDetails';
  behavior?: Maybe<Scalars['String']['output']>;
  biome?: Maybe<Scalars['String']['output']>;
  bioregion?: Maybe<Scalars['String']['output']>;
  coordinateSystem?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  firstObservedAt?: Maybe<Scalars['NaiveDate']['output']>;
  genotypicSex?: Maybe<Scalars['String']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  holding?: Maybe<Scalars['String']['output']>;
  holdingId?: Maybe<Scalars['String']['output']>;
  holdingPermit?: Maybe<Scalars['String']['output']>;
  ibraImcra?: Maybe<Scalars['String']['output']>;
  identificationDate?: Maybe<Scalars['NaiveDate']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  lastKnownAliveAt?: Maybe<Scalars['NaiveDate']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  lifeStage?: Maybe<Scalars['String']['output']>;
  liveState?: Maybe<Scalars['String']['output']>;
  locationSource?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  organismId: Scalars['String']['output'];
  phenotypicSex?: Maybe<Scalars['String']['output']>;
  recordCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  recordUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  reproductiveCondition?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
};

export type Overview = {
  __typename?: 'Overview';
  classification: Scalars['Int']['output'];
  /** Returns the amount of species in every dataset */
  datasets: Array<OverviewItem>;
  loci: Scalars['Int']['output'];
  sequences: Scalars['Int']['output'];
  /** Returns the amount of species in every source */
  sources: Array<OverviewItem>;
  specimens: Scalars['Int']['output'];
  /** Returns the amount of whole genomes in the index */
  wholeGenomes: Scalars['Int']['output'];
};


export type OverviewClassificationArgs = {
  by: ClassificationFilter;
};

export type OverviewItem = {
  __typename?: 'OverviewItem';
  name: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type Provenance = {
  __typename?: 'Provenance';
  nomenclaturalAct: Array<NomenclaturalActOperation>;
  specimen: Array<SpecimenOperation>;
  taxon: Array<TaxonOperation>;
};


export type ProvenanceNomenclaturalActArgs = {
  by: OperationBy;
};


export type ProvenanceSpecimenArgs = {
  by: OperationBy;
};


export type ProvenanceTaxonArgs = {
  by: OperationBy;
};

export type Publication = {
  __typename?: 'Publication';
  authors?: Maybe<Array<Scalars['String']['output']>>;
  citation?: Maybe<Scalars['String']['output']>;
  doi?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  language?: Maybe<Scalars['String']['output']>;
  publicationType?: Maybe<PublicationType>;
  publishedDate?: Maybe<Scalars['DateTime']['output']>;
  publishedYear?: Maybe<Scalars['Int']['output']>;
  publisher?: Maybe<Scalars['String']['output']>;
  sourceUrls?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PublicationType =
  | 'BOOK'
  | 'BOOK_CHAPTER'
  | 'JOURNAL_ARTICLE'
  | 'JOURNAL_VOLUME'
  | 'PROCEEDINGS_PAPER'
  | 'URL';

export type Query = {
  __typename?: 'Query';
  assembly: Assembly;
  dataset: Dataset;
  dnaExtract?: Maybe<DnaExtract>;
  maps: Maps;
  marker: Marker;
  markers: Markers;
  organism: Organism;
  overview: Overview;
  provenance: Provenance;
  search: Search;
  sequence: Array<Sequence>;
  source: Source;
  sources: Array<Source>;
  species: Species;
  specimen: Specimen;
  stats: Statistics;
  subsample?: Maybe<Subsample>;
  taxa: Taxa;
  taxon: Taxon;
};


export type QueryAssemblyArgs = {
  by: AssemblyBy;
};


export type QueryDatasetArgs = {
  by: DatasetBy;
};


export type QueryDnaExtractArgs = {
  by: DnaExtractBy;
};


export type QueryMapsArgs = {
  tolerance?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMarkerArgs = {
  accession: Scalars['String']['input'];
};


export type QueryOrganismArgs = {
  by: OrganismBy;
};


export type QuerySequenceArgs = {
  by: SequenceBy;
};


export type QuerySourceArgs = {
  by: SourceBy;
  filters?: InputMaybe<Array<FilterItem>>;
};


export type QuerySpeciesArgs = {
  canonicalName: Scalars['String']['input'];
};


export type QuerySpecimenArgs = {
  by: SpecimenBy;
};


export type QuerySubsampleArgs = {
  by: SubsampleBy;
};


export type QueryTaxaArgs = {
  filters: Array<TaxaFilter>;
};


export type QueryTaxonArgs = {
  by: TaxonBy;
  filters?: InputMaybe<Array<FilterItem>>;
};

export type RankSummary = {
  __typename?: 'RankSummary';
  /** Total amount of taxa in the rank with genomes */
  genomes: Scalars['Int']['output'];
  /** Total amount of taxa in the rank with any genomic data */
  genomicData: Scalars['Int']['output'];
  /** Total amount of taxa in the rank with loci */
  loci: Scalars['Int']['output'];
  /** Total amount of taxa in the rank */
  total: Scalars['Int']['output'];
};

export type RegionDistribution = {
  __typename?: 'RegionDistribution';
  dataset: DatasetDetails;
  names: Array<Scalars['String']['output']>;
};

export type Regions = {
  __typename?: 'Regions';
  ibra: Array<RegionDistribution>;
  imcra: Array<RegionDistribution>;
};

export type Registration = {
  __typename?: 'Registration';
  accessionedBy?: Maybe<Scalars['String']['output']>;
  collectionRepositoryCode?: Maybe<Scalars['String']['output']>;
  collectionRepositoryId?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  identificationRemarks?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  identifiedDate?: Maybe<Scalars['NaiveDate']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionName?: Maybe<Scalars['String']['output']>;
  otherCatalogNumbers?: Maybe<Scalars['String']['output']>;
  preparation?: Maybe<Scalars['String']['output']>;
  preparedBy?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  specimenId: Scalars['String']['output'];
  typeStatus?: Maybe<Scalars['String']['output']>;
};

export type Search = {
  __typename?: 'Search';
  fullText: FullTextSearchResult;
};


export type SearchFullTextArgs = {
  page: Scalars['Int']['input'];
  perPage: Scalars['Int']['input'];
  query: Scalars['String']['input'];
};

export type Sequence = {
  __typename?: 'Sequence';
  datasetName: Scalars['String']['output'];
  dnaExtractId: Scalars['String']['output'];
  events: SequenceEvents;
  id: Scalars['UUID']['output'];
  recordId: Scalars['String']['output'];
};

export type SequenceBy = {
  accession?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
  specimenRecordId?: InputMaybe<Scalars['String']['input']>;
};

export type SequenceEvents = {
  __typename?: 'SequenceEvents';
  annotations: Array<AnnotationEvent>;
  assemblies: Array<AssemblyEvent>;
  dataDepositions: Array<DataDepositionEvent>;
  sequencing: Array<SequencingEvent>;
  sequencingRuns: Array<SequencingRunEvent>;
};

export type SequencingEvent = {
  __typename?: 'SequencingEvent';
  ampliconSize?: Maybe<Scalars['Int']['output']>;
  baitSetName?: Maybe<Scalars['String']['output']>;
  baitSetReference?: Maybe<Scalars['String']['output']>;
  concentration?: Maybe<Scalars['Float']['output']>;
  dnaSequence?: Maybe<Scalars['String']['output']>;
  estimatedSize?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventTime?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  materialSampleId?: Maybe<Scalars['String']['output']>;
  sequencedBy?: Maybe<Scalars['String']['output']>;
  targetGene?: Maybe<Scalars['String']['output']>;
};

export type SequencingRunEvent = {
  __typename?: 'SequencingRunEvent';
  analysisDescription?: Maybe<Scalars['String']['output']>;
  analysisSoftware?: Maybe<Scalars['String']['output']>;
  direction?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  libraryProtocol?: Maybe<Scalars['String']['output']>;
  pcrPrimerNameForward?: Maybe<Scalars['String']['output']>;
  pcrPrimerNameReverse?: Maybe<Scalars['String']['output']>;
  sequencePrimerForwardName?: Maybe<Scalars['String']['output']>;
  sequencePrimerReverseName?: Maybe<Scalars['String']['output']>;
  sequencingCenter?: Maybe<Scalars['String']['output']>;
  sequencingCenterCode?: Maybe<Scalars['String']['output']>;
  sequencingDate?: Maybe<Scalars['NaiveDateTime']['output']>;
  sequencingEventId: Scalars['UUID']['output'];
  sequencingMethod?: Maybe<Scalars['String']['output']>;
  targetGene?: Maybe<Scalars['String']['output']>;
  trace: TraceData;
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type SortOrder =
  | 'ASCENDING'
  | 'DESCENDING';

export type Source = {
  __typename?: 'Source';
  accessPill?: Maybe<AccessRightsStatus>;
  accessRights: Scalars['String']['output'];
  author: Scalars['String']['output'];
  contentType?: Maybe<SourceContentType>;
  datasets: Array<DatasetDetails>;
  id: Scalars['UUID']['output'];
  latestGenomeReleases: Array<GenomeRelease>;
  latestGenomeReleasesCsv: Scalars['String']['output'];
  license: Scalars['String']['output'];
  listsId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  reusePill?: Maybe<DataReuseStatus>;
  rightsHolder: Scalars['String']['output'];
  species: SpeciesCardPage;
  speciesCsv: Scalars['String']['output'];
  speciesGenomesSummary: Array<DataBreakdown>;
  speciesGenomesSummaryCsv: Scalars['String']['output'];
  speciesGenomicDataSummary: Array<DataBreakdown>;
  speciesGenomicDataSummaryCsv: Scalars['String']['output'];
  speciesLociSummary: Array<DataBreakdown>;
  speciesLociSummaryCsv: Scalars['String']['output'];
  summary: RankSummary;
  summaryCsv: Scalars['String']['output'];
  taxonomicDiversity: Array<KingdomPhylumCount>;
  taxonomicDiversityCsv: Scalars['String']['output'];
};


export type SourceSpeciesArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sort?: InputMaybe<SpeciesSort>;
  sortDirection?: InputMaybe<SortDirection>;
};

export type SourceBy = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SourceContentType =
  | 'BIOCHEMICAL_TRAITS'
  | 'ECOLOGICAL_TRAITS'
  | 'ETHNOBIOLOGY'
  | 'FUNCTIONAL_TRAITS'
  | 'GENOMIC_DATA'
  | 'MIXED_DATATYPES'
  | 'MORPHOLOGICAL_TRAITS'
  | 'NONGENOMIC_DATA'
  | 'SPECIMENS'
  | 'TAXONOMIC_BACKBONE';

export type Species = {
  __typename?: 'Species';
  assemblies: AssemblyPage;
  attributes: Array<NameAttribute>;
  dataSummary: SpeciesGenomicDataSummary;
  genomicComponents: GenomicComponentPage;
  mapping: SpeciesMapping;
  markers: SpeciesMarkerPage;
  overview: SpeciesOverview;
  photos: Array<SpeciesPhoto>;
  referenceGenome?: Maybe<WholeGenome>;
  regions: Regions;
  specimens: SpecimenSummaryPage;
  synonyms: Array<Synonym>;
  taxonomy: Array<Taxonomy>;
  vernacularNames: Array<VernacularName>;
  wholeGenomes: WholeGenomePage;
};


export type SpeciesAssembliesArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type SpeciesGenomicComponentsArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type SpeciesMarkersArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};


export type SpeciesSpecimensArgs = {
  filters: Array<SpecimenFilterItem>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sorting: SpecimenSorting;
};


export type SpeciesWholeGenomesArgs = {
  filters?: InputMaybe<Array<WholeGenomeFilterItem>>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type SpeciesCard = {
  __typename?: 'SpeciesCard';
  dataSummary: SpeciesDataSummary;
  photo?: Maybe<SpeciesPhoto>;
  taxonomy: Taxonomy;
};

export type SpeciesCardPage = {
  __typename?: 'SpeciesCardPage';
  records: Array<SpeciesCard>;
  total: Scalars['Int']['output'];
};

export type SpeciesDataSummary = {
  __typename?: 'SpeciesDataSummary';
  genomes: Scalars['Int']['output'];
  loci: Scalars['Int']['output'];
  other: Scalars['Int']['output'];
  specimens: Scalars['Int']['output'];
};

export type SpeciesGenomicDataSummary = {
  __typename?: 'SpeciesGenomicDataSummary';
  /** The total amount of whole genomes available */
  genomes: Scalars['Int']['output'];
  /** The total amount of loci available */
  loci: Scalars['Int']['output'];
  /** The total amount of other genomic data */
  other: Scalars['Int']['output'];
  /** The total amount of specimens available */
  specimens: Scalars['Int']['output'];
  /** The total amount of genomic data */
  totalGenomic: Scalars['Int']['output'];
};

export type SpeciesMapping = {
  __typename?: 'SpeciesMapping';
  specimens: Array<SpecimenMapMarker>;
};

export type SpeciesMarker = {
  __typename?: 'SpeciesMarker';
  accession?: Maybe<Scalars['String']['output']>;
  datasetName: Scalars['String']['output'];
  dnaExtractId: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  materialSampleId?: Maybe<Scalars['String']['output']>;
  recordId: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  sequenceId: Scalars['UUID']['output'];
  sequencedBy?: Maybe<Scalars['String']['output']>;
  targetGene: Scalars['String']['output'];
};

export type SpeciesMarkerPage = {
  __typename?: 'SpeciesMarkerPage';
  records: Array<SpeciesMarker>;
  total: Scalars['Int']['output'];
};

export type SpeciesOverview = {
  __typename?: 'SpeciesOverview';
  /**
   * The specimen accessions, if any. There should only ever be one holotype
   * per species but conflicting data sources can give us multiple and rather than
   * hiding it we surface all possible accessions here.
   */
  accessions: Array<AccessionEvent>;
  /** A list of the collections that have the most specimens for the species */
  majorCollections: Array<Scalars['String']['output']>;
  specimens: SpecimensOverview;
};

export type SpeciesPhoto = {
  __typename?: 'SpeciesPhoto';
  license?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  publisher?: Maybe<Scalars['String']['output']>;
  rightsHolder?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type SpeciesSort =
  | 'CANONICAL_NAME'
  | 'CLASSIFICATION_HIERARCHY'
  | 'GENOMES'
  | 'LOCI'
  | 'OTHER'
  | 'SCIENTIFIC_NAME'
  | 'SPECIMENS'
  | 'TOTAL_GENOMIC';

export type SpeciesStatistics = {
  __typename?: 'SpeciesStatistics';
  /** The total amount of barcodes available */
  barcodes: Scalars['Int']['output'];
  /** The total amount of organelles available */
  organelles: Scalars['Int']['output'];
  /** The total amount of partial genomes available */
  partialGenomes: Scalars['Int']['output'];
  /** The total amount of genomic data */
  total: Scalars['Int']['output'];
  /** The total amount of whole genomes available */
  wholeGenomes: Scalars['Int']['output'];
};

export type Specimen = {
  __typename?: 'Specimen';
  accessions: Array<AccessionEvent>;
  canonicalName: Scalars['String']['output'];
  collections: Array<CollectionEvent>;
  entityId: Scalars['String']['output'];
  events: SpecimenEvents;
  organism: OrganismDetails;
  organismId: Scalars['String']['output'];
  stats: SpecimenStats;
  tissues: Array<TissueDetails>;
};

export type SpecimenAtom = SpecimenAtomText;

export type SpecimenAtomText = {
  __typename?: 'SpecimenAtomText';
  type: SpecimenAtomTextType;
  value: Scalars['String']['output'];
};

export type SpecimenAtomTextType =
  | 'COLLECTION_REPOSITORY_CODE'
  | 'COLLECTION_REPOSITORY_ID'
  | 'DISPOSITION'
  | 'EMPTY'
  | 'EVENT_DATE'
  | 'EVENT_TIME'
  | 'INSTITUTION_CODE'
  | 'INSTITUTION_NAME'
  | 'OTHER_CATALOG_NUMBERS'
  | 'PREPARATION'
  | 'SCIENTIFIC_NAME'
  | 'SPECIMEN_ID'
  | 'TYPE_STATUS';

export type SpecimenBy = {
  entityId?: InputMaybe<Scalars['String']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
  sequenceAccession?: InputMaybe<Scalars['String']['input']>;
  sequenceRecordId?: InputMaybe<Scalars['String']['input']>;
};

export type SpecimenEvents = {
  __typename?: 'SpecimenEvents';
  accessions: Array<AccessionEvent>;
  collections: Array<CollectionEvent>;
};

export type SpecimenFilterItem = {
  collectedBetween?: InputMaybe<DateRange>;
  country?: InputMaybe<Array<Scalars['String']['input']>>;
  data?: InputMaybe<Array<HasData>>;
  institution?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SpecimenItem = {
  __typename?: 'SpecimenItem';
  accession: Scalars['String']['output'];
  canonicalName?: Maybe<Scalars['String']['output']>;
  collectedBy?: Maybe<Scalars['String']['output']>;
  collectionRepositoryCode?: Maybe<Scalars['String']['output']>;
  collectionRepositoryId?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  identifiedBy?: Maybe<Scalars['String']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  type: FullTextType;
};

export type SpecimenMapMarker = {
  __typename?: 'SpecimenMapMarker';
  collectionRepositoryId?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  institutionCode?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  typeStatus?: Maybe<Scalars['String']['output']>;
};

export type SpecimenOperation = {
  __typename?: 'SpecimenOperation';
  action: Action;
  atom: SpecimenAtom;
  dataset: DatasetDetails;
  datasetVersion: DatasetVersion;
  entityId: Scalars['String']['output'];
  loggedAt: Scalars['DateTime']['output'];
  operationId: Scalars['Int']['output'];
  parentId: Scalars['Int']['output'];
};

export type SpecimenOptions = {
  __typename?: 'SpecimenOptions';
  countries: Array<Scalars['String']['output']>;
  institutions: Array<Scalars['String']['output']>;
};

export type SpecimenSortable =
  | 'COLLECTION_DATE'
  | 'COUNTRY'
  | 'GENOMES'
  | 'GENOMIC_DATA'
  | 'INSTITUTION'
  | 'LOCI'
  | 'METADATA_SCORE'
  | 'STATUS'
  | 'VOUCHER';

export type SpecimenSorting = {
  order: SortOrder;
  sortable: SpecimenSortable;
};

export type SpecimenStats = {
  __typename?: 'SpecimenStats';
  assemblyChromosomes: Scalars['Int']['output'];
  assemblyContigs: Scalars['Int']['output'];
  assemblyScaffolds: Scalars['Int']['output'];
  completeGenomes: Scalars['Int']['output'];
  entityId: Scalars['String']['output'];
  fullGenomes: Scalars['Int']['output'];
  loci: Scalars['Int']['output'];
  otherGenomic: Scalars['Int']['output'];
  partialGenomes: Scalars['Int']['output'];
  sequences: Scalars['Int']['output'];
  wholeGenomes: Scalars['Int']['output'];
};

/** A specimen from a specific species. */
export type SpecimenSummary = {
  __typename?: 'SpecimenSummary';
  assemblyChromosomes: Scalars['Int']['output'];
  assemblyContigs: Scalars['Int']['output'];
  assemblyScaffolds: Scalars['Int']['output'];
  collectedAt?: Maybe<Scalars['NaiveDate']['output']>;
  collectionRepositoryCode?: Maybe<Scalars['String']['output']>;
  collectionRepositoryId?: Maybe<Scalars['String']['output']>;
  completeGenomes: Scalars['Int']['output'];
  country?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  fullGenomes: Scalars['Int']['output'];
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionName?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  loci: Scalars['Int']['output'];
  longitude?: Maybe<Scalars['Float']['output']>;
  organismId: Scalars['String']['output'];
  otherGenomic: Scalars['Int']['output'];
  partialGenomes: Scalars['Int']['output'];
  sequences: Scalars['Int']['output'];
  specimenId?: Maybe<Scalars['String']['output']>;
  typeStatus?: Maybe<Scalars['String']['output']>;
};

export type SpecimenSummaryPage = {
  __typename?: 'SpecimenSummaryPage';
  options: SpecimenOptions;
  records: Array<SpecimenSummary>;
  total: Scalars['Int']['output'];
};

export type SpecimensOverview = {
  __typename?: 'SpecimensOverview';
  /** The total amount of material located in an Australian institution */
  australianMaterial: Scalars['Int']['output'];
  /** An array of total specimens collected for each year */
  collectionYears: Array<YearValue>;
  /** The total amount of specimen registrations */
  formalVouchers: Scalars['Int']['output'];
  /** The total amount of genomic DNA resulting from a specimen */
  genomicDna: Scalars['Int']['output'];
  /** The total amount of material located elsewhere */
  nonAustralianMaterial: Scalars['Int']['output'];
  /** The total amount of type specimens that are not the holotype */
  otherTypes: Scalars['Int']['output'];
  /** The total amount of tissue subsamples */
  tissues: Scalars['Int']['output'];
  /** The top 5 countries of collected specimens */
  topCountries: Array<StringValue>;
  /** The total amount of specimens associated with the species */
  total: Scalars['Int']['output'];
};

export type Statistics = {
  __typename?: 'Statistics';
  completeGenomesByYear: Array<CompleteGenomesByYearStatistic>;
  completeGenomesByYearCsv: Scalars['String']['output'];
  completeGenomesByYearForSource: Array<CompleteGenomesByYearStatistic>;
  completeGenomesByYearForSourceCsv: Scalars['String']['output'];
  dataset: DatasetStatistics;
  species: SpeciesStatistics;
  taxonBreakdown: Array<TaxonTreeNodeStatistics>;
  taxonomicRanks: Array<TaxonomicRankStatistic>;
  taxonomicRanksCsv: Scalars['String']['output'];
};


export type StatisticsCompleteGenomesByYearArgs = {
  taxonCanonicalName: Scalars['String']['input'];
  taxonRank: TaxonomicRank;
};


export type StatisticsCompleteGenomesByYearCsvArgs = {
  taxonCanonicalName: Scalars['String']['input'];
  taxonRank: TaxonomicRank;
};


export type StatisticsCompleteGenomesByYearForSourceArgs = {
  filters?: InputMaybe<Array<FilterItem>>;
  name: Scalars['String']['input'];
};


export type StatisticsCompleteGenomesByYearForSourceCsvArgs = {
  filters?: InputMaybe<Array<FilterItem>>;
  name: Scalars['String']['input'];
};


export type StatisticsDatasetArgs = {
  name: Scalars['String']['input'];
};


export type StatisticsSpeciesArgs = {
  canonicalName: Scalars['String']['input'];
};


export type StatisticsTaxonBreakdownArgs = {
  includeRanks: Array<TaxonomicRank>;
  taxonCanonicalName: Scalars['String']['input'];
  taxonRank: TaxonomicRank;
};


export type StatisticsTaxonomicRanksArgs = {
  ranks: Array<TaxonomicRank>;
  taxonCanonicalName: Scalars['String']['input'];
  taxonRank: TaxonomicRank;
};


export type StatisticsTaxonomicRanksCsvArgs = {
  ranks: Array<TaxonomicRank>;
  taxonCanonicalName: Scalars['String']['input'];
  taxonRank: TaxonomicRank;
};

export type StringValue = {
  __typename?: 'StringValue';
  label: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Subsample = {
  __typename?: 'Subsample';
  cellLine?: Maybe<Scalars['String']['output']>;
  cellType?: Maybe<Scalars['String']['output']>;
  cloneName?: Maybe<Scalars['String']['output']>;
  cultureMedia?: Maybe<Scalars['String']['output']>;
  cultureMethod?: Maybe<Scalars['String']['output']>;
  custodian?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  eventDate?: Maybe<Scalars['NaiveDate']['output']>;
  eventTime?: Maybe<Scalars['NaiveTime']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  institutionName?: Maybe<Scalars['String']['output']>;
  labHost?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  preservationDuration?: Maybe<Scalars['String']['output']>;
  preservationMethod?: Maybe<Scalars['String']['output']>;
  preservationTemperature?: Maybe<Scalars['String']['output']>;
  publication?: Maybe<Publication>;
  quality?: Maybe<Scalars['String']['output']>;
  samplePooling?: Maybe<Scalars['String']['output']>;
  sampleProcessing?: Maybe<Scalars['String']['output']>;
  sampleType?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  subsampleId: Scalars['String']['output'];
  weightOrVolume?: Maybe<Scalars['String']['output']>;
};

export type SubsampleBy = {
  id?: InputMaybe<Scalars['String']['input']>;
  recordId?: InputMaybe<Scalars['String']['input']>;
  specimenRecordId?: InputMaybe<Scalars['String']['input']>;
};

export type Synonym = {
  __typename?: 'Synonym';
  authorship?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  scientificName: Scalars['String']['output'];
};

export type Taxa = {
  __typename?: 'Taxa';
  filterOptions: FilterOptions;
  records: Array<Taxon>;
};

/** Available filters when retrieving taxa. */
export type TaxaFilter = {
  canonicalName?: InputMaybe<Scalars['String']['input']>;
  hasData?: InputMaybe<DataType>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  vernacularGroup?: InputMaybe<Scalars['String']['input']>;
};

export type Taxon = {
  __typename?: 'Taxon';
  authorship?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  citation?: Maybe<Scalars['String']['output']>;
  datasetId: Scalars['UUID']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  hierarchy: Array<TaxonNode>;
  nomenclaturalActs: Array<NomenclaturalAct>;
  nomenclaturalCode: Scalars['String']['output'];
  rank: TaxonomicRank;
  scientificName: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  species: SpeciesCardPage;
  speciesCsv: Scalars['String']['output'];
  speciesGenomesSummary: Array<DataBreakdown>;
  speciesGenomesSummaryCsv: Scalars['String']['output'];
  speciesGenomicDataSummary: Array<DataBreakdown>;
  speciesGenomicDataSummaryCsv: Scalars['String']['output'];
  status: TaxonomicStatus;
  summary: RankSummary;
  summaryCsv: Scalars['String']['output'];
  taxonomicActs: Array<TaxonomicAct>;
  typeSpecimens: Array<TypeSpecimen>;
};


export type TaxonSpeciesArgs = {
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sort?: InputMaybe<SpeciesSort>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type TaxonSummaryArgs = {
  rank: TaxonomicRank;
};


export type TaxonSummaryCsvArgs = {
  rank: TaxonomicRank;
};

export type TaxonAtom = TaxonAtomRank | TaxonAtomStatus | TaxonAtomText;

export type TaxonAtomRank = {
  __typename?: 'TaxonAtomRank';
  type: TaxonAtomRankType;
  value: TaxonomicRank;
};

export type TaxonAtomRankType =
  | 'TAXONOMIC_RANK_TYPE';

export type TaxonAtomStatus = {
  __typename?: 'TaxonAtomStatus';
  type: TaxonAtomStatusType;
  value: TaxonomicStatus;
};

export type TaxonAtomStatusType =
  | 'TAXONOMIC_STATUS_TYPE';

export type TaxonAtomText = {
  __typename?: 'TaxonAtomText';
  type: TaxonAtomTextType;
  value: Scalars['String']['output'];
};

export type TaxonAtomTextType =
  | 'ACCEPTED_NAME_USAGE'
  | 'ACCEPTED_NAME_USAGE_ID'
  | 'AUTHORSHIP'
  | 'CANONICAL_NAME'
  | 'CITATION'
  | 'DATASET_ID'
  | 'EMPTY'
  | 'ENTITY_ID'
  | 'LAST_UPDATED'
  | 'NAME_PUBLISHED_IN'
  | 'NAME_PUBLISHED_IN_URL'
  | 'NAME_PUBLISHED_IN_YEAR'
  | 'NOMENCLATURAL_CODE'
  | 'NOMENCLATURAL_STATUS'
  | 'PARENT_NAME_USAGE'
  | 'PARENT_NAME_USAGE_ID'
  | 'PARENT_TAXON'
  | 'REFERENCES'
  | 'SCIENTIFIC_NAME'
  | 'TAXONOMIC_RANK'
  | 'TAXONOMIC_STATUS'
  | 'TAXON_ID';

export type TaxonBy = {
  classification?: InputMaybe<TaxonByClassification>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};

export type TaxonByClassification = {
  canonicalName: Scalars['String']['input'];
  datasetId: Scalars['UUID']['input'];
  rank: TaxonRank;
};

export type TaxonDetails = {
  __typename?: 'TaxonDetails';
  authorship?: Maybe<Scalars['String']['output']>;
  canonicalName: Scalars['String']['output'];
  citation?: Maybe<Scalars['String']['output']>;
  datasetId: Scalars['UUID']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  nomenclaturalCode: Scalars['String']['output'];
  rank: TaxonomicRank;
  scientificName: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  status: TaxonomicStatus;
};

export type TaxonItem = {
  __typename?: 'TaxonItem';
  canonicalName?: Maybe<Scalars['String']['output']>;
  classification: Classification;
  commonNames: Array<Scalars['String']['output']>;
  dataSummary: DataSummary;
  rank?: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  subspecies: Array<Scalars['String']['output']>;
  synonyms: Array<Scalars['String']['output']>;
  type: FullTextType;
};

export type TaxonNode = {
  __typename?: 'TaxonNode';
  canonicalName: Scalars['String']['output'];
  depth: Scalars['Int']['output'];
  rank: TaxonomicRank;
  scientificName: Scalars['String']['output'];
};

export type TaxonOperation = {
  __typename?: 'TaxonOperation';
  action: Action;
  atom: TaxonAtom;
  dataset: DatasetDetails;
  datasetVersion: DatasetVersion;
  entityId: Scalars['String']['output'];
  loggedAt: Scalars['DateTime']['output'];
  operationId: Scalars['Int']['output'];
  parentId: Scalars['Int']['output'];
};

export type TaxonRank =
  | 'AGGREGATE_GENERA'
  | 'AGGREGATE_SPECIES'
  | 'BIOVAR'
  | 'CLASS'
  | 'CLASSIS'
  | 'COHORT'
  | 'DIVISION'
  | 'DOMAIN'
  | 'EPIFAMILY'
  | 'FAMILIA'
  | 'FAMILY'
  | 'FORMA'
  | 'GENUS'
  | 'GIGACLASS'
  | 'HIGHER_TAXON'
  | 'HYPORDER'
  | 'INCERTAE_SEDIS'
  | 'INFRACLASS'
  | 'INFRAGENUS'
  | 'INFRAKINGDOM'
  | 'INFRAORDER'
  | 'INFRAPHYLUM'
  | 'INFRASPECIES'
  | 'KINGDOM'
  | 'MEGACLASS'
  | 'MINORDER'
  | 'MUTATIO'
  | 'NATIO'
  | 'NOTHOVARIETAS'
  | 'ORDER'
  | 'ORDO'
  | 'PARVORDER'
  | 'PARVPHYLUM'
  | 'PATHOVAR'
  | 'PHYLUM'
  | 'REGIO'
  | 'REGNUM'
  | 'SECTIO'
  | 'SECTION'
  | 'SERIES'
  | 'SEROVAR'
  | 'SPECIAL_FORM'
  | 'SPECIES'
  | 'SUBCLASS'
  | 'SUBCLASSIS'
  | 'SUBCOHORT'
  | 'SUBDIVISION'
  | 'SUBFAMILIA'
  | 'SUBFAMILY'
  | 'SUBFORMA'
  | 'SUBGENUS'
  | 'SUBKINGDOM'
  | 'SUBORDER'
  | 'SUBORDO'
  | 'SUBPHYLUM'
  | 'SUBSECTIO'
  | 'SUBSECTION'
  | 'SUBSERIES'
  | 'SUBSPECIES'
  | 'SUBTERCLASS'
  | 'SUBTRIBE'
  | 'SUBVARIETAS'
  | 'SUBVARIETY'
  | 'SUPERCLASS'
  | 'SUPERCOHORT'
  | 'SUPERFAMILY'
  | 'SUPERKINGDOM'
  | 'SUPERORDER'
  | 'SUPERORDO'
  | 'SUPERPHYLUM'
  | 'SUPERSPECIES'
  | 'SUPERTRIBE'
  | 'TRIBE'
  | 'UNRANKED'
  | 'VARIETAS'
  | 'VARIETY';

export type TaxonTreeNodeStatistics = {
  __typename?: 'TaxonTreeNodeStatistics';
  /** The total amount of chromosomes for all species under this taxon */
  assemblyChromosomes?: Maybe<Scalars['Int']['output']>;
  assemblyChromosomesCoverage: Scalars['Int']['output'];
  /** The total amount of contigs for all species under this taxon */
  assemblyContigs?: Maybe<Scalars['Int']['output']>;
  assemblyContigsCoverage: Scalars['Int']['output'];
  /** The total amount of scaffolds for all species under this taxon */
  assemblyScaffolds?: Maybe<Scalars['Int']['output']>;
  assemblyScaffoldsCoverage: Scalars['Int']['output'];
  /** The canonical name of the taxon */
  canonicalName: Scalars['String']['output'];
  /** The taxa that fall below this taxon rank */
  children: Array<TaxonTreeNodeStatistics>;
  /** The total amount of complete genomes for all species under this taxon */
  completeGenomes?: Maybe<Scalars['Int']['output']>;
  completeGenomesCoverage: Scalars['Int']['output'];
  /** The total amount of full genomes for all species under this taxon */
  fullGenomes?: Maybe<Scalars['Int']['output']>;
  fullGenomesCoverage: Scalars['Int']['output'];
  /** The total amount of genomes available */
  genomes?: Maybe<Scalars['Int']['output']>;
  /** The total amount of loci available */
  loci?: Maybe<Scalars['Int']['output']>;
  /** The total amount of data related to the taxon */
  other?: Maybe<Scalars['Int']['output']>;
  /** The total amount of partial genomes for all species under this taxon */
  partialGenomes?: Maybe<Scalars['Int']['output']>;
  partialGenomesCoverage: Scalars['Int']['output'];
  /** The taxonomic rank */
  rank: TaxonomicRank;
  /** The scientific name of the taxon */
  scientificName: Scalars['String']['output'];
  /** The total amount of species belonging to the taxon */
  species?: Maybe<Scalars['Int']['output']>;
  /** The total amount of specimens available */
  specimens?: Maybe<Scalars['Int']['output']>;
  /** The total amount of genomic data */
  totalGenomic?: Maybe<Scalars['Int']['output']>;
};

export type TaxonomicAct = {
  __typename?: 'TaxonomicAct';
  acceptedTaxon?: Maybe<TaxonDetails>;
  dataCreatedAt?: Maybe<Scalars['DateTime']['output']>;
  dataUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  entityId: Scalars['String']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  taxon: TaxonDetails;
};

export type TaxonomicRank =
  | 'AGGREGATE_GENERA'
  | 'AGGREGATE_SPECIES'
  | 'BIOVAR'
  | 'CLASS'
  | 'CLASSIS'
  | 'COHORT'
  | 'DIVISION'
  | 'DOMAIN'
  | 'EPIFAMILY'
  | 'FAMILIA'
  | 'FAMILY'
  | 'FORMA'
  | 'GENUS'
  | 'GIGACLASS'
  | 'HIGHER_TAXON'
  | 'HYPORDER'
  | 'INCERTAE_SEDIS'
  | 'INFRACLASS'
  | 'INFRAGENUS'
  | 'INFRAKINGDOM'
  | 'INFRAORDER'
  | 'INFRAPHYLUM'
  | 'INFRASPECIES'
  | 'KINGDOM'
  | 'MEGACLASS'
  | 'MINORDER'
  | 'MUTATIO'
  | 'NATIO'
  | 'NOTHOVARIETAS'
  | 'ORDER'
  | 'ORDO'
  | 'PARVORDER'
  | 'PARVPHYLUM'
  | 'PATHOVAR'
  | 'PHYLUM'
  | 'REGIO'
  | 'REGNUM'
  | 'SECTIO'
  | 'SECTION'
  | 'SERIES'
  | 'SEROVAR'
  | 'SPECIAL_FORM'
  | 'SPECIES'
  | 'SUBCLASS'
  | 'SUBCLASSIS'
  | 'SUBCOHORT'
  | 'SUBDIVISION'
  | 'SUBFAMILIA'
  | 'SUBFAMILY'
  | 'SUBFORMA'
  | 'SUBGENUS'
  | 'SUBKINGDOM'
  | 'SUBORDER'
  | 'SUBORDO'
  | 'SUBPHYLUM'
  | 'SUBSECTIO'
  | 'SUBSECTION'
  | 'SUBSERIES'
  | 'SUBSPECIES'
  | 'SUBTERCLASS'
  | 'SUBTRIBE'
  | 'SUBVARIETAS'
  | 'SUBVARIETY'
  | 'SUPERCLASS'
  | 'SUPERCOHORT'
  | 'SUPERFAMILY'
  | 'SUPERKINGDOM'
  | 'SUPERORDER'
  | 'SUPERORDO'
  | 'SUPERPHYLUM'
  | 'SUPERSPECIES'
  | 'SUPERTRIBE'
  | 'TRIBE'
  | 'UNRANKED'
  | 'VARIETAS'
  | 'VARIETY';

export type TaxonomicRankStatistic = {
  __typename?: 'TaxonomicRankStatistic';
  atLeastOne: Scalars['Int']['output'];
  children: Scalars['Int']['output'];
  coverage: Scalars['Float']['output'];
  rank: TaxonomicRank;
};

export type TaxonomicStatus =
  | 'ACCEPTED'
  | 'ALTERNATIVE_NAME'
  | 'BASIONYM'
  | 'DOUBTFUL_MISAPPLIED'
  | 'DOUBTFUL_PRO_PARTE_MISAPPLIED'
  | 'DOUBTFUL_PRO_PARTE_TAXONOMIC_SYNONYM'
  | 'DOUBTFUL_TAXONOMIC_SYNONYM'
  | 'EXCLUDED'
  | 'HOMONYM'
  | 'HYBRID'
  | 'INCORRECT_GRAMMATICAL_AGREEMENT_OF_SPECIFIC_EPITHET'
  | 'INFORMAL'
  | 'INTERIM_UNPUBLISHED'
  | 'MANUSCRIPT_NAME'
  | 'MISAPPLIED'
  | 'MISSPELLED'
  | 'NOMENCLATURAL_SYNONYM'
  | 'NOMEN_DUBIUM'
  | 'NOMEN_NUDUM'
  | 'NOMEN_OBLITUM'
  | 'ORTHOGRAPHIC_VARIANT'
  | 'PLACEHOLDER'
  | 'PRO_PARTE_MISAPPLIED'
  | 'PRO_PARTE_TAXONOMIC_SYNONYM'
  | 'REPLACED_SYNONYM'
  | 'SPECIES_INQUIRENDA'
  | 'SUPERSEDED_COMBINATION'
  | 'SUPERSEDED_RANK'
  | 'SYNONYM'
  | 'TAXONOMIC_SYNONYM'
  | 'TAXON_INQUIRENDUM'
  | 'UNACCEPTED'
  | 'UNASSESSED'
  | 'UNAVAILABLE'
  | 'UNCERTAIN'
  | 'UNDESCRIBED'
  | 'UNJUSTIFIED_EMENDATION';

export type TaxonomicVernacularGroup =
  | 'ANIMALS'
  | 'BACTERIA'
  | 'BIRDS'
  | 'BROWN_ALGAE'
  | 'CHROMISTS'
  | 'CONIFERS_AND_CYCADS'
  | 'CORALS_AND_JELLYFISHES'
  | 'CRUSTACEANS'
  | 'CYANOBACTERIA'
  | 'DIATOMS'
  | 'ECHINODERMS'
  | 'FERNS'
  | 'FIN_FISHES'
  | 'FLOWERING_PLANTS'
  | 'FROGS_AND_OTHER_AMPHIBIANS'
  | 'FUNGI'
  | 'GREEN_ALGAE'
  | 'HIGHER_PLANTS'
  | 'HORNWORTS'
  | 'INSECTS'
  | 'LIVERWORTS'
  | 'MAMMALS'
  | 'MOLLUSCS'
  | 'MOSSES'
  | 'PROTISTS_AND_OTHER_UNICELLULAR_ORGANISMS'
  | 'RED_ALGAE'
  | 'REPTILES'
  | 'SHARKS_AND_RAYS'
  | 'SPIDERS'
  | 'SPONGES';

/** Taxonomic information of a species. */
export type Taxonomy = {
  __typename?: 'Taxonomy';
  attributes?: Maybe<Scalars['JSON']['output']>;
  /** The authors of the scientific name */
  authorship?: Maybe<Scalars['String']['output']>;
  /** The species name without authors */
  canonicalName: Scalars['String']['output'];
  citation?: Maybe<Scalars['String']['output']>;
  nomenclaturalCode: Scalars['String']['output'];
  rank: TaxonomicRank;
  /** The species scientific name */
  scientificName: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  /** The taxonomic status of the species */
  status: TaxonomicStatus;
  /** Renamed taxonomy for the same species */
  synonyms: Array<Taxonomy>;
  traits?: Maybe<Array<Scalars['String']['output']>>;
  vernacularGroup?: Maybe<TaxonomicVernacularGroup>;
};

export type Tissue = {
  __typename?: 'Tissue';
  custodian?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  fixation?: Maybe<Scalars['String']['output']>;
  identificationVerified?: Maybe<Scalars['Boolean']['output']>;
  institution?: Maybe<Scalars['String']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  materialSampleId: Scalars['String']['output'];
  publication?: Maybe<Publication>;
  referenceMaterial?: Maybe<Scalars['Boolean']['output']>;
  samplingProtocol?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  storage?: Maybe<Scalars['String']['output']>;
  tissueId: Scalars['String']['output'];
  tissueType?: Maybe<Scalars['String']['output']>;
};

export type TissueDetails = {
  __typename?: 'TissueDetails';
  custodian?: Maybe<Scalars['String']['output']>;
  disposition?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['String']['output'];
  fixation?: Maybe<Scalars['String']['output']>;
  identificationVerified?: Maybe<Scalars['Boolean']['output']>;
  institution?: Maybe<Scalars['String']['output']>;
  institutionCode?: Maybe<Scalars['String']['output']>;
  materialSampleId: Scalars['String']['output'];
  referenceMaterial?: Maybe<Scalars['Boolean']['output']>;
  samplingProtocol?: Maybe<Scalars['String']['output']>;
  specimenId: Scalars['String']['output'];
  storage?: Maybe<Scalars['String']['output']>;
  tissueId: Scalars['String']['output'];
  tissueType?: Maybe<Scalars['String']['output']>;
};

export type TraceData = {
  __typename?: 'TraceData';
  accession?: Maybe<Scalars['String']['output']>;
  traceId?: Maybe<Scalars['String']['output']>;
  traceLink?: Maybe<Scalars['String']['output']>;
  traceName?: Maybe<Scalars['String']['output']>;
};

export type TypeSpecimen = {
  __typename?: 'TypeSpecimen';
  accession: AccessionEvent;
  collection: CollectionEvent;
  name: NameDetails;
};

/** Common vernacular names for a specific species */
export type VernacularName = {
  __typename?: 'VernacularName';
  citation?: Maybe<Scalars['String']['output']>;
  datasetId: Scalars['UUID']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  vernacularName: Scalars['String']['output'];
};

export type WholeGenome = {
  __typename?: 'WholeGenome';
  accession?: Maybe<Scalars['String']['output']>;
  annotatedBy?: Maybe<Scalars['String']['output']>;
  assembledBy?: Maybe<Scalars['String']['output']>;
  assemblyType?: Maybe<Scalars['String']['output']>;
  dataType?: Maybe<Scalars['String']['output']>;
  datasetName: Scalars['String']['output'];
  depositedBy?: Maybe<Scalars['String']['output']>;
  dnaExtractId: Scalars['String']['output'];
  estimatedSize?: Maybe<Scalars['String']['output']>;
  excludedFromRefseq?: Maybe<Scalars['String']['output']>;
  genomeSize?: Maybe<Scalars['Int']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  materialSampleId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  recordId: Scalars['String']['output'];
  releaseDate?: Maybe<Scalars['String']['output']>;
  releaseType?: Maybe<Scalars['String']['output']>;
  representation?: Maybe<Scalars['String']['output']>;
  sequenceId: Scalars['UUID']['output'];
  sequencedBy?: Maybe<Scalars['String']['output']>;
  versionStatus?: Maybe<Scalars['String']['output']>;
};

/** An all purpose filter to apply to queries for whole genomes. */
export type WholeGenomeFilterItem = {
  action: FilterAction;
  filter: WholeGenomeFilterType;
  value: Scalars['String']['input'];
};

export type WholeGenomeFilterType =
  | 'ASSEMBLY_LEVEL'
  | 'GENOME_REPRESENTATION'
  | 'RELEASE_TYPE';

export type WholeGenomePage = {
  __typename?: 'WholeGenomePage';
  records: Array<WholeGenome>;
  total: Scalars['Int']['output'];
};

export type YearValue = {
  __typename?: 'YearValue';
  value: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};
