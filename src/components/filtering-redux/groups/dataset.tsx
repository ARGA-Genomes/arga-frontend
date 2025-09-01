import { useEffect } from "react";
import { FilterGroup } from "../group";

import { BoolFilter, BoolFilterData } from "../filters/bool";
import { FilterItem, FilterType } from "../filters/common";

export const datasetFiltersToQuery = (filters: BoolFilterData[]): FilterItem[] =>
  filters
    .filter(({ active }) => active)
    .map(({ include, value }) => ({
      filter: FilterType.Dataset,
      action: include ? "INCLUDE" : "EXCLUDE",
      value,
    }));

interface DatasetFiltersProps {
  filters: BoolFilterData[];
  loading: boolean;
  onChange: (filters: BoolFilterData[]) => void;
}

export function DatasetFilters({ filters, loading, onChange }: DatasetFiltersProps) {
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
      title="Dataset"
      description="Filter source datasets"
      icon={"/icons/data-type/Data type_ Sequence Archive.svg"}
      loading={loading}
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
