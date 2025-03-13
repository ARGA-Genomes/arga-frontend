export default [
  {
    category: "All Threatened",
    image: "/icons/list-group/List group_ Threatened species.svg",
    source: "ARGA Threatened Species",
  },
  {
    category: "Australia's 110 Priority Threatened Species",
    image: "/icons/list-group/List group_ Threatened (= Top 110 Species).svg",
    source: "ARGA Threatened Species",
    filters: {
      top110Species: "TRUE",
    },
  },
  {
    category: "Bushfire Vulnerability",
    image: "/icons/list-group/List group_ Bushfire vulnerable.svg",
    source: "ARGA Bushfire Recovery",
  },
  {
    category: "CITES Listing",
    image: "/icons/list-group/List group_ CITES.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_VU: "TRUE", // TODO: FIX
    },
  },
  {
    category: "Extinct",
    image: "/icons/list-group/List group_ EPBC_ extinct.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_EX: "TRUE",
    },
  },
  {
    category: "Extinct in the Wild",
    image: "/icons/list-group/List group_ EPBC_ extinct in the wild.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_EW: "TRUE",
    },
  },
  {
    category: "Critically Endangered",
    image: "/icons/list-group/List group_ EPBC_ critically endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_CR: "TRUE",
    },
  },
  {
    category: "Endangered",
    image: "/icons/list-group/List group_ EPBC_ endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_EN: "TRUE",
    },
  },
  {
    category: "Vulnerable",
    image: "/icons/list-group/List group_ EPBC_ vulnerable.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_VU: "TRUE",
    },
  },
  {
    category: "Conservation Dependent",
    image: "/icons/list-group/List group_ EPBC_ conservation dependent.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_cd: "TRUE",
    },
  },
  {
    category: "Not Threatened",
    image: "/icons/list-group/List group_ EPBC_ not threatened.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_nt: "TRUE",
    },
  },
  {
    category: "Least Concern",
    image: "/icons/list-group/List group_ EPBC_ least concern.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_lc: "TRUE",
    },
  },
  {
    category: "Unlisted Status",
    image: "/icons/list-group/List group_ EPBC_ unlisted.svg",
    source: "ARGA Threatened Species",
    filter: {
      EPBC_ul: "TRUE",
    },
  },
];
