import classes from "./CardSlider.module.css";

import { Text, Paper, Stack, ScrollArea } from "@mantine/core";
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";

const SIZE: Record<string, number> = {
  sm: 600,
  md: 900,
  lg: 1200,
};

const HighlightContext = createContext(false);

interface CardSliderProps {
  card?: number;
  children: React.ReactElement<CardSliderCardProps>[];
}

export function CardSlider({ card, children }: CardSliderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = card ?? 0;

    const offset = children.reduce((acc, cur, curIdx) => (acc += curIdx < idx ? SIZE[cur.props.size ?? "md"] : 0), 0);
    const centre = ref.current!.clientWidth / 2;
    const halfWidth = SIZE[children[idx].props.size ?? "md"] / 2;
    const padding = 20 * idx;

    const left = offset - centre + halfWidth + padding + 300;
    ref.current!.scrollTo({ left, behavior: "smooth" });
  }, [card]);

  return (
    <ScrollArea scrollbars={false} viewportRef={ref} className={classes.container}>
      {children.map((child, idx) => (
        <HighlightContext key={idx} value={idx === card}>
          {child}
        </HighlightContext>
      ))}
    </ScrollArea>
  );
}

interface CardSliderCardProps extends PropsWithChildren {
  title: string;
  size?: "sm" | "md" | "lg";
}

export function CardSliderCard({ title, size, children }: CardSliderCardProps) {
  const selected = useContext(HighlightContext);
  const width = SIZE[size ?? "md"];

  return (
    <Paper
      bg={selected ? undefined : "midnight.0"}
      withBorder
      radius="xl"
      shadow="xl"
      mb={60}
      w={width}
      mih={600}
      className={classes.card}
    >
      <Stack>
        <Text mx="xl" mt="xl" fw={600} fz="md" c="midnight.9">
          {title}
        </Text>
        {children}
      </Stack>
    </Paper>
  );
}

CardSlider.Card = CardSliderCard;
