import { GroupItem } from "./all";

export const threatened: GroupItem[] = [
  {
    category: "All Threatened",
    image: "/icons/list-group/List group_ Threatened species.svg",
    source: "ARGA Threatened Species",
  },
  {
    category: "Australia's 110 Priority Threatened Species",
    image: "/icons/list-group/List group_ Threatened (Top 110 Species).svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "top_110_species",
      value: true,
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
    disabled: false,
    filter: {
      name: "cites",
      // value: true
    },
  },
  // EPBC
  {
    category: "EPBC All",
    image: "/icons/list-group/List group_ EPBC.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Extinct",
    image: "/icons/list-group/List group_ EPBC_ extinct.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EX",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Extinct in the Wild",
    image: "/icons/list-group/List group_ EPBC_ extinct in the wild.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EW",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Critically Endangered",
    image: "/icons/list-group/List group_ EPBC_ critically endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_CR",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Endangered",
    image: "/icons/list-group/List group_ EPBC_ endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EN",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Vulnerable",
    image: "/icons/list-group/List group_ EPBC_ vulnerable.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_VU",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Conservation Dependent",
    image: "/icons/list-group/List group_ EPBC_ conservation dependent.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_cd",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Not Threatened",
    image: "/icons/list-group/List group_ EPBC_ not threatened.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_nt",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Least Concern",
    image: "/icons/list-group/List group_ EPBC_ least concern.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_lc",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "EPBC Act",
    },
  },
  {
    category: "EPBC Unlisted Status",
    image: "/icons/list-group/List group_ EPBC_ unlisted.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_ul",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "EPBC Act",
    },
  },
  // IUCN
  {
    category: "IUCN All",
    image: "/icons/list-group/List group_ IUCN.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Extinct",
    image: "/icons/list-group/List group_ IUCN_ extinct.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_EX",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Extinct in the wild",
    image: "/icons/list-group/List group_ IUCN_ extinct in the wild.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_EW",
      value: true,
    },
    display: {
      order: 1,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Critically Endangered",
    image: "/icons/list-group/List group_ IUCN_ critically endangered.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_CR",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Endangered",
    image: "/icons/list-group/List group_ IUCN_ endangered.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_EN",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Vulnerable",
    image: "/icons/list-group/List group_ IUCN_ vulnerable.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_VU",
      value: true,
    },
    display: {
      order: 2,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Near Threatened",
    image: "/icons/list-group/List group_ IUCN_ near threatened.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_NT",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Least Concern",
    image: "/icons/list-group/List group_ IUCN_ least concern.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_LC",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Data Deficient",
    image: "/icons/list-group/List group_ IUCN_ data deficient.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_DD",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "IUCN",
    },
  },
  {
    category: "IUCN Not Evaluated",
    image: "/icons/list-group/List group_ IUCN_ not evaluated.svg",
    source: "ARGA IUCN Red List",
    filter: {
      name: "iucn_redlist_NE",
      value: true,
    },
    display: {
      order: 3,
      subcategory: "IUCN",
    },
  },
];
