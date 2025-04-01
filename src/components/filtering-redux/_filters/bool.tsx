import { Checkbox, Chip, Flex, Group, SegmentedControl, Text } from "@mantine/core";
import { FilterItem } from "./common";
import { DataTypeFilter } from "../data-type";
import { useCallback } from "react";
import { IconX } from "@tabler/icons-react";

interface BoolFilterProps {
  active: boolean;
  include: boolean;
  disabled: boolean;
  value: string;
  onActiveToggle: (checked: boolean) => void;
  onIncludeToggle: (include: boolean) => void;
}

export function BoolFilter({ active, include, value, disabled, onActiveToggle, onIncludeToggle }: BoolFilterProps) {
  return (
    <Flex align="center" justify="space-between">
      <Checkbox
        color="midnight.9"
        radius={7}
        checked={active}
        disabled={disabled}
        onChange={(ev) => onActiveToggle(ev.currentTarget.checked)}
        label={
          <Text size="sm" fw={600}>
            {value}
          </Text>
        }
      />
      <SegmentedControl
        value={include ? "Has" : "Missing"}
        onChange={(value) => onIncludeToggle(value === "Has" ? true : false)}
        disabled={!active || disabled}
        radius="lg"
        size="xs"
        data={["Has", "Missing"]}
      />
    </Flex>
  );
}

interface BoolFilterChipsProps {
  filters: DataTypeFilter[];
  onRemove: (filters: DataTypeFilter[]) => void;
}

export function BoolFilterChips({ filters, onRemove }: BoolFilterChipsProps) {
  const handleRemove = useCallback(
    (currentFilter: DataTypeFilter) =>
      onRemove(filters.map((filter) => (filter.value === currentFilter.value ? { ...filter, active: false } : filter))),
    [filters, onRemove]
  );

  return (
    <Group gap="xs">
      {filters
        .filter(({ active }) => active)
        .map((filter) => (
          <Chip
            checked
            icon={<IconX size={12} />}
            color="gray"
            key={filter.value}
            onClick={() => handleRemove(filter)}
            size="xs"
          >
            {filter.include ? "Has" : "Missing"} {filter.value}
          </Chip>
        ))}
    </Group>
  );
}
