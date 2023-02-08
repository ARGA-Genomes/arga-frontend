'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, createStyles, Chip, Box } from "@mantine/core";
import SearchFilter from './filter';


const useStyles = createStyles((theme, _params, _getRef) => ({
  item: {
    "&:hover": {
      backgroundColor: theme.colors["moss"][0],
    },
  },
}));


type SearchItem = {
  id: string,
  scientificName: string,
  subgenus: string,
  genus: string,
  family: string,
  class: string,
  phylum: string,
  kingdom: string,
  speciesGroup?: string[],
  speciesSubgroup?: string[],
  biome: string,
  eventDate: string,
  eventTime: string,
  license: string,
  recordedBy: string[],
  identifiedBy: string[],
};

type WithKingdom = {
  total: number,
  records: SearchItem[],
};

type SearchResults = {
  withKingdom: WithKingdom,
};

type QueryResults = {
  search: SearchResults,
};

const GET_SEARCH_RESULTS = gql`
query {
  search {
    withKingdom(kingdom:"Animalia") {
      total
      records {
        id
        scientificName
        subgenus
        genus
        family
        class
        phylum
        kingdom
        speciesGroup
        speciesSubgroup
        biome
        eventDate
        eventTime
        license
        recordedBy
        identifiedBy
      }
    }
  }
}
`

export default function SearchPage() {
  const { classes } = useStyles();

  const { loading, error, data } = useQuery<QueryResults>(GET_SEARCH_RESULTS);
  if (error) return <p>Error : {error.message}</p>;
  if (loading) return <Text>Loading...</Text>;
  if (!data) return <Text>No data</Text>;

  return (
    <div>
      <Box mb={40}>
        <Title order={3}>Current filters:</Title>
        <SearchFilter />
      </Box>

      <Title order={1} mt={20} mb={20}>Search results</Title>

      {data.search.withKingdom.records.map(item => (
        <Paper mb="md" shadow="md" radius="lg" p="xl" withBorder component="a" href="#" className={classes.item} key={item.id}>
          <Title order={3}>{item.scientificName}</Title>
          <Text>group: {item.speciesGroup?.join(", ")}</Text>
          <Text>subgroup: {item.speciesSubgroup?.join(", ")}</Text>
          <Chip.Group position="left" multiple mt={15}>
            <Chip value="1" variant="filled" checked={true}>Kingdom: {item.kingdom}</Chip>
            <Chip value="2" variant="filled">Phylum: {item.phylum}</Chip>
            <Chip value="3" variant="filled">Class: {item.class}</Chip>
            <Chip value="4" variant="filled">Family: {item.family}</Chip>
            <Chip value="5" variant="filled">Genus: {item.genus}</Chip>
            <Chip value="6">Biome: {item.biome}</Chip>
            <Chip value="7">License: {item.license}</Chip>
            <Chip value="8">Recorded by: {item.recordedBy}</Chip>
            <Chip value="9">Identified by: {item.identifiedBy}</Chip>
          </Chip.Group>
        </Paper>
      ))}
    </div>
  );
}
