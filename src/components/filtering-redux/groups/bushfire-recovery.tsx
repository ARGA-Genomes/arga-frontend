import { useEffect } from "react";
import { FilterGroup } from "../group";

import { FilterType, FilterItem } from "../filters/common";
import { BoolFilter, BoolFilterData } from "../filters/bool";

export const bushfireRecoveryFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, value }) => ({
      filter: FilterType.Attribute,
      action: include ? "INCLUDE" : "EXCLUDE",
      value: [
        {
          name: value,
          value: true,
        },
      ],
    }));

interface BushfireRecoveryFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function BushfireRecoveryFilters({ filters, onChange }: BushfireRecoveryFiltersProps) {
  // Event handlers for filter chip bools
  const handleActiveToggle = (value: string, active: boolean) =>
    onChange(
      filters.map((newFilter) =>
        newFilter.value === value
          ? {
              ...newFilter,
              active,
            }
          : newFilter
      )
    );

  const handleIncludeToggle = (value: string, include: boolean) =>
    onChange(
      filters.map((newFilter) =>
        newFilter.value === value
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
          key={filter.value}
          {...filter}
          options={["Include", "Exclude"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.value, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.value, include)}
        />
      ))}
    </FilterGroup>
  );
}

const DEFAULT_TRAITS = [
  "vulnerable_wildfire",
  "Interactive effects of fire and drought",
  "Fire-disease interactions",
  "High fire severity",
  "Weed invasion",
  "Elevated winter temperatures or changed temperature regimes",
  "Fire sensitivity",
  "Post-fire erosion",
  "Post-fire herbivore impacts",
  "Cumulative exposure to high risks",
  "Other plausible threats or expert-driven nominations",
];

export const DEFAULT_BUSHFIRE_RECOVERY_FILTERS: BoolFilterData[] = DEFAULT_TRAITS.map((value) => ({
  value,
  active: false,
  disabled: false,
  include: true,
}));
