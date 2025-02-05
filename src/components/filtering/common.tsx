import { Input, InputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";


export interface FilterItem {
  filter: string,
  action: string,
  value: string,
}

export function intoFilterItem(item: Filter): FilterItem | undefined {
  if (item.filter && item.action && item.value) {
    return {
      filter: item.filter,
      action: item.action,
      value: item.value,
    }
  }
  return undefined;
}


export interface Filter {
  filter: string,
  action: string,
  value: string,
  editable: boolean,
}

export interface CommonFiltersProps {
  filters: Filter[],
  onAdd: () => void,
  onRemove: (index: number) => void,
  onChange: (index: number, filter: Filter) => void,
}


interface DebouncedInputFilterProps {
  initialValue?: string,
  onChange: (value: string) => void,
}

export function DebouncedInputFilter({ initialValue, onChange, ...props }: DebouncedInputFilterProps & InputProps) {
  const [value, setValue] = useState(initialValue || '');
  const [debounced] = useDebouncedValue(value, 400);

  useEffect(() => { onChange(debounced); }, [debounced])

  return (
    <Input
      value={value}
      onChange={el => { setValue(el.currentTarget.value); }}
      {...props}
    />
  )
}
