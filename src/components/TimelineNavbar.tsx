import classes from "./TimelineNavbar.module.css";

import { Center, Group, Paper, Stack, Text } from "@mantine/core";

interface TimelineNavbarProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function TimelineNavbar({ children }: TimelineNavbarProps) {
  return (
    <Paper radius="lg" p={"xs"} className={classes.navbar}>
      <Group justify="space-evenly">{children}</Group>
    </Paper>
  );
}

interface TimelineNavbarItemProps {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

function TimelineNavbarItem({ icon, label, selected, onClick }: TimelineNavbarItemProps) {
  return (
    <Paper
      bg={selected ? "midnight.1" : undefined}
      radius="xl"
      p={"xl"}
      w={160}
      h={160}
      className={classes.item}
      onClick={onClick}
    >
      <Stack justify="space-between">
        <Center h={60}>{icon}</Center>
        <Text className={classes.label}>{label}</Text>
      </Stack>
    </Paper>
  );
}

TimelineNavbar.Item = TimelineNavbarItem;
