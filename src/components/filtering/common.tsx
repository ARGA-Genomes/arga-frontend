import { Input, InputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";

export enum FilterKind {
  Genomes = "GENOME",
  Loci = "LOCUS",
  Specimens = "SPECIMEN",
  Other = "OTHER",
}

export interface Filter {
  scientificName?: string;
  canonicalName?: string;
  vernacularGroup?: string;
  hasData?: FilterKind;
  editable: boolean;
}

export type FilterItem = Omit<Filter, "editable">;

export function intoFilterItem(item: Filter): FilterItem | undefined {
  if (!item.scientificName && !item.canonicalName && !item.vernacularGroup && !item.hasData) return undefined;

  return {
    scientificName: item.scientificName,
    canonicalName: item.canonicalName,
    vernacularGroup: item.vernacularGroup,
    hasData: item.hasData,
  };
}

export interface CommonFiltersProps {
  filters: Filter[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, filter: Filter) => void;
}

interface DebouncedInputFilterProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

export function DebouncedInputFilter({ initialValue, onChange, ...props }: DebouncedInputFilterProps & InputProps) {
  const [value, setValue] = useState(initialValue || "");
  const [debounced] = useDebouncedValue(value, 400);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <Input
      value={value}
      onChange={(el) => {
        setValue(el.currentTarget.value);
      }}
      {...props}
    />
  );
}
