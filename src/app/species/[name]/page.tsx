'use client';

import { gql, useQuery } from "@apollo/client";
import {Paper, Title, Box, Badge, Text, Tabs, Grid} from "@mantine/core";
import { Summary } from "src/app/species/[name]/summary";
import { QueryResults} from "@/app/type";
import {WholeGenome} from "@/app/species/[name]/wholeGenome";
import {Resources } from "@/app/species/[name]/resources";

const GET_SPECIES = gql`
query Species($canonicalName: String) {
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

export default function SpeciesPage({ params }: { params: { name: string } }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
        canonicalName: params.name.replaceAll("_", " "),
    },
  });

  if (loading) {
    return (<Text>Loading...</Text>);
  }
  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }
  if (!data) {
    return (<Text>No data</Text>);
  }

  const taxonomy = data.species.taxonomy;
  const status = data.species.distribution.find(dist => dist.threatStatus != null);
  const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" ||
    record.refseqCategory == "reference genome");

  return (
    <><Box>
      <Title order={3} color="white"><Text italic={true}>{taxonomy.canonicalName}</Text> {taxonomy.authorship}</Title>
      {status ? <ThreatBadge
        status={status.threatStatus}>{status.threatStatus} - {status.source} - {status.locality}</ThreatBadge> : null}
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">Data Summary</Title>
        <Grid style={{ paddingTop: 25 }}>
          <Grid.Col span={4}><Text color="white">Whole Genomes : {wholeGenomeRecords.length}</Text></Grid.Col>
          <Grid.Col span={4}><Text color="white">Mitogenomes</Text></Grid.Col>
          <Grid.Col span={4}><Text color="white">Other Data</Text></Grid.Col>
        </Grid>
      </Paper>
    </Box>
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
          tab content
        </Tabs.Panel>
        <Tabs.Panel value="gallery" pt="xs">
        </Tabs.Panel>
        <Tabs.Panel value="resources" pt="xs">
          <Resources data={data.species.data}/>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
