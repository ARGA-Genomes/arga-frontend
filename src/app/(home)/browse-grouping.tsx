"use client";

import { gql, useQuery } from "@apollo/client";
import { BrowseCard } from "@/components/browse-card";
import {Carousel} from "@mantine/carousel";
import { Group } from "@mantine/core";

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
          total={0}
          category="Agriculture"
          image="/card-icons/dataset/agriculture.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Aquaculture"
          image="/card-icons/dataset/aquaculture.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Terrestrial"
          image="/card-icons/dataset/terrestrial.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Marine"
          image="/card-icons/dataset/marine.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Threatened"
          image="/card-icons/dataset/threatened_top_110_species.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.allSpecies}
          category="All species"
          image="/card-icons/view_all.svg"
          link="/browse/list/Conservation_NT"
        />
      </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
