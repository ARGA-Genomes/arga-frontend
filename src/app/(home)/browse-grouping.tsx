"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";

type Overview = {
  agriculturalAndAquacultureAndCommercial: number;
  bioSecurityAndPest: number;
  inAustralia: number;
  marine: number;
  terrestrial: number;
  threatenedSpecies: number;
  allSpecies: number
};

const GET_OVERVIEW = gql`
  query {
    overview {
      agriculturalAndAquacultureAndCommercial
      bioSecurityAndPest
      inAustralia
      marine
      terrestrial
      threatenedSpecies
      allSpecies
    }
  }
`;

type OverviewResults = {
  overview: Overview;
};

export default function BrowseGrouping() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  // TODO: get the proper data from the backend once the categories are settled
  return (
    <Grid gutter={37}>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.agriculturalAndAquacultureAndCommercial}
          category="Agriculture, aquaculture and commercial species"
          image="card-icons/agricultural.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.marine}
          category="Marine biodiversity"
          image="card-icons/marine.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.terrestrial}
          category="Terrestrial biodiversity"
          image="card-icons/allspecies.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.bioSecurityAndPest}
          category="Biosecurity and pest species"
          image="card-icons/preserved.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.threatenedSpecies}
          category="Threatened biodiversity"
          image="card-icons/tsi.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
      <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
        <BrowseCard
          total={data?.overview.allSpecies}
          category="All species"
          image="card-icons/terrestrial.svg"
          link="/browse/list/Conservation_NT"
        />
      </Grid.Col>
    </Grid>
  );
}
