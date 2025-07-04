"use client";

import { Dataset } from "@/app/source-provider";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  createTheme,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  Image,
  Indicator,
  MantineProvider,
  Menu,
  Paper,
  rem,
  Space,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useClipboard, useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconChevronDown,
  IconClipboardCopy,
  IconDownload,
  IconFileInfo,
  IconFileText,
  IconFileZip,
  IconTerminal2,
  IconTrashFilled,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface SavedItem {
  url: string;
  label: string;
  dataType: string;
  scientificName: string;
  datePublished?: string;
  dataset: Dataset;
}

interface DownloadLink {
  label: string;
  url: string;
}

export function SavedDataManagerButton() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [saved, _setSaved] = useSavedData();

  return (
    <>
      <Drawer opened={opened} onClose={close} position="top" size="xl">
        <Space h={88} />
        <SavedDataManager />
      </Drawer>
      <Indicator inline label={saved.length} size={16} color="bushfire" disabled={!saved.length}>
        <ActionIcon size="lg" onClick={toggle} radius="md" variant="subtle" color="midnight.2">
          <Image src="/icons/misc/file-leaf.svg" width={26} height={26} />
        </ActionIcon>
      </Indicator>
    </>
  );
}

function SavedDataManager() {
  const [saved, setSaved] = useSavedData();
  const [selected, setSelected] = useState<SavedItem[]>(saved);

  const [metadataUrl, setMetadataUrl] = useState<string | undefined>();
  const [manifestUrl, setManifestUrl] = useState<string | undefined>();
  const [scriptUrl, setScriptUrl] = useState<string | undefined>();
  const clipboard = useClipboard({ timeout: 1000 });

  // every time the selected files change we need to recreate
  // the blobs for metadata and manifest files and create a new
  // URL for each file
  useEffect(() => {
    // remove the old url. manual cleanup needed for performance
    if (metadataUrl) URL.revokeObjectURL(metadataUrl);
    if (manifestUrl) URL.revokeObjectURL(manifestUrl);
    if (scriptUrl) URL.revokeObjectURL(scriptUrl);

    if (selected.length > 0) {
      const metadataBlob = createMetadataFile(selected);
      const metadataBlobUrl = URL.createObjectURL(metadataBlob);
      setMetadataUrl(metadataBlobUrl);

      const manifestBlob = createManifestFile(selected);
      const manifestBlobUrl = URL.createObjectURL(manifestBlob);
      setManifestUrl(manifestBlobUrl);

      const scriptBlob = createScriptFile(selected);
      const scriptBlobUrl = URL.createObjectURL(scriptBlob);
      setScriptUrl(scriptBlobUrl);
    } else {
      setMetadataUrl(undefined);
      setManifestUrl(undefined);
      setScriptUrl(undefined);
    }
  }, [selected]);

  function remove(item: SavedItem) {
    setSaved(saved.filter((value) => value.url != item.url));
    setSelected(selected.filter((value) => value.url != item.url));
  }

  function copySelected() {
    const urls = Array.from(selected)
      .map((item) => item.url)
      .join("\n");
    clipboard.copy(urls);
  }

  function selectItem(item: SavedItem) {
    if (!selected.find((i) => i.url === item.url)) {
      setSelected([...selected, item]);
    }
  }

  function deselectItem(item: SavedItem) {
    setSelected((current) => current.filter((i) => i.url !== item.url));
  }

  return (
    <Flex gap="md">
      <Grid w="100%">
        {saved.map((item) => (
          <Grid.Col key={item.url} span={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
            <SavedDataItem
              key={item.url}
              item={item}
              onRemove={remove}
              onSelected={selectItem}
              onDeselected={deselectItem}
            />
          </Grid.Col>
        ))}
      </Grid>
      <Paper w={300} shadow="md" radius="lg" withBorder p="xl">
        <Stack>
          <DownloadSelectedForm items={selected} metadata={metadataUrl}>
            <Tooltip label="Download all selected files and metadata as a single .zip file">
              <Button
                fullWidth
                disabled={selected.length <= 0}
                color="midnight.8"
                radius="md"
                rightSection={<IconFileZip />}
                type="submit"
              >
                Download selected
              </Button>
            </Tooltip>
          </DownloadSelectedForm>

          <Tooltip label="Download a metadata file containing metadata for all selected files">
            <Button
              component="a"
              href={metadataUrl}
              download="metadata.csv"
              disabled={!metadataUrl}
              fullWidth
              variant="light"
              color="shellfish"
              radius="md"
              rightSection={<IconFileInfo />}
            >
              Download metadata
            </Button>
          </Tooltip>

          <Divider mt="md" label="Tools for programmatic access" />

          <Tooltip label="Copy the URLs of all selected files into the clipboard">
            <Button
              fullWidth
              disabled={selected.length <= 0}
              variant="light"
              color="shellfish"
              radius="md"
              rightSection={<IconClipboardCopy />}
              onClick={copySelected}
            >
              {clipboard.copied ? "Copied!" : "Copy URLs to clipboard"}
            </Button>
          </Tooltip>

          <Tooltip label="Download a text file containing links to all selected files">
            <Button
              component="a"
              href={manifestUrl}
              download="manifest.txt"
              disabled={!manifestUrl}
              fullWidth
              variant="light"
              color="shellfish"
              radius="md"
              rightSection={<IconFileText />}
            >
              Download manifest
            </Button>
          </Tooltip>

          <Tooltip label="Download a shell script that downloads all selected files">
            <Button
              component="a"
              href={scriptUrl}
              download="arga-download.sh"
              disabled={!scriptUrl}
              fullWidth
              variant="light"
              color="shellfish"
              radius="md"
              rightSection={<IconTerminal2 />}
            >
              Download script
            </Button>
          </Tooltip>
        </Stack>
      </Paper>
    </Flex>
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
    // Only run when 'checked' changes; ignore 'onChange' identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Box
      h={100}
      w={80}
      bg={hint}
      style={{ cursor: "pointer" }}
      onMouseOver={() => {
        setHint(checked ? "moss.1" : "moss.0");
      }}
      onMouseOut={() => {
        setHint(checked ? "moss.0" : "none");
      }}
      onClick={() => {
        setChecked(!checked);
      }}
    >
      <Center h={100}>
        <MantineProvider theme={theme}>
          <Checkbox
            color="moss"
            size="lg"
            radius="lg"
            checked={checked}
            onChange={(ev) => {
              setChecked(ev.currentTarget.checked);
            }}
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

function SavedDataItem({ item, onRemove, onSelected, onDeselected }: SaveDataItemProps) {
  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Card.Section withBorder mb="md">
        <Group gap={4} justify="space-between">
          <Flex style={{ flexShrink: 1 }} gap="lg" align="center">
            <HintedCheckbox
              onChange={(checked) => {
                if (checked) onSelected(item);
                else onDeselected(item);
              }}
            />
            <Link href={`/species/${item.scientificName}/whole_genomes/${item.label}`} style={{ flexShrink: 1 }}>
              <Flex gap="lg">
                <Image src={"/icons/data-type/Data type_ Whole genome.svg"} fit="contain" h={65} w={65} alt="" />
                <Stack justify="center" gap={0}>
                  <Text fw={500} truncate="end">
                    {item.label}
                  </Text>
                  <Text fw={300} fz="xs" style={{ fontVariant: "small-caps" }}>
                    {item.dataType}
                  </Text>
                </Stack>
              </Flex>
            </Link>
          </Flex>

          <Button
            color="red"
            variant="subtle"
            radius={0}
            onClick={() => {
              onRemove(item);
            }}
            h={100}
          >
            <IconTrashFilled style={{ width: rem(35), height: rem(35) }} />
          </Button>
        </Group>
      </Card.Section>

      <Table mx="md" mb="md">
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

      <DownloadButton links={[{ label: "Fasta (.fna.gz)", url: item.url }]} />
    </Card>
  );
}

export function useSavedData() {
  return useLocalStorage<SavedItem[]>({ key: "saved-data", defaultValue: [] });
}

function DownloadButton({ links }: { links: DownloadLink[] }) {
  const clipboard = useClipboard({ timeout: 1000 });
  const selected = links[0];

  return (
    <Group gap={0} grow>
      <Button
        color="moss.4"
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

      <Button
        color="moss"
        radius={0}
        rightSection={<IconClipboardCopy />}
        onClick={() => {
          clipboard.copy(selected.url);
        }}
      >
        {clipboard.copied ? "Copied!" : "Copy URL"}
      </Button>

      <Menu
        shadow="md"
        width={200}
        styles={{
          dropdown: { borderRadius: "var(--mantine-radius-lg)" },
          item: { borderRadius: "var(--mantine-radius-lg)" },
        }}
      >
        <Menu.Target>
          <Button
            color="moss.7"
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

interface DownloadSelectedFormProps {
  items: SavedItem[];
  metadata?: string;
  children: React.ReactNode;
}

function DownloadSelectedForm({ items, metadata, children }: DownloadSelectedFormProps) {
  const timestamp = DateTime.now().toFormat("yyyy-mm-dd-HHmmss");
  const filename = `ARGA-${timestamp}.zip`;
  return (
    <form name="download" action={`/downloadZip/${filename}`} method="POST">
      {metadata && <input type="hidden" name="metadataUrl" value={metadata} />}
      {items.map((item) => (
        <input type="hidden" name="url" value={item.url} key={item.url} />
      ))}

      {children}
    </form>
  );
}

function createMetadataFile(items: SavedItem[]): Blob {
  function toLine(item: SavedItem) {
    return `${item.label},${item.datePublished},${item.scientificName},${item.url}`;
  }

  const header = "label,date_published,scientific_name,url";
  const text = items.map(toLine).join("\n");
  const csv = `${header}\n${text}`;

  return new Blob([csv], { type: "text/csv;charset=utf-8" });
}

function createManifestFile(items: SavedItem[]): Blob {
  const text = items.map((item) => item.url).join("\n");
  return new Blob([text], { type: "text/plain;charset=utf-8" });
}

function createScriptFile(items: SavedItem[]): Blob {
  function toCurl(item: SavedItem) {
    return `echo "Downloading ${item.label}"; curl -O -XGET ${item.url};`;
  }

  const header = "#!/bin/sh";
  const text = items.map(toCurl).join("\n");
  const script = `${header}\n\n${text}`;

  return new Blob([script], { type: "text/plain;charset=utf-8" });
}
