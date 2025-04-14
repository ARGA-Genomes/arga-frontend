import { FilterGroup } from "../group";

import { FilterType, FilterItem } from "../filters/common";
import { TaxonAutocomplete, TaxonFilter, TaxonSearch } from "../filters/taxon";
import { useCallback } from "react";
import { Stack } from "@mantine/core";

export interface ClassificationFilter {
  guid: string;
  name: string;
  rank: string;
  include: boolean;
  disabled: boolean;
}

export const classificationFiltersToQuery = (filters: ClassificationFilter[]): FilterItem[] =>
  filters.map(({ include, rank, name }) => ({
    filter: rank.toUpperCase() as FilterType,
    action: include ? "INCLUDE" : "EXCLUDE",
    value: name,
  }));

interface ClassificationFiltersProps {
  filters: ClassificationFilter[];
  onChange: (filters: ClassificationFilter[]) => void;
}

export function ClassificationFilters({ filters, onChange }: ClassificationFiltersProps) {
  const handleAdd = useCallback(
    (newTaxon: TaxonAutocomplete) => {
      if (!filters.map((taxon) => taxon.guid).includes(newTaxon.guid)) {
        onChange([
          ...filters,
          {
            guid: newTaxon.guid,
            name: newTaxon.name,
            rank: newTaxon.rankString.toUpperCase(),
            include: true,
            disabled: false,
          },
        ]);
      }
    },
    [filters, onChange]
  );

  const handleRemove = useCallback(
    (guid: string) => onChange(filters.filter((taxon) => taxon.guid !== guid)),
    [filters, onChange]
  );

  const handleIncludeToggle = useCallback(
    (guid: string, include: boolean) =>
      onChange(
        filters.map((newFilter) =>
          newFilter.guid === guid
            ? {
                ...newFilter,
                include,
              }
            : newFilter
        )
      ),
    [filters]
  );

  return (
    <FilterGroup
      title="Higher classification"
      description="Filter species based on taxonomy"
      icon={"/icons/data-type/Data type_ Higher taxon report.svg"}
    >
      <Stack gap="xs">
        {filters.map((taxon) => (
          <TaxonFilter
            key={taxon.guid}
            onRemove={() => handleRemove(taxon.guid)}
            onIncludeToggle={(include) => handleIncludeToggle(taxon.guid, include)}
            {...taxon}
          />
        ))}
        <TaxonSearch onSelect={handleAdd} />
      </Stack>
    </FilterGroup>
  );
}
