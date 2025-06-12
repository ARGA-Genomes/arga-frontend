import { Checkbox, CheckboxProps, Flex, Pill, Text, Tooltip, TooltipProps } from "@mantine/core";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { ReactElement } from "react";

const GenericFilterCheck: CheckboxProps["icon"] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus stroke="4" {...others} /> : <IconPlus stroke="4" {...others} />;

interface GenericFilterProps {
  name: string | ReactElement;
  value: string | ReactElement;
  include: boolean;
  tooltip?: Omit<TooltipProps, "children">;
  readOnly?: boolean;
  onSwitch?: () => void;
  onRemove?: () => void;
}

export function GenericFilter({ name, value, include, tooltip, readOnly, onSwitch, onRemove }: GenericFilterProps) {
  const inner = (
    <Pill
      styles={{ label: { display: "flex", alignItems: "center" } }}
      size="xl"
      withRemoveButton={!readOnly}
      removeButtonProps={{ style: { transform: "scale(0.8)", opacity: 0.75 } }}
      onRemove={readOnly ? undefined : onRemove}
    >
      <Flex align="center" justify="center" gap="xs">
        <Checkbox
          readOnly={readOnly || !onSwitch}
          icon={GenericFilterCheck}
          checked={include}
          onChange={readOnly ? undefined : onSwitch}
          indeterminate={!include}
          color="midnight.9"
          size="xs"
        />{" "}
        <Text size="sm" pb={2}>
          <b>{name}: </b> {value}
        </Text>
      </Flex>
    </Pill>
  );

  return tooltip ? <Tooltip {...tooltip}>{inner}</Tooltip> : inner;
}
