/*
	GraphQL filter types/interfaces
*/

export enum FilterType {
  VernacularGroup = "VERNACULAR_GROUP",
  HasData = "HAS_DATA",
  Attribute = "ATTRIBUTE",
  Domain = "DOMAIN",
  Superkingdom = "SUPERKINGDOM",
  Kingdom = "KINGDOM",
  Subkingdom = "SUBKINGDOM",
  Phylum = "PHYLUM",
  Subphylum = "SUBPHYLUM",
  Superclass = "SUPERCLASS",
  Class = "CLASS",
  Subclass = "SUBCLASS",
  Superorder = "SUPERORDER",
  Order = "ORDER",
  Suborder = "SUBORDER",
  Hyporder = "HYPORDER",
  Superfamily = "SUPERFAMILY",
  Family = "FAMILY",
  Subfamily = "SUBFAMILY",
  Supertribe = "SUPERTRIBE",
  Tribe = "TRIBE",
  Subtribe = "SUBTRIBE",
  Genus = "GENUS",
  Subgenus = "SUBGENUS",
  Cohort = "COHORT",
  Subcohort = "SUBCOHORT",
  Division = "DIVISION",
  Section = "SECTION",
  Subdivision = "SUBDIVISION",
  Regnum = "REGNUM",
  Familia = "FAMILIA",
  Classis = "CLASSIS",
  Ordo = "ORDO",
  Forma = "FORMA",
  Subclassis = "SUBCLASSIS",
  Superordo = "SUPERORDO",
  Sectio = "SECTIO",
  Series = "SERIES",
  Subfamilia = "SUBFAMILIA",
  Subordo = "SUBORDO",
  Regio = "REGIO",
}

export type FilterAction = "INCLUDE" | "EXCLUDE";

export interface FilterItemAttribute {
  name: string;
  value: string | number | boolean;
}

export interface FilterItem {
  filter: FilterType;
  action: FilterAction;
  value: string | FilterItemAttribute[];
}

/*
	UI filter types/interfaces
*/
export interface DataFilter {
  filter: FilterType;
  label: string;
}
