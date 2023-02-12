'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, createStyles, Chip, Box } from "@mantine/core";
import { SearchFilter,  FilterParams } from './filter';


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

type FilteredResults = {
  total: number,
  records: SearchItem[],
};

type SearchResults = {
  filtered: FilteredResults,
};

type QueryResults = {
  search: SearchResults,
};

const GET_SEARCH_RESULTS = gql`
query Search($kingdom: String, $phylum: String, $class: String, $family: String, $genus: String) {
  search {
    filtered(kingdom: $kingdom, phylum: $phylum, class: $class, family: $family, genus: $genus) {
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
}`;

export default function SearchPage() {
  const { classes } = useStyles();

  const { loading, error, data, refetch } = useQuery<QueryResults>(GET_SEARCH_RESULTS);
  if (error) return <p>Error : {error.message}</p>;
  if (loading) return <Text>Loading...</Text>;
  if (!data) return <Text>No data</Text>;

  const onFilterChange = (params: FilterParams) => {
    const variables = {
      kingdom: [...params.kingdom][0],
      phylum: [...params.phylum][0],
      class: [...params.class][0],
      family: [...params.family][0],
      genus: [...params.genus][0],
    };
    refetch(variables);
  }

  return (
    <div>
      <Box mb={40}>
        <Title order={3}>Current filters:</Title>
        <SearchFilter onChange={ onFilterChange } />
      </Box>

      <Title order={1} mt={20} mb={20}>Search results</Title>

      {data.search.filtered.records.map(item => (
        <Paper mb="md" shadow="md" radius="lg" p="xl" withBorder component="a" href="#" className={classes.item} key={item.id}>
          <Title order={3}>{item.scientificName}</Title>
          <Text>group: {item.speciesGroup?.join(", ")}</Text>
          <Text>subgroup: {item.speciesSubgroup?.join(", ")}</Text>
          <Chip.Group position="left" multiple mt={15}>
            <Chip value="1" variant="filled">Kingdom: {item.kingdom}</Chip>
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
