import { BrowseItem } from "../browse";

export const type: BrowseItem[] = [
  {
    total: "wholeGenomes",
    category: "Genome assemblies",
    image: "/icons/data-type/Data type_ Whole genome.svg",
    link: "/browse/genomes",
  },
  {
    total: "loci",
    category: "Single loci",
    image: "/icons/data-type/Data type_ Markers.svg",
    link: "/browse/loci",
  },
  {
    total: "specimens",
    category: "Specimens",
    image: "/icons/data-type/Data type_ Specimen.svg",
    link: "/browse/specimens",
  },
];
