import { Stack, Select } from "@mantine/core";
import { Filter } from "./common";


interface DrainageBasinFiltersProps {
  value?: string,
  options: string[],
  onChange: (item: Filter | undefined) => void,
}

export function DrainageBasinFilters({ value, options, onChange }: DrainageBasinFiltersProps) {
  const changeFilter = (value: string | null) => {
    if (!value) return onChange(undefined);

    onChange({
      filter: "DRAINAGE_BASIN",
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
