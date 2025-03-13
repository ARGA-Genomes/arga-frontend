"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "@/components/browse-card";
import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";
import "@mantine/carousel/styles.css";

interface Overview {
  wholeGenomes: number;
  loci: number;
  specimens: number;
}

const GET_OVERVIEW = gql`
  query {
    overview {
      wholeGenomes
      loci
      specimens
    }
  }
`;

interface OverviewResults {
  overview: Overview;
}

export default function BrowseType() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel slideSize={150} slideGap="sm" slidesToScroll="auto" align="start" withControls={false}>
      <Group justify="center" align="flex-start">
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.wholeGenomes}
            category="Genome assemblies"
            image="/icons/data-type/Data type_ Whole genome.svg"
            link="/browse/genomes"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.loci}
            category="Single loci"
            image="/icons/data-type/Data type_ Markers.svg"
            link="/browse/loci"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.specimens}
            category="Specimens"
            image="/icons/data-type/Data type_ Specimen.svg"
            link="/browse/specimens"
          />
        </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
