'use client';

import { gql, useQuery } from '@apollo/client';

import { Text, Paper, Title, createStyles, Chip } from "@mantine/core";


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
  genus: string,
  subgenus: string,
  kingdom: string,
  phylum: string,
  family: string,
  class: string,
  speciesGroup: string[],
  speciesSubgroup: string[],
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
    withKingdom(kingdom:"Bacteria") {
      total
      records {
        id
        scientificName
        genus
        subgenus
        kingdom
        phylum
        family
        class
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
  console.log(data);

  if (!data) return <Text>No data</Text>;

  return (
    <div>
      <Title order={1} mt={20} mb={20}>Search results</Title>

      {data.search.withKingdom.records.map((item) => (
        <Paper mb="md" shadow="md" radius="lg" p="xl" withBorder component="a" href="#" className={classes.item} key={item.id}>
          <Title order={3}>{item.scientificName}</Title>
          <Chip.Group position="left" multiple mt={15}>
            <Chip value="1" variant="filled" checked={true}>Kingdom: {item.kingdom}</Chip>
            <Chip value="2">License: {item.license}</Chip>
            <Chip value="3">Recorded by: {item.recordedBy}</Chip>
          </Chip.Group>
        </Paper>
      ))}
    </div>
  );
}
