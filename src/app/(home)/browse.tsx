"use client";

import { BrowseCard } from "@/components/browse-card";
import { Carousel } from "@mantine/carousel";
import { Group, Text } from "@mantine/core";
import get from "lodash-es/get";

import "@mantine/carousel/styles.css";
import { ApolloError } from "@apollo/client";

export interface BrowseItem {
  total: string | null;
  category: string;
  image: string;
  link: string;
}

interface BrowseProps {
  items: BrowseItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: ApolloError;
}

export default function Browse({ items, data, error }: BrowseProps) {
  return (
    <Carousel slideSize={150} slideGap="sm" slidesToScroll="auto" align="start" withControls={false}>
      <Group justify="center" align="flex-start">
        {error ? (
          <Text>{error.message}</Text>
        ) : (
          items.map((item, idx) => (
            <Carousel.Slide key={`${item.link}-${idx}`}>
              <BrowseCard {...item} total={item.total ? get(data, item.total) : item.total} />
            </Carousel.Slide>
          ))
        )}
      </Group>
    </Carousel>
  );
}
