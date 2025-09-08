import { Avatar, Group, Select, Stack, Text } from "@mantine/core";
import { constantCase } from "change-case";
import { forwardRef } from "react";
import { TAXON_ICONS } from "../icon-bar";
import { Filter } from "./common";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  image: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, image, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group wrap="nowrap">
      <Avatar src={image} />
      <div>
        <Text size="sm">{label}</Text>
      </div>
    </Group>
  </div>
));
SelectItem.displayName = "SelectItem";

interface VernacularGroupFiltersProps {
  value?: string;
  onChange: (item: Filter | undefined) => void;
}

export function VernacularGroupFilters({ value, onChange }: VernacularGroupFiltersProps) {
  const data = Object.entries(TAXON_ICONS)
    .map(([key, value]) => {
      return { value: key, ...value };
    })
    .sort((a, b) => a.value.localeCompare(b.value));

  const changeFilter = (value: string | null) => {
    if (!value) {
      onChange(undefined);
      return;
    }

    onChange({
      // filter: "VERNACULAR_GROUP",
      // action: "INCLUDE",
      // value: pascalCase(value),
      editable: true,
    });
  };

  return (
    <Stack>
      <Select data={data} value={value ? constantCase(value) : null} clearable onChange={changeFilter} />
    </Stack>
  );
}
