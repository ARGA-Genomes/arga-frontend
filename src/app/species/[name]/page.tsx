'use client';

import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Badge, Text, Tabs, Grid, Group, LoadingOverlay, Stack, Center } from "@mantine/core";
import { Summary } from "src/app/species/[name]/summary";
import { Species, StatsSpecies } from "@/app/type";
import { WholeGenome } from "@/app/species/[name]/wholeGenome";
import { Resources } from "@/app/species/[name]/resources";
import SpecimenTable from "./specimens";
import {Barcode} from "@/app/species/[name]/barcode";
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
  }
}`;

type StatsResults = {
  species: StatsSpecies,
}

type QueryResults = {
  stats: StatsResults,
  species: Species,
};


// A mapping between a thread status value and a colour to
// associated it with.
const ThreatColour = {
    "critically endangered": "red",
    "data deficient": "gray",
    "endangered": "orange",
    "extinct": "black",
    "extinct in the wild": "black",
    "least concern": "green",
    "near threatened": "yellow",
    "not applicable": "gray",
    "not evaluated": "gray",
    "regionally extinct": "purple",
    "vulnerable": "orange",
} as { [index: string]: string };


function ThreatBadge({ status, children }: { status: string, children: React.ReactNode }) {
  const colour = ThreatColour[status];
  return (
    <Badge color={colour} variant="filled">{children}</Badge>
  )
}

function DataTabs({ data }: { data: QueryResults }) {
  return (
    <Tabs defaultValue="summary">
      <Tabs.List style={{ paddingTop: 25 }}>
        <Tabs.Tab value="summary"><Text color="grey">Summary</Text></Tabs.Tab>
        <Tabs.Tab value="whole_genome"><Text color="grey">Whole Genome Data</Text></Tabs.Tab>
        <Tabs.Tab value="mitogenome"><Text color="grey">Mitogenome Data</Text></Tabs.Tab>
        <Tabs.Tab value="barcode"><Text color="grey">Barcode Data</Text></Tabs.Tab>
        <Tabs.Tab value="other_genomic"><Text color="grey">Other Genomic Data</Text></Tabs.Tab>
        <Tabs.Tab value="other_nongenomic"><Text color="grey">Other Non genomic Data</Text></Tabs.Tab>
        <Tabs.Tab value="specimen"><Text color="grey">Specimen</Text></Tabs.Tab>
        <Tabs.Tab value="gallery"><Text color="grey">Gallery</Text></Tabs.Tab>
        <Tabs.Tab value="resources"><Text color="grey">Resources</Text></Tabs.Tab>
      </Tabs.List>

        <Tabs.Panel value="summary" pt="xs">
          <Summary
            taxonomy={data.species.taxonomy}
            photos={data.species.photos}
            regions={data.species.regions}
            stats={data.stats.species}
          />
        </Tabs.Panel>
        <Tabs.Panel value="whole_genome" pt="xs">
          <WholeGenome records={data.species.wholeGenomes}/>
        </Tabs.Panel>
        <Tabs.Panel value="mitogenome" pt="xs">
          tab content
        </Tabs.Panel>
        <Tabs.Panel value="barcode" pt="xs">
          <Barcode data={data}/>
        </Tabs.Panel>
        <Tabs.Panel value="other_genomic" pt="xs">
          tab content
        </Tabs.Panel>
        <Tabs.Panel value="other_nongenomic" pt="xs">
          tab content
        </Tabs.Panel>
        <Tabs.Panel value="specimen" pt="xs">
          <Paper p={40} radius="lg">
            <SpecimenTable canonicalName={data.species.taxonomy.canonicalName} />
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="gallery" pt="xs">
        </Tabs.Panel>
        <Tabs.Panel value="resources" pt="xs">
          <Resources data={data.species.data}/>
        </Tabs.Panel>
      </Tabs>
  )
}


export default function SpeciesPage({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
        canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const taxonomy = data?.species.taxonomy;
  const status = data?.species.distribution.find(dist => dist.threatStatus != null);

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      <Stack>
        <Grid>
          <Grid.Col span="auto">
            <Title order={3} color="white" mb={10}>
              <Group>
                <Text italic={true} fw={500}>{taxonomy?.canonicalName}</Text> {taxonomy?.authorship}
              </Group>
            </Title>
          </Grid.Col>
          <Grid.Col span="content">
            { data ? <IconBar species={data.species} /> : null }
          </Grid.Col>
        </Grid>

        {status
        ? <ThreatBadge status={status.threatStatus}>{status.threatStatus} - {status.source} - {status.locality}</ThreatBadge>
        : null
        }
      </Stack>

      { data ? <DataTabs data={data} /> : null }
    </Box>
  );
}
