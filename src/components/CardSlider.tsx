import classes from "./CardSlider.module.css";

import { Text, Paper, Stack, ScrollArea } from "@mantine/core";
import { PropsWithChildren, useEffect, useRef } from "react";

interface CardSliderProps {
  card?: number;
  children: React.ReactNode[];
}

export function CardSlider({ card, children }: CardSliderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = card ?? 0;
    const width = ref.current!.clientWidth;
    const cardWidth = width * 0.8;
    const padding = 20 * idx;

    ref.current!.scrollTo({ left: cardWidth * idx + padding, behavior: "smooth" });
  }, [card]);

  return (
    <ScrollArea.Autosize scrollbars={false} viewportRef={ref} className={classes.container}>
      {children}
    </ScrollArea.Autosize>
  );
}

interface CardSliderCardProps extends PropsWithChildren {
  title: string;
  selected?: boolean;
}

export function CardSliderCard({ title, selected, children }: CardSliderCardProps) {
  return (
    <Paper
      bg={selected ? undefined : "midnight.0"}
      withBorder
      radius="xl"
      shadow="xl"
      mb={60}
      w="80%"
      mih={600}
      className={classes.card}
    >
      <Stack h="100%">
        <Text mx="xl" mt="xl" fw={600} fz="md" c="midnight.9">
          {title}
        </Text>
        {children}
      </Stack>
    </Paper>
  );
}

CardSlider.Card = CardSliderCard;
