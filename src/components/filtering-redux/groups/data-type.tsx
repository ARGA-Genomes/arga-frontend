import { useEffect } from "react";
import { FilterGroup } from "../group";

import { InputQueryAttribute, SEARCH_ATTRIBUTES_MAP } from "@/components/search";
import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const dataTypeFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, value }) => ({
      filter: FilterType.HasData,
      action: include ? "INCLUDE" : "EXCLUDE",
      value,
    }));

export const searchDataTypeFiltersToQuery = (filters: BoolFilterData[]): InputQueryAttribute[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, value }) => ({
      ...SEARCH_ATTRIBUTES_MAP["data_type"],
      value: value,
      include,
    }));

interface DataTypeFiltersProps {
  filters: BoolFilterData[];
  boolOptions?: [string, string];
  onChange: (filters: BoolFilterData[]) => void;
}

export function DataTypeFilters({ filters, boolOptions, onChange }: DataTypeFiltersProps) {
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
      title="Data types"
      description="Filter species that have specific types of data"
      icon={"/icons/data-type/Data type_ DNA.svg"}
    >
      {filters.map((filter) => (
        <BoolFilter
          key={filter.value}
          {...filter}
          options={boolOptions || ["Has", "Missing"]}
          onActiveToggle={(checked) => handleActiveToggle(filter.value, checked)}
          onIncludeToggle={(include) => handleIncludeToggle(filter.value, include)}
        />
      ))}
    </FilterGroup>
  );
}

export const DEFAULT_DATA_TYPE_FILTERS = ["Genome", "Locus", "Specimen", "Other"].map((value) => ({
  value,
  active: false,
  disabled: false,
  include: true,
}));

export const DEFAULT_SEARCH_DATA_TYPE_FILTERS = ["Taxon", "Genome", "Locus", "Specimen"].map((value) => ({
  value,
  active: false,
  disabled: false,
  include: true,
}));
