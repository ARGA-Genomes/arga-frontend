'use client';

import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Badge, Text, Tabs, Grid, Group, LoadingOverlay, Stack } from "@mantine/core";
import { Summary } from "src/app/species/[name]/summary";
import { Species, StatsSpecies } from "@/app/type";
import { WholeGenome } from "@/app/species/[name]/wholeGenome";
import { Resources } from "@/app/species/[name]/resources";
import SpecimenTable from "./specimens";

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
    }
    photos {
      url
      referenceUrl
      publisher
      license
      rightsHolder
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
          <Summary data={data}/>
        </Tabs.Panel>
        <Tabs.Panel value="whole_genome" pt="xs">
          <WholeGenome data={data}/>
        </Tabs.Panel>
        <Tabs.Panel value="mitogenome" pt="xs">
          tab content
        </Tabs.Panel>
        <Tabs.Panel value="barcode" pt="xs">
          tab content
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

function DataSummary({ stats }: { stats: StatsSpecies }) {
  return (
    <Paper bg="midnight.6" radius="xl">
      <Grid pb={20}>
        <Grid.Col span={3}>
          <Stack align="center" spacing={0}>
            <Text color="white" fw={700} fz={40}>{stats.wholeGenomes}</Text>
            <Text color="white">Whole Genomes</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="center" spacing={0}>
            <Text color="white" fw={700} fz={40}>{stats.mitogenomes}</Text>
            <Text color="white">Mitogenomes</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="center" spacing={0}>
            <Text color="white" fw={700} fz={40}>{stats.barcodes}</Text>
            <Text color="white">Barcodes</Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack align="center" spacing={0}>
            <Text color="white" fw={700} fz={40}>{stats.total - stats.wholeGenomes - stats.mitogenomes - stats.barcodes}</Text>
            <Text color="white">Other Data</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
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
  const stats = data?.stats.species;

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      <Box mb={30}>
        <Title order={3} color="white" mb={10}>
          <Group>
            <Text italic={true} fw={500}>{taxonomy?.canonicalName}</Text> {taxonomy?.authorship}
          </Group>
        </Title>

        {status
        ? <ThreatBadge status={status.threatStatus}>{status.threatStatus} - {status.source} - {status.locality}</ThreatBadge>
        : null
        }
      </Box>

      { stats ? <DataSummary stats={stats} /> : null }
      { data ? <DataTabs data={data} /> : null }
    </Box>
  );
}
