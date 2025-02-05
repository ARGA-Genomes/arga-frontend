"use client";

import { gql, useQuery } from "@apollo/client";
import { BrowseCard } from "@/components/browse-card";
import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";
import "@mantine/carousel/styles.css";

interface Overview {
  allSpecies: number;
  sources: [
    {
      name: string;
      total: number;
    }
  ];
}

const GET_OVERVIEW = gql`
  query {
    overview {
      allSpecies
      sources {
        name
        total
      }
    }
  }
`;

interface OverviewResults {
  overview: Overview;
}

export default function BrowseGrouping() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  const sources: Record<string, number> = {};
  for (const source of data?.overview.sources || []) {
    sources[source.name] = source.total;
  }

  return (
    <Carousel
      slideSize={150}
      slideGap="sm"
      slidesToScroll="auto"
      align="start"
      withControls={false}
    >
      <Group justify="center" align="flex-start">
        <Carousel.Slide>
          <BrowseCard
            total={data && (sources["ARGA Bushfire Recovery"] || 0)}
            category="Bushfire Recovery"
            image="/card-icons/dataset/fire_vulnerable.svg"
            link="/browse/sources/ARGA_Bushfire_Recovery"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data && (sources["ARGA Commercial Species"] || 0)}
            category="Commercial"
            image="/card-icons/dataset/commercial_and_trade_fishes.svg"
            link="/browse/sources/ARGA_Commercial_Species"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={
              data && (sources["ARGA Venomous and Poisonous Species"] || 0)
            }
            category="Venomous and Poisonous"
            image="/card-icons/dataset/venomous_and_poisonous.svg"
            link="/browse/sources/ARGA_Venomous_and_Poisonous_Species"
          />
        </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
