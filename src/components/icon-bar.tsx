import {
  Conservation,
  IndigenousEcologicalKnowledge,
  Taxonomy,
} from "@/app/type";
import {
  Box,
  Group,
  ThemeIcon,
  Image,
  Tooltip,
  Text,
  Popover,
  Stack,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { AttributeIcon } from "./highlight-stack";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

interface IconData {
  label?: string;
  image?: string;
  link?: string;
}

const CONSERVATION_STATUS_ICON: Record<string, IconData> = {
  native: {
    image: "native.svg",
    label: "Native Species",
  },
  extinct: {
    label: "Extinct Species",
    image: "/species-icons/epbc_extinct.svg",
  },
  "extinct in the wild": {
    label: "Extinct in the Wild",
    image: "/species-icons/epbc_extinct_in_the_wild.svg",
  },
  "critically endangered": {
    label: "Critically Endangered",
    image: "/species-icons/epbc_critically_endangered.svg",
  },
  endangered: {
    label: "Endangered Species",
    image: "/species-icons/epbc_endangered.svg",
  },
  vulnerable: {
    label: "Vulnerable Species",
    image: "/species-icons/epbc_vulnerable.svg",
  },
  "vulnerable (wildfire)": {
    label: "Vulnerable to Wildfire",
    image: "/species-icons/fire_vulnerable.svg",
  },
  threatened: {
    label: "Threatened Species",
  },
  rare: {
    label: "Rare Species",
  },
  "near threatened": {
    label: "Near Threatened Species",
  },
  "least concern": {
    label: "Least concern",
    image: "/species-icons/epbc_least_concern.svg",
  },
  unlisted: {
    label: "Unlisted",
    image: "/species-icons/epbc_unlisted.svg",
  },
};

const VERNACULAR_GROUP_ICON: Record<string, IconData> = {
  BACTERIA: {
    image: "/species-icons/bacteria.svg",
    label: "Bacteria",
    link: "/kingdom/Bacteria",
  },
  PROTISTS_AND_OTHER_UNICELLULAR_ORGANISMS: {
    image: "/species-icons/protists.svg",
    label: "Protists and other unicellular organisms",
    link: "/superkingdom/Protista",
  },
  FUNGI: {
    image: "/species-icons/fungi.svg",
    label: "Mushrooms and other fungi",
    link: "/regnum/Fungi",
  },
  MOLLUSCS: {
    image: "/species-icons/molluscs.svg",
    label: "Molluscs",
    link: "/phylum/Mollusca",
  },
  CRUSTACEANS: {
    image: "/species-icons/crustaceans.svg",
    label: "Crustaceans",
    link: "/subphylum/Crustacea",
  },
  INSECTS: {
    image: "/species-icons/insecta.svg",
    label: "Insects",
    link: "/class/Insecta",
  },
  FROGS_AND_OTHER_AMPHIBIANS: {
    image: "/species-icons/frogs_updated.svg",
    label: "Frogs and other amphibians",
    link: "/class/Amphibia",
  },
  BIRDS: {
    image: "/species-icons/birds.svg",
    label: "Birds",
    link: "/class/Aves",
  },
  MAMMALS: {
    image: "/species-icons/mammals.svg",
    label: "Mammals",
    link: "/class/Mammalia",
  },
  HIGHER_PLANTS: {
    image: "/species-icons/plants.svg",
    label: "Higher plants",
    link: "/regnum/Plantae",
  },
  FLOWERING_PLANTS: {
    image: "/species-icons/flowering_plants.svg",
    label: "Flowering plants",
    link: "/subclassis/Magnoliidae",
  },
  ANIMALS: {
    image: "/species-icons/animals.svg",
    label: "Animals",
    link: "/kingdom/Animalia",
  },
  BROWN_ALGAE: {
    image: "/species-icons/brown_algae.svg",
    label: "Brown algae",
    link: "/classis/Phaeophyceae",
  },
  RED_ALGAE: {
    image: "/species-icons/red_algae.svg",
    label: "Red algae",
    link: "/division/Rhodophyta",
  },
  GREEN_ALGAE: {
    image: "/species-icons/green_algae.svg",
    label: "Green algae",
    link: "/division/Chlorophyta",
  },
  ECHINODERMS: {
    image: "/species-icons/echinoderms.svg",
    label: "Echinoderms",
    link: "/phylum/Echinodermata",
  },
  FIN_FISHES: {
    image: "/species-icons/finfishes.svg",
    label: "Fin fishes",
    link: "/class/Actinopterygii",
  },
  CORALS_AND_JELLYFISHES: {
    image: "/species-icons/cnidaria.svg",
    label: "Corals and jellyfishes",
    link: "/phylum/Cnidaria",
  },
  CYANOBACTERIA: {
    image: "/species-icons/cyanobacteria.svg",
    label: "Cyanobacteria",
    link: "/division/Cyanobacteria",
  },
  SHARKS_AND_RAYS: {
    image: "/species-icons/sharks.svg",
    label: "Sharks and rays",
    link: "/subclass/Elasmobranchii",
  },
  SPIDERS: {
    image: "/species-icons/spiders.svg",
    label: "Spiders",
    link: "/order/Araneae",
  },
  REPTILES: {
    image: "/species-icons/reptiles.svg",
    label: "Reptiles",
    link: "/class/Reptilia",
  },
  MOSSES: {
    image: "/species-icons/mosses.svg",
    label: "Mosses",
    link: "/classis/Bryopsida",
  },
  LIVERWORTS: {
    image: "/species-icons/liverworts.svg",
    label: "Liverworts",
    link: "/division/Marchantiophyta",
  },
  HORNWORTS: {
    image: "/species-icons/hornworts.svg",
    label: "Hornworts",
    link: "/division/Anthocerotophyta",
  },
  LICHENS: {
    image: "/species-icons/lichens.svg",
    label: "Lichens",
  },
  FERNS: {
    image: "/species-icons/ferns.svg",
    label: "Ferns",
    link: "/subclassis/Polypodiidae",
  },
  CONIFERS_AND_CYCADS: {
    image: "/species-icons/conifers_and_cycads.svg",
    label: "Conifers and cycads",
  },
  DIATOMS: {
    image: "/species-icons/diatoms.svg",
    label: "Diatoms",
    link: "/division/Bacillariophyta",
  },
  CHROMISTS: {
    image: "/species-icons/chromists.svg",
    label: "Chromists",
    link: "/regnum/Chromista",
  },
};

const INDIGENOUS_LANGUAGE_GROUP_ICON: Record<string, IconData> = {
  "Indigenous Ecological Knowledge: Kamilaroi People": {
    label: "Indigenous Ecological Knowledge: Kamilaroi People",
    image: "/species-icons/iek_kamilaroi.svg",
    link: "/browse/datasets/Indigenous Ecological Knowledge: Kamilaroi People",
  },
  "Indigenous Ecological Knowledge: South East Arnhem Land": {
    label: "Indigenous Ecological Knowledge: South East Arnhem Land",
    image: "/species-icons/iek_south_east_arnhem_land.svg",
    link: "/browse/datasets/Indigenous Ecological Knowledge: South East Arnhem Land",
  },
  "Indigenous Ecological Knowledge: Noongar Boodjar People": {
    label: "Indigenous Ecological Knowledge: Noongar Boodjar People",
    image: "/species-icons/iek_noongar_boodjar.svg",
    link: "/browse/datasets/Indigenous Ecological Knowledge: Noongar Boodjar People",
  },
};

const ATTRIBUTE_GROUP_ICON: Record<string, IconData> = {
  is_venomous: {
    image: "/attribute-icons/venomous_and_poisonous.svg",
    label: "Venomous and poisonous",
    link: "/browse/sources/ARGA_Venomous_and_Poisonous_Species",
  },
  vulnerable_wildfire: {
    image: "/attribute-icons/bushfire_vulnerable.svg",
    label: "Fire vulnerable",
    link: "/browse/sources/ARGA_Bushfire_Recovery",
  },
  native_species_icon: {
    image: "/attribute-icons/native_species.svg",
    label: "Native",
    link: "/browse/sources/ARGA_Native_Species",
  },
  edible_wild_species_icon: {
    image: "/attribute-icons/edible_wild_species.svg",
    label: "Edible wild",
    link: "/browse/sources/ARGA_Edible_Species",
  },
  crop_wild_relative_icon: {
    image: "/attribute-icons/crop_wild_relative.svg",
    label: "Crop wild relative",
    link: "/browse/sources/ARGA_Crop_Wild_Relatives",
  },
  invasives_pests_icon: {
    image: "/attribute-icons/invasives_pests.svg",
    label: "Invasive/pest",
    link: "/browse/sources/ARGA_Exotic_Species",
  },
  migratory_species_icon: {
    image: "/attribute-icons/migratory_species.svg",
    label: "Migratory",
    link: "/browse/sources/ARGA_Migratory_Species",
  },
  top_110_species_icon: {
    image: "/attribute-icons/top_110_species.svg",
    label: "Threatened",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EX: {
    image: "/attribute-icons/EPBC_extinct.svg",
    label: "EPBC Act Status: Extinct",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EW: {
    image: "/attribute-icons/EPBC_extinct_in_the_wild.svg",
    label: "EPBC Act Status: Extinct in the wild",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_CR: {
    image: "/attribute-icons/EPBC_critically_endangered.svg",
    label: "EPBC Act Status: Critically endangered",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_EN: {
    image: "/attribute-icons/EPBC_endangered.svg",
    label: "EPBC Act Status: Endangered",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_VU: {
    image: "/attribute-icons/EPBC_vulnerable.svg",
    label: "EPBC Act Status: Vulnerable",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_cd: {
    image: "/attribute-icons/EPBC_conservation_dependent.svg",
    label: "EPBC Act Status: Conservation dependent",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_nt: {
    image: "/attribute-icons/EPBC_not_threatened.svg",
    label: "EPBC Act Status: Not threatened",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_lc: {
    image: "/attribute-icons/EPBC_least_concern.svg",
    label: "EPBC Act Status: Least concern",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  EPBC_act_category_ul: {
    image: "/attribute-icons/EPBC_unlisted.svg",
    label: "EPBC Act Status: Unlisted",
    link: "/browse/sources/ARGA_Threatened_Species",
  },
  is_medicinal_and_bioactive_icon: {
    image: "/attribute-icons/medicinal_and_bioactive.svg",
    label: "Medicinal and bioactive",
  },
  agriculture: {
    image: "/attribute-icons/agriculture.svg",
    label: "Agriculture",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  aquaculture: {
    image: "/attribute-icons/aquaculture.svg",
    label: "Aquaculture",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  "horticultural crop": {
    image: "/attribute-icons/horticultural_crops.svg",
    label: "Horticultural crop",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  "crops and cereals": {
    image: "/attribute-icons/crops_and_cereals.svg",
    label: "Crops and cereals",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  forestry: {
    image: "/attribute-icons/forestry_and_timber.svg",
    label: "Forestry and timber industry",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  livestock: {
    image: "/attribute-icons/livestock.svg",
    label: "Livestock industry",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  commercial_and_trade_fisheries_icon: {
    image: "/attribute-icons/commercial_and_trade_fisheries.svg",
    label: "Commercial and trade fisheries",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
  managed_fisheries_icon: {
    image: "/attribute-icons/managed_fisheries.svg",
    label: "Managed fisheries",
    link: "/browse/sources/ARGA_Commercial_Species",
  },
};

function ConservationIcon({
  status,
  source,
}: {
  status: string;
  source: string | undefined;
}) {
  const icon =
    CONSERVATION_STATUS_ICON[status] || CONSERVATION_STATUS_ICON.no_status;
  const tooltip = `${icon.label || status} | ${source}`;

  return (
    <Tooltip label={tooltip}>
      <ThemeIcon radius="xl" size={60} p={10} variant="transparent">
        {icon.image && (
          <Image src={icon?.image} alt={icon.label || status} w={60} />
        )}
      </ThemeIcon>
    </Tooltip>
  );
}

interface VernacularGroupIconProps {
  group: string;
  iconLink?: string;
}

function VernacularGroupIcon({ group, iconLink }: VernacularGroupIconProps) {
  const icon = VERNACULAR_GROUP_ICON[group];
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

interface IndigenousLanguageGroupIconProps {
  group: string;
  trait: IndigenousEcologicalKnowledge;
}

function IndigenousLanguageGroupIcon({
  group,
  trait,
}: IndigenousLanguageGroupIconProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const extraDimmed = "rgba(134, 142, 150, .3)";

  const icon = INDIGENOUS_LANGUAGE_GROUP_ICON[group];
  const component = (
    <Popover position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <Image
          w={60}
          src={icon?.image}
          alt=""
          onMouseEnter={open}
          onMouseLeave={close}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Text>{icon?.label}</Text>
          <Text size="sm">
            <strong>Name:</strong> {trait.name}
          </Text>
          <SimpleGrid cols={3}>
            <AttributeIcon
              label="Food use"
              icon={
                trait.foodUse ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color={extraDimmed} />
                )
              }
            />
            <AttributeIcon
              label="Medicinal use"
              icon={
                trait.medicinalUse ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color={extraDimmed} />
                )
              }
            />
            <AttributeIcon
              label="Cultural connection"
              icon={
                trait.culturalConnection ? (
                  <IconCircleCheck color="green" />
                ) : (
                  <IconCircleX color={extraDimmed} />
                )
              }
            />
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );

  return (
    <>{icon?.link ? <Link href={icon.link}>{component}</Link> : component}</>
  );
}

function DebugIconBar() {
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

type ClassificationNode = {
  canonicalName: string;
  rank: string;
  depth: number;
};

type TaxonQuery = {
  taxon: {
    hierarchy: ClassificationNode[];
  };
};

type NameAttribute = {
  name: string;
  valueBool?: boolean;
  valueInt?: number;
  valueDecimal?: number;
  valueStr?: string;
};

interface IconBarProps {
  taxonomy: Taxonomy;
  conservation?: Conservation[];
  traits?: IndigenousEcologicalKnowledge[];
  attributes?: NameAttribute[];
}

export default function IconBar({
  taxonomy,
  conservation,
  traits,
  attributes,
}: IconBarProps) {
  const taxonomyHeaderIcons = [taxonomy.vernacularGroup];
  isLichen(taxonomy.source) ? taxonomyHeaderIcons.push("LICHENS") : undefined;

  const attributeHeaderIconsRaw = attributes
    ?.map((nameAttribute) => {
      if (
        nameAttribute.name === "commercial_sector_icon" ||
        nameAttribute.name === "agricultural_industry_icon"
      ) {
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
  const { loading, error, data } = useQuery<TaxonQuery>(GET_TAXON, {
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
        base:
          headerIcons.length <= 3
            ? (100 / headerIcons.length).toString() + "%"
            : "33.333333%",
        xs:
          headerIcons.length <= 4
            ? (100 / headerIcons.length).toString() + "%"
            : "25%",
        sm:
          headerIcons.length <= 5
            ? (100 / headerIcons.length).toString() + "%"
            : "20%",
        md:
          headerIcons.length <= 6
            ? (100 / headerIcons.length).toString() + "%"
            : "16.66666666%",
      }}
      maw={{
        base:
          headerIcons.length <= 3
            ? (70 * headerIcons.length).toString() + "px"
            : "306px",
        xs:
          headerIcons.length <= 4
            ? (70 * headerIcons.length).toString() + "px"
            : "376px",
        sm:
          headerIcons.length <= 5
            ? (70 * headerIcons.length).toString() + "px"
            : "446px",
        md:
          headerIcons.length <= 6
            ? (70 * headerIcons.length).toString() + "px"
            : "516px",
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
                  <VernacularGroupIcon
                    group={icon}
                    iconLink={coniferCycadLink}
                  />
                ) : (
                  <VernacularGroupIcon group={icon} />
                )}
              </Box>
            </Carousel.Slide>
          )
      )}
      {attributeHeaderIcons &&
        attributeHeaderIcons?.map(
          (icon, index) =>
            icon && (
              <Carousel.Slide pr="5px" pl="5px" key={index}>
                <Box
                  w="100%"
                  display="flex"
                  style={{ justifyContent: "center" }}
                >
                  <AttributeGroupIcon attribute={icon} />
                </Box>
              </Carousel.Slide>
            )
        )}
    </Carousel>
  );
}
