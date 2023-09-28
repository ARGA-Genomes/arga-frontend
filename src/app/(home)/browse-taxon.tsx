"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "@/components/browse-card";
import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";

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

/* styles={{
*   control: {
*     '&[data-inactive]': {
*       opacity: 0,
*       cursor: 'default',
*     },
*   },
* }} */

export default function BrowseTaxon() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel
      height={340}
      slideSize={{ base: 230, md: '50%' }}
      slideGap={{ base: "md", sm: 0 }}
      slidesToScroll='auto'
      align="start"
    >
      <Group>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.animals}
          category="Animals"
          image="/card-icons/taxon/animals.svg"
          link="/kingdom/Animalia"
        />
      </Carousel.Slide>  
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.plants}
          category="Plants"
          image="/card-icons/taxon/plants.svg"
          link="/kingdom/Plantae"
        />
      </Carousel.Slide> 
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.fungi}
          category="Fungi"
          image="/card-icons/taxon/fungi.svg"
          link="/kingdom/Fungi"
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Bacteria"
          image="/card-icons/taxon/bacteria.svg"
          link="kingdom/Bacteria"
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Protista"
          image="/card-icons/taxon/protista.svg"
          link="/kingdom/Protista"
        />
        </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
