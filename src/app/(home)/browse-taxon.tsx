"use client";

import { gql, useQuery } from "@apollo/client";

import { Grid } from "@mantine/core";
import { BrowseCard } from "../components/browse-card";
import {Carousel} from "@mantine/carousel";

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

export default function BrowseTaxon() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel sx={{ width: '100%'}} 
      mx="auto" 
      height={340} 
      slidesToScroll='auto'
      slideSize="200px"
      slideGap="md"
      align="start"
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
          total={data?.overview.animals}
          category="Animals"
          image="card-icons/taxon_Animals(Animalia).svg"
          link="/browse/animals"
        />
      </Carousel.Slide>  
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.plants}
          category="Plants"
          image="card-icons/taxon_Floweringplants(Plantae).svg"
          link="/browse/plants"
        />
      </Carousel.Slide> 
      <Carousel.Slide>
        <BrowseCard
          total={data?.overview.fungi}
          category="Fungi"
          image="card-icons/taxon_Fungi(Fungi).svg"
          link="/browse/fungi"
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Cnidaria"
          image="card-icons/taxon_Anemones_coralsandjellyfishes(Cnidaria).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Bacteria"
          image="card-icons/taxon_Bacteria.svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Birds"
          image="card-icons/taxon_Birds(Aves).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Phaeophyceae"
          image="card-icons/taxon_Brownalgae(Phaeophyceae).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Crustacea"
          image="card-icons/taxon_Crustaceans(Crustacea).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Cyanobacteria"
          image="card-icons/taxon_Cyanobacteria.svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Echinodermata"
          image="card-icons/taxon_Echinoderms(Echinodermata).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Actinopterygii"
          image="card-icons/taxon_Finfishes(Actinopterygii).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Anura"
          image="card-icons/taxon_Frogsandtoads(Anura).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Chlorophyta"
          image="card-icons/taxon_Greenalgae(Chlorophyta).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Insecta"
          image="card-icons/taxon_Insects(Insecta).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Mammalia"
          image="card-icons/taxon_Mammals(Mammalia).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Mollusca"
          image="card-icons/taxon_Molluscs(Mollusca).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Protista"
          image="card-icons/taxon_Protists(Protista).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Rhodophyta"
          image="card-icons/taxon_Redalgae(Rhodophyta).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Elasmobranchii"
          image="card-icons/taxon_Sharksandrays(Elasmobranchii).svg"
          link=""
        />
        </Carousel.Slide>
        <Carousel.Slide>
        <BrowseCard
          total={0}
          category="Porifera"
          image="card-icons/taxon_Sponges(Porifera).svg"
          link=""
        />
        </Carousel.Slide>
    </Carousel>
  );
}
