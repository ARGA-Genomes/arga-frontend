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
      withControls={false}
    >
      <Group>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Agriculture"
          image="/card-icons/dataset/agriculture.svg"
          link="#"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Aquaculture"
          image="/card-icons/dataset/aquaculture.svg"
          link="#"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Terrestrial"
          image="/card-icons/dataset/terrestrial.svg"
          link="#"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Marine"
          image="/card-icons/dataset/marine.svg"
          link="#"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Threatened"
          image="/card-icons/dataset/threatened_top_110_species.svg"
          link="/browse/sources/ARGA_Threatened_Species"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Bushfire Recovery"
          image="/card-icons/dataset/fire_vulnerable.svg"
          link="/browse/sources/ARGA_Bushfire_Recovery"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Commercial"
          image="/card-icons/dataset/commercial_and_trade_fishes.svg"
          link="/browse/sources/ARGA_Commercial_Species"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Venomous and Poisonous"
          image="/card-icons/dataset/venomous_and_poisonous.svg"
          link="/browse/sources/ARGA_Venomous_species"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="All items"
          image="/card-icons/view_all.svg"
          link="/domain/Eukaryota"
        />
      </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
