import { Stack, Switch, Text } from "@mantine/core";
import { Filter, FilterKind } from "./common";
import { useListState } from "@mantine/hooks";
import { ChangeEvent, useEffect } from "react";

interface HasDataFiltersProps {
  filters: Filter[];
  onChange: (items: Filter[]) => void;
}

export function HasDataFilters({ filters, onChange }: HasDataFiltersProps) {
  const [items, handlers] = useListState<Filter>(filters);
  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const findFilter = (value: string) => {
    return items.find((item) => item.hasData === value);
  };

  const addFilter = (value: FilterKind) => {
    handlers.append({
      hasData: value,
      editable: true,
    });
  };

  const removeFilter = (value: string) => {
    const idx = items.findIndex((item) => item.hasData === value);
    handlers.remove(idx);
  };

  const filterChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.checked) addFilter(ev.currentTarget.value as FilterKind);
    else removeFilter(ev.currentTarget.value);
  };

  const isDisabled = (dataType: FilterKind) => {
    const filter = findFilter(dataType);
    return filter && !filter.editable;
  };

  return (
    <Stack>
      <Switch
        label={<Text fz="sm">Genomes</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Genomes}
        checked={!!findFilter(FilterKind.Genomes)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Genomes)}
      />
      <Switch
        label={<Text fz="sm">Loci</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Loci}
        checked={!!findFilter(FilterKind.Loci)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Loci)}
      />
      <Switch
        label={<Text fz="sm">Specimens</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Specimens}
        checked={!!findFilter(FilterKind.Specimens)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Specimens)}
      />
      <Switch
        label={<Text fz="sm">Other</Text>}
        onLabel="SHOW"
        offLabel="HIDE"
        size="lg"
        value={FilterKind.Other}
        checked={!!findFilter(FilterKind.Other)}
        onChange={filterChanged}
        disabled={isDisabled(FilterKind.Other)}
      />
    </Stack>
  );
}
