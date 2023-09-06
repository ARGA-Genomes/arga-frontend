import { Button, Stack, Grid, Select, Flex } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Minus, Plus } from "tabler-icons-react";
import { CommonFiltersProps, DebouncedInputFilter, Filter } from "./common";


const CLASSIFICATIONS = [
  {value: "KINGDOM", label: "Kingdom"},
  {value: "PHYLUM", label: "Phylum"},
  {value: "CLASS", label: "Class"},
  {value: "ORDER", label: "Order"},
  {value: "FAMILY", label: "Family"},
  {value: "GENUS", label: "Genus"},
]


export function HigherClassificationFilters({ filters, onAdd, onRemove, onChange }: CommonFiltersProps) {
  const [used, handler] = useListState(filters.map(item => item.filter));

  const valueChanged = (idx: number, item: Filter, value: string | null) => {
    if (value) {
      item.value = value;
      onChange(idx, item);
    }
  }
  const filterChanged = (idx: number, item: Filter, value: string | null) => {
    if (value) {
      handler.setItem(idx, value);
      item.filter = value;
      onChange(idx, item);
    }
  }
  const filterRemoved = (idx: number) => {
    handler.remove(idx);
    onRemove(idx);
  }

  return (
    <Stack>
      { filters.map((item, idx) => (
        <Grid key={`classification-filter-${idx}`}>
          <Grid.Col span="auto">
            <Flex>
              <Select
                value={item.filter}
                disabled={!item.editable}
                onChange={value => filterChanged(idx, item, value)}
                data={CLASSIFICATIONS.map(option => { return {
                  value: option.value,
                  label: option.label,
                  disabled: used.indexOf(option.value) >= 0,
                }})}
              />
              <DebouncedInputFilter
                initialValue={item.value}
                disabled={!item.editable}
                onChange={value => valueChanged(idx, item, value)}
              />
            </Flex>
          </Grid.Col>
          <Grid.Col span="content">
            <Button color="red" onClick={() => filterRemoved(idx)} disabled={!item.editable}><Minus /></Button>
          </Grid.Col>
        </Grid>
      ))}
      <Button leftIcon={<Plus />} onClick={onAdd}>Add filter</Button>
    </Stack>
  )
}
