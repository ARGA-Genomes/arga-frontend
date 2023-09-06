import { Stack, Select, Group, Avatar, Text } from "@mantine/core";
import { forwardRef } from "react";
import { Filter } from "./common";
import { constantCase, pascalCase } from "change-case";


interface GroupItem {
  label: string,
  image: string,
  link?: string,
}

const VERNACULAR_GROUPS: Record<string, GroupItem> = {
  BACTERIA: {
    label: "Bacteria",
    image: "/species-icons/bacteria.svg",
    link: "/kingdom/Bacteria",
  },
  PROTISTS_AND_OTHER_UNICELLULAR_ORGANISMS: {
    label: "Protists and other unicellular organisms",
    image: "/species-icons/protists.svg",
    link: "/kingdom/Protozoa",
  },
  FUNGI: {
    label: "Mushrooms and other fungi",
    image: "/species-icons/fungi.svg",
    link: "/kingdom/Fungi",
  },
  MOLLUSCS: {
    label: "Molluscs",
    image: "/species-icons/molluscs.svg",
    link: "/phylum/Mollusca",
  },
  CRUSTACEANS: {
    label: "Marine crustaceans",
    image: "/species-icons/crustaceans.svg",
  },
  INSECTS: {
    label: "Insects",
    image: "/species-icons/insects_light.svg",
    link: "/class/Insecta",
  },
  FROGS_AND_OTHER_AMPHIBIANS: {
    label: "Frogs and other amphibians",
    image: "/species-icons/frogs_light.svg",
    link: "/class/Amphibia",
  },
  BIRDS: {
    label: "Birds",
    image: "/species-icons/birds_light.svg",
    link: "/class/Aves",
  },
  MAMMALS: {
    label: "Mammals",
    image: "/species-icons/mammals.svg",
    link: "/class/Mammalia",
  },
  SEAWEEDS: {
    label: "Seaweeds",
    image: "/species-icons/seaweed_light.svg",
    link: "/kingdom/Chromista",
  },
  HIGHER_PLANTS: {
    label: "Higher plants",
    image: "/species-icons/plants_light.svg",
    link: "/kingdom/Plantae",
  },

  FLOWERING_PLANTS: {
      label: "Flowering plants",
      image: "/species-icons/plants_light.svg",
      link: "/kingdom/Plantae",
  },
  ANIMALS: {
      label: "Animals",
      image: "",
      link: "/kingdom/Animalia",
  },
  BROWN_ALGAE: {
      image: "",
      label: "Brown algae",
      link: "/phylum/Phaeophycea",
  },
  RED_ALGAE: {
      label: "Red algae",
      image: "",
      link: "/phylum/Rhodophyta",
  },
  GREEN_ALGAE: {
      label: "Green algae",
      image: "",
      link: "/phylum/Chlorophyta",
  },
  ECHINODERMS: {
      label: "Echinoderms",
      image: "",
      link: "/phylum/Echinodermata",
  },
  FIN_FISHES: {
      label: "Fin fishes",
      image: "",
      link: "/class/Actinopterygii",
  },
  CORALS_AND_JELLYFISHES: {
      label: "Corals and jellyfishes",
      image: "",
      link: "/phylum/Cnidaria",
  },
  CYANOBACTERIA: {
      label: "Cyanobacteria",
      image: "",
      link: "/phylum/Cyanobacteria",
  },
  SHARKS_AND_RAYS: {
      label: "Sharks and rays",
      image: "",
  },
};


interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  image: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, image, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);


interface VernacularGroupFiltersProps {
  value?: string,
  onChange: (item: Filter | undefined) => void,
}

export function VernacularGroupFilters({ value, onChange }: VernacularGroupFiltersProps) {
  const data = Object.entries(VERNACULAR_GROUPS).map(([key, value]) => {
    return { value: key, ...value }
  }).sort((a, b) => a.value.localeCompare(b.value));

  const changeFilter = (value: string | null) => {
    if (!value) return onChange(undefined);

    onChange({
      filter: "VERNACULAR_GROUP",
      action: "INCLUDE",
      value: pascalCase(value),
      editable: true,
    })
  }

  return (
    <Stack>
      <Select
        itemComponent={SelectItem}
        data={data}
        value={value ? constantCase(value) : null}
        clearable
        onChange={changeFilter}
      />
    </Stack>
  )
}
