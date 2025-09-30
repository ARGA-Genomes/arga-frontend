import { useEffect } from "react";
import { FilterGroup } from "../group";

import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const bushfireRecoveryFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, name, value }) => ({
      filter: FilterType.Attribute,
      action: include ? "INCLUDE" : "EXCLUDE",
      value: [
        {
          name,
          value,
        },
      ],
    }));

interface BushfireRecoveryFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function BushfireRecoveryFilters({ filters, onChange }: BushfireRecoveryFiltersProps) {
  // Event handlers for filter chip bools
  const handleActiveToggle = (name: string, active: boolean) =>
    onChange(
      filters.map((newFilter) =>
        newFilter.name === name
          ? {
              ...newFilter,
              active,
            }
          : newFilter
      )
    );

  const handleIncludeToggle = (name: string, include: boolean) =>
    onChange(
      filters.map((newFilter) =>
        newFilter.name === name
          ? {
              ...newFilter,
              include,
            }
          : newFilter
      )
    );

  // Trigger the onChange prop when the filters change
  useEffect(() => onChange(filters), [filters, onChange]);

  return (
    <FilterGroup
      title="Bushfire recovery"
      description="Filter species with bushfire recovery traits"
      icon={"/icons/list-group/List group_ Bushfire vulnerable.svg"}
    >
      {filters.map((filter) => (
        <BoolFilter
          key={filter.name}
          {...filter}
          options={["Include", "Exclude"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.name, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.name, include)}
        />
      ))}
    </FilterGroup>
  );
}

const DEFAULT_BUSHFIRE = [
  {
    name: "wildfire_vulnerable_icon",
    label: "Wildfire vulnerable",
  },
  {
    name: "interactive_effects_of_fire_and_drought",
    label: "Interactice effect of fire and drought",
  },
  {
    name: "fire_disease_interactions",
    label: "Fire/disease interactions",
  },
  {
    name: "high_fire_severity",
    label: "High fire severity",
  },
  {
    name: "weed_invasion",
    label: "Weed invasion",
  },
  {
    name: "elevated_winter_temperature_or_changed_temperature_regimes",
    label: "Elevanted winter temps/changes temp regimes",
  },
  {
    name: "fire_sensitivity",
    label: "Fire sensitivity",
  },
  {
    name: "post_fire_erosion",
    label: "Post-fire erosion",
  },
  {
    name: "cumulative_exposure_to_high_risks",
    label: "Cumulative exposure to high risks",
  },
  {
    name: "other_plausible_threats_or_expert_driven_nominations",
    label: "Other plausible threats or expert driven nominations",
  },
];

export const DEFAULT_BUSHFIRE_RECOVERY_FILTERS: BoolFilterData[] = DEFAULT_BUSHFIRE.map((filter) => ({
  ...filter,
  value: true,
  active: false,
  disabled: false,
  include: true,
}));
