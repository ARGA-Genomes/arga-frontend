'use client';

import { gql, useQuery } from "@apollo/client";
import { Box, Grid, Group, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { Species, StatsSpecies, Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";


const GET_SPECIES = gql`
query Species($canonicalName: String) {
  stats {
    species(canonicalName: $canonicalName) {
      total
      wholeGenomes
      mitogenomes
      barcodes
    }
  }
  species(canonicalName: $canonicalName) {
    taxonomy {
      canonicalName
      authorship
      kingdom
      phylum
      class
      order
      family
      genus
      vernacularGroup
    }
    photos {
      url
      referenceUrl
      publisher
      license
      rightsHolder
    }
    conservation {
      status
      state
      source
    }
    distribution {
      locality
      threatStatus
      source
    }
    regions {
      ibra {
        name
      }
      imcra {
        name
      }
    }
    data {
      canonicalName
      type
      dataResource
      recordedBy
      license
      provenance
      eventDate
      accession
      accessionUri
      refseqCategory
      coordinates {
        latitude
        longitude
      }
    }
    wholeGenomes {
      type
      dataResource
      recordedBy
      license
      provenance
      eventDate
      occurrenceYear
      otherCatalogNumbers
      accession
      accessionUri
      refseqCategory
      coordinates {
        latitude
        longitude
      }
      ncbiNuccore
      ncbiBioproject
      ncbiBiosample
      mixs0000005
      mixs0000029
      mixs0000026
      pairedAsmComp
      rawRecordedBy
      ncbiReleaseType
    }
    traceFiles {
      id
      metadata
    }
  }
}`;

type StatsResults = {
  species: StatsSpecies,
}

type QueryResults = {
  stats: StatsResults,
  species: Species,
};


function Header({ taxonomy, species }: { taxonomy: Taxonomy, species: Species | undefined }) {
  return (
    <Stack>
      <Grid>
        <Grid.Col span="auto">
          <Title order={3} color="white" mb={10}>
            <Group>
              <Text italic={true} fw={500}>{taxonomy.canonicalName}</Text> {taxonomy.authorship}
            </Group>
          </Title>
        </Grid.Col>
        <Grid.Col span="content">
          { species ? <IconBar species={species} /> : null }
        </Grid.Col>
      </Grid>
    </Stack>
  )
}


interface SpeciesLayoutProps {
  params: { name: string },
  children: React.ReactNode,
}

export default function SpeciesLayout(props: SpeciesLayoutProps) {
  const canonicalName = props.params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
        canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const taxonomy = data?.species.taxonomy;

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />
      { taxonomy ? <Header taxonomy={taxonomy} species={data?.species} /> : null }
      { props.children }
    </Box>
  )
}
