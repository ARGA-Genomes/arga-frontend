import {
  Badge,
  Box,
  Button,
  Drawer,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import { Filter } from "./common";
import { useDisclosure } from "@mantine/hooks";

interface FilterBarProps {
  title?: string | React.ReactNode;
  filters: Filter[];
  children?: React.ReactNode;
}

export function FilterBar(props: FilterBarProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xl"
      >
        <Box pt={200}>{props.children}</Box>
      </Drawer>

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          {typeof props.title === "string" ? (
            <Title order={5}>{props.title}</Title>
          ) : (
            props.title
          )}
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>
              Filters
            </Text>
            {props.filters.length === 0 && (
              <Text fz="sm" c="dimmed" fw={300}>
                None
              </Text>
            )}
            {props.filters.map((filter) => (
              <FilterBadge filter={filter} key={filter.value} />
            ))}
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Button
            leftSection={<IconFilter />}
            variant="subtle"
            onClick={open}
            color="shellfish.7"
          >
            Filter
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
}

function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline" color="shellfish.7">
      {filter.value}
    </Badge>
  );
}
