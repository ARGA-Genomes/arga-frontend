import { Stack, Select, Group, Avatar, Text } from "@mantine/core";
import { forwardRef } from "react";
import { Filter } from "./common";
import { constantCase, pascalCase } from "change-case";

interface GroupItem {
  label: string;
  image: string;
  link?: string;
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
  HIGHER_PLANTS: {
    label: "Higher plants",
    image: "/species-icons/plants.svg",
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

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  image: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, image, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group wrap="nowrap">
        <Avatar src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);
SelectItem.displayName = "SelectItem";

interface VernacularGroupFiltersProps {
  value?: string;
  onChange: (item: Filter | undefined) => void;
}

export function VernacularGroupFilters({
  value,
  onChange,
}: VernacularGroupFiltersProps) {
  const data = Object.entries(VERNACULAR_GROUPS)
    .map(([key, value]) => {
      return { value: key, ...value };
    })
    .sort((a, b) => a.value.localeCompare(b.value));

  const changeFilter = (value: string | null) => {
    if (!value) { onChange(undefined); return; }

    onChange({
      filter: "VERNACULAR_GROUP",
      action: "INCLUDE",
      value: pascalCase(value),
      editable: true,
    });
  };

  return (
    <Stack>
      <Select
        data={data}
        value={value ? constantCase(value) : null}
        clearable
        onChange={changeFilter}
      />
    </Stack>
  );
}
