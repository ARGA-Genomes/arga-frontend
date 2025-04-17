import { Checkbox, Chip, Flex, SegmentedControl, Text } from "@mantine/core";
import { IconTrashFilled } from "@tabler/icons-react";

export interface BoolFilterData {
  value: string;
  active: boolean;
  include: boolean;
  disabled: boolean;
}

interface BoolFilterProps extends BoolFilterData {
  onActiveToggle: (checked: boolean) => void;
  onIncludeToggle: (include: boolean) => void;
  options: [string, string];
  label?: string;
}

export function BoolFilter({
  active,
  include,
  value,
  disabled,
  options,
  onActiveToggle,
  onIncludeToggle,
}: BoolFilterProps) {
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
            {value.replaceAll("_", " ")}
          </Text>
        }
      />
      <SegmentedControl
        value={include ? options[0] : options[1]}
        onChange={(value) => onIncludeToggle(value === options[0] ? true : false)}
        disabled={!active || disabled}
        radius="lg"
        size="xs"
        data={options}
      />
    </Flex>
  );
}

export function renderBoolFilterChips(
  filters: BoolFilterData[],
  options: [string, string],
  onRemove: (filters: BoolFilterData[]) => void
) {
  const handleRemove = (currentFilter: BoolFilterData) =>
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
        {filter.include ? options[0] : options[1]} {filter.value}
      </Chip>
    ));
}

export function renderVernacularGroupFilterChip(filter: BoolFilterData | null, onRemove: () => void) {
  return filter
    ? [
        <Chip key={filter.value} checked icon={<IconTrashFilled size={12} />} color="gray" onClick={onRemove} size="xs">
          {filter.include ? "Include" : "Exclude"} group <b>{filter.value}</b>
        </Chip>,
      ]
    : [];
}
