import { FilterGroup } from "../group";

import { Group, Image, SegmentedControl, Select, SelectProps, Text } from "@mantine/core";
import { useMemo } from "react";
import { BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

import { TAXON_ICONS } from "@/components/icon-bar";
import { IconCheck } from "@tabler/icons-react";
import classes from "./vernacular-group.module.css";

enum VernacularGroup {
  FloweringPlants = "Flowering Plants",
  Animals = "Animals",
  BrownAlgae = "Brown Algae",
  RedAlgae = "Red Algae",
  GreenAlgae = "Green Algae",
  Crustaceans = "Crustaceans",
  Echinoderms = "Echinoderms",
  FinFishes = "Fin Fishes",
  CoralsAndJellyfishes = "Corals And Jellyfishes",
  Cyanobacteria = "Cyanobacteria",
  Molluscs = "Molluscs",
  SharksAndRays = "Sharks And Rays",
  Insects = "Insects",
  Fungi = "Fungi",
  Spiders = "Spiders",
  Reptiles = "Reptiles",
  Sponges = "Sponges",
  Bacteria = "Bacteria",
  ProtistsAndOtherUnicellularOrganisms = "Protists And Other Unicellular Organisms",
  FrogsAndOtherAmphibians = "Frogs And Other Amphibians",
  Birds = "Birds",
  Mammals = "Mammals",
  HigherPlants = "Higher Plants",
  Mosses = "Mosses",
  Liverworts = "Liverworts",
  Hornworts = "Hornworts",
  Diatoms = "Diatoms",
  Chromists = "Chromists",
  ConifersAndCycads = "Conifers And Cycads",
  Ferns = "Ferns",
}

export const vernacularGroupFilterToQuery = (filter: BoolFilterData | null): FilterItem[] =>
  filter
    ? [
        {
          filter: FilterType.VernacularGroup,
          action: filter.include ? "INCLUDE" : "EXCLUDE",
          value: filter.value.replaceAll(" ", ""),
        },
      ]
    : [];

interface VernacularGroupFilterProps {
  filter: BoolFilterData | null;
  onChange: (filter: BoolFilterData | null) => void;
}

const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => {
  const group = TAXON_ICONS[option.value.toUpperCase().replaceAll(" ", "_")];

  return (
    <Group justify="space-between" flex="1" style={{ flexGrow: 1 }} gap="xs">
      <Text size="sm">{group.label}</Text>
      <Group gap="xs">
        {checked && <IconCheck size="1rem" color="#020202" />}
        <Image w={25} h={25} src={group?.image || ""} />
      </Group>
    </Group>
  );
};

export function VernacularGroupFilter({ filter, onChange }: VernacularGroupFilterProps) {
  const data = useMemo(() => Object.values(VernacularGroup).sort(), []);

  // Event handlers for filter chip bools
  const handleIncludeToggle = (include: boolean) =>
    onChange(
      filter
        ? {
            ...filter,
            include,
          }
        : null
    );

  return (
    <FilterGroup
      title="Vernacular group"
      description="Filter species by vernacular group"
      icon={"/icons/data-type/Data type_ Species (and subspecies) report.svg"}
    >
      <Group>
        <Select
          value={filter?.value || null}
          classNames={classes}
          radius="lg"
          data={data}
          onChange={(value) =>
            onChange(
              value
                ? {
                    value,
                    active: true,
                    include: true,
                    disabled: false,
                  }
                : null
            )
          }
          comboboxProps={{ transitionProps: { transition: "pop" } }}
          placeholder="Choose vernacular group"
          renderOption={renderSelectOption}
          searchable
          clearable
        />
        <SegmentedControl
          value={filter?.include ? "Include" : "Exclude"}
          onChange={(value) => handleIncludeToggle(value === "Include" ? true : false)}
          disabled={!filter}
          radius="lg"
          size="xs"
          data={["Include", "Exclude"]}
        />
      </Group>
    </FilterGroup>
  );
}
