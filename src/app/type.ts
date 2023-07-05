type Taxonomy = {
    canonicalName: string,
    authorship: string,

    kingdom?: string,
    phylum?: string,
    class?: string,
    order?: string,
    family?: string,
    genus?: string,
    vernacularGroup?: string,
};

type Photo = {
    url: string,
    referenceUrl: string,
    publisher: string,
    license: string,
    rightsHolder: string,
}

type Distribution = {
    locality: string,
    threatStatus: string,
    source: string,
};

type Region = {
    name: string,
}

type GenomicData = {
    canonicalName: string,
    type: string,
    dataResource: string,
    recordedBy: string[],
    license: string,
    provenance: string,
    eventDate: string,
    accession: string,
    accessionUri: string,
    refseqCategory: string,
    coordinates: Coordinates,
    associatedSequences: AssociatedSequences
}

type WholeGenome = GenomicData & {
    occurrenceYear?: string[],
    otherCatalogNumbers?: string[],
    ncbiNuccore?: string,
    ncbiBioproject?: string,
    ncbiBiosample?: string,
    mixs0000005?: string,
    mixs0000029?: string,
    mixs0000026?: string,
    pairedAsmComp?: string,
    rawRecordedBy?: string,
    ncbiReleaseType?: string,
}

type AssemblyStats = {
    id: string,
    componentCount?: number,
    contigCount?: number,
    contigL50?: number,
    contigN50?: number,
    gcPerc?: number,
    moleculeCount?: number,
    regionCount?: number,
    scaffoldCount?: number,
    scaffoldL50?: number,
    scaffoldN50?: number,
    scaffoldN75?: number,
    scaffoldN90?: number,
    totalLength?: number,
    topLevelCount?: number,
    totalGapLength?: number,
    spannedGaps?: number,
    unspannedGaps?: number,
}

type BioSample = {
    id: string,
    accession: string,
    sra?: string,
    submissionDate?: string,
    publicationDate?: string,
    lastUpdate?: string,
    title?: string,
    owner?: string,
    attributes?: BioSampleAttribute[],
}

type BioSampleAttribute = {
    name: string,
    harmonized_name: string,
    value: string,
}

type Assembly = {
    id: string,
    accession: string,
    nuccore: string,
    refseqCategory: string,
    specificHost: string,
    cloneStrain: string,
    versionStatus: string,
    contamScreenInput: string,
    releaseType: string,
    genomeRep: string,
    gbrsPairedAsm: string,
    pairedAsmComp: string,
    excludedFromRefseq: string,
    relationToTypeMaterial: string,
    asmNotLiveDate: string,
    otherCatalogNumbers: string,
    recordedBy: string,
    geneticAccessionUri: string,
    eventDate: string,
}

type AssociatedSequences = {
    sequenceID: string,
    genbankAccession: string,
    markercode: string,
    nucleotides: string
}

type Coordinates = {
    latitude: number,
    longitude: number,
}

type Regions = {
    ibra: Region[],
    imcra: Region[],
}

type Conservation = {
    status: string,
    state?: string,
    source?: string,
}

type Species = {
    taxonomy: Taxonomy,
    photos: Photo[],
    conservation: Conservation[],
    distribution: Distribution[],
    regions: Regions,
    data: GenomicData[],
    wholeGenomes: WholeGenome[],
    traceFiles: TraceFile[],
};

type Specimen = {
    id: string,
    typeStatus: string,
    institutionName?: string,
    institutionCode?: string,
    collectionCode?: string,
    catalogNumber?: string,
    recordedBy?: string,
    organismId?: string,
    locality?: string,
    latitude?: number,
    longitude?: number,
    details?: string,
    remarks?: string,
}

type StatsSpecies = {
    total: number,
    wholeGenomes: number,
    mitogenomes: number,
    barcodes: number,
}

type TraceFile = {
    id: string,
    metadata: any,
}

type QueryResults = {
    species: Species,
};

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
};
