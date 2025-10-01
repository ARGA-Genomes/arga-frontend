import { createContext, useContext, useState } from "react";
import classes from "./TimelineNavbar.module.css";

import { Box, Center, Group, Paper, Stack, Text } from "@mantine/core";

const HighlightContext = createContext(false);

interface TimelineNavbarProps {
  onSelected?: (index: number) => void;
  children: React.ReactNode[];
}

export function TimelineNavbar({ onSelected, children }: TimelineNavbarProps) {
  const [selected, setSelected] = useState(0);

  function onClick(idx: number) {
    setSelected(idx);
    if (onSelected) onSelected(idx);
  }

  return (
    <Paper radius="lg" p={"xs"} className={classes.navbar}>
      <Group justify="space-evenly">
        {children.map((child, idx) => (
          <HighlightContext key={idx} value={idx === selected}>
            <Box onClick={() => onClick(idx)}>{child}</Box>
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
    <Paper bg={selected ? "midnight.1" : undefined} radius="xl" p={"xl"} w={160} h={160} className={classes.item}>
      <Stack justify="space-between">
        <Center h={60}>{icon}</Center>
        <Text className={classes.label}>{label}</Text>
      </Stack>
    </Paper>
  );
}

TimelineNavbar.Item = TimelineNavbarItem;
