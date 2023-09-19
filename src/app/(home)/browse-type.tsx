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
          total={0} // TODO: total={data?.overview.organelles}
          category="Mitogenomes"
          image="card-icons/data_type_mitogenome.svg"
          link="/browse/organelles"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.markers}
          category="Markers"
          image="card-icons/data_type_marker.svg"
          link="/browse/barcodes"
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Higher Taxon"
          image="card-icons/data_type_higher_taxon_report.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Microsatellite"
          image="card-icons/data_type_microsatellite.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Plastome"
          image="card-icons/data_type_plastome.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Protein"
          image="card-icons/data_type_protein.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="SNPs and ddRADs"
          image="card-icons/data_type_SNPs_and_ddRADs.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Species Report"
          image="card-icons/data_type_species_and_subspecies_report.svg"
          link=""
        />
      </Carousel.Slide>
      <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Specimen"
          image="card-icons/data_type_specimen.svg"
          link=""
        />
      </Carousel.Slide>
    </Carousel>
  );
}
