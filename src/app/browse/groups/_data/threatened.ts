export default [
  {
    category: "Bushfire Vulnerability",
    image: "/card-icons/dataset/fire_vulnerable.svg",
    link: "/browse/sources/ARGA_Bushfire_Recovery",
    source: "ARGA_Bushfire_Recovery",
  },
  {
    category: "Australia's 110 Priority Threatened Species",
    image: "/card-icons/dataset/threatened_top_110_species.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "top110Species",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Extinct",
    image: "/card-icons/dataset/epbc_extinct.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_EX",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Extinct in the Wild",
    image: "/card-icons/dataset/epbc_extinct_in_the_wild.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_EW",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Critically Endangered",
    image: "/card-icons/dataset/epbc_critically_endangered.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_CR",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Endangered",
    image: "/card-icons/dataset/epbc_endangered.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_EN",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Vulnerable",
    image: "/card-icons/dataset/epbc_vulnerable.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_VU",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Conservation Dependent",
    image: "/card-icons/dataset/epbc_conservation_dependent.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_cd",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Not Threatened",
    image: "/card-icons/dataset/epbc_not_threatened.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_nt",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Least Concern",
    image: "/card-icons/dataset/epbc_least_concern.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_lc",
        value: "TRUE",
      },
    ],
  },
  {
    category: "Unlisted Status",
    image: "/card-icons/dataset/epbc_unlisted.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_ul",
        value: "TRUE",
      },
    ],
  },
  {
    category: "CITES Listing",
    image: "/card-icons/dataset/cites.svg",
    link: "/browse/sources/ARGA_Threatened_Species",
    source: "ARGA_Threatened_Species",
    filters: [
      {
        key: "EPBC_VU", // TODO: FIX
        value: "TRUE",
      },
    ],
  },
];
