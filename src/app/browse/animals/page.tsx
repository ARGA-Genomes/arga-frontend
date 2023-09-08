'use client';

import { Filter, intoFilterItem } from "@/app/components/filtering/common";
import { HigherClassificationFilters } from "@/app/components/filtering/higher-classification";
import { VernacularGroupFilters } from "@/app/components/filtering/vernacular-group";
import { EcologyFilters } from "@/app/components/filtering/ecology";
import { IbraFilters } from "@/app/components/filtering/ibra";
import { ImcraFilters } from "@/app/components/filtering/imcra";
import { StateFilters } from "@/app/components/filtering/state";
import { DrainageBasinFilters } from "@/app/components/filtering/drainage-basin";
import { PaginationBar } from "@/app/components/pagination";
import { SpeciesCard } from "@/app/components/species-card";
import { gql, useQuery } from "@apollo/client";
import { Box, Button, Drawer, Group, LoadingOverlay, SimpleGrid, Title, Text, useMantineTheme, Stack, Divider, Input, Grid, Select, Flex } from "@mantine/core";
import { useDisclosure, useListState, useScrollIntoView } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Filter as IconFilter, Plus } from "tabler-icons-react";


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
    filterOptions {
      ecology
      ibra
      imcra
      state
      drainageBasin
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

type FilterOptions = {
  ecology: string[],
  ibra: string[],
  imcra: string[],
  state: string[],
  drainageBasin: string[],
}

type Taxa = {
  species: {
    records: Species[],
    total: number,
  },
  filterOptions: FilterOptions,
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


type Filters = {
  classifications: Filter[],
  vernacularGroup?: Filter,
  ecology?: Filter,
  ibra?: Filter,
  imcra?: Filter,
  state?: Filter,
  drainageBasin?: Filter,
}

interface FiltersProps {
  filters: Filters,
  options?: FilterOptions,
  onChange: (filters: Filters) => void,
}

function Filters({ filters, options, onChange }: FiltersProps) {
  const [classifications, setClassifications] = useState<Filter[]>(filters.classifications)
  const [vernacularGroup, setVernacularGroup] = useState<Filter | undefined>(filters.vernacularGroup)
  const [ecology, setEcology] = useState<Filter | undefined>(filters.ecology)
  const [ibra, setIbra] = useState<Filter | undefined>(filters.ibra)
  const [imcra, setImcra] = useState<Filter | undefined>(filters.imcra)
  const [state, setState] = useState<Filter | undefined>(filters.state)
  const [drainageBasin, setDrainageBasin] = useState<Filter | undefined>(filters.drainageBasin)

  useEffect(() => {
    onChange({
      classifications,
      vernacularGroup,
      ecology,
      ibra,
      imcra,
      state,
      drainageBasin,
    })
  }, [classifications, vernacularGroup, ecology, ibra, imcra, state, drainageBasin, onChange]);

  return (
    <Stack p={20}>
      <Title order={5}>Higher classification</Title>
      <HigherClassificationFilters
        filters={classifications}
        onChange={setClassifications}
      />

      <Title order={5}>Vernacular group</Title>
      <VernacularGroupFilters value={vernacularGroup?.value} onChange={setVernacularGroup} />

      <Title order={5}>Ecology</Title>
      <EcologyFilters value={ecology?.value} options={options?.ecology || []} onChange={setEcology} />

      <Title order={5}>Ibra Region</Title>
      <IbraFilters value={ibra?.value} options={options?.ibra || []} onChange={setIbra} />

      <Title order={5}>Imcra Region</Title>
      <ImcraFilters value={imcra?.value} options={options?.imcra || []} onChange={setImcra} />

      <Title order={5}>State</Title>
      <StateFilters value={state?.value} options={options?.state || []} onChange={setState} />

      <Title order={5}>Drainage Basin</Title>
      <DrainageBasinFilters value={drainageBasin?.value} options={options?.drainageBasin || []} onChange={setDrainageBasin} />
    </Stack>
  )
}


export default function AnimalsList() {
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const { scrollIntoView } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const [filters, setFilters] = useState<Filters>({
    classifications: [{ filter: "KINGDOM", action: "INCLUDE", value: "Animalia", editable: false }],
  });


  const flattenFilters = (filters: Filters) => {
    const items = [
      ...filters.classifications,
      filters.vernacularGroup,
      filters.ecology,
      filters.ibra,
      filters.imcra,
      filters.state,
      filters.drainageBasin,
    ];

    return items.filter((item): item is Filter => !!item);
  }

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      page,
      perPage: PAGE_SIZE,
      filters: flattenFilters(filters).map(intoFilterItem).filter(item => item)
    }
  });

  return (
    <Box>
      <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="xl">
        <Box mt={120}>
          <Filters filters={filters} options={data?.taxa.filterOptions} onChange={setFilters} />
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
