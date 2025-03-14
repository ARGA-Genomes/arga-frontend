import { Stack, Select } from "@mantine/core";
import { Filter } from "./common";

interface StateFiltersProps {
  value?: string;
  options: string[];
  onChange: (item: Filter | undefined) => void;
}

export function StateFilters({ value, options, onChange }: StateFiltersProps) {
  const changeFilter = (value: string | null) => {
    if (!value) {
      onChange(undefined);
      return;
    }

    onChange({
      // filter: "STATE",
      // action: "INCLUDE",
      // value,
      editable: true,
    });
  };

  return (
    <Stack>
      <Select data={options} value={value ? value : null} clearable searchable onChange={changeFilter} />
    </Stack>
  );
}
