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

type DataItem = {
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
  specimens: DataItem[],
};

type QueryResults = {
  species: Species,
};


// A data item in the ARGA index associated with the species.
// There can be multiple different types of data in the index and
// each might require different treatment so we abstract it here and
// encapsulate it as a 'card'.
function DataItem({ item }: { item: DataItem }) {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Group position="apart">
        <Title order={5}>{item.accession}</Title>
        <Badge>{item.type.replace("_", " ")}</Badge>
      </Group>
      <Text c="dimmed">{item.refseqCategory ? Humanize.capitalize(item.refseqCategory) : null}</Text>
      <Text c="dimmed">{item.dataResource}</Text>
      <Text c="dimmed">{item.license} - {item.provenance}</Text>
      <Text c="dimmed">{Luxon.DateTime.fromISO(item.eventDate).toLocaleString()}</Text>
      <Divider my={20} />
      <Link href={item.accessionUri || "#"} target="_blank">
        <Button color="midnight.5" radius={10}>Get Data</Button>
      </Link>
    </Card>
  )
}


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
        {data.species.specimens.map(item => (
          <DataItem key={item.accession} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
