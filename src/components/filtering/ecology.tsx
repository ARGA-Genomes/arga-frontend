import { Stack, Select } from "@mantine/core";
import { Filter } from "./common";


interface EcologyFiltersProps {
  value?: string,
  options: string[],
  onChange: (item: Filter | undefined) => void,
}

export function EcologyFilters({ value, options, onChange }: EcologyFiltersProps) {
  const changeFilter = (value: string | null) => {
    if (!value) { onChange(undefined); return; }

    onChange({
      filter: "ECOLOGY",
      action: "INCLUDE",
      value,
      editable: true,
    })
  }

  return (
    <Stack>
      <Select
        data={options}
        value={value ? value : null}
        clearable
        searchable
        onChange={changeFilter}
      />
    </Stack>
  )
}
