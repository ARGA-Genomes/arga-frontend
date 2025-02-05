interface Taxonomy {
  scientificName: string;
  canonicalName: string;
  authorship: string;
  status: string;
  rank: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  vernacularGroup?: string;
  vernacularNames: { name: string }[];
  synonyms: { scientificName: string }[];
  source?: string;
  sourceUrl?: string;
}

interface Photo {
  url: string;
  source?: string;
  publisher?: string;
  license?: string;
  rightsHolder?: string;
}

interface Distribution {
  locality: string;
  threatStatus: string;
  source: string;
}

interface Region {
  name: string;
}

interface GenomicData {
  canonicalName: string;
  type: string;
  dataResource: string;
  recordedBy: string[];
  license: string;
  provenance: string;
  eventDate: string;
  accession: string;
  accessionUri: string;
  refseqCategory: string;
  coordinates: Coordinates;
  associatedSequences: AssociatedSequences;
}

type WholeGenome = GenomicData & {
  occurrenceYear?: string[];
  otherCatalogNumbers?: string[];
  ncbiNuccore?: string;
  ncbiBioproject?: string;
  ncbiBiosample?: string;
  mixs0000005?: string;
  mixs0000029?: string;
  mixs0000026?: string;
  pairedAsmComp?: string;
  rawRecordedBy?: string;
  ncbiReleaseType?: string;
};

interface AssemblyStats {
  id: string;
  componentCount?: number;
  contigCount?: number;
  contigL50?: number;
  contigN50?: number;
  gcPerc?: number;
  moleculeCount?: number;
  regionCount?: number;
  scaffoldCount?: number;
  scaffoldL50?: number;
  scaffoldN50?: number;
  scaffoldN75?: number;
  scaffoldN90?: number;
  totalLength?: number;
  topLevelCount?: number;
  totalGapLength?: number;
  spannedGaps?: number;
  unspannedGaps?: number;
}

interface BioSample {
  id: string;
  accession: string;
  sra?: string;
  submissionDate?: string;
  publicationDate?: string;
  lastUpdate?: string;
  title?: string;
  owner?: string;
  attributes?: BioSampleAttribute[];
}

interface BioSampleAttribute {
  name: string;
  harmonized_name: string;
  value: string;
}

interface Assembly {
  id: string;
  accession: string;
  nuccore: string;
  refseqCategory: string;
  specificHost: string;
  cloneStrain: string;
  versionStatus: string;
  contamScreenInput: string;
  releaseType: string;
  genomeRep: string;
  gbrsPairedAsm: string;
  pairedAsmComp: string;
  excludedFromRefseq: string;
  relationToTypeMaterial: string;
  asmNotLiveDate: string;
  otherCatalogNumbers: string;
  recordedBy: string;
  geneticAccessionUri: string;
  eventDate: string;
}

interface AssociatedSequences {
  sequenceID: string;
  genbankAccession: string;
  markercode: string;
  nucleotides: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Regions {
  ibra: Region[];
  imcra: Region[];
}

interface Conservation {
  status: string;
  state?: string;
  source?: string;
}

interface Species {
  taxonomy: Taxonomy;
  photos: Photo[];
  conservation: Conservation[];
  distribution: Distribution[];
  regions: Regions;
  data: GenomicData[];
  wholeGenomes: WholeGenome[];
  traceFiles: TraceFile[];
  specimens?: Specimen[];
  indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[];
}

interface Specimen {
  id: string;
  accession: string;
  typeStatus: string;
  institutionName?: string;
  institutionCode?: string;
  collectionCode?: string;
  catalogNumber?: string;
  recordedBy?: string;
  organismId?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  details?: string;
  remarks?: string;
}

interface Event {
  id: string;
  eventDate: string;
  eventId: string;
  eventRemarks: string;
  fieldNotes: string;
  fieldNumber: string;
  habitat: string;
  samplingEffort: string;
  samplingProtocol: string;
  samplingSizeUnit: string;
  samplingSizeValue: string;

  events: [CollectionEvent | SequencingEvent];
}

interface CollectionEvent {
  __typename: string;
  id: string;
  behavior: string;
  catalogNumber: string;
  degreeOfEstablishment: string;
  establishmentMeans: string;
  individualCount: string;
  lifeStage: string;
  occurrenceStatus: string;
  organismId: string;
  organismQuantity: string;
  organismQuantityType: string;
  otherCatalogNumbers: string;
  pathway: string;
  preparation: string;
  recordNumber: string;
  reproductiveCondition: string;
  sex: string;
}

interface SequencingEvent {
  __typename: string;
  id: string;
  organismId?: string;
  sequenceId?: string;
  genbankAccession?: string;
  targetGene?: string;
  dnaSequence?: string;
  runs: SequencingRunEvent[];
}

interface SequencingRunEvent {
  id: string;
  traceId: string;
  traceName: string;
  traceLink: string;
  sequencingDate: string;
  sequencingCenter: string;
  targetGene: string;
  direction: string;
  pcrPrimerNameForward: string;
  pcrPrimerNameReverse: string;
  sequencePrimerForwardName: string;
  sequencePrimerReverseName: string;
}

interface Marker {
  id: string;
  accession: string;
  basepairs?: number;
  fastaUrl?: string;
  sourceUrl?: string;
  gbAcs?: string;
  markerCode?: string;
  materialSampleId?: string;
  nucleotide?: string;
  recordedBy?: string;
  shape?: string;
  type?: string;
  version?: string;
  extraData?: any;
}

interface SpecimenDetails {
  id: string;
  accession: string;
  typeStatus: string;
  institutionName?: string;
  institutionCode?: string;
  collectionCode?: string;
  catalogNumber?: string;
  recordedBy?: string;
  organismId?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;

  events: Event[];
}

interface StatsSpecies {
  total: number;
  wholeGenomes: number;
  organelles: number;
  barcodes: number;
}

interface TraceFile {
  id: string;
  metadata: any;
}

interface IndigenousEcologicalKnowledge {
  id: string;
  name: string;
  datasetName: string;
  culturalConnection: boolean;
  foodUse: boolean;
  medicinalUse: boolean;
  sourceUrl: string;
}

interface QueryResults {
  species: Species;
}

type CommonGenome = GenomicData | WholeGenome;

export type {
  Taxonomy,
  Photo,
  Distribution,
  Region,
  GenomicData,
  WholeGenome,
  AssemblyStats,
  Regions,
  Species,
  QueryResults,
  Coordinates,
  Specimen,
  StatsSpecies,
  TraceFile,
  CommonGenome,
  Conservation,
  BioSample,
  BioSampleAttribute,
  Assembly,
  SpecimenDetails,
  Event,
  CollectionEvent,
  SequencingEvent,
  SequencingRunEvent,
  Marker,
  IndigenousEcologicalKnowledge,
};

export interface HeaderAndFooterProps {
  links: { link: string; label: string }[];
}

export enum Layer {
  WholeGenome,
  Loci,
  Specimens,
  OtherData,
}
