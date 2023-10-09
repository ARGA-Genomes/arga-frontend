import { Badge, Box, Button, Drawer, Grid, Group, SegmentedControl, Text, Title } from "@mantine/core";
import { SortAscending, Filter as IconFilter } from "tabler-icons-react";
import { Filter } from "./common";
import { useDisclosure } from "@mantine/hooks";


interface FilterBarProps {
  title?: string,
  filters: Filter[],
  children?: React.ReactNode,
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
        <Box pt={200}>
          {props.children}
        </Box>
      </Drawer>

    <Grid gutter={50} align="baseline">
      <Grid.Col span="content">
        <Title order={5}>{props.title}</Title>
      </Grid.Col>

      <Grid.Col span="auto">
        <Group>
          <Text fz="sm" fw={300}>Filters</Text>
          { props.filters.map(filter => <FilterBadge filter={filter} key={filter.value} />) }
        </Group>
      </Grid.Col>

      <Grid.Col span="content">
        <Group wrap="nowrap">
          <SortAscending />
          <Text>Sort by</Text>
          <SegmentedControl radius="xl" data={[
            { value: 'alpha', label: 'A-Z' },
            { value: 'date', label: 'Date' },
            { value: 'records', label: 'Records' },
          ]}/>
        </Group>
      </Grid.Col>

      <Grid.Col span="content">
        <Button leftSection={<IconFilter />} variant="subtle" onClick={open}>Filter</Button>
      </Grid.Col>
    </Grid>
    </>
  )
}

function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline">
      {filter.value}
    </Badge>
  )
}
