"use client";

import { Group, Text } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import Link from "next/link";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

export interface Page {
  name: string;
  url: string;
}

export function PreviousPage() {
  const [previousPage, _setSession] = useSessionStorage<Page | undefined>({
    key: "previous-page",
    defaultValue: undefined,
  });

  return (
    <Link href={previousPage?.url || "/"}>
      <Group gap={5}>
        <IconArrowNarrowLeft />
        <Text fz={18}>Back to {previousPage?.name || "home"}</Text>
      </Group>
    </Link>
  );
}

export const usePreviousPage = () =>
  useSessionStorage<Page | undefined>({
    key: "previous-page",
    defaultValue: undefined,
  });
