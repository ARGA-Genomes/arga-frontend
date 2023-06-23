'use client';

import { gql, useQuery } from '@apollo/client';

import { Grid } from "@mantine/core";
import { BrowseCard, BrowseCardLoading } from "../components/browse-card";

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


function Card({ category, total, image }: { category: string, total: number | undefined, image: string }) {
  if (!total) {
    return (<BrowseCardLoading />);
  } else {
    return (
      <BrowseCard category={category} total={total} image={image} />
    );
  }
}


export default function BrowseGrouping() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  // TODO: get the proper data from the backend once the categories are settled
  return (
      <Grid gutter={37}>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.publishedDatasets} category="Agriculture, aquaculture and commercial species" image="card-icons/agricultural.svg" />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.marine} category="Marine biodiversity" image="card-icons/marine.svg"/>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.inAustralia} category="Terrestrial biodiversity" image="card-icons/allspecies.svg" />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.preservedSpecimens} category="Biosecurity and pest species" image="card-icons/preserved.svg" />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.terrestrial} category="Threatened biodiversity" image="card-icons/tsi.svg" />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.bacteria} category="All species" image="card-icons/terrestrial.svg" />
        </Grid.Col>
      </Grid>
  );
}
