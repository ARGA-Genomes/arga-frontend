"use client";

import { gql, useQuery } from "@apollo/client";
import { BrowseCard } from "../components/browse-card";
import {Carousel} from "@mantine/carousel";

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
    <Carousel sx={{ width: '100%'}} 
      mx="auto" 
      height={340} 
      slidesToScroll='auto'
      slideSize="200px"
      slideGap="md"
      align="center"
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
          total={0}
          category="Agriculture, aquaculture and commercial species"
          image="card-icons/agricultural.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>

      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Marine biodiversity"
          image="card-icons/marine.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>

      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Terrestrial biodiversity"
          image="card-icons/allspecies.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>

      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Biosecurity and pest species"
          image="card-icons/preserved.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>

      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Threatened biodiversity"
          image="card-icons/tsi.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>

      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.allSpecies}
          category="All species"
          image="card-icons/terrestrial.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
    </Carousel>
  );
}
