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
      value: value as string,
    }));

interface DatasetFiltersProps {
  filters: BoolFilterData[];
  loading: boolean;
  onChange: (filters: BoolFilterData[]) => void;
}

export function DatasetFilters({ filters, loading, onChange }: DatasetFiltersProps) {
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
      title="Dataset"
      description="Filter source datasets"
      icon={"/icons/data-type/Data type_ Sequence Archive.svg"}
      loading={loading}
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
