import { Conservation, Taxonomy } from "@/app/type";
import { Box, Group, ThemeIcon, Image, Tooltip } from "@mantine/core";


interface IconData {
  image: string,
  label: string,
  color: string,
}

const CONSERVATION_STATUS_ICON: Record<string, IconData> = {
  'native': {
    image: 'native.svg',
    label: 'Native Species',
    color: 'wheat.4',
  },
  'vulnerable': {
    image: 'threatened.svg',
    label: 'Vulnerable Species',
    color: 'wheat.6',
  },
  'vulnerable (wildfire)': {
    image: 'vulnerable_fire_light.svg',
    label: 'Vulnerable to Wildfire',
    color: 'bushfire.5',
  },
  'endangered': {
    image: 'threatened_light.svg',
    label: 'Endangered Species',
    color: 'bushfire.4',
  },
  'critically endangered': {
    image: 'threatened.svg',
    label: 'Critically endangered',
    color: 'red',
  },
  'extinct': {
    image: 'threatened_light.svg',
    label: 'Extinct Species',
    color: 'black',
  },
  'least concern': {
    image: 'threatened.svg',
    label: 'Least concern',
    color: 'moss.4',
  },
  'unlisted': {
    image: 'threatened.svg',
    label: 'Unlisted',
    color: 'moss.4',
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
    <Tooltip label={icon?.label || status}>
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
    <ConservationIcon status="native" />
    <ConservationIcon status="vulnerable" />
    <ConservationIcon status="vulnerable (wildfire)" />
    <ConservationIcon status="endangered" />
    <ConservationIcon status="critically endangered" />
    <ConservationIcon status="extinct" />
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
          <ConservationIcon status={cons.status.toLowerCase()} key={cons.status}/>
        ))}
      </Group>
    </Box>
  )
}
