"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "@/components/browse-card";
import {Carousel} from "@mantine/carousel";
import { Group } from "@mantine/core";

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
          total={data?.overview.wholeGenomes}
          category="Whole genomes"
          image="/card-icons/type/whole_genomes.svg"
          link="/browse/genomes"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.loci}
          category="Genetic loci"
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
