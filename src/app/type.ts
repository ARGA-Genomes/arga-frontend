type Taxonomy = {
    canonicalName: string,
    authorship: string,

    kingdom: string,
    phylum: string,
    class: string,
    order: string,
    family: string,
    genus: string,
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
    coordinates: Coordinates
}

type Coordinates = {
    latitude: number,
    longitude: number,
}

type Regions = {
    ibra: Region[],
    imcra: Region[],
}

type Species = {
    taxonomy: Taxonomy,
    photos: Photo[],
    distribution: Distribution[],
    regions: Regions,
    data: GenomicData[],
};

type QueryResults = {
    species: Species,
};

export type {
    Taxonomy,
    Photo,
    Distribution,
    Region,
    GenomicData,
    Regions,
    Species,
    QueryResults,
    Coordinates
};
