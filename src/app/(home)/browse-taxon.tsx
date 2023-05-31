'use client';

import { gql, useQuery } from '@apollo/client';

import { Grid } from "@mantine/core";
import { BrowseCard, BrowseCardLoading } from "../components/browse-card";

type Overview = {
  animals: number,
  plants: number,
  fungi: number,
};


const GET_OVERVIEW = gql`
query {
  overview {
    animals
    plants
    fungi
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


export default function BrowseTaxon() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
      <Grid gutter={37}>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.animals} category="Animals" image="card-icons/agricultural.svg" />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.plants} category="Plants" image="card-icons/marine.svg"/>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card total={data?.overview.fungi} category="Fungi" image="card-icons/allspecies.svg" />
        </Grid.Col>
      </Grid>
  );
}