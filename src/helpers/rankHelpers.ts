import { Taxon } from "@/generated/types";

export type RankMap = Record<string, string>;

// Latin → Normal (singular)
const latinToNormal: RankMap = {
  // existing
  regnum: "Kingdom",
  familia: "Family",
  classis: "Class",
  ordo: "Order",
  varietas: "Variety",
  forma: "Form",
  subforma: "Subform",
  subclassis: "Subclass",
  superordo: "Superorder",
  sectio: "Section",
  subsectio: "Subsection",
  nothovarietas: "Nothovariety",
  subvarietas: "Subvariety",
  series: "Series",
  subseries: "Subseries",
  superspecies: "Superspecies",
  infraspecies: "Infraspecies",
  subfamilia: "Subfamily",
  subordo: "Suborder",
  regio: "Region",

  // added from childRankMap coverage
  division: "Phylum",
  subdivision: "Subphylum",
  superclassis: "Superclass",
  infraordo: "Infraorder",
  superfamilia: "Superfamily",
  tribus: "Tribe",
  subtribus: "Subtribe",
  supertribus: "Supertribe",
  genus: "Genus",
  subgenus: "Subgenus",
  species: "Species",
  subspecies: "Subspecies",
  "incertae sedis": "Incertae sedis",
  cohors: "Cohort",
  "forma specialis": "Special form",
};

// Latin → Latin (plural label)
const latinPlural: RankMap = {
  // existing
  regnum: "Regna",
  familia: "Familiae",
  classis: "Classes",
  ordo: "Ordines",
  varietas: "Varietates",
  forma: "Formae",
  subforma: "Subformae",
  subclassis: "Subclasses",
  superordo: "Superordines",
  sectio: "Sectiones",
  subsectio: "Subsectiones",
  nothovarietas: "Nothovarietates",
  subvarietas: "Subvarietates",
  series: "Series",
  subseries: "Subseries",
  superspecies: "Superspecies",
  infraspecies: "Infraspecies",
  subfamilia: "Subfamiliae",
  subordo: "Subordines",
  regio: "Regiones",

  // added from childRankMap coverage
  division: "Divisiones",
  subdivision: "Subdivisiones",
  superclassis: "Superclasses",
  infraordo: "Infraordines",
  superfamilia: "Superfamiliae",
  tribus: "Tribus",
  subtribus: "Subtribus",
  supertribus: "Supertribus",
  genus: "Genera",
  subgenus: "Subgenera",
  species: "Species",
  subspecies: "Subspecies",
  cohors: "Cohortes",
  "forma specialis": "Formae speciales",
  "incertae sedis": "Incertae sedis",
};

// Normal → Latin (singular)
const normalToLatin: RankMap = {
  // existing
  kingdom: "Regnum",
  family: "Familia",
  class: "Classis",
  order: "Ordo",
  variety: "Varietas",
  form: "Forma",
  subform: "Subforma",
  subclass: "Subclassis",
  superorder: "Superordo",
  section: "Sectio",
  subsection: "Subsectio",
  nothovariety: "Nothovarietas",
  subvariety: "Subvarietas",
  series: "Series",
  subseries: "Subseries",
  superspecies: "Superspecies",
  infraspecies: "Infraspecies",
  subfamily: "Subfamilia",
  suborder: "Subordo",
  region: "Regio",

  // added from childRankMap coverage
  domain: "Regio",
  superkingdom: "Superregnum",
  subkingdom: "Subregnum",
  phylum: "Division",
  subphylum: "Subdivision",
  superclass: "Superclassis",
  infraclass: "Infraclassis",
  infraorder: "Infraordo",
  superfamily: "Superfamilia",
  tribe: "Tribus",
  subtribe: "Subtribus",
  supertribe: "Supertribus",
  genus: "Genus",
  subgenus: "Subgenus",
  species: "Species",
  subspecies: "Subspecies",
  cohort: "Cohors",
  "special form": "Forma specialis",
  "higher taxon": "Taxon superius",
  "aggregate genera": "Genera aggregata",
  "aggregate species": "Species aggregata",
  "incertae sedis": "Incertae sedis",
  unranked: "Unranked",
};

// Normal → Normal (plural label)
const normalPlural: RankMap = {
  // existing
  kingdom: "Kingdoms",
  family: "Families",
  class: "Classes",
  order: "Orders",
  variety: "Varieties",
  form: "Forms",
  subform: "Subforms",
  subclass: "Subclasses",
  superorder: "Superorders",
  section: "Sections",
  subsection: "Subsections",
  nothovariety: "Nothovarieties",
  subvariety: "Subvarieties",
  series: "Series",
  subseries: "Subseries",
  superspecies: "Superspecies",
  infraspecies: "Infraspecies",
  subfamily: "Subfamilies",
  suborder: "Suborders",
  region: "Regions",

  // added from childRankMap coverage
  domain: "Domains",
  superkingdom: "Superkingdoms",
  subkingdom: "Subkingdoms",
  phylum: "Phyla",
  subphylum: "Subphyla",
  superclass: "Superclasses",
  infraclass: "Infraclasses",
  infraorder: "Infraorders",
  superfamily: "Superfamilies",
  tribe: "Tribes",
  subtribe: "Subtribes",
  supertribe: "Supertribes",
  genus: "Genera",
  subgenus: "Subgenera",
  species: "Species",
  subspecies: "Subspecies",
  cohort: "Cohorts",
  "special form:": "Special forms",
  "higher taxon": "Higher taxa",
  "aggregate genera": "Aggregate genera",
  "aggregate species": "Aggregate species",
  "incertae sedis": "Incertae sedis",
  unranked: "Unranked",
};

const childRankMap: RankMap = {
  domain: "kingdom",
  superkingdom: "kingdom",
  kingdom: "phylum",
  subkingdom: "phylum",
  phylum: "class",
  subphylum: "class",
  superclass: "class",
  class: "order",
  subclass: "order",
  infraclass: "order",
  superorder: "order",
  order: "family",
  suborder: "family",
  infraorder: "family",
  superfamily: "family",
  family: "genus",
  subfamily: "genus",
  supertribe: "genus",
  tribe: "genus",
  subtribe: "genus",
  genus: "species",
  subgenus: "species",
  species: "subspecies",
  subspecies: "subspecies",

  unranked: "unranked",
  highertaxon: "higher taxon",

  aggregategenera: "aggregate genera",
  aggregatespecies: "aggregate species",
  incertaesedis: "incertae sedis",

  regnum: "division",
  division: "classis",
  subdivision: "classis",
  classis: "ordo",
  subclassis: "ordo",
  superordo: "ordo",
  ordo: "familia",
  subordo: "familia",
  cohort: "familia",
  familia: "genus",
  subfamilia: "genus",
  section: "species",
  sectio: "species",
  series: "species",
  varietas: "subvarietas",
  subvarietas: "subvarietas",
  forma: "forma",

  nothovarietas: "nothovarietas",
  infraspecies: "infraspecies",
  regio: "regio",
  specialform: "special form",
};

// Helper function to normalize rank names
export function normalizeLatinRank(rank: string) {
  return latinToNormal[rank.toLowerCase()] || rank;
}

export function pluralizeLatinRank(rank: string) {
  return latinPlural[rank.toLowerCase()] || rank;
}

export function latinilizeNormalRank(rank: string) {
  return normalToLatin[rank.toLowerCase()] || rank;
}

export function pluralizeRank(rank: string) {
  return { ...normalPlural, ...latinPlural }[rank.toLowerCase()] || rank;
}

export function getChildRank(rank: string) {
  return childRankMap[rank.toLowerCase()] || "";
}

export function isLatin(taxon: Taxon) {
  // Check the immediate kingdom name
  if ((taxon.rank === "KINGDOM" || taxon.rank === "REGNUM") && ["Plantae", "Fungi"].includes(taxon.canonicalName)) {
    return true;
  }

  // Check whether the Plantae/Fungi exist in the hierarchy
  return (
    taxon.hierarchy.findIndex(
      (node) =>
        (node.rank === "KINGDOM" || taxon.rank === "REGNUM") && ["Plantae", "Fungi"].includes(node.canonicalName)
    ) !== -1
  );
}
