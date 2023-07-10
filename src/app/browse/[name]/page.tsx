'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Card, createStyles, LoadingOverlay, Paper, SegmentedControl, SimpleGrid, Text, Title, Image, Grid, Pagination, MantineProvider } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleCheck, CircleX } from "tabler-icons-react";

const GET_SPECIES_STAT = gql`
  query SpeciesStat($withRecordType: String){
    search {
      species (withRecordType:$withRecordType){
        canonicalName
        scientificName
        dataSummary{
          wholeGenomes
          partialGenomes
          barcodes
          mitogenomes
          other
        }
        photo{
          url
        }
      }
    }
  }`;

type FilterItem = {
  filter: string,
  action: string,
  value: string,
}

type Photo = {
  url: string,
}

type DataSummary = {
  wholeGenomes: number,
  partialGenomes: number,
  mitogenomes: number,
  barcodes: number,
  other: number,
}

type Species = {
  canonicalName: string,
  scientificName: string,
  dataSummary: DataSummary,
  photo: Photo,
}

type search = {
  species: Species[],
};

type QueryResults = {
  search: search,
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


function SpeciesCard({ species, withRecordType }: { species: Species , withRecordType: String}) {
  const itemLinkName = species.canonicalName?.replaceAll(" ", "_");

  function small(photo: Photo) {
    return photo.url.replaceAll("original", "small");
  }

  let tab = "summary";
  if(withRecordType == "genomes") { tab = "whole_genome"}
  else if (withRecordType == "barcodes") { tab = "barcode"}
  else if (withRecordType == "organelles") { tab = "mitogenome"}

  return (
    <Card shadow="sm" p={20} radius="lg" withBorder>
      <Link href={`/species/${itemLinkName}/${tab}`}>
        <Title order={4}>{ species.canonicalName }</Title>
      </Link>

      <Box py={20}>
        { withRecordType == "genomes" &&
          <><DataItem name="Whole genome" count={species.dataSummary.wholeGenomes}/>
            <DataItem name="Partial genome" count={species.dataSummary.partialGenomes}/></>
        }
        { withRecordType == "organelles" &&
          <DataItem name="Mitogenome" count={species.dataSummary.mitogenomes}/>
        }
        { withRecordType == "barcodes" &&
          <DataItem name="Barcode" count={species.dataSummary.barcodes}/>
        }
        <DataItem name="Other" count={species.dataSummary.other} />
      </Box>

      <Card.Section>
        <Link href={`/species/${itemLinkName}/summary`}>
          { species.photo
            ? <Image src={small(species.photo)} height={160} alt={species.canonicalName} />
            : <Image withPlaceholder height={160} alt={species.canonicalName} />
          }
        </Link>
      </Card.Section>
    </Card>
  )
}


function BrowseResults({ list , withRecordType}: { list: Species[], withRecordType: String}) {
  return (
    <SimpleGrid cols={4}>
      { list.map(item => (<SpeciesCard species={item} key={item.scientificName} withRecordType={withRecordType}/>)) }
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

  let {loading, error, data} = useQuery<QueryResults>(GET_SPECIES_STAT, {
    variables:  { withRecordType: params.name.toUpperCase() },
  });

  useEffect(() => {
    setFilters(taxaType == 'vertebrates' ? VERTEBRATE_FILTERS : INVERTEBRATE_FILTERS)
    setPagination({ page: 1, pageSize: PAGE_SIZE })
    setTotalPages(1)
  }, [taxaType, setFilters, setPagination, setTotalPages])

  useEffect(() => {
    setTotalPages(data ? 10 : 1)
  }, [data, setTotalPages])

  let title = params.name

  return (
    <Box>
      {/*<Paper bg="midnight.6" p={10} radius="lg" ref={targetRef}>*/}
      {/*  <MantineProvider theme={{ colorScheme: 'dark' }}>*/}
          {/*<SegmentedControl*/}
          {/*  size="md"*/}
          {/*  m={10}*/}
          {/*  value={taxaType}*/}
          {/*  onChange={setTaxaType}*/}
          {/*  classNames={segmented.classes}*/}
          {/*  data={[*/}
          {/*    { value: 'vertebrates', label: 'Vertebrates' },*/}
          {/*    { value: 'invertebrates', label: 'Invertebrates' },*/}
          {/*  ]}*/}
          {/*/>*/}
        {/*</MantineProvider>*/}
      {/*</Paper>*/}
      <Title color="white" style={{textTransform: 'capitalize'}}>{title}</Title>

      <Box mt={40}>
        <LoadingOverlay
          overlayColor="black"
          transitionDuration={500}
          loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
          visible={loading}
        />
        { !loading && data ? <BrowseResults list={data.search.species} withRecordType={params.name}/> : null }
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
