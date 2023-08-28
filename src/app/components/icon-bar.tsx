import { Conservation, IndigenousEcologicalKnowledge, Taxonomy } from "@/app/type";
import { Box, Group, ThemeIcon, Image, Tooltip, Text, Popover, Stack, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { CircleCheck, CircleX } from "tabler-icons-react";
import { AttributeIcon } from "./highlight-stack";

interface IconData {
  color: string;
  label?: string;
  image?: string;
  text?: string;
  text_color?: string;
  link?: string;
}

const CONSERVATION_STATUS_ICON: Record<string, IconData> = {
  native: {
    image: "native.svg",
    label: "Native Species",
    color: "wheat.4",
  },
  extinct: {
    text: "EX",
    label: "Extinct Species",
    color: "black",
    text_color: "red",
  },
  "extinct in the wild": {
    text: "EW",
    label: "Extinct in the Wild",
    color: "black",
  },
  "critically endangered": {
    text: "CR",
    label: "Critically Endangered",
    color: "red",
  },
  endangered: {
    text: "EN",
    label: "Endangered Species",
    color: "bushfire.4",
    text_color: "bushfire.0",
  },
  vulnerable: {
    text: "VU",
    label: "Vulnerable Species",
    color: "wheat.5",
  },
  "vulnerable (wildfire)": {
    text: "VU",
    label: "Vulnerable to Wildfire",
    color: "bushfire.5",
  },
  threatened: {
    text: "VU",
    label: "Threatened Species",
    color: "wheat.5",
  },
  rare: {
    text: "RA",
    label: "Rare Species",
    color: "shellfish.6",
    text_color: "moss.1",
  },
  "near threatened": {
    text: "NT",
    label: "Near Threatened Species",
    color: "shellfish.6",
    text_color: "moss.1",
  },
  "least concern": {
    text: "LC",
    label: "Least concern",
    color: "shellfish.6",
  },
  unlisted: {
    text: "UL",
    label: "Unlisted",
    color: "shellfish.6",
  },
  no_status: {
    image: "threatened.svg",
    color: "gray",
  }
};

const VERNACULAR_GROUP_ICON: Record<string, IconData> = {
  bacteria: {
    image: "bacteria.svg",
    label: "Bacteria",
    color: "shellfish.5",
    link: "/kingdom/Bacteria",
  },
  "protists and other unicellular organisms": {
    image: "protists.svg",
    label: "Protists and other unicellular organisms",
    color: "wheat.2",
    link: "/kingdom/Protozoa",
  },
  "mushrooms and other fungi": {
    image: "fungi.svg",
    label: "Mushrooms and other fungi",
    color: "bushfire.5",
  },
  molluscs: {
    image: "molluscs.svg",
    label: "Molluscs",
    color: "bushfire.4",
    link: "/phylum/Mollusca",
  },
  "marine crustaceans": {
    image: "crustaceans.svg",
    label: "Marine crustaceans",
    color: "red",
    link: "/order/Crustacea",
  },
  insects: {
    image: "insects_light.svg",
    label: "Insects",
    color: "black",
    link: "/class/Insecta",
  },
  "frogs and other amphibians": {
    image: "frogs_light.svg",
    label: "Frogs and other amphibians",
    color: "moss.5",
    link: "/order/Anura",
  },
  birds: {
    image: "birds_light.svg",
    label: "Birds",
    color: "moss.7",
    link: "/class/Aves",
  },
  mammals: {
    image: "mammals.svg",
    label: "Mammals",
    color: "moss.3",
    link: "/class/Mammalia",
  },
  "seaweeds and other algae": {
    image: "seaweed_light.svg",
    label: "Seaweeds and other algae",
    color: "shellfish",
  },
  "higher plants": {
    image: "plants_light.svg",
    label: "Higher plants",
    color: "midnight",
    link: "/kingdom/Plantae",
  },
};

const INDIGENOUS_LANGUAGE_GROUP_ICON: Record<string, IconData> = {
  "Kamilaroi Plant and Animal Encyclopaedia": {
    label: "Kamilaroi Plant and Animal Encyclopaedia",
    image: "iek_kamilaroi.svg",
    color: "#f47c2e",
    link: "/browse/datasets/Kamilaroi_Plant_and_Animal_Encyclopaedia",
  },
  "South East Arnhem Land": {
    label: "South East Arnhem Land",
    image: "iek_south_east_arnhem_land.svg",
    color: "#a2c36e",
    link: "/browse/datasets/South_East_Arnhem_Land",
  },
  "Noongar Boodjar Plants and Animals": {
    label: "Noongar Boodjar Plants and Animals",
    image: "iek_noongar_boodjar.svg",
    color: "#fec743",
    link: "/browse/datasets/Noongar_Boodjar_Plants_and_Animals",
  },
}

function ConservationIcon({ status, source }: { status: string, source: string | undefined }) {
  const icon = CONSERVATION_STATUS_ICON[status] || CONSERVATION_STATUS_ICON.no_status;
  const tooltip = `${icon.label || status} | ${source}`;

  return (
    <Tooltip label={tooltip}>
      <ThemeIcon radius="xl" size={60} color={icon.color} p={10}>
        {icon.text &&
         <Text weight={700} fz={30} color={icon.text_color || "white"}>
           {icon.text}
         </Text>
        }
        {icon.image &&
         <Image
           src={`/species-icons/${icon?.image}`}
           alt={icon.label || status}
         />
        }
      </ThemeIcon>
    </Tooltip>
  );
}

function VernacularGroupIcon({ group }: { group: string }) {
  const icon = VERNACULAR_GROUP_ICON[group];
  const component = (
    <Tooltip label={icon?.label}>
      <ThemeIcon radius="xl" size={60} color={icon?.color} p={10}>
        <Image
          src={`/species-icons/${icon?.image}`}
          alt={`Icon of ${icon.label}`}
        />
      </ThemeIcon>
    </Tooltip>
  );

  return (
    <Tooltip label={icon?.label}>
      {icon?.link ? <Link href={icon?.link}>{component}</Link> : component}
    </Tooltip>
  );
}

interface IndigenousLanguageGroupIconProps {
  group: string,
  trait: IndigenousEcologicalKnowledge,
}

function IndigenousLanguageGroupIcon({ group, trait }: IndigenousLanguageGroupIconProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const extraDimmed = 'rgba(134, 142, 150, .3)';

  const icon = INDIGENOUS_LANGUAGE_GROUP_ICON[group];
  const component = (
    <Popover position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <ThemeIcon radius="xl" size={60} color={icon?.color} p={10} onMouseEnter={open} onMouseLeave={close}>
          <Image src={`/species-icons/${icon?.image}`} alt="" />
        </ThemeIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Text>{icon?.label}</Text>
          <Text size="sm"><strong>Name:</strong> {trait.name}</Text>
          <SimpleGrid cols={3}>
            <AttributeIcon label="Food use" icon={trait.foodUse ? <CircleCheck color="green" /> : <CircleX color={extraDimmed} />} />
            <AttributeIcon label="Medicinal use" icon={trait.medicinalUse ? <CircleCheck color="green" /> : <CircleX color={extraDimmed} />} />
            <AttributeIcon label="Cultural connection" icon={trait.culturalConnection ? <CircleCheck color="green" /> : <CircleX color={extraDimmed} />} />
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );

  return (
    <>
      {icon?.link ? <Link href={icon.link}>{component}</Link> : component}
    </>
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
  taxonomy: Taxonomy,
  conservation?: Conservation[],
  traits?: IndigenousEcologicalKnowledge[],
}

export default function IconBar({ taxonomy, conservation, traits }: IconBarProps) {
  return (
    <Box>
      <Group>
        {taxonomy.vernacularGroup ? (
          <VernacularGroupIcon group={taxonomy.vernacularGroup} />
        ) : null}
        {conservation?.map((cons) => (
          <ConservationIcon
            status={cons.status.toLowerCase()}
            source={cons.source}
            key={cons.status + cons.source}
          />
        ))}
        {traits?.map((trait) => (
          <IndigenousLanguageGroupIcon
            group={trait.datasetName}
            trait={trait}
            key={trait.id}
          />
        ))}
      </Group>
    </Box>
  );
}
