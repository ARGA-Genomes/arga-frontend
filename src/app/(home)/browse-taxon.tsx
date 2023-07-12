"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";

type Overview = {
  animals: number;
  plants: number;
  fungi: number;
};

const GET_OVERVIEW = gql`
  query {
    overview {
      animals
      plants
      fungi
    }
  }
`;

type OverviewResults = {
  overview: Overview;
};

export default function BrowseTaxon() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Grid gutter={37}>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.animals}
          category="Animals"
          image="card-icons/marine.svg"
          link="/browse/animals"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.plants}
          category="Plants"
          image="card-icons/agricultural.svg"
          link="/browse/plants"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.fungi}
          category="Fungi"
          image="card-icons/allspecies.svg"
          link="/browse/fungi"
        />
      </Grid.Col>
    </Grid>
  );
}
