import { GroupItem } from "./all";

export const other: GroupItem[] = [
  {
    category: "Native Species",
    image: "/icons/list-group/List group_ native.svg",
    source: "ARGA Native Species",
  },
  {
    category: "Migratory Species",
    image: "/icons/list-group/List group_ migratory species.svg",
    source: "ARGA Migratory Species",
  },
  {
    category: "Invasives and Pests",
    image: "/icons/list-group/List group_ invasives and pests.svg",
    source: "ARGA Exotic Species",
  },
  {
    category: "Venomous and Poisonous",
    image: "/icons/list-group/List group_ Venomous and poisonous.svg",
    source: "ARGA Venomous and Poisonous Species",
  },
  {
    category: "Edible Species",
    image: "/icons/list-group/List group_ edible wild species.svg",
    source: "ARGA Edible Species",
  },
  {
    category: "Iconic Australian Species",
    image: "/icons/list-group/List group_ Australian iconic species.svg",
    source: "Atlas of Living Australia",
    filter: {
      name: "australian_iconic_species",
      value: true,
    },
  },
  {
    category: "Genomics Milestones",
    image: "/icons/list-group/List group_ milestone species.svg",
    source: "N/A",
    href: "/genome-tracker",
  },
];
