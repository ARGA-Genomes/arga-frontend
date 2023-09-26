"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "../components/browse-card";
import {Carousel} from "@mantine/carousel";

type Overview = {
  wholeGenomes: number;
  organelles: number;
  markers: number;
};

const GET_OVERVIEW = gql`
  query {
    overview {
      wholeGenomes
      markers
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
    <Carousel sx={{maxWidth:'100%'}}
      // mx="auto" //use this if you'd like to center the carousel
      height={340} 
      slidesToScroll='auto'
      slideSize="200px"
      slideGap="xs"
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
          total={data?.overview.wholeGenomes}
          category="Whole genomes"
          image="card-icons/data_type_whole_genome.svg"
          link="/browse/genomes"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.markers}
          category="Markers"
          image="card-icons/data_type_marker.svg"
          link="/browse/markers"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Specimen"
          image="card-icons/data_type_specimen.svg"
          link="/browse/specimens"
        />
      </Carousel.Slide>
    </Carousel>
  );
}
