import { useEffect } from "react";
import { FilterGroup } from "../group";

import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const otherFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
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

interface OtherFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function OtherFilters({ filters, onChange }: OtherFiltersProps) {
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
      title="Other"
      description="Filter for other attributes"
      icon={"/icons/list-group/List group_ Australian iconic species.svg"}
    >
      {filters.map((filter) => (
        <BoolFilter
          {...filter}
          key={filter.value}
          options={["Include", "Exclude"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.value, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.value, include)}
        />
      ))}
    </FilterGroup>
  );
}

export const DEFAULT_OTHER_LABELS: { [key: string]: string } = {
  australian_iconic_species: "Australian Iconic Species",
};

export const DEFAULT_OTHER_FILTERS: BoolFilterData[] = Object.entries(DEFAULT_OTHER_LABELS).map(([value, label]) => ({
  value,
  label,
  active: false,
  disabled: false,
  include: true,
}));
