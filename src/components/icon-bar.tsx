import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import { Box, ThemeIcon, Image, Tooltip, Paper, getThemeColor, useMantineTheme, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

export interface IconData {
  label: string;
  image: string;
  link?: string;
  colour?: string;
}

const CONSERVATION_STATUS_ICON: Record<string, IconData> = {
  native: {
    image: "/icons/list-group/List group_ native.svg",
    label: "Native Species",
  },
  extinct: {
    label: "Extinct Species",
    image: "/icons/list-group/List group_ EPBC_ extinct.svg",
  },
  "extinct in the wild": {
    label: "Extinct in the Wild",
    image: "/icons/list-group/List group_ EPBC_ extinct in the wild.svg",
  },
  "critically endangered": {
    label: "Critically Endangered",
    image: "/icons/list-group/List group_ EPBC_ critically endangered.svg",
  },
  endangered: {
    label: "Endangered Species",
    image: "/icons/list-group/List group_ EPBC_ endangered.svg",
  },
  vulnerable: {
    label: "Vulnerable Species",
    image: "/icons/list-group/List group_ EPBC_ vulnerable.svg",
  },
  "vulnerable (wildfire)": {
    label: "Vulnerable to Wildfire",
    image: "/icons/list-group/List group_ Bushfire vulnerable.svg",
  },
  threatened: {
    label: "Threatened Species",
    image: "",
  },
  rare: {
    label: "Rare Species",
    image: "",
  },
  "near threatened": {
    label: "Near Threatened Species",
    image: "",
  },
  "least concern": {
    label: "Least concern",
    image: "/icons/list-group/List group_ EPBC_ least concern.svg",
  },
  unlisted: {
    label: "Unlisted",
    image: "/icons/list-group/List group_ EPBC_ unlisted.svg",
  },
};

export const VERNACULAR_GROUP_ICON: Record<string, IconData & { group: 1 | 2 | 3 }> = {
  // Group 1: Animals
  ANIMALS: {
    image: "/icons/taxon/Taxon_ Animals (Kingdom Animalia).svg",
    label: "Animals",
    link: "/kingdom/Animalia",
    colour: "shellfish.5",
    group: 1,
  },
  MOLLUSCS: {
    image: "/icons/taxon/Taxon_ Molluscs (Mollusca).svg",
    label: "Molluscs",
    link: "/phylum/Mollusca",
    colour: "shellfish.5",
    group: 1,
  },
  CRUSTACEANS: {
    image: "/icons/taxon/Taxon_ Crustaceans (Crustacea).svg",
    label: "Crustaceans",
    link: "/subphylum/Crustacea",
    colour: "shellfish.5",
    group: 1,
  },
  INSECTS: {
    image: "/icons/taxon/Taxon_ Insects (Insecta).svg",
    label: "Insects",
    link: "/class/Insecta",
    colour: "moss.4",
    group: 1,
  },
  SPIDERS: {
    image: "/icons/taxon/Taxon_ Spiders (Araneae).svg",
    label: "Spiders",
    link: "/order/Araneae",
    colour: "wheat.4",
    group: 1,
  },
  FROGS_AND_OTHER_AMPHIBIANS: {
    image: "/icons/taxon/Taxon_ Frogs and toads (Anura).svg",
    label: "Frogs and other amphibians",
    link: "/class/Amphibia",
    colour: "moss.4",
    group: 1,
  },
  REPTILES: {
    image: "/icons/taxon/Taxon_ Reptiles (Reptilia).svg",
    label: "Reptiles",
    link: "/class/Reptilia",
    colour: "moss.4",
    group: 1,
  },
  BIRDS: {
    image: "/icons/taxon/Taxon_ Birds (Aves).svg",
    label: "Birds",
    link: "/class/Aves",
    colour: "wheat.4",
    group: 1,
  },
  MAMMALS: {
    image: "/icons/taxon/Taxon_ Mammals (Mammalia).svg",
    label: "Mammals",
    link: "/class/Mammalia",
    colour: "moss.4",
    group: 1,
  },
  ECHINODERMS: {
    image: "/icons/taxon/Taxon_ Echinoderms (Echinodermata).svg",
    label: "Echinoderms",
    link: "/phylum/Echinodermata",
    colour: "shellfish.5",
    group: 1,
  },
  FIN_FISHES: {
    image: "/icons/taxon/Taxon_ Finfishes (Actinopterygii).svg",
    label: "Fin fishes",
    link: "/class/Actinopterygii",
    colour: "shellfish.5",
    group: 1,
  },
  SHARKS_AND_RAYS: {
    image: "/icons/taxon/Taxon_ Sharks and rays (Subclass Elasmobranchii).svg",
    label: "Sharks and rays",
    link: "/subclass/Elasmobranchii",
    colour: "shellfish.5",
    group: 1,
  },
  CORALS_AND_JELLYFISHES: {
    image: "/icons/taxon/Taxon_ Anemones, corals and jellyfishes (Cnidaria).svg",
    label: "Corals and jellyfishes",
    link: "/phylum/Cnidaria",
    colour: "shellfish.5",
    group: 1,
  },
  SPONGES: {
    image: "/icons/taxon/Taxon_ Sponges (Phylum Porifera).svg",
    label: "Sponges",
    link: "/phylum/Porifera",
    colour: "shellfish.5",
    group: 1,
  },

  // Group 2: Primary producers & decomposers
  FUNGI: {
    image: "/icons/taxon/Taxon_ Fungi (Fungi).svg",
    label: "Mushrooms and other fungi",
    link: "/regnum/Fungi",
    colour: "bushfire.4",
    group: 2,
  },
  BROWN_ALGAE: {
    image: "/icons/taxon/Taxon_ Brown algae (Phaeophyceae).svg",
    label: "Brown algae",
    link: "/classis/Phaeophyceae",
    colour: "wheat.4",
    group: 2,
  },
  RED_ALGAE: {
    image: "/icons/taxon/Taxon_ Red algae (Rhodophyta).svg",
    label: "Red algae",
    link: "/division/Rhodophyta",
    colour: "bushfire.4",
    group: 2,
  },
  GREEN_ALGAE: {
    image: "/icons/taxon/Taxon_ Green algae (Chlorophyta).svg",
    label: "Green algae",
    link: "/division/Chlorophyta",
    colour: "moss.4",
    group: 2,
  },
  HIGHER_PLANTS: {
    image: "/icons/taxon/Taxon_ Plants (Regnum Plantae).svg",
    label: "Higher plants",
    link: "/regnum/Plantae",
    colour: "moss.4",
    group: 2,
  },
  FLOWERING_PLANTS: {
    image: "/icons/taxon/Taxon_ Flowering plants (Magnoliidae).svg",
    label: "Flowering plants",
    link: "/subclassis/Magnoliidae",
    colour: "moss.4",
    group: 2,
  },
  MOSSES: {
    image: "/icons/taxon/Taxon_ Mosses (Bryophyta).svg",
    label: "Mosses",
    link: "/classis/Bryopsida",
    colour: "moss.4",
    group: 2,
  },
  LIVERWORTS: {
    image: "/icons/taxon/Taxon_ Liverworts (Marchantiophyta).svg",
    label: "Liverworts",
    link: "/division/Marchantiophyta",
    colour: "moss.4",
    group: 2,
  },
  HORNWORTS: {
    image: "/icons/taxon/Taxon_ Hornworts (Anthocerotophyta).svg",
    label: "Hornworts",
    link: "/division/Anthocerotophyta",
    colour: "moss.4",
    group: 2,
  },
  LICHENS: {
    image: "/icons/taxon/Taxon_ Lichens.svg",
    label: "Lichens",
    colour: "wheat.4",
    group: 2,
  },
  FERNS: {
    image: "/icons/taxon/Taxon_ Ferns (Polypodiidae).svg",
    label: "Ferns",
    link: "/subclassis/Polypodiidae",
    colour: "moss.4",
    group: 2,
  },
  CONIFERS_AND_CYCADS: {
    image: "/icons/taxon/Taxon_ Conifers and cycads (Pinales, Araucariales, Cupressales, Cycadales).svg",
    label: "Conifers and cycads",
    colour: "moss.4",
    group: 2,
  },

  // Group 3: Microbes & protists
  BACTERIA: {
    image: "/icons/taxon/Taxon_ Bacteria (Prokaryota_Bacteria).svg",
    label: "Bacteria",
    link: "/kingdom/Bacteria",
    colour: "wheat.4",
    group: 3,
  },
  PROTISTS_AND_OTHER_UNICELLULAR_ORGANISMS: {
    image: "/icons/taxon/Taxon_ Protozoa (Kingdom Protozoa).svg",
    label: "Protists and other unicellular organisms",
    link: "/superkingdom/Protista",
    colour: "moss.4",
    group: 3,
  },
  CYANOBACTERIA: {
    image: "/icons/taxon/Taxon_ Blue-green algae (Cyanobacteria).svg",
    label: "Cyanobacteria",
    link: "/division/Cyanobacteria",
    colour: "shellfish.5",
    group: 3,
  },
  DIATOMS: {
    image: "/icons/taxon/Taxon_ Diatoms (Bacillariophyta).svg",
    label: "Diatoms",
    link: "/division/Bacillariophyta",
    colour: "shellfish.5",
    group: 3,
  },
  CHROMISTS: {
    image: "/icons/taxon/Taxon_ Chromists (Chromista).svg",
    label: "Chromists",
    link: "/regnum/Chromista",
    colour: "shellfish.5",
    group: 3,
  },
};

export function VernacularGroupChip({ group }: { group: string }) {
  const theme = useMantineTheme();
  const colour = VERNACULAR_GROUP_ICON[group]?.colour;
  const rawColour = getThemeColor(colour || "lightgrey", theme);

  return (
    <Paper
      radius="xl"
      px="lg"
      py={4}
      style={{
        border: `1px solid ${rawColour}`,
        textAlign: "center",
      }}
    >
      <Text size="sm" c={colour} fw={650}>
        {VERNACULAR_GROUP_ICON[group]?.label || "Unknown"}
      </Text>
    </Paper>
  );
}

const ATTRIBUTE_GROUP_ICON: Record<string, IconData> = {
  is_venomous: {
    image: "/icons/list-group/List group_ Venomous and poisonous.svg",
    label: "Venomous and poisonous",
    link: "/browse/sources/ARGA_Venomous_and_Poisonous_Species",
  },
  vulnerable_wildfire: {
    image: "/icons/list-group/List group_ Bushfire vulnerable.svg",
    label: "Fire vulnerable",
    link: "/browse/sources/ARGA_Bushfire_Recovery",
  },
  native_species_icon: {
    image: "/icons/list-group/List group_ native.svg",
    label: "Native",
    link: "/browse/sources/ARGA_Native_Species",
  },
  edible_wild_species_icon: {
    image: "/icons/list-group/List group_ edible wild species.svg",
    label: "Edible wild",
    link: "/browse/sources/ARGA_Edible_Species",
  },
  crop_wild_relative_icon: {
    image: "/icons/list-group/List group_ crop wild relative.svg",
    label: "Crop wild relative",
    link: "/browse/sources/ARGA_Crop_Wild_Relatives",
  },
  invasives_pests_icon: {
    image: "/icons/list-group/List group_ invasives and pests.svg",
    label: "Invasive/pest",
    link: "/browse/sources/ARGA_Exotic_Species",
  },
  migratory_species_icon: {
    image: "/icons/list-group/List group_ migratory species.svg",
    label: "Migratory",
    link: "/browse/sources/ARGA_Migratory_Species",
  },
  top_110_species_icon: {
    image: "/icons/list-group/List group_ Threatened (Top 110 Species).svg",
    label: "Threatened",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EX: {
    image: "/icons/list-group/List group_ EPBC_ extinct.svg",
    label: "EPBC Act Status: Extinct",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EW: {
    image: "/icons/list-group/List group_ EPBC_ extinct in the wild.svg",
    label: "EPBC Act Status: Extinct in the wild",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_CR: {
    image: "/icons/list-group/List group_ EPBC_ critically endangered.svg",
    label: "EPBC Act Status: Critically endangered",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EN: {
    image: "/icons/list-group/List group_ EPBC_ endangered.svg",
    label: "EPBC Act Status: Endangered",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_VU: {
    image: "/icons/list-group/List group_ EPBC_ vulnerable.svg",
    label: "EPBC Act Status: Vulnerable",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_cd: {
    image: "/icons/list-group/List group_ EPBC_ conservation dependent.svg",
    label: "EPBC Act Status: Conservation dependent",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_nt: {
    image: "/icons/list-group/List group_ EPBC_ not threatened.svg",
    label: "EPBC Act Status: Not threatened",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_lc: {
    image: "/icons/list-group/List group_ EPBC_ least concern.svg",
    label: "EPBC Act Status: Least concern",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_ul: {
    image: "/icons/list-group/List group_ EPBC_ unlisted.svg",
    label: "EPBC Act Status: Unlisted",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  is_medicinal_and_bioactive_icon: {
    image: "/icons/list-group/List group_ medicinal and bioactive.svg",
    label: "Medicinal and bioactive",
  },
  agriculture: {
    image: "/icons/list-group/List group_ Agriculture.svg",
    label: "Agriculture",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  aquaculture: {
    image: "/icons/list-group/List group_ Aquaculture.svg",
    label: "Aquaculture",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  "horticultural crop": {
    image: "/icons/list-group/List group_ Horticultural crops.svg",
    label: "Horticultural crop",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  "crops and cereals": {
    image: "/icons/list-group/List group_ Cereals and crops.svg",
    label: "Crops and cereals",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  forestry: {
    image: "/icons/list-group/List group_ Forestry timber and textiles.svg",
    label: "Forestry and timber industry",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  livestock: {
    image: "/icons/list-group/List group_ Livestock.svg",
    label: "Livestock industry",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  commercial_and_trade_fisheries_icon: {
    image: "/icons/list-group/List group_ Commercial and trade fishes.svg",
    label: "Commercial and trade fisheries",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  managed_fisheries_icon: {
    image: "/icons/list-group/List group_ Managed fisheries.svg",
    label: "Managed fisheries",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
};

function ConservationIcon({ status, source }: { status: string; source: string | undefined }) {
  const icon = CONSERVATION_STATUS_ICON[status] || CONSERVATION_STATUS_ICON.no_status;
  const tooltip = `${icon.label || status} | ${source}`;

  return (
    <Tooltip label={tooltip}>
      <ThemeIcon radius="xl" size={60} p={10} variant="transparent">
        {icon.image && <Image src={icon.image} alt={icon.label || status} w={60} />}
      </ThemeIcon>
    </Tooltip>
  );
}

interface VernacularGroupIconProps {
  group: string;
  iconLink?: string;
  size?: number;
}

function VernacularGroupIcon({ group, size, iconLink }: VernacularGroupIconProps) {
  const icon = VERNACULAR_GROUP_ICON[group];
  if (!icon) return null;
  if (!iconLink) {
    iconLink = icon.link;
  }

  const component = (
    <Tooltip label={icon.label}>
      <ThemeIcon radius="xl" size={size || 60} p={10} variant="transparent">
        <Image src={icon.image} alt={`Icon of ${icon.label}`} w={60} />
      </ThemeIcon>
    </Tooltip>
  );

  return <>{iconLink ? <Link href={iconLink}>{component}</Link> : component}</>;
}

interface AttributeIconProps {
  attribute: string;
  iconLink?: string;
}

function AttributeGroupIcon({ attribute, iconLink }: AttributeIconProps) {
  const icon = ATTRIBUTE_GROUP_ICON[attribute];
  if (!icon) return null;
  if (!iconLink) {
    iconLink = icon.link;
  }

  const component = (
    <Tooltip label={icon.label}>
      <ThemeIcon radius="xl" size={60} p={10} variant="transparent">
        <Image src={icon.image} alt={`Icon of ${icon.label}`} w={60} />
      </ThemeIcon>
    </Tooltip>
  );

  return <>{iconLink ? <Link href={iconLink}>{component}</Link> : component}</>;
}

function _DebugIconBar() {
  return (
    <>
      <VernacularGroupIcon group="bacteria" />
      <VernacularGroupIcon group="protists and other unicellular organisms" />
      <VernacularGroupIcon group="mushrooms and other fungi" />
      <VernacularGroupIcon group="molluscs" />
      <VernacularGroupIcon group="marine crustaceans" />
      <VernacularGroupIcon group="insects" />
      <VernacularGroupIcon group="frogs and other amphibians" />
      <VernacularGroupIcon group="birds" />
      <VernacularGroupIcon group="mammals" />
      <VernacularGroupIcon group="seaweeds and other algae" />
      <VernacularGroupIcon group="higher plants" />
      <ConservationIcon status="native" source="Debug List" />
      <ConservationIcon status="unlisted" source="Debug List" />
      <ConservationIcon status="least concern" source="Debug List" />
      <ConservationIcon status="near threatened" source="Debug List" />
      <ConservationIcon status="rare" source="Debug List" />
      <ConservationIcon status="threatened" source="Debug List" />
      <ConservationIcon status="vulnerable" source="Debug List" />
      <ConservationIcon status="vulnerable (wildfire)" source="Debug List" />
      <ConservationIcon status="endangered" source="Debug List" />
      <ConservationIcon status="critically endangered" source="Debug List" />
      <ConservationIcon status="extinct in the wild" source="Debug List" />
      <ConservationIcon status="extinct" source="Debug List" />
    </>
  );
}

function isLichen(source: string | undefined) {
  if (source !== undefined) {
    if (source === "Australian Lichen List") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const GET_TAXON = gql`
  query TaxonSpecies($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      hierarchy {
        canonicalName
        rank
        depth
      }
    }
  }
`;

interface ClassificationNode {
  canonicalName: string;
  rank: string;
  depth: number;
}

interface TaxonQuery {
  taxon: {
    hierarchy: ClassificationNode[];
  };
}

interface NameAttribute {
  name: string;
  valueBool?: boolean;
  valueInt?: number;
  valueDecimal?: number;
  valueStr?: string;
}

interface IconBarProps {
  taxonomy: Taxonomy;
  conservation?: Conservation[];
  traits?: IndigenousEcologicalKnowledge[];
  attributes?: NameAttribute[];
}

export default function IconBar({ taxonomy, attributes }: IconBarProps) {
  const taxonomyHeaderIcons = [taxonomy.vernacularGroup];

  if (isLichen(taxonomy.source)) {
    taxonomyHeaderIcons.push("LICHENS");
  }

  const attributeHeaderIconsRaw = attributes
    ?.map((nameAttribute) => {
      if (nameAttribute.name === "commercial_sector_icon" || nameAttribute.name === "agricultural_industry_icon") {
        return nameAttribute.valueStr;
      }
      if (ATTRIBUTE_GROUP_ICON[nameAttribute.name]) {
        return nameAttribute.name;
      }
    })
    .filter((item) => item !== undefined);
  const attributeHeaderIcons = [...new Set(attributeHeaderIconsRaw)];

  const headerIcons = taxonomyHeaderIcons.concat(attributeHeaderIcons);

  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const detectResize = () => {
    setWinWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", detectResize);

    return () => {
      window.removeEventListener("resize", detectResize);
    };
  }, [winWidth]);

  const setControls = () => {
    if (winWidth >= 992) {
      if (headerIcons.length <= 6) {
        return false;
      } else {
        return true;
      }
    } else if (winWidth >= 768 && winWidth < 992) {
      if (headerIcons.length <= 5) {
        return false;
      } else {
        return true;
      }
    } else if (winWidth >= 576 && winWidth < 768) {
      if (headerIcons.length <= 4) {
        return false;
      } else {
        return true;
      }
    } else if (winWidth < 576) {
      if (headerIcons.length <= 3) {
        return false;
      } else {
        return true;
      }
    }
  };

  // The taxonomic groups that make up Conifers and Cycads are disjoint - finds the
  // appropriate taxonomic link for whichever ordo the species is from
  let coniferCycadLink = "/";
  const { data } = useQuery<TaxonQuery>(GET_TAXON, {
    skip: taxonomy.vernacularGroup !== "CONIFERS_AND_CYCADS",
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const hierarchy = data?.taxon.hierarchy.toSorted((a, b) => b.depth - a.depth);
  hierarchy?.forEach((taxon) => {
    if (
      (taxon.rank === "ORDO" || taxon.rank === "ORDER") &&
      (taxon.canonicalName === "Pinales" || taxon.canonicalName === "Cycadales")
    ) {
      coniferCycadLink += taxon.rank.toLowerCase();
      coniferCycadLink += "/";
      coniferCycadLink += taxon.canonicalName;
    }
  });

  return (
    <Carousel
      slideSize={{
        base: headerIcons.length <= 3 ? (100 / headerIcons.length).toString() + "%" : "33.333333%",
        xs: headerIcons.length <= 4 ? (100 / headerIcons.length).toString() + "%" : "25%",
        sm: headerIcons.length <= 5 ? (100 / headerIcons.length).toString() + "%" : "20%",
        md: headerIcons.length <= 6 ? (100 / headerIcons.length).toString() + "%" : "16.66666666%",
      }}
      maw={{
        base: headerIcons.length <= 3 ? (70 * headerIcons.length).toString() + "px" : "306px",
        xs: headerIcons.length <= 4 ? (70 * headerIcons.length).toString() + "px" : "376px",
        sm: headerIcons.length <= 5 ? (70 * headerIcons.length).toString() + "px" : "446px",
        md: headerIcons.length <= 6 ? (70 * headerIcons.length).toString() + "px" : "516px",
      }}
      pr={{
        base: headerIcons.length <= 3 ? "0" : "3em",
        xs: headerIcons.length <= 4 ? "0" : "3em",
        sm: headerIcons.length <= 5 ? "0" : "3em",
        md: headerIcons.length <= 6 ? "0" : "3em",
      }}
      pl={{
        base: headerIcons.length <= 3 ? "0" : "3em",
        xs: headerIcons.length <= 4 ? "0" : "3em",
        sm: headerIcons.length <= 5 ? "0" : "3em",
        md: headerIcons.length <= 6 ? "0" : "3em",
      }}
      withControls={setControls()}
      draggable={setControls()}
      align="start"
      loop
    >
      {taxonomyHeaderIcons.map(
        (icon, index) =>
          icon && (
            <Carousel.Slide pr="5px" pl="5px" key={index}>
              <Box w="100%" display="flex" style={{ justifyContent: "center" }}>
                {icon === "CONIFERS_AND_CYCADS" ? (
                  <VernacularGroupIcon group={icon} iconLink={coniferCycadLink} />
                ) : (
                  <VernacularGroupIcon group={icon} />
                )}
              </Box>
            </Carousel.Slide>
          )
      )}
      {attributeHeaderIcons &&
        attributeHeaderIcons.map(
          (icon, index) =>
            icon && (
              <Carousel.Slide pr="5px" pl="5px" key={index}>
                <Box w="100%" display="flex" style={{ justifyContent: "center" }}>
                  <AttributeGroupIcon attribute={icon} />
                </Box>
              </Carousel.Slide>
            )
        )}
    </Carousel>
  );
}
