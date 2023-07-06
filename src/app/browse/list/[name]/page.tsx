'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Card, createStyles, LoadingOverlay, Paper, SegmentedControl, SimpleGrid, Text, Title, Image, Grid, Pagination, MantineProvider } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleCheck, CircleX } from "tabler-icons-react";


const GET_TAXA = gql`
query lists($name: String, $pagination: Pagination, $filters: [FilterItem]) {
  lists(name: $name, pagination: $pagination, filters: $filters) {
    stats {
      totalRecords
    }
    species {
      taxonomy {
        scientificName
        canonicalName
        authorship
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
        mitogenomes
        barcodes
        other
      }
    }
  }
}`;

type Pagination = {
  page: number,
  pageSize: number,
}

type FilterItem = {
  filter: string,
  action: string,
  value: string,
}


type Taxonomy = {
  scientificName: string,
  canonicalName: string,
  authorship: string,
  kingdom: string,
  phylum: string,
  class: string,
  order: string,
  family: string,
  genus: string,
};

type Photo = {
  url: string,
}

type DataSummary = {
  wholeGenomes: number,
  mitogenomes: number,
  barcodes: number,
  other: number,
}

type Species = {
  taxonomy: Taxonomy,
  photo: Photo,
  dataSummary: DataSummary,
}

type Stats = {
  totalRecords: number,
}

type Lists = {
  stats: Stats,
  species: Species[],
};

type QueryResults = {
  lists: Lists,
};


function DataItem({ name, count }: { name: string, count: number }) {
  const hasData = count > 0;
  const dimmed = 'rgba(134, 142, 150, .5)';
  const extraDimmed = 'rgba(134, 142, 150, .3)';

  return (
    <Grid>
      <Grid.Col span="content" pb={0} pr={0} mr={0}>
        { hasData ? <CircleCheck color="green" /> : <CircleX color={extraDimmed} /> }
      </Grid.Col>
      <Grid.Col span="auto">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400 }>{name}</Text>
      </Grid.Col>
      <Grid.Col span="content">
        <Text c={hasData ? "black" : dimmed} fw={hasData ? 500 : 400 }>{count} records</Text>
      </Grid.Col>
    </Grid>
  )
}


function SpeciesCard({ species }: { species: Species }) {
  const itemLinkName = species.taxonomy.canonicalName.replaceAll(" ", "_");

  function small(photo: Photo) {
    return photo.url.replaceAll("original", "small");
  }

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}/summary`}>
        <Title order={4}>{ species.taxonomy.canonicalName }</Title>
      </Link>

      <Box py={20}>
        <DataItem name="Whole genome" count={species.dataSummary.wholeGenomes} />
        <DataItem name="Mitogenome" count={species.dataSummary.mitogenomes} />
        <DataItem name="Barcode" count={species.dataSummary.barcodes} />
        <DataItem name="Other" count={species.dataSummary.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}/summary`}>
          { species.photo
            ? <Image src={small(species.photo)} height={160} alt={species.taxonomy.canonicalName} />
            : <Image withPlaceholder height={160} alt={species.taxonomy.canonicalName} />
          }
        </Link>
      </Card.Section>
    </Card>
  )
}


function BrowseResults({ list }: { list: Species[]}) {
  return (
    <SimpleGrid cols={4}>
      { list.map(item => (<SpeciesCard species={item} key={item.taxonomy.scientificName} />)) }
    </SimpleGrid>
  )
}

const VERTEBRATE_FILTERS = [
  { filter: 'KINGDOM', action: 'INCLUDE', value: 'Animalia' },
  { filter: 'PHYLUM', action: 'INCLUDE', value: 'Chordata' },
];

const INVERTEBRATE_FILTERS = [
  { filter: 'KINGDOM', action: 'INCLUDE', value: 'Animalia' },
  { filter: 'PHYLUM', action: 'EXCLUDE', value: 'Chordata' },
];

const PAGE_SIZE = 20;

export default function BrowseList({ params }: { params: { name: string } }) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60, duration: 500 });

  const segmented = useSearchTypeStyles();
  const [taxaType, setTaxaType] = useState('vertebrates');
  const [filters, setFilters] = useState<FilterItem[]>(VERTEBRATE_FILTERS);
  const [pagination, setPagination] = useState({ page: 1, pageSize: PAGE_SIZE });
  const [totalPages, setTotalPages] = useState(1)

  const { loading, error, data } = useQuery<QueryResults>(GET_TAXA, {
    variables: {
      name: params.name.replaceAll("_", " "),
      pagination,
      filters,
    },
  });

  useEffect(() => {
    setFilters(taxaType == 'vertebrates' ? VERTEBRATE_FILTERS : INVERTEBRATE_FILTERS)
    setPagination({ page: 1, pageSize: PAGE_SIZE })
    setTotalPages(1)
  }, [taxaType, setFilters, setPagination, setTotalPages])

  useEffect(() => {
    setTotalPages(data ? Math.ceil(data.lists.stats.totalRecords / PAGE_SIZE) : 1)
  }, [data, setTotalPages])


  return (
    <Box>
      <Paper bg="midnight.6" p={10} radius="lg" ref={targetRef}>
        <MantineProvider theme={{ colorScheme: 'dark' }}>
        <SegmentedControl
          size="md"
          m={10}
          value={taxaType}
          onChange={setTaxaType}
          classNames={segmented.classes}
          data={[
            { value: 'vertebrates', label: 'Vertebrates' },
            { value: 'invertebrates', label: 'Invertebrates' },
          ]}
        />
        </MantineProvider>
      </Paper>

      <Box mt={40}>
        <LoadingOverlay
          overlayColor="black"
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
        />
        { !loading && data ? <BrowseResults list={data.lists.species} /> : null }
      </Box>

      <Paper bg="midnight.6" p={20} m={40} radius="lg">
        <Pagination
          position="center"
          color="bushfire.5"
          radius="lg"
          withEdges
          total={totalPages}
          page={pagination.page}
          onChange={(page) => {
            setPagination({page, pageSize: PAGE_SIZE})
            scrollIntoView({ alignment: 'center' })
          }}
        />
      </Paper>
    </Box>
  );
}


// Custom segmented control style for the search block
const useSearchTypeStyles = createStyles((theme, _params, _getRef) => {
  return {
    root: {
      color: "white",
      backgroundColor: theme.colors.midnight[6],
      paddingLeft: 0,
      paddingRight: 0,
      borderWidth: 0,
      borderRadius: 0,
    },
    label: {
      fontSize: "20px",
      fontWeight: 400,
      color: theme.colors.gray[3],

      '&:hover': {
        color: "white",
      },
      '&[data-active]': {
        '&, &:hover': {
          color: "white",
        },
      },
    },
    control: {
      borderWidth: 0,
      borderRadius: 0,
    },
    active: {
      color: "white",
      backgroundColor: theme.colors.midnight[5],
      left: 5,
      bottom: 0,
      borderRadius: 5,
      borderBottomColor: theme.colors.bushfire[4],
      borderBottomWidth: "6px",
      borderBottomStyle: "solid",
      boxShadow: "none",
    },
  }
});