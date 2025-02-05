import { Stack, Select } from "@mantine/core";
import { Filter } from "./common";


interface ImcraFiltersProps {
  value?: string,
  options: string[],
  onChange: (item: Filter | undefined) => void,
}

export function ImcraFilters({ value, options, onChange }: ImcraFiltersProps) {
  const changeFilter = (value: string | null) => {
    if (!value) { onChange(undefined); return; }

    onChange({
      filter: "IMCRA",
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
