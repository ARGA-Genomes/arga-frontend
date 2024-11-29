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
  Menu,
  Table,
  Checkbox,
  createTheme,
  MantineProvider,
  Box,
  Center,
  Grid,
  Space,
  Paper,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useListState, useLocalStorage } from "@mantine/hooks";
import {
  IconChevronDown,
  IconClipboardCopy,
  IconDownload,
  IconFileInfo,
  IconFileText,
  IconFileZip,
  IconSortDescending,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type SavedItem = {
  url: string;
  label: string;
  dataType: string;
  scientificName: string;
  datePublished?: string;
  dataset: Dataset;
};

type DownloadLink = {
  label: string;
  url: string;
};

export function SavedDataManagerButton() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [saved, _setSaved] = useSavedData();

  return (
    <>
      <Drawer opened={opened} onClose={close} position="top" size="xl">
        <Space h={150} />
        <SavedDataManager />
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
  const [selected, handlers] = useListState<SavedItem>();

  // TODO: replace this with a proper set when mantine is updated
  function selectItem(item: SavedItem) {
    if (selected.indexOf(item) === -1) {
      handlers.append(item);
    }
  }

  useEffect(() => {
    if (!saved) return;
    for (const item of saved) {
      selectItem(item);
    }
  }, [saved]);

  function remove(item: SavedItem) {
    const newList = saved?.filter((value) => value.url != item.url);
    setSaved(newList || []);
  }

  return (
    <Grid>
      <Grid.Col span={10}>
        <ScrollArea.Autosize>
          <SimpleGrid cols={3}>
            {saved?.map((item) => (
              <SavedDataItem
                key={item.url}
                item={item}
                onRemove={remove}
                onSelected={(item) => selectItem(item)}
                onDeselected={(item) => handlers.remove(selected.indexOf(item))}
              />
            ))}
          </SimpleGrid>
        </ScrollArea.Autosize>
      </Grid.Col>
      <Grid.Col span={2}>
        <Paper shadow="md" radius="md" withBorder p="xl">
          <Stack>
            <Tooltip label="Copy the URLs of all selected files into the clipboard">
              <Button
                fullWidth
                variant="light"
                color="moss"
                radius="md"
                rightSection={<IconClipboardCopy />}
              >
                Copy selected to clipboard
              </Button>
            </Tooltip>

            <Tooltip label="Download a metadata file containing metadata for all selected files">
              <Button
                fullWidth
                variant="light"
                color="shellfish"
                radius="md"
                rightSection={<IconFileInfo />}
              >
                Download metadata
              </Button>
            </Tooltip>

            <Tooltip label="Download a text file containing links to all selected files">
              <Button
                fullWidth
                variant="light"
                color="shellfish"
                radius="md"
                rightSection={<IconFileText />}
              >
                Download manifest
              </Button>
            </Tooltip>

            <Tooltip label="Download all selected files as a single .zip file">
              <Button
                fullWidth
                color="midnight.8"
                radius="md"
                rightSection={<IconFileZip />}
              >
                Download selected
              </Button>
            </Tooltip>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

const theme = createTheme({
  cursorType: "pointer",
});

interface HintedCheckboxProps {
  onChange: (checked: boolean) => void;
}

function HintedCheckbox({ onChange }: HintedCheckboxProps) {
  const [hint, setHint] = useState("none");
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    setHint(!checked ? "moss.1" : "moss.0");
    onChange(checked);
  }, [checked]);

  return (
    <Box
      h={100}
      w={80}
      bg={hint}
      style={{ cursor: "pointer" }}
      onMouseOver={() => setHint(checked ? "moss.1" : "moss.0")}
      onMouseOut={() => setHint(checked ? "moss.0" : "none")}
      onClick={() => setChecked(!checked)}
    >
      <Center h={100}>
        <MantineProvider theme={theme}>
          <Checkbox
            color="moss"
            size="xl"
            radius={0}
            checked={checked}
            onChange={(ev) => setChecked(ev.currentTarget.checked)}
          />
        </MantineProvider>
      </Center>
    </Box>
  );
}

interface SaveDataItemProps {
  item: SavedItem;
  onRemove: (item: SavedItem) => void;
  onSelected: (item: SavedItem) => void;
  onDeselected: (item: SavedItem) => void;
}

function SavedDataItem({
  item,
  onRemove,
  onSelected,
  onDeselected,
}: SaveDataItemProps) {
  const components = item.url.split("/");
  const url = `${item.url}/${components[components.length - 1]}_genomic.fna.gz`;

  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Card.Section withBorder mb="md">
        <Group justify="space-between">
          <Group>
            <HintedCheckbox
              onChange={(checked) =>
                checked ? onSelected(item) : onDeselected(item)
              }
            />
            <Link
              href={`/species/${item.scientificName}/whole_genomes/${item.label}`}
            >
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
            </Link>
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

      <Table ml="md">
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Organism</Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {item.scientificName.replaceAll("_", " ")}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Source</Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {item.dataset.name}
              </Text>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Date release</Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {item.datePublished}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <DownloadButton links={[{ label: "Fasta (.fna.gz)", url }]} />
    </Card>
  );
}

export function useSavedData() {
  return useLocalStorage<SavedItem[]>({ key: "saved-data", defaultValue: [] });
}

function DownloadButton({ links }: { links: DownloadLink[] }) {
  const selected = links[0];

  return (
    <Group gap={0} grow>
      <Button
        color="moss"
        mt="md"
        radius={0}
        rightSection={<IconDownload />}
        component={Link}
        href={selected.url}
        style={{
          borderTopLeftRadius: "var(--mantine-radius-lg)",
          borderBottomLeftRadius: "var(--mantine-radius-lg)",
        }}
      >
        Download
      </Button>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            color="moss.7"
            mt="md"
            radius={0}
            rightSection={<IconChevronDown />}
            style={{
              borderTopRightRadius: "var(--mantine-radius-lg)",
              borderBottomRightRadius: "var(--mantine-radius-lg)",
            }}
          >
            {selected.label}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Available files</Menu.Label>
          {links.map((link) => (
            <Menu.Item key={link.url}>{link.label}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
