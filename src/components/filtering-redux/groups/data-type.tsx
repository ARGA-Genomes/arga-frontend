import { useEffect } from "react";
import { FilterGroup } from "../group";

import { FilterType, FilterItem } from "../filters/common";
import { BoolFilter } from "../filters/bool";

export interface DataTypeFilter {
  value: string;
  active: boolean;
  include: boolean;
  disabled: boolean;
}

export const dataTypeFiltersToQuery = (filters: DataTypeFilter[]): FilterItem[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, value }) => ({
      filter: FilterType.HasData,
      action: include ? "INCLUDE" : "EXCLUDE",
      value,
    }));

interface DataTypeFiltersProps {
  filters: DataTypeFilter[];
  onChange: (filters: DataTypeFilter[]) => void;
}

export function DataTypeFilters({ filters, onChange }: DataTypeFiltersProps) {
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
