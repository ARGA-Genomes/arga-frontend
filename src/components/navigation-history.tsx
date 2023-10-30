import { Group, Text } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";


export interface Page {
  name: string,
  url: string,
}

export function PreviousPage() {
  const [previousPage, _setSession] = useSessionStorage<Page | undefined>({ key: 'previous-page', defaultValue: undefined });
  if (!previousPage) return null;

  return (
    <Link href={previousPage.url}>
      <Group gap={5}>
        <ArrowNarrowLeft />
        <Text fz={18}>Back to {previousPage.name}</Text>
      </Group>
    </Link>
  )
}


export const usePreviousPage = () => useSessionStorage<Page | undefined>({
  key: 'previous-page',
  defaultValue: undefined,
});
