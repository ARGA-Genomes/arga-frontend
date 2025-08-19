import classes from "./CardSlider.module.css";

import { Text, Paper, Stack, ScrollArea, Box } from "@mantine/core";
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
      <Box py="xl">{children}</Box>
    </ScrollArea.Autosize>
  );
}

interface CardSliderCardProps extends PropsWithChildren {
  title: string;
}

export function CardSliderCard({ title, children }: CardSliderCardProps) {
  return (
    <Paper withBorder radius="xl" p="xl" w="80%" shadow="xl" className={classes.card}>
      <Stack>
        <Text fw={600} fz="md" c="midnight.9">
          {title}
        </Text>
        {children}
      </Stack>
    </Paper>
  );
}

CardSlider.Card = CardSliderCard;
