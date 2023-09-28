import { Stack, Select } from "@mantine/core";
import { Filter } from "./common";


interface IbraFiltersProps {
  value?: string,
  options: string[],
  onChange: (item: Filter | undefined) => void,
}

export function IbraFilters({ value, options, onChange }: IbraFiltersProps) {
  const changeFilter = (value: string | null) => {
    if (!value) return onChange(undefined);

    onChange({
      filter: "IBRA",
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
