import { Button, Stack, Grid, Select, Flex } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
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


interface HigherClassificationFiltersProps {
  filters: Filter[],
  onChange: (items: Filter[]) => void,
}

export function HigherClassificationFilters({ filters, onChange }: HigherClassificationFiltersProps) {
  const [items, handlers] = useListState<Filter>(filters);
  useEffect(() => onChange(items), [items, onChange]);

  const addFilter = () => {
    handlers.append({
      filter: "",
      action: "INCLUDE",
      value: "",
      editable: true,
    });
  }

  const removeFilter = (index: number) => {
    handlers.remove(index);
  }

  const filterChanged = (index: number, value: string | null) => {
    if (value) {
      handlers.setItemProp(index, 'filter', value);
    }
  }

  const valueChanged = (index: number, value: string) => {
    handlers.setItemProp(index, 'value', value);
  }

  return (
    <Stack>
      { items.map((item, idx) => (
        <Grid key={`classification-filter-${idx}`}>
          <Grid.Col span="auto">
            <Flex>
              <Select
                value={item.filter}
                disabled={!item.editable}
                onChange={value => filterChanged(idx, value)}
                data={CLASSIFICATIONS.map(option => { return {
                  value: option.value,
                  label: option.label,
                  disabled: items.findIndex(item => item.filter == option.value) !== -1,
                }})}
              />
              <DebouncedInputFilter
                initialValue={item.value}
                disabled={!item.editable}
                onChange={value => valueChanged(idx, value)}
              />
            </Flex>
          </Grid.Col>
          <Grid.Col span="content">
            <Button color="red" onClick={() => removeFilter(idx)} disabled={!item.editable}><Minus /></Button>
          </Grid.Col>
        </Grid>
      ))}
      <Button leftIcon={<Plus />} onClick={addFilter}>Add filter</Button>
    </Stack>
  )
}
