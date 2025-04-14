import { Group, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconLayoutGrid, IconTable } from "@tabler/icons-react";
import classes from "./table-card-switch.module.css";

export type TableCardLayout = "table" | "card";

interface TableCardSwitchProps {
  layout: TableCardLayout;
  onChange: (layout: TableCardLayout) => void;
}

export function TableCardSwitch({ layout, onChange }: TableCardSwitchProps) {
  const theme = useMantineTheme();
  const isTable = layout === "table";

  return (
    <Group gap="sm">
      <UnstyledButton
        className={classes.btn}
        opacity={isTable ? 1 : 0.5}
        onClick={(e) => {
          e.stopPropagation();
          onChange("table");
        }}
      >
        <Stack gap={1} align="center">
          <IconTable size={16} color={theme.colors.midnight[10]} fill="none" />
          <Text size="xs" fw={600}>
            Table
          </Text>
        </Stack>
      </UnstyledButton>
      <UnstyledButton
        className={classes.btn}
        opacity={!isTable ? 1 : 0.5}
        onClick={(e) => {
          e.stopPropagation();
          onChange("card");
        }}
      >
        <Stack gap={1} align="center">
          <IconLayoutGrid size={16} color={theme.colors.midnight[10]} fill={theme.colors.midnight[10]} />
          <Text size="xs" fw={600}>
            Card
          </Text>
        </Stack>
      </UnstyledButton>
    </Group>
  );
}
