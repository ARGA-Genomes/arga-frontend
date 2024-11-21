import {
  Button,
  Drawer,
  Indicator,
  Stack,
  Text,
  ScrollArea,
  Card,
  Group,
  Badge,
  Image,
  SimpleGrid,
  Menu,
  ActionIcon,
  rem,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconDots, IconSortDescending, IconTrash } from "@tabler/icons-react";

export function SavedDataManagerButton() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [saved, _setSaved] = useLocalStorage<string[]>({
    key: "save-list",
    defaultValue: [],
  });

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
  const [saved, setSaved] = useLocalStorage<string[]>({
    key: "save-list",
    defaultValue: [],
  });

  function remove(item: string) {
    const newList = saved?.filter((value) => value != item);
    setSaved(newList || []);
  }

  return (
    <SimpleGrid cols={5}>
      {saved?.map((item) => (
        <SavedDataItem key={item} item={item} onRemove={remove} />
      ))}
    </SimpleGrid>
  );
}

interface SaveDataItemProps {
  item: string;
  onRemove: (item: string) => void;
}

function SavedDataItem({ item, onRemove }: SaveDataItemProps) {
  const components = item.split("/");
  const name = components.length > 0 ? components[components.length - 1] : "";

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
        <Group justify="space-between" ml="lg">
          <Text fw={500}>{name}</Text>
          <Group justify="right">
            <Button
              color="bushfire"
              variant="subtle"
              radius={0}
              onClick={() => onRemove(item)}
            >
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            </Button>
          </Group>
        </Group>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Badge color="pink">Whole genome</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {item}
      </Text>

      <Button color="moss" fullWidth mt="md" radius="md">
        Download
      </Button>
    </Card>
  );
}
