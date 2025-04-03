import { Checkbox, Chip, Flex, SegmentedControl, Text } from "@mantine/core";
import { DataTypeFilter } from "../groups/data-type";
import { IconTrashFilled, IconX } from "@tabler/icons-react";

interface BoolFilterProps extends DataTypeFilter {
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

export function renderBoolFilterChips(filters: DataTypeFilter[], onRemove: (filters: DataTypeFilter[]) => void) {
  const handleRemove = (currentFilter: DataTypeFilter) =>
    onRemove(filters.map((filter) => (filter.value === currentFilter.value ? { ...filter, active: false } : filter)));

  return filters
    .filter(({ active }) => active)
    .map((filter) => (
      <Chip
        key={filter.value}
        checked
        icon={<IconTrashFilled size={12} />}
        color="gray"
        onClick={() => handleRemove(filter)}
        size="xs"
      >
        {filter.include ? "Has" : "Missing"} {filter.value}
      </Chip>
    ));
}
