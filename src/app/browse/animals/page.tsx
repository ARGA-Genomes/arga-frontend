'use client';

import { PaginationBar } from "@/app/components/pagination";
import { SpeciesCard } from "@/app/components/species-card";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Drawer, Group, LoadingOverlay, SimpleGrid, Title, Text, useMantineTheme, Stack, Divider, Input, Grid, Select, Flex } from "@mantine/core";
import { useDisclosure, useListState, useScrollIntoView } from "@mantine/hooks";
import { useState } from "react";
import { Filter as IconFilter, Minus, Plus } from "tabler-icons-react";


const PAGE_SIZE = 15;

const GET_SPECIES = gql`
query AnimaliaTaxaSpecies($page: Int, $perPage: Int, $filters: [FilterItem]) {
  taxa(filters: $filters) {
    species(page: $page, perPage: $perPage) {
      total,
      records {
        taxonomy {
          scientificName
          canonicalName
          authority
          kingdom
          phylum
          class
          order
          family
          genus
        }
        photo {
          url
        }
        dataSummary {
          wholeGenomes
          partialGenomes
          organelles
          barcodes
          other
        }
      }
    }
  }
}`;

type DataSummary = {
  wholeGenomes: number,
  organelles: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: { canonicalName: string },
  photo: { url: string },
  dataSummary: DataSummary,
}

type Taxa = {
  species: {
    records: Species[],
    total: number,
  },
};

type QueryResults = {
  taxa: Taxa,
};


function BrowseResults({ list }: { list: Species[]}) {
  if (list.length === 0) return <Title>No data found</Title>

  return (
    <SimpleGrid cols={3}>
      { list.map(item => (<SpeciesCard species={item} key={item.taxonomy.canonicalName} />)) }
    </SimpleGrid>
  )
}


type Filter = {
  filter: string,
  action: string,
  value: string,
  editable: boolean,
}


const CLASSIFICATIONS = [
  {value: "KINGDOM", label: "Kingdom"},
  {value: "PHYLUM", label: "Phylum"},
  {value: "CLASS", label: "Class"},
  {value: "ORDER", label: "Order"},
  {value: "FAMILY", label: "Family"},
  {value: "GENUS", label: "Genus"},
]


interface FiltersProps {
  filters: Filter[],
  onAdd: () => void,
  onRemove: (index: number) => void,
  onChange: (index: number, filter: Filter) => void,
}

function Filters({ filters, onAdd, onRemove, onChange }: FiltersProps) {

  const valueChanged = (idx: number, filter: Filter, value: string|null) => {
    if (value) {
      filter.value = value;
      onChange(idx, filter);
    }
  }
  const filterChanged = (idx: number, filter: Filter, value: string|null) => {
    if (value) {
      filter.filter = value;
      onChange(idx, filter);
    }
  }

  return (
    <Stack p={20}>
        <Title order={5}>Higher classification</Title>
        { filters.map((item, idx) => (
          <Grid key={`classification-filter-${idx}`}>
            <Grid.Col span="auto">
              <Flex>
                <Select
                  data={CLASSIFICATIONS}
                  value={item.filter}
                  disabled={!item.editable}
                  onChange={value => filterChanged(idx, item, value)}
                />
                <Input
                  value={item.value}
                  disabled={!item.editable}
                  onChange={el => valueChanged(idx, item, el.currentTarget.value)}
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span="content">
              <Button color="red" onClick={() => onRemove(idx)} disabled={!item.editable}><Minus /></Button>
            </Grid.Col>
          </Grid>
        ))}
        <Button leftIcon={<Plus />} onClick={onAdd}>Add filter</Button>

        <Divider m={20} />

        <Title order={5}>Vernacular group</Title>
        <Button leftIcon={<Plus />}>Add filter</Button>
    </Stack>
  )
}


export default function AnimalsList() {
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const [classifications, handlers] = useListState<Filter>([
    { filter: "KINGDOM", action: "INCLUDE", value: "Animalia", editable: false }
  ]);

  const addFilter = () => {
    handlers.append({
      filter: "",
      action: "INCLUDE",
      value: "",
      editable: true,
    })
  }

  const removeFilter = (index: number) => {
    handlers.remove(index)
  }

  const changeFilter = (index: number, item: Filter) => {
    handlers.setItem(index, item)
  }

  const convertFilter = (item: Filter) => {
    if (item.filter && item.action && item.value) {
      return {
        filter: item.filter,
        action: item.action,
        value: item.value,
      }
    }

    return undefined;
  }


  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      page,
      perPage: PAGE_SIZE,
      filters: classifications.map(convertFilter).filter(item => item)
    }
  });

  return (
    <Box>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box mt={120}>
          <Filters filters={classifications} onAdd={addFilter} onRemove={removeFilter} onChange={changeFilter} />
        </Box>
      </Drawer>

      <Box mt={20}>
        <LoadingOverlay
          overlayColor={theme.colors.midnight[0]}
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
          radius="xl"
        />

        <Group position="apart">
          <Title order={2} mb={20}>Animals</Title>
          <Button onClick={open} variant="outline" leftIcon={<IconFilter />} radius="md">Filters</Button>
        </Group>

        { error ? <Title order={4}>{error.message}</Title> : null }
        { !loading && data ? <BrowseResults list={data.taxa.species.records} /> : null }

        <PaginationBar
          total={data?.taxa.species.total}
          page={page}
          pageSize={PAGE_SIZE}
          onChange={page => { setPage(page); scrollIntoView() }}
        />
      </Box>
    </Box>
  );
}
