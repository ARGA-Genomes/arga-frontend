import { Stack, Select, Group, Avatar, Text } from "@mantine/core";
import { forwardRef } from "react";
import { Filter } from "./common";
import { constantCase } from "change-case";
import { VERNACULAR_GROUP_ICON } from "../icon-bar";

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
  const data = Object.entries(VERNACULAR_GROUP_ICON)
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
