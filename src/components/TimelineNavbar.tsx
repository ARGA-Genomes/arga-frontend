import { createContext, useContext } from "react";
import classes from "./TimelineNavbar.module.css";

import { Box, Center, Group, Paper, Stack, Text } from "@mantine/core";

const HighlightContext = createContext(false);

interface TimelineNavbarProps {
  selected?: number;
  onSelected?: (index: number) => void;
  children: React.ReactNode[];
}

export function TimelineNavbar({ selected, onSelected, children }: TimelineNavbarProps) {
  return (
    <Paper className={classes.navbar}>
      <Group justify="space-evenly">
        {children.map((child, idx) => (
          <HighlightContext key={idx} value={idx === selected}>
            <Box onClick={() => onSelected && onSelected(idx)}>{child}</Box>
          </HighlightContext>
        ))}
      </Group>
    </Paper>
  );
}

interface TimelineNavbarItemProps {
  icon?: React.ReactNode;
  label: string;
}

function TimelineNavbarItem({ icon, label }: TimelineNavbarItemProps) {
  const selected = useContext(HighlightContext);

  return (
    <Paper bg={selected ? "midnight.1" : undefined} radius="lg" p="md" className={classes.item}>
      <Stack justify="space-between" gap={4}>
        <Center h={60}>{icon}</Center>
        <Text className={classes.label}>{label}</Text>
      </Stack>
    </Paper>
  );
}

TimelineNavbar.Item = TimelineNavbarItem;
