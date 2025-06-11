import { FilterGroup } from "../group";

import { InputQueryAttribute, SEARCH_ATTRIBUTES_MAP } from "@/components/search";
import { Stack } from "@mantine/core";
import { useCallback } from "react";
import { FilterItem, FilterType } from "../filters/common";
import { TaxonAutocomplete, TaxonFilter, TaxonSearch } from "../filters/taxon";

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

export const searchClassificationFiltersToQuery = (filters: ClassificationFilter[]): InputQueryAttribute[] =>
  filters
    .filter(({ rank }) => Boolean(SEARCH_ATTRIBUTES_MAP[rank.toLowerCase()]))
    .map(({ include, rank, name }) => ({
      ...SEARCH_ATTRIBUTES_MAP[rank.toLowerCase()],
      value: name,
      include,
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
