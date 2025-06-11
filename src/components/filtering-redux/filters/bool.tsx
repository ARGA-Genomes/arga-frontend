import { Checkbox, Flex, SegmentedControl, Text } from "@mantine/core";
import * as Humanize from "humanize-plus";
import { GenericFilter } from "../generic";

export interface BoolFilterData {
  value: string;
  active: boolean;
  include: boolean;
  disabled: boolean;
}

interface BoolFilterProps extends BoolFilterData {
  onActiveToggle: (checked: boolean) => void;
  onIncludeToggle?: (include: boolean) => void;
  options: [string, string];
  label?: string;
}

export function BoolFilter({
  active,
  include,
  value,
  label,
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
            {label || Humanize.capitalize(value.replaceAll("_", " "))}
          </Text>
        }
      />
      {onIncludeToggle && (
        <SegmentedControl
          value={include ? options[0] : options[1]}
          onChange={(value) => onIncludeToggle(value === options[0] ? true : false)}
          disabled={!active || disabled}
          radius="lg"
          size="xs"
          data={options}
        />
      )}
    </Flex>
  );
}

export function renderBoolFilterChips(
  filters: BoolFilterData[],
  options: [string, string],
  onChange: (filters: BoolFilterData[]) => void,
  labelMap?: { [key: string]: string }
) {
  const handleRemove = (currentFilter: BoolFilterData) =>
    onChange(filters.map((filter) => (filter.value === currentFilter.value ? { ...filter, active: false } : filter)));

  const handleSwitch = (currentFilter: BoolFilterData) =>
    onChange(
      filters.map((filter) =>
        filter.value === currentFilter.value ? { ...filter, include: !currentFilter.include } : filter
      )
    );

  return filters
    .filter(({ active }) => active)
    .map((filter) => (
      <GenericFilter
        key={filter.value}
        name={(labelMap || {})[filter.value] || filter.value}
        value={filter.include ? options[0] : options[1]}
        include={filter.include}
        onSwitch={() => handleSwitch(filter)}
        onRemove={() => handleRemove(filter)}
      />
    ));
}

export function renderVernacularGroupFilterChip(
  filter: BoolFilterData | null,
  onChange: (item: BoolFilterData | null) => void
) {
  return filter
    ? [
        <GenericFilter
          key={filter.value}
          name="Vernacular group"
          value={filter.value}
          include={filter.include}
          onSwitch={() =>
            onChange({
              ...filter,
              include: !filter.include,
            })
          }
          onRemove={() => onChange(null)}
        />,
      ]
    : [];
}
