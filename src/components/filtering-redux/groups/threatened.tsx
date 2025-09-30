import { useEffect } from "react";
import { FilterGroup } from "../group";

import { threatened } from "@/app/browse/list-groups/_data/threatened";
import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const threatenedFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
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

interface ThreatenedFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function ThreatenedFilters({ filters, onChange }: ThreatenedFiltersProps) {
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
      title="Threatened"
      description="Filter threatened species"
      icon={"/icons/list-group/List group_ Threatened species.svg"}
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

const DEFAULT_THREATENED = [
  {
    name: "top_110_species",
    label: "Top 110 Species",
    value: true,
  },
  // EPBC & IUCN
  ...threatened
    .filter((item) => item.category.startsWith("IUCN") || item.category.startsWith("EPBC"))
    .map((item) => ({
      name: (item.filter as { name: string }).name,
      label: item.category,
      value: true,
    })),
];

export const DEFAULT_THREATENED_FILTERS: BoolFilterData[] = DEFAULT_THREATENED.map((filter) => ({
  ...filter,
  active: false,
  disabled: false,
  include: true,
}));
