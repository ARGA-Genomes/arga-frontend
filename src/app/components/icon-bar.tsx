import { Conservation, Taxonomy } from "@/app/type";
import { Box, Group, ThemeIcon, Image, Tooltip } from "@mantine/core";


interface IconData {
  image: string,
  label: string,
  color: string,
}

const CONSERVATION_STATUS_ICON: Record<string, IconData> = {
  'Native': {
    image: 'native.svg',
    label: 'Native Species',
    color: 'wheat.4',
  },
  'Vulnerable': {
    image: 'threatened.svg',
    label: 'Vulnerable Species',
    color: 'wheat.6',
  },
  'Vulnerable (Wildfire)': {
    image: 'vulnerable_fire_light.svg',
    label: 'Vulnerable to Wildfire',
    color: 'bushfire.5',
  },
  'Endangered': {
    image: 'threatened_light.svg',
    label: 'Endangered Species',
    color: 'bushfire.4',
  },
  'Critically endangered': {
    image: 'threatened.svg',
    label: 'Critically endangered',
    color: 'red',
  },
  'Extinct': {
    image: 'threatened_light.svg',
    label: 'Extinct Species',
    color: 'black',
  },
}

const VERNACULAR_GROUP_ICON: Record<string, IconData> = {
  'bacteria': {
    image: 'bacteria.svg',
    label: 'Bacteria',
    color: 'shellfish.5',
  },
  'protists and other unicellular organisms': {
    image: 'protists.svg',
    label: 'Protists and other unicellular organisms',
    color: 'wheat.2',
  },
  'mushrooms and other fungi': {
    image: 'fungi.svg',
    label: 'Mushrooms and other fungi',
    color: 'bushfire.5',
  },
  'molluscs': {
    image: 'molluscs.svg',
    label: 'Molluscs',
    color: 'bushfire.4',
  },
  'marine crustaceans': {
    image: 'crustaceans.svg',
    label: 'Marine crustaceans',
    color: 'red',
  },
  'insects': {
    image: 'insects_light.svg',
    label: 'Insects',
    color: 'black',
  },
  'frogs and other amphibians': {
    image: 'frogs.svg',
    label: 'Frogs and other amphibians',
    color: 'moss.5',
  },
  'birds': {
    image: 'birds_light.svg',
    label: 'Birds',
    color: 'moss.7',
  },
  'mammals': {
    image: 'mammals.svg',
    label: 'Mammals',
    color: 'moss.3',
  },
  'seaweeds and other algae': {
    image: 'seaweed_light.svg',
    label: 'Seaweeds and other algae',
    color: 'shellfish',
  },
  'higher plants': {
    image: 'plants_light.svg',
    label: 'Higher plants',
    color: 'midnight',
  },
}

function ConservationIcon({ status }: { status: string }) {
  const icon = CONSERVATION_STATUS_ICON[status];

  return (
    <Tooltip label={icon?.label}>
      <ThemeIcon radius="xl" size={60} color={icon?.color} p={10}>
        <Image src={`/species-icons/${icon?.image}`} />
      </ThemeIcon>
    </Tooltip>
  )
}

function VernacularGroupIcon({ group }: { group: string }) {
  const icon = VERNACULAR_GROUP_ICON[group]

  return (
    <Tooltip label={icon?.label}>
      <ThemeIcon radius="xl" size={60} color={icon?.color} p={10}>
        <Image src={`/species-icons/${icon?.image}`} />
      </ThemeIcon>
    </Tooltip>
  )
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
    <ConservationIcon status="Native" />
    <ConservationIcon status="Vulnerable" />
    <ConservationIcon status="Vulnerable (Wildfire)" />
    <ConservationIcon status="Endangered" />
    <ConservationIcon status="Critically endangered" />
    <ConservationIcon status="Extinct" />
    </>
  )
}


interface IconBarProps {
  taxonomy: Taxonomy,
  conservation?: Conservation[],
}

export default function IconBar({ taxonomy, conservation }: IconBarProps) {
  return (
    <Box>
      <Group>
        { taxonomy.vernacularGroup ? <VernacularGroupIcon group={taxonomy.vernacularGroup} /> : null }
        { conservation?.map(cons => (
            <ConservationIcon status={cons.status} key={cons.status}/>
        ))}
      </Group>
    </Box>
  )
}
