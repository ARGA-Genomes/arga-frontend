"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "@/components/browse-card";
import { Carousel, Embla } from "@mantine/carousel";
import { Group } from "@mantine/core";
import "@mantine/carousel/styles.css";

type Overview = {
  wholeGenomes: number;
  loci: number;
  specimens: number;
};

const GET_OVERVIEW = gql`
  query {
    overview {
      wholeGenomes
      loci
      specimens
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
    <Carousel
      slideSize={150}
      slideGap="sm"
      slidesToScroll="auto"
      align="start"
      withControls={false}
    >
      <Group align="flex-start">
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.wholeGenomes}
            category="Genome assemblies"
            image="/card-icons/type/whole_genomes.svg"
            link="/browse/genomes"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.loci}
            category="Single loci"
            image="/card-icons/type/markers.svg"
            link="/browse/loci"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.specimens}
            category="Specimens"
            image="/card-icons/type/specimens.svg"
            link="/browse/specimens"
          />
        </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
