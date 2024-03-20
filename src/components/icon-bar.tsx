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
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { AttributeIcon } from "./highlight-stack";
import { useEffect, useState } from "react";

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
    link: "/regnum/Plantae",
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

function VernacularGroupIcon({ group }: { group: string }) {
  const icon = VERNACULAR_GROUP_ICON[group];
  if (!icon) return null;

  const component = (
    <Tooltip label={icon.label}>
      <ThemeIcon radius="xl" size={60} p={10} variant="transparent">
        <Image src={icon.image} alt={`Icon of ${icon.label}`} w={60} />
      </ThemeIcon>
    </Tooltip>
  );

  return (
    <>{icon.link ? <Link href={icon.link}>{component}</Link> : component}</>
  );
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
                  <CircleCheck color="green" />
                ) : (
                  <CircleX color={extraDimmed} />
                )
              }
            />
            <AttributeIcon
              label="Medicinal use"
              icon={
                trait.medicinalUse ? (
                  <CircleCheck color="green" />
                ) : (
                  <CircleX color={extraDimmed} />
                )
              }
            />
            <AttributeIcon
              label="Cultural connection"
              icon={
                trait.culturalConnection ? (
                  <CircleCheck color="green" />
                ) : (
                  <CircleX color={extraDimmed} />
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

interface IconBarProps {
  taxonomy: Taxonomy;
  conservation?: Conservation[];
  traits?: IndigenousEcologicalKnowledge[];
}

export default function IconBar({
  taxonomy,
  conservation,
  traits,
}: IconBarProps) {
  const headerIcons = [taxonomy.vernacularGroup];

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
      {headerIcons.map(
        (icon) =>
          icon && (
            <Carousel.Slide pr="5px" pl="5px">
              <Box w="100%" display="flex" style={{ justifyContent: "center" }}>
                <VernacularGroupIcon group={icon} />
              </Box>
            </Carousel.Slide>
          )
      )}
    </Carousel>
    // <Box>
    //   <Group>
    //     {taxonomy?.vernacularGroup ? (
    //       <VernacularGroupIcon group={taxonomy.vernacularGroup} />
    //     ) : null}
    //     {conservation?.map((cons) => (
    //       <ConservationIcon
    //         status={cons.status.toLowerCase()}
    //         source={cons.source}
    //         key={cons.status + cons.source}
    //       />
    //     ))}
    //     {traits?.map((trait) => (
    //       <IndigenousLanguageGroupIcon
    //         group={trait.datasetName}
    //         trait={trait}
    //         key={trait.id}
    //       />
    //     ))}
    //   </Group>
    // </Box>
  );
}
