"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Photo, Taxonomy, IndigenousEcologicalKnowledge } from "@/app/type";

import { Attribute } from "@/components/highlight-stack";
import { ExternalLink } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";
import { SpeciesImage } from "@/components/species-image";
import Link from "next/link";


const GET_TAXON = gql`
query TaxonSpecies($canonicalName: String) {
  taxon(rank: GENUS, canonicalName: $canonicalName) {
    hierarchy {
      canonicalName
      rank
      depth
    }
  }
}`;

type ClassificationNode = {
  canonicalName: string,
  rank: string,
  depth: number,
}

type TaxonQuery = {
  taxon: {
    hierarchy: ClassificationNode[],
  },
};


const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authority
        status
        kingdom
        phylum
        class
        order
        family
        genus
        synonyms {
          scientificName
        }
        vernacularNames {
          name
        }
      }
      photos {
        url
        referenceUrl
        publisher
        license
        rightsHolder
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
      }
    }
  }
`;

type Species = {
    taxonomy: Taxonomy,
    photos: Photo[],
    indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[],
};

type QueryResults = {
  species: Species,
};


interface TaxonMatch {
  identifier: string;
  name: string;
  acceptedIdentifier: string;
  acceptedName: string;
}

interface ExternalLinksProps {
  canonicalName: string,
  species?: Species,
}

function ExternalLinks(props: ExternalLinksProps) {
  const [matchedTaxon, setMatchedTaxon] = useState<string[] | null>(null);
  const hasFrogID = false;
  const hasAFD = false;

  // Fetch the taxon UID from the given name
  useEffect(() => {
    async function matchTaxon() {
      try {
        const response = await fetch(
          `https://api.ala.org.au/species/guid/${encodeURIComponent(props.canonicalName)}`
        );
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(
          matches.map(({ acceptedIdentifier }) => acceptedIdentifier)
        );
      } catch (error) {
        setMatchedTaxon([]);
      }
    }

    matchTaxon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} mb={10} size="lg">External links</Text>
      <Group mt="md" gap="xs">
        <Button
          component="a"
          radius="md"
          color="gray"
          variant="light"
          size="xs"
          leftSection={<ExternalLink size="1rem" color="black" />}
          loading={!matchedTaxon}
          disabled={Array.isArray(matchedTaxon) && matchedTaxon.length === 0}
          href={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
          target="_blank"
        >
          <Text>View on&nbsp;<b>ALA</b></Text>
        </Button>

        {props.species?.indigenousEcologicalKnowledge?.map(iek => (
          <Button
            key={iek.id}
            component="a"
            radius="md"
            color="gray"
            variant="light"
            size="xs"
            leftSection={<ExternalLink size="1rem" color="black" />}
            href={iek.sourceUrl}
            target="_blank"
          >
            <Text >View on&nbsp;<b>Profiles</b></Text>
          </Button>
        ))}

        {hasFrogID && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<ExternalLink size="1rem" />}
          >
            View on&nbsp;<b>FrogID</b>
          </Button>
        )}
        {hasAFD && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<ExternalLink size="1rem" />}
          >
            View on&nbsp;<b>AFD</b>
          </Button>
        )}
      </Group>
    </Paper>
  );
}
 function showSource(kingdom:  String | undefined ) {
  if  (kingdom && (kingdom.toLowerCase() ==="animalia" || kingdom.toLowerCase() ==="protista")) {
    return true;
  }
  return false;
}


function Details({ taxonomy }: { taxonomy: Taxonomy }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Paper radius={16} p="md" withBorder>
      <Group mb={10}>
      <Text fw={700}  size="lg">Taxonomy</Text>      
      {showSource(taxonomy.kingdom) && <Text c="attribute.5">Source: <Link href={`https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`}>AFD</Link></Text>}
      </Group>

      <SimpleGrid cols={2}>
        <DataTable>
          <DataTableRow label="Scientific name">
            <Group gap={10}>
              <Text fw={600} fz="sm" fs="italic">{taxonomy.canonicalName}</Text>
              <Text fw={600} fz="sm">{taxonomy.authority}</Text>
            </Group>
          </DataTableRow>
          <DataTableRow label="Status">
            <Text fw={600} fz="sm">{taxonomy.status.toLowerCase()}</Text>
          </DataTableRow>
          <DataTableRow label="Synonyms">
            <Stack>
              { taxonomy.synonyms.map(synonym => (
                <Text fw={600} fz="sm" key={synonym.scientificName}>{synonym.scientificName}</Text>
              ))}
            </Stack>
          </DataTableRow>
        </DataTable>

        <DataTable>
          <DataTableRow label="Common names">
            <Group display="block" w={{xs: 50, sm: 100, md: 150, lg: 200, xl: 270}}>
            <Text fw={600} fz="sm" truncate="end" >
              {taxonomy.vernacularNames?.map(r => r.name).join(', ')}
            </Text>
            <Button onClick={() => setIsOpen(true)} bg="none" c="midnight.4" pl={-5} className="textButton">Show All</Button>
            </Group>
            <Modal opened={isOpen} onClose={() => setIsOpen(false)} className="commonNamesModal" centered>
            <Text fw={600} fz="sm">
              {taxonomy.vernacularNames?.map(r => r.name).join(', ')}
            </Text>
            </Modal>
          </DataTableRow>
          <DataTableRow label="Subspecies"></DataTableRow>
        </DataTable>
      </SimpleGrid>
    </Paper>
  );
}


function Classification({ taxonomy }: { taxonomy: Taxonomy }) {
  const { loading, error, data } = useQuery<TaxonQuery>(GET_TAXON, {
    variables: { canonicalName: taxonomy.genus },
  });

  const hierarchy = data?.taxon.hierarchy.toSorted((a, b) => b.depth - a.depth);

  return (
    <Paper radius={16} p="md" withBorder>
      <LoadOverlay visible={loading} />

      <Group>
        <Text fw={700} size="lg">Higher classification</Text>
        {showSource(taxonomy.kingdom) && <Text c="attribute.5">Source: <Link href={`https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`}>AFD</Link></Text>}
      </Group>

      <Group>
        { error && <Text>{error.message}</Text> }
        { hierarchy?.map(node => (
          <Attribute
            label={Humanize.capitalize(node.rank.toLowerCase())}
            value={node.canonicalName}
            href={`/${node.rank.toLowerCase() }/${node.canonicalName}`}
          />
        )) }
      </Group>
    </Paper>
  );
}

function SpeciesPhoto({ photo, taxonomy }: { photo?: Photo, taxonomy?: Taxonomy }) {
  return (
    <Paper radius={100}>
      <SpeciesImage h={500} w="auto" photo={photo} taxonomy={taxonomy} radius="lg" />
      {photo && (
        <Group px="md" py="xs" align="apart">
          <Text fz="sm" c="dimmed">
            &copy; {photo?.rightsHolder}
          </Text>
          <Text fz="sm" c="dimmed">
            <Link href={photo?.referenceUrl || "#"} target="_blank">
              {photo?.publisher}
            </Link>
          </Text>
        </Group>
      )}
    </Paper>
  );
}


export default function TaxonomyPage({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <>
      <Grid>
        <Grid.Col span={8}>
          <Stack gap={20} pos="relative">
            <LoadOverlay visible={loading} />
            {data && <Details taxonomy={data.species.taxonomy} /> }
            {data && <Classification taxonomy={data.species.taxonomy} /> }
            <ExternalLinks canonicalName={canonicalName} species={data?.species} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <SpeciesPhoto photo={data?.species.photos[0]} taxonomy={data?.species.taxonomy} />
        </Grid.Col>
      </Grid>
    </>
  );
}
