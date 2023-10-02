"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Photo, Taxonomy, IndigenousEcologicalKnowledge } from "@/app/type";
import Link from "next/link";

import { Attribute, HighlightStack } from "@/components/highlight-stack";
import { ExternalLink } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { SurveyModal } from "@/components/survey-modal";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";


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


function SpeciesPhoto({ photo }: { photo?: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Paper radius={100}>
      <Image
        height={500}
        radius={100}
        src={photo ? small(photo.url) : ""}
        alt=""
      />
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


function Details({ taxonomy }: { taxonomy: Taxonomy }) {
  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} mb={10} size="lg">Taxonomy</Text>

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
            <Text fw={600} fz="sm" truncate="end" w="400">
              {taxonomy.vernacularNames?.map(r => r.name).join(', ')}
            </Text>
          </DataTableRow>
          <DataTableRow label="Subspecies"></DataTableRow>
        </DataTable>
      </SimpleGrid>
    </Paper>
  );
}


function Classification({ taxonomy }: { taxonomy: Taxonomy }) {
  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} mb={10} size="lg">Higher classification</Text>

      <Group>
        <Attribute label="Kingdom" value={taxonomy.kingdom} href={`/kingdom/${taxonomy.kingdom}`} />
        <Attribute label="Phylum" value={taxonomy.phylum} href={`/phylum/${taxonomy.phylum}`} />
        <Attribute label="Class" value={taxonomy.class} href={`/class/${taxonomy.class}`} />
        <Attribute label="Order" value={taxonomy.order} href={`/order/${taxonomy.order}`} />
        <Attribute label="Family" value={taxonomy.family} href={`/family/${taxonomy.family}`} />
        <Attribute label="Genus" value={taxonomy.genus} href={`/genus/${taxonomy.genus}`} />
      </Group>

      <HighlightStack gap={0}>
        { taxonomy.synonyms.length > 0 && <>
          <Text fw={700} mb={10} mt={20}>Synonyms</Text>
          { taxonomy.synonyms.map(synonym => (
            <Text key={synonym.scientificName}>{synonym.scientificName}</Text>
          ))}
        </>}
      </HighlightStack>
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
      <SurveyModal />

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
          <SpeciesPhoto photo={data?.species.photos[0]} />
        </Grid.Col>
      </Grid>
    </>
  );
}
