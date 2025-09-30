import { Checkbox, Flex, SegmentedControl, Text } from "@mantine/core";
import { GenericFilter } from "../generic";

export interface BoolFilterData {
  name: string;
  value: string | boolean;
  label?: string;
  active: boolean;
  include: boolean;
  disabled: boolean;
}

interface BoolFilterProps extends BoolFilterData {
  onActiveToggle: (checked: boolean) => void;
  onIncludeToggle?: (include: boolean) => void;
  options: [string, string];
}

export function BoolFilter({
  active,
  include,
  label,
  name,
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
          <Text size="sm" fw={600} maw={500} truncate="end">
            {label || name}
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
  onChange: (filters: BoolFilterData[]) => void
) {
  const handleRemove = (currentFilter: BoolFilterData) =>
    onChange(filters.map((filter) => (filter.name === currentFilter.name ? { ...filter, active: false } : filter)));

  const handleSwitch = (currentFilter: BoolFilterData) =>
    onChange(
      filters.map((filter) =>
        filter.name === currentFilter.name ? { ...filter, include: !currentFilter.include } : filter
      )
    );

  return filters
    .filter(({ active }) => active)
    .map((filter) => (
      <GenericFilter
        key={filter.name}
        name={filter.label || filter.name}
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
          key={filter.name}
          name="Vernacular group"
          value={filter.value.toString()}
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
