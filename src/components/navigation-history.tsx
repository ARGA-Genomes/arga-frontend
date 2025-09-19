import { Group, Text } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export interface Page {
  name: string;
  url: string;
}

export function PreviousPage() {
  const [previousPage] = useSessionStorage<Page | undefined>({
    key: "previous-page",
    defaultValue: undefined,
  });
  if (!previousPage) return null;

  return (
    <Link href={previousPage.url}>
      <Group gap={5}>
        <IconArrowNarrowLeft />
        <Text fz={18}>Back to {previousPage.name}</Text>
      </Group>
    </Link>
  );
}

export const usePreviousPage = () =>
  useSessionStorage<Page | undefined>({
    key: "previous-page",
    defaultValue: undefined,
  });
