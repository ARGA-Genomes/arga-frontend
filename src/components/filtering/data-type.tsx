import { Stack, Switch, Text } from "@mantine/core";
import { Filter } from "./common";
import { useListState } from "@mantine/hooks";
import { ChangeEvent, useEffect } from "react";


enum FilterKind {
  Genomes = 'Genome',
  Loci = 'Locus',
  Specimens = 'Specimen',
  Other = 'Other',
}


interface DataTypeFiltersProps {
  filters: Filter[],
  onChange: (items: Filter[]) => void,
}

export function DataTypeFilters({ filters, onChange }: DataTypeFiltersProps) {
  const [items, handlers] = useListState<Filter>(filters);
  useEffect(() => onChange(items), [items, onChange]);

  const findFilter = (value: string) => {
    return items.find(item => item.value === value)
  }

  const addFilter = (value: string) => {
    handlers.append({
      filter: "HAS_DATA",
      action: "INCLUDE",
      value,
      editable: true,
    })
  }

  const removeFilter = (value: string) => {
    const idx = items.findIndex(item => item.value === value);
    handlers.remove(idx);
  }

  const filterChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.checked)
      addFilter(ev.currentTarget.value);
    else
      removeFilter(ev.currentTarget.value);
  }

  return (
    <Stack>
    <Switch
      label={<Text fz="sm">Genomes</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      value={FilterKind.Genomes}
      checked={!!findFilter(FilterKind.Genomes)}
      onChange={filterChanged}
    />
    <Switch
      label={<Text fz="sm">Loci</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      value={FilterKind.Loci}
      checked={!!findFilter(FilterKind.Loci)}
      onChange={filterChanged}
    />
    <Switch
      label={<Text fz="sm">Specimens</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      value={FilterKind.Specimens}
      checked={!!findFilter(FilterKind.Specimens)}
      onChange={filterChanged}
    />
    <Switch
      label={<Text fz="sm">Other</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      value={FilterKind.Other}
      checked={!!findFilter(FilterKind.Other)}
      onChange={filterChanged}
    />
    </Stack>
  )
}
