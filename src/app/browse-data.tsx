'use client';

import { gql, useQuery } from '@apollo/client';

import { Grid } from "@mantine/core";
import BrowseCard from "./browse-card";
import Loading from './loading';


type Overview = {
  publishedDatasets: number,
  bacteria: number,
  inAustralia: number,
  marine: number,
  terrestrial: number,
  preservedSpecimens: number,
};


const GET_OVERVIEW = gql`
query {
  overview {
    publishedDatasets
    bacteria
    inAustralia
    marine
    terrestrial
    preservedSpecimens
  }
}`;

type OverviewResults = {
  overview: Overview,
}


export default function BrowseData() {
  const { loading, error, data } = useQuery<OverviewResults>(GET_OVERVIEW);

  if (loading) return <Loading/>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return <p>No data</p>;

  return (
      <Grid>
        <Grid.Col span={4}>
          <BrowseCard category="Published datasets" total={data.overview.publishedDatasets}/>
        </Grid.Col>
        <Grid.Col span={4}>
          <BrowseCard category="Bacteria specimens" total={data.overview.bacteria} />
        </Grid.Col>
        <Grid.Col span={4}>
          <BrowseCard category="Australian specimens" total={data.overview.inAustralia}/>
        </Grid.Col>
        <Grid.Col span={4}>
          <BrowseCard category="Marine specimens" total={data.overview.marine}/>
        </Grid.Col>
        <Grid.Col span={4}>
          <BrowseCard category="Terrestrial specimens" total={data.overview.terrestrial}/>
        </Grid.Col>
        <Grid.Col span={4}>
          <BrowseCard category="Preserved specimens" total={data.overview.preservedSpecimens}/>
        </Grid.Col>
      </Grid>
  );
}
