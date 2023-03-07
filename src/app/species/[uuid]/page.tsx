'use client';

import * as Luxon from "luxon";
import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Badge, Text, Card, SimpleGrid, Group, Button, Divider } from "@mantine/core";
import Link from "next/link";


const GET_SPECIES = gql`
query Species($taxonUuid: String) {
  species(taxonUuid: $taxonUuid) {
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
    distribution {
      locality
      threatStatus
      source
    }
    specimens {
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
    }
  }
}`;


type Taxonomy = {
  canonicalName: string,
  authorship: string,

  kingdom: string,
  phylum: string,
  class: string,
  order: string,
  family: string,
  genus: string,
};

type Distribution = {
  locality: string,
  threatStatus: string,
  source: string,
};

type Specimen = {
  canonicalName: string,
  type: string,
  dataResource: string,
  recordedBy: string[],
  license: string,
  provenance: string,
  eventDate: string,
  accession: string,
  accessionUri: string,
  refseqCategory: string,
}

type Species = {
  taxonomy: Taxonomy,
  distribution: Distribution[],
  specimens: Specimen[],
};

type QueryResults = {
  species: Species,
};


function SpecimenItem({ specimen }: { specimen: Specimen }) {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Group position="apart">
        <Title order={5}>{specimen.accession}</Title>
        <Badge>{specimen.type.replace("_", " ")}</Badge>
      </Group>
      <Text c="dimmed">{specimen.refseqCategory ? Humanize.capitalize(specimen.refseqCategory) : null}</Text>
      <Text c="dimmed">{specimen.dataResource}</Text>
      <Text c="dimmed">{specimen.license} - {specimen.provenance}</Text>
      <Text c="dimmed">{Luxon.DateTime.fromISO(specimen.eventDate).toLocaleString()}</Text>
      <Divider my={20} />
      <Link href={specimen.accessionUri || "#"} target="_blank">
        <Button color="midnight.5" radius={10}>Get Data</Button>
      </Link>
    </Card>
  )
}


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


export default function SpeciesPage({ params }: { params: { uuid: string } }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      taxonUuid: params.uuid
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

  return (
    <Box>
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">{taxonomy.canonicalName}, {taxonomy.authorship}</Title>
        <Text color="white" c="dimmed">
          {taxonomy.kingdom}
          , {taxonomy.phylum}
          , {taxonomy.class}
          , {taxonomy.order}
          , {taxonomy.family}
          , {taxonomy.genus}
        </Text>
        {status ? <ThreatBadge status={status.threatStatus}>{status.threatStatus} - {status.source} - {status.locality}</ThreatBadge> : null}
      </Paper>

      <SimpleGrid cols={3} p={40}>
        {data.species.specimens.map(specimen => (
          <SpecimenItem key={specimen.accession} specimen={specimen} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
