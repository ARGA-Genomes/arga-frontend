"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";
import {Carousel} from "@mantine/carousel";

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
    <Carousel sx={{ width: '100%'}} 
      mx="auto" 
      height={340} 
      slidesToScroll='auto'
      slideSize="200px"
      slideGap="md"
      align="start"
      breakpoints={[
        { maxWidth: 'md', slideSize: '50%' },
        { maxWidth: 'sm', slideSize: '100%', slideGap: 0},
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
          total={data?.overview.animals}
          category="Animals"
          image="card-icons/taxon_Animals(Animalia).svg"
          link="/kingdom/Animalia"
        />
      </Carousel.Slide>  
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.plants}
          category="Plants"
          image="card-icons/taxon_Floweringplants(Plantae).svg"
          link="/kingdom/Plantae"
        />
      </Carousel.Slide> 
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.fungi}
          category="Fungi"
          image="card-icons/taxon_Fungi(Fungi).svg"
          link="/kingdom/Fungi"
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Bacteria"
          image="card-icons/taxon_Bacteria.svg"
          link="kingdom/Bacteria"
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Protista"
          image="card-icons/taxon_Protists(Protista).svg"
          link="/kingdom/Protista"
        />
        </Carousel.Slide>
    </Carousel>
  );
}
