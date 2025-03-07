export default [
  {
    category: "Venomous and Poisonous",
    image: "/card-icons/dataset/venomous_and_poisonous.svg",
    link: "/browse/sources/ARGA_Venomous_and_Poisonous_Species",
    source: "ARGA_Venomous_and_Poisonous_Species",
  },
  {
    category: "Edible Species",
    image: "/card-icons/dataset/edible_wild_species.svg",
    link: "/browse/sources/ARGA_Commercial_Species",
    source: "ARGA_Edible_Species",
  },
  {
    category: "Medicinal and Bioactive",
    image: "/card-icons/dataset/medicinal_bioactive.svg",
    link: "/browse/sources/ARGA_Commercial_Species",
    source: "ARGA_Useful_Species", // TODO: MISSING
    filters: [
      {
        key: "isMedicinalAndBioactive",
        value: "TRUE",
      },
    ],
  },
];
