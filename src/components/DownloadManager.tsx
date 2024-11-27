"use client";

import { Dataset } from "@/app/source-provider";
import {
  Button,
  Drawer,
  Indicator,
  Stack,
  Text,
  ScrollArea,
  Card,
  Group,
  Image,
  SimpleGrid,
  rem,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconSortDescending, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

export type SavedItem = {
  url: string;
  label: string;
  dataType: string;
  scientificName: string;
  datePublished?: string;
  dataset: Dataset;
};

export function SavedDataManagerButton() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [saved, _setSaved] = useSavedData();

  return (
    <>
      <Drawer opened={opened} onClose={close} position="top" size="xl">
        <ScrollArea.Autosize mt={150}>
          <SavedDataManager />
        </ScrollArea.Autosize>
      </Drawer>
      <Indicator
        inline
        label={saved?.length}
        size={16}
        color="bushfire"
        disabled={!saved?.length}
      >
        <Button
          variant="subtle"
          color="midnight.2"
          radius="lg"
          onClick={toggle}
          leftSection={
            <IconSortDescending size={35} color="white" strokeWidth="1.75" />
          }
        >
          Saved data
        </Button>
      </Indicator>
    </>
  );
}

function SavedDataManager() {
  const [saved, setSaved] = useSavedData();

  function remove(item: SavedItem) {
    const newList = saved?.filter((value) => value.url != item.url);
    setSaved(newList || []);
  }

  return (
    <SimpleGrid cols={4}>
      {saved?.map((item) => (
        <SavedDataItem key={item.url} item={item} onRemove={remove} />
      ))}
    </SimpleGrid>
  );
}

interface SaveDataItemProps {
  item: SavedItem;
  onRemove: (item: SavedItem) => void;
}

function SavedDataItem({ item, onRemove }: SaveDataItemProps) {
  const components = item.url.split("/");
  const url = `${item.url}/${components[components.length - 1]}_genomic.fna.gz`;

  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Card.Section withBorder mb="md">
        <Group justify="space-between" ml="lg">
          <Group>
            <Image
              src={"/card-icons/type/whole_genomes.svg"}
              fit="contain"
              h={80}
              w={80}
              alt=""
            />

            <Stack gap={0}>
              <Text fw={500} truncate="end">
                {item.label}
              </Text>
              <Text fw={300} fz="xs" style={{ fontVariant: "small-caps" }}>
                {item.dataType}
              </Text>
            </Stack>
          </Group>

          <Button
            color="red"
            variant="subtle"
            radius={0}
            onClick={() => onRemove(item)}
            h={100}
          >
            <IconTrash style={{ width: rem(35), height: rem(35) }} />
          </Button>
        </Group>
      </Card.Section>

      <Stack gap={0} ml="md">
        <Text size="sm" c="dimmed">
          {item.scientificName.replaceAll("_", " ")}
        </Text>

        <Text size="sm" c="dimmed">
          {item.dataset.name}
        </Text>

        <Text size="sm" c="dimmed">
          {item.datePublished}
        </Text>
      </Stack>

      <Link href={url} target="_blank">
        <Button color="moss" fullWidth mt="md" radius="lg">
          Download
        </Button>
      </Link>
    </Card>
  );
}

export function useSavedData() {
  return useLocalStorage<SavedItem[]>({ key: "saved-data", defaultValue: [] });
}
