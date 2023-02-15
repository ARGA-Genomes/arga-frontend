'use client';

import { gql, useQuery } from '@apollo/client';

import { Grid } from "@mantine/core";
import { BrowseCard, BrowseCardLoading } from "./browse-card";

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
  if (error) return <p>Error : {error.message}</p>;

  return (
      <Grid gutter="xl">
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Published datasets" total={data.overview.publishedDatasets} />}
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Bacteria specimens" total={data.overview.bacteria} />}
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Australian specimens" total={data.overview.inAustralia} />}
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Marine specimens" total={data.overview.marine} />}
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Terrestrial specimens" total={data.overview.terrestrial} />}
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          {loading || !data ? <BrowseCardLoading/> : <BrowseCard category="Preserved specimens" total={data.overview.preservedSpecimens} />}
        </Grid.Col>
      </Grid>
  );
}
