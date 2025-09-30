import { useEffect } from "react";
import { FilterGroup } from "../group";

import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const otherFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
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

interface OtherFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function OtherFilters({ filters, onChange }: OtherFiltersProps) {
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
      title="Other"
      description="Filter for other attributes"
      icon={"/icons/list-group/List group_ Australian iconic species.svg"}
    >
      {filters.map((filter) => (
        <BoolFilter
          {...filter}
          key={filter.name}
          options={["Include", "Exclude"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.name, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.name, include)}
        />
      ))}
    </FilterGroup>
  );
}

const DEFAULT_OTHER = [
  {
    name: "australian_iconic_species",
    label: "Australian Iconic Species",
    value: true,
  },
];

export const DEFAULT_OTHER_FILTERS: BoolFilterData[] = DEFAULT_OTHER.map((filter) => ({
  ...filter,
  active: false,
  disabled: false,
  include: true,
}));
