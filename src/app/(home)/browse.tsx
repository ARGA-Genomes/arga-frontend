"use client";

import { BrowseCard } from "@/components/browse-card";
import { Group, Text } from "@mantine/core";
import get from "lodash-es/get";

import { ApolloError } from "@apollo/client";
import "@mantine/carousel/styles.css";

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
  disabled?: boolean;
}

export default function Browse({ items, data, error, disabled }: BrowseProps) {
  return (
    <Group justify="center" align="flex-start">
      {error ? (
        <Text>{error.message}</Text>
      ) : (
        items.map((item, idx) => (
          <BrowseCard key={idx} disabled={disabled} {...item} total={item.total ? get(data, item.total) : item.total} />
        ))
      )}
    </Group>
  );
}
