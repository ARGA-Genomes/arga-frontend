import { GroupItem } from "./all";

export const phenotypic: GroupItem[] = [
  {
    category: "Medicinal and Bioactive",
    image: "/icons/list-group/List group_ medicinal and bioactive.svg",
    source: "ARGA Useful Species", // TODO: MISSING
    filter: {
      name: "is_medicinal_and_bioactive_icon",
      value: true,
    },
  },
  {
    category: "Crop Wild Relatives",
    image: "/icons/list-group/List group_ crop wild relative.svg",
    source: "ARGA Crop Wild Relatives",
  },
];
