export const threatened = [
  {
    category: "All Threatened",
    image: "/icons/list-group/List group_ Threatened species.svg",
    source: "ARGA Threatened Species",
  },
  {
    category: "Australia's 110 Priority Threatened Species",
    image: "/icons/list-group/List group_ Threatened (Top 110 Species).svg",
    source: "ARGA Threatened Species",
    filters: {
      name: "top110Species",
      value: {
        bool: true,
      },
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
      name: "EPBC_act_category_VU", // TODO: FIX
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Extinct",
    image: "/icons/list-group/List group_ EPBC_ extinct.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EX",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Extinct in the Wild",
    image: "/icons/list-group/List group_ EPBC_ extinct in the wild.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EW",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Critically Endangered",
    image: "/icons/list-group/List group_ EPBC_ critically endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_CR",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Endangered",
    image: "/icons/list-group/List group_ EPBC_ endangered.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_EN",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Vulnerable",
    image: "/icons/list-group/List group_ EPBC_ vulnerable.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_VU",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Conservation Dependent",
    image: "/icons/list-group/List group_ EPBC_ conservation dependent.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_cd",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Not Threatened",
    image: "/icons/list-group/List group_ EPBC_ not threatened.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_nt",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Least Concern",
    image: "/icons/list-group/List group_ EPBC_ least concern.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_lc",
      value: {
        bool: true,
      },
    },
  },
  {
    category: "Unlisted Status",
    image: "/icons/list-group/List group_ EPBC_ unlisted.svg",
    source: "ARGA Threatened Species",
    filter: {
      name: "EPBC_act_category_ul",
      value: {
        bool: true,
      },
    },
  },
];
