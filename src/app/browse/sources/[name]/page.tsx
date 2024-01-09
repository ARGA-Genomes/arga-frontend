'use client';

import { Filter, intoFilterItem } from "@/components/filtering/common";
import { SpeciesCard } from "@/components/species-card";
import { gql, useQuery } from "@apollo/client";
import { Paper, SimpleGrid, Text, Title, Group, Stack, Container, Drawer, Box, Grid, SegmentedControl, Button, Accordion, Badge, Avatar } from "@mantine/core";
import { useEffect, useState } from "react";
import { PaginationBar } from "@/components/pagination";
import { MAX_WIDTH } from "@/app/constants";
import { LoadOverlay } from "@/components/load-overlay";
import { usePreviousPage } from "@/components/navigation-history";
import { useDisclosure } from "@mantine/hooks";
import { SortAscending, Filter as IconFilter } from "tabler-icons-react";
import { HasDataFilters } from "@/components/filtering/has-data";
import { HigherClassificationFilters } from "@/components/filtering/higher-classification";


const PAGE_SIZE = 10;
type Filters = {

  classifications: Filter[],
  dataTypes: Filter[],
}


const GET_DETAILS = gql`
query SourceDetails($name: String) {
  source(by: { name: $name }) {
    license
    accessRights
    rightsHolder
    author
    name

    datasets {
      name
      globalId
    }
  }
}`;

type Dataset = {
  name: string,
  globalId: string,
}

type Source = {
  license: string,
  accessRights: string,
  rightsHolder: string,
  author: string,
  name: string,

  datasets: Dataset[],
};

type DetailsQueryResults = {
  source: Source,
};


const GET_SPECIES = gql`
query SourceSpecies($name: String, $page: Int, $pageSize: Int) {
  source(by: { name: $name }) {
    species(page: $page, pageSize: $pageSize) {
      total
      records {
        taxonomy {
          canonicalName
        }
        photo {
          url
        }
        dataSummary {
          genomes
          loci
          specimens
          other
        }
      }
    }
  }
}`;

type Photo = {
  url: string,
}

type DataSummary = {
  genomes: number,
  loci: number,
  specimens: number,
  other: number,
}

type Record = {
  taxonomy: { canonicalName: string },
  photo: Photo,
  dataSummary: DataSummary,
}

type SpeciesQueryResults = {
  source: {
    species: {
      records: Record[],
      total: number,
    }
  },
};


interface FiltersProps {
  filters: Filters,
  onChange: (filters: Filters) => void,
}

function Filters({ filters, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications)
  const [dataTypes, setDataTypes] = useState<Filter[]>(filters.dataTypes)

  useEffect(() => {
    onChange({
      classifications,
      dataTypes,
    })
  }, [classifications, dataTypes, onChange]);

  return (
    <Accordion defaultValue="hasData" variant='separated'>
      <Accordion.Item value="hasData">
        <Accordion.Control>
          <FilterGroup
            label="Data types"
            description="Only show species that have specific types of data"
            image="/card-icons/type/whole_genomes.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HasDataFilters filters={dataTypes} onChange={setDataTypes} />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="classification">
        <Accordion.Control>
          <FilterGroup
            label="Higher classification filters"
            description="Limit data based on taxonomy"
            image="/card-icons/type/higher_taxon_report.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <HigherClassificationFilters filters={classifications} onChange={setClassifications} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}


interface FilterGroupProps {
  label: string,
  description: string,
  image: string,
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  )
}


function FilterBadge({ filter }: { filter: Filter }) {
  return (
    <Badge variant="outline">
      {filter.value}
    </Badge>
  )
}



function Species({ source }: { source: string }) {
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const [filters, setFilters] = useState<Filters>({
    classifications: [],
    dataTypes: [],
  });

  const flattenFilters = (filters: Filters) => {
    const items = [
      ...filters.classifications,
      ...filters.dataTypes,
    ];

    return items.filter((item): item is Filter => !!item);
  }

  const { loading, error, data } = useQuery<SpeciesQueryResults>(GET_SPECIES, {
    variables: { name: source, page, pageSize: PAGE_SIZE },
  });

  const records = Array.from(data?.source.species.records || []);

  return (
    <Stack>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        size="xl"
      >
        <Box pt={200}>
          <Filters filters={filters} onChange={setFilters} />
        </Box>
      </Drawer>

      <LoadOverlay visible={loading} />

      <Grid gutter={50} align="baseline">
        <Grid.Col span="content">
          <Title order={5}>Browse species</Title>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            <Text fz="sm" fw={300}>Filters</Text>
            { flattenFilters(filters).map(filter => <FilterBadge filter={filter} key={filter.value} />) }
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

      { error ? <Title order={4}>{error.message}</Title> : null }

      <SimpleGrid cols={5}>
        {records.map((record) => (
          <SpeciesCard key={record.taxonomy.canonicalName} species={record} />
        ))}
      </SimpleGrid>

      <PaginationBar
        total={data?.source.species.total}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </Stack>
  );
}


function SourceDetails({ source }: { source: string }) {
  const { loading, error, data } = useQuery<DetailsQueryResults>(GET_DETAILS, {
    variables: { name: source }
  });

  return (
    <Stack gap={0}>
      <LoadOverlay visible={loading} />

      { error ? <Text>{error.message}</Text> : null }

      <Text c="dimmed" size="xs">{data?.source.author}</Text>
      <Text c="dimmed" size="xs">&copy; {data?.source.rightsHolder}</Text>
    </Stack>
  )
}


export default function BrowseSource({ params }: { params: { name: string } }) {
  const source = decodeURIComponent(params.name).replaceAll("_", " ");
  const [_, setPreviousPage] = usePreviousPage();

  useEffect(() => {
    setPreviousPage({ name: `browsing ${source}`, url: '/browse/sources/${params.name}' })
  }, [setPreviousPage])

  return (
    <Stack mt="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Group gap={40}>
            <Text c="dimmed" fw={400}>SOURCE</Text>
            <Stack gap={0}>
              <Text fz={38} fw={700}>{source}</Text>
              <SourceDetails source={source} />
            </Stack>
          </Group>
        </Container>
      </Paper>

      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack>
            <Paper p="xl" radius="lg" withBorder>
              <Species source={source} />
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </Stack>
  );
}
