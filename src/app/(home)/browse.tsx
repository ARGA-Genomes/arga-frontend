"use client";

import { BrowseCard } from "@/components/browse-card";
import { Group, Text } from "@mantine/core";

import { ApolloError } from "@apollo/client";
import "@mantine/carousel/styles.css";

export interface BrowseItem {
  total?: string;
  category: string;
  image: string;
  link: string;
}

interface BrowseProps {
  items: BrowseItem[];
  data?: unknown;
  error?: ApolloError;
  disabled?: boolean;
}

export default function Browse({ items, data, error, disabled }: BrowseProps) {
  return (
    <Group justify="center" align="flex-start">
      {error ? (
        <Text>{error.message}</Text>
      ) : (
        items.map((item, idx) => <BrowseCard key={idx} disabled={disabled} {...item} data={data} />)
      )}
    </Group>
  );
}
