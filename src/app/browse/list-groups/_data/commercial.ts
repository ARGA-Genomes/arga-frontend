import { GroupItem } from "./all";

export const commercial: GroupItem[] = [
  {
    category: "Agriculture",
    image: "/icons/list-group/List group_ Agriculture.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "commercialSector",
      value: "agriculture",
    },
  },
  {
    category: "Crops and Cereals",
    image: "/icons/list-group/List group_ Cereals and crops.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "agriculturalIndustry",
      value: "agriculture",
    },
  },
  {
    category: "Horticulture",
    image: "/icons/list-group/List group_ Horticultural crops.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "agriculturalIndustry",
      value: "horticultural crop",
    },
  },
  {
    category: "Livestock",
    image: "/icons/list-group/List group_ Livestock.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "agriculturalIndustry",
      value: "livestock",
    },
  },
  {
    category: "Aquaculture",
    image: "/icons/list-group/List group_ Aquaculture.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "commercialSector",
      value: "aquaculture",
    },
  },
  {
    category: "Commercial Fishing",
    image: "/icons/list-group/List group_ Commercial and trade fishes.svg",
    source: "ARGA Commercial Species",
    filter: {
      name: "commercialAndTradeFisheries",
      value: "commercial and trade fisheries",
    },
  },
  {
    category: "Managed Fisheries",
    image: "/icons/list-group/List group_ Managed fisheries.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "managedFisheries",
      value: "managed fisheries",
    },
  },
  {
    category: "Forestry and Timber",
    image: "/icons/list-group/List group_ Forestry timber and textiles.svg",
    source: "ARGA Commercial Species",
    disabled: true,
    filter: {
      name: "agriculturalIndustry",
      value: "forestry",
    },
  },
];
