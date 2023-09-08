"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";
import {Carousel} from "@mantine/carousel";

type Overview = {
  genomes: number;
  organelles: number;
  barcodes: number;
};

const GET_OVERVIEW = gql`
  query {
    overview {
      genomes
      barcodes
    }
  }
`;

type OverviewResults = {
  overview: Overview;
};

export default function BrowseType() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel sx={{ width: '100%'}} 
      mx="auto" 
      height={300} 
      slidesToScroll='auto'
      slideSize="33.333333%"
      slideGap="md"
      align="start"
      breakpoints={[
        { maxWidth: 'md', slideSize: '50%' },
        { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
      ]}
      styles={{
        control: {
          '&[data-inactive]': {
            opacity: 0,
            cursor: 'default',
          },
        },
      }}
      >
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.genomes}
          category="Whole genomes"
          image="card-icons/agricultural.svg"
          link="/browse/genomes"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0} // TODO: total={data?.overview.organelles}
          category="Mitogenomes"
          image="card-icons/marine.svg"
          link="/browse/organelles"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.barcodes}
          category="Markers"
          image="card-icons/allspecies.svg"
          link="/browse/barcodes"
        />
      </Carousel.Slide>
    </Carousel>
  );
}
