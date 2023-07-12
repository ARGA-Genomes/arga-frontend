"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";

type Overview = {
  wholeGenomes: number;
  partialGenomes: number;
  organelles: number;
  barcodes: number;
};

const GET_OVERVIEW = gql`
  query {
    overview {
      wholeGenomes
      partialGenomes
      organelles
      barcodes
    }
  }
`;

type OverviewResults = {
  overview: Overview;
};

export default function BrowseData() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  let wholeGenome = data?.overview?.wholeGenomes ?? 0;
  let partialGenome = data?.overview.partialGenomes ?? 0;
  let genomes =  wholeGenome + partialGenome != 0 ? wholeGenome + partialGenome : undefined;

  return (
    <Grid gutter={37}>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={genomes}
          category="Genomes"
          image="card-icons/agricultural.svg"
          link="/browse/genomes"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={0} // TODO: total={data?.overview.organelles}
          category="Organelles"
          image="card-icons/marine.svg"
          link="/browse/organelles"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.barcodes}
          category="Barcodes*"
          image="card-icons/allspecies.svg"
          link="/browse/barcodes"
        />
      </Grid.Col>
    </Grid>
  );
}
