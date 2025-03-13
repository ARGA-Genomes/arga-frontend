"use client";

import { gql, useQuery } from "@apollo/client";

import { BrowseCard } from "@/components/browse-card";
import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";
import "@mantine/carousel/styles.css";

interface Overview {
  animals: number;
  plants: number;
  fungi: number;
  protista: number;
  allSpecies: number;
}

const GET_OVERVIEW = gql`
  query {
    overview {
      animals
      plants
      fungi
      protista
      allSpecies
    }
  }
`;

interface OverviewResults {
  overview: Overview;
}

export default function BrowseTaxon() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel slideSize={150} slideGap="sm" slidesToScroll="auto" align="start" withControls={false}>
      <Group justify="center" align="flex-start">
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.animals}
            category="Animals"
            image="/icons/taxon/Taxon_ Animals (= Kingdom Animalia).svg"
            link="/kingdom/Animalia"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.plants}
            category="Plants"
            image="/icons/taxon/Taxon_ Plants (=Regnum Plantae).svg"
            link="/regnum/Plantae"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.fungi}
            category="Fungi"
            image="/icons/taxon/Taxon_ Fungi (= Fungi).svg"
            link="/regnum/Fungi"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.protista}
            category="Protista"
            image="/icons/taxon/Taxon_ Protozoa (= Kingdom Protozoa).svg"
            link="/superkingdom/Protista"
          />
        </Carousel.Slide>
        <Carousel.Slide>
          <BrowseCard
            total={data?.overview.allSpecies}
            category="All species"
            image="/icons/taxon/Taxon_ All eukaryote species (= Eukaryota).svg"
            link="/domain/Eukaryota"
          />
        </Carousel.Slide>
      </Group>
    </Carousel>
  );
}
