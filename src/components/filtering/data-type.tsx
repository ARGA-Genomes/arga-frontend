import { Stack, Switch, Text } from "@mantine/core";
import { Filter } from "./common";
import { useListState } from "@mantine/hooks";
import { ChangeEvent, useEffect } from "react";

enum FilterKind {
  Taxon = "Taxon",
  Genome = "Genome",
  Locus = "Locus",
  Specimen = "Specimen",
}

interface DataTypeFiltersProps {
  filters: Filter[];
  onChange: (items: Filter[]) => void;
}

export function DataTypeFilters({ filters, onChange }: DataTypeFiltersProps) {
  const [items, handlers] = useListState<Filter>(filters);
  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const findFilter = (value: string): Filter => {
    // return items.find(item => item.value === value);
    return { editable: false };
  };

  const addFilter = (value: string) => {
    handlers.append({
      // filter: "DATA_TYPE",
      // action: "INCLUDE",
      // value,
      editable: true,
    });
  };

  const removeFilter = (value: string) => {
    // const idx = items.findIndex(item => item.value === value);
    // handlers.remove(idx);
  };

  const filterChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.checked) addFilter(ev.currentTarget.value);
    else removeFilter(ev.currentTarget.value);
  };

  const isDisabled = (dataType: FilterKind) => {
    const filter = findFilter(dataType);
    return filter && !filter.editable;
  };

  return (
    <Stack>
      <Switch
        label={<Text fz="sm">Species reports</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Taxon}
        checked={!!findFilter(FilterKind.Taxon)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Taxon)}
      />
      <Switch
        label={<Text fz="sm">Genomes</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Genome}
        checked={!!findFilter(FilterKind.Genome)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Genome)}
      />
      <Switch
        label={<Text fz="sm">Loci</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Locus}
        checked={!!findFilter(FilterKind.Locus)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Locus)}
      />
      <Switch
        label={<Text fz="sm">Specimens</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Specimen}
        checked={!!findFilter(FilterKind.Specimen)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Specimen)}
      />
    </Stack>
  );
}
