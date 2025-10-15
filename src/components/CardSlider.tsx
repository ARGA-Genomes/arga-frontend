import classes from "./CardSlider.module.css";

import { Text, Paper, Stack, ScrollArea, Group, Button } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";

const SIZE: Record<string, number> = {
  sm: 600,
  md: 900,
  lg: 1200,
};

interface CardNav {
  index: number;
  previous?: CardSliderCardProps;
  next?: CardSliderCardProps;
  onChange?: (index: number) => void;
}

const HighlightContext = createContext(false);
const CardNavContext = createContext<CardNav>({ index: 0 });

interface CardSliderProps {
  card?: number;
  onSelected: (index: number) => void;
  children: React.ReactElement<CardSliderCardProps>[];
}

export function CardSlider({ card, onSelected, children }: CardSliderProps) {
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
          <CardNavContext
            key={idx}
            value={{
              index: idx,
              previous: children[idx - 1]?.props,
              next: children[idx + 1]?.props,
              onChange: onSelected,
            }}
          >
            {child}
          </CardNavContext>
        </HighlightContext>
      ))}
    </ScrollArea>
  );
}

interface CardSliderCardProps extends PropsWithChildren {
  title: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function CardSliderCard({ title, size, href, children }: CardSliderCardProps) {
  const selected = useContext(HighlightContext);
  const nav = useContext(CardNavContext);
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

        <Group className={classes.navigation} grow>
          <Group>
            {nav.previous && (
              <Button
                component={nav.previous.href ? Link : undefined}
                href={nav.previous.href ?? "#"}
                variant="subtle"
                color="mantine.4"
                disabled={!selected}
                leftSection={<IconArrowNarrowLeft />}
                onClick={() => nav.onChange && nav.onChange(nav.index - 1)}
              >
                {nav.previous.title}
              </Button>
            )}
          </Group>
          <Group justify="end">
            {nav.next && (
              <Button
                component={nav.next.href ? Link : undefined}
                href={nav.next.href ?? "#"}
                variant="subtle"
                color="mantine.4"
                disabled={!selected}
                rightSection={<IconArrowNarrowRight />}
                onClick={() => nav.onChange && nav.onChange(nav.index + 1)}
              >
                {nav.next.title}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}

CardSlider.Card = CardSliderCard;
