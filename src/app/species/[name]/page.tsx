'use client';

import * as Luxon from "luxon";
import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Paper, Title, Box, Badge, Text, Card, SimpleGrid, Group, Button, Divider, Image, Grid, Stack, NavLink } from "@mantine/core";
import Link from "next/link";
import dynamic from "next/dynamic";


const RegionMap = dynamic(() => import('../../components/region-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})


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

type Photo = {
  url: string,
  referenceUrl: string,
  publisher: string,
  license: string,
  rightsHolder: string,
}

type Distribution = {
  locality: string,
  threatStatus: string,
  source: string,
};

type Region = {
  name: string,
}

type GenomicData = {
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

type Regions = {
  ibra: Region[],
  imcra: Region[],
}

type Species = {
  taxonomy: Taxonomy,
  photos: Photo[],
  distribution: Distribution[],
  regions: Regions,
  data: GenomicData[],
};

type QueryResults = {
  species: Species,
};


// A data item in the ARGA index associated with the species.
// There can be multiple different types of data in the index and
// each might require different treatment so we abstract it here and
// encapsulate it as a 'card'.
function DataItem({ item }: { item: GenomicData }) {
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


function SpeciesPhoto({ photo }: { photo: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Box>
      <Image width={200} height={300} radius="lg" src={small(photo.url)} alt="Species image" />
      <Text fz="sm" c="dimmed">&copy; { photo.rightsHolder }</Text>
      <Text fz="sm" c="dimmed"><a href={ photo.referenceUrl } target="_blank">{ photo.publisher }</a></Text>
    </Box>
  )
}


function Taxonomy({ taxonomy, regions }: { taxonomy: Taxonomy, regions: Regions }) {
  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={3}>
          <Stack>
            <Text color="white" c="dimmed">{taxonomy.kingdom}</Text>
            <Text color="white" c="dimmed">{taxonomy.phylum}</Text>
            <Text color="white" c="dimmed">{taxonomy.class}</Text>
            <Text color="white" c="dimmed">{taxonomy.order}</Text>
            <Link href={`/family/${taxonomy.family}`}>{taxonomy.family}</Link>
            <Link href={`/genus/${taxonomy.genus}`}>{taxonomy.genus}</Link>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto">
          <RegionMap regions={ regions.ibra.map(region => region.name) } />
          <Text color="white" c="dimmed" fz="sm">
            { regions.ibra.map(region => region.name).join(", ") }
            { regions.imcra.map(region => region.name).join(", ") }
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
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
  const photos = data.species.photos;
  const regions = data.species.regions;
  const status = data.species.distribution.find(dist => dist.threatStatus != null);

  return (
    <Box>
      <Paper bg="midnight.6" p={40} radius={35}>
        <Title order={3} color="white">{taxonomy.canonicalName}, {taxonomy.authorship}</Title>
        {status ? <ThreatBadge status={status.threatStatus}>{status.threatStatus} - {status.source} - {status.locality}</ThreatBadge> : null}
      </Paper>

      <Grid p={40}>
        <Grid.Col span="content">
          { photos[0]
            ? <SpeciesPhoto photo={photos[0]}/>
            : <Image width={200} height={300} radius="lg" alt="Species image" withPlaceholder />
          }
        </Grid.Col>
        <Grid.Col span="auto">
          <Taxonomy taxonomy={taxonomy} regions={regions} />
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={3} p={40}>
        {data.species.data.map(item => (
          <DataItem key={item.accession} item={item} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
