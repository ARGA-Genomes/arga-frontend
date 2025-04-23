import { useEffect } from "react";
import { FilterGroup } from "../group";

import { FilterType, FilterItem } from "../filters/common";
import { BoolFilter, BoolFilterData } from "../filters/bool";

export const threatenedFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
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

interface ThreatenedFiltersProps {
  filters: BoolFilterData[];
  onChange: (filters: BoolFilterData[]) => void;
}

export function ThreatenedFilters({ filters, onChange }: ThreatenedFiltersProps) {
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
      title="Threatened"
      description="Filter threatened species"
      icon={"/icons/list-group/List group_ Threatened species.svg"}
    >
      {filters.map((filter) => (
        <BoolFilter
          {...filter}
          key={filter.value}
          label={DEFAULT_THREATENED_LABELS[filter.value]}
          options={["Include", "Exclude"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.value, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.value, include)}
        />
      ))}
    </FilterGroup>
  );
}

export const DEFAULT_THREATENED_LABELS: { [key: string]: string } = {
  EPBC_act_category_CR: "EPBC Critically Endangered",
  EPBC_act_category_EN: "EPBC Endangered",
  EPBC_act_category_EW: "EPBC Extinct in the Wild",
  EPBC_act_category_EX: "EPBC Extinct",
  EPBC_act_category_VU: "EPBC Vulnerable",
  EPBC_act_category_cd: "EPBC Conservation Dependant",
};

export const DEFAULT_THREATENED_FILTERS: BoolFilterData[] = Object.keys(DEFAULT_THREATENED_LABELS).map((value) => ({
  value,
  active: false,
  disabled: false,
  include: true,
}));
