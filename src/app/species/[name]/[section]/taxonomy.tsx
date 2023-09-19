"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Spoiler,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { Photo, Taxonomy, IndigenousEcologicalKnowledge } from "@/app/type";
import Link from "next/link";

import { AttributeLink, HighlightStack } from "@/app/components/highlight-stack";
import { ExternalLink } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { SurveyModal } from "@/app/components/survey-modal";
import { LoadOverlay } from "@/app/components/load-overlay";
import { MAX_WIDTH } from "@/app/constants";


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
    <Paper radius={100} sx={{ border: "1px solid #c1c1c1" }}>
      <Image
        height={500}
        radius={100}
        src={photo ? small(photo.url) : ""}
        alt=""
        styles={{
          image: {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        withPlaceholder
      />
      {photo && (
        <Group px="md" py="xs" position="apart">
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
      <Text size="xl" weight={600} mb="sm">External links</Text>
      <Group mt="md" spacing="xs">
        <Button
          component="a"
          radius="md"
          color="gray"
          variant="light"
          size="xs"
          leftIcon={<ExternalLink size="1rem" color="black" />}
          loading={!matchedTaxon}
          disabled={Array.isArray(matchedTaxon) && matchedTaxon.length === 0}
          href={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
          target="_blank"
          sx={(theme) => ({
            border: `1px solid ${theme.colors["gray"][6]}`,
          })}
        >
          <Text color="black">View on&nbsp;<b>ALA</b></Text>
        </Button>

        {props.species?.indigenousEcologicalKnowledge?.map(iek => (
          <Button
            key={iek.id}
            component="a"
            radius="md"
            color="gray"
            variant="light"
            size="xs"
            leftIcon={<ExternalLink size="1rem" color="black" />}
            href={iek.sourceUrl}
            target="_blank"
            sx={(theme) => ({
              border: `1px solid ${theme.colors["gray"][6]}`,
            })}
          >
            <Text color="black">View on&nbsp;<b>Profiles</b></Text>
          </Button>
        ))}

        {hasFrogID && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftIcon={<ExternalLink size="1rem" />}
            sx={(theme) => ({
              border: `1px solid ${theme.colors["shellfish"][6]}`,
            })}
          >
            View on&nbsp;<b>FrogID</b>
          </Button>
        )}
        {hasAFD && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftIcon={<ExternalLink size="1rem" />}
            sx={(theme) => ({
              border: `1px solid ${theme.colors["shellfish"][6]}`,
            })}
          >
            View on&nbsp;<b>AFD</b>
          </Button>
        )}
      </Group>
    </Paper>
  );
}


const useTableStyles = createStyles((theme, _params, _getRef) => {
  return {
    table: {
      "td:first-child": {
        textAlign: "right",
        whiteSpace: "nowrap",
        width: 1,
        paddingRight: 20,
      },
    },
  }
});


function Details({ taxonomy }: { taxonomy: Taxonomy }) {
  let { classes } = useTableStyles();

  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} mb={10} size="lg">Taxonomy</Text>

      <SimpleGrid cols={2}>
        <Table className={classes.table}>
          <tr>
            <td><Text weight={300} size="sm">Scientific name</Text></td>
            <td>
              <Group>
                <Text weight={600} size="sm" italic>{taxonomy.canonicalName}</Text>
                <Text weight={600} size="sm">{taxonomy.authority}</Text>
              </Group>
            </td>
          </tr>
          <tr>
            <td><Text weight={300} size="sm">Status</Text></td>
            <td><Text weight={600} size="sm">{taxonomy.status.toLowerCase()}</Text></td>
          </tr>
          <tr>
            <td><Text weight={300} size="sm">Synonyms</Text></td>
            <td>
              { taxonomy.synonyms.map(synonym => (
                <Text weight={600} size="sm" key={synonym.scientificName}>{synonym.scientificName}</Text>
              ))}
            </td>
          </tr>
        </Table>

        <Stack>
          <Table className={classes.table}>
            <tr>
              <td><Text weight={300} size="sm">Common names</Text></td>
              <td>
                <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
                  <Text weight={600} size="sm">{taxonomy.vernacularNames?.map(r => r.name).join(', ')}</Text>
                </Spoiler>
              </td>
            </tr>
          </Table>
          <AttributeLink label="Subspecies" value="" href="#" />
        </Stack>
      </SimpleGrid>
    </Paper>
  );
}


function Classification({ taxonomy }: { taxonomy: Taxonomy }) {
  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} mb={10} size="lg">Higher Classification</Text>

      <Group>
        <AttributeLink label="Kingdom" value={taxonomy.kingdom} href={`/kingdom/${taxonomy.kingdom}`} />
        <AttributeLink label="Phylum" value={taxonomy.phylum} href={`/phylum/${taxonomy.phylum}`} />
        <AttributeLink label="Class" value={taxonomy.class} href={`/class/${taxonomy.class}`} />
        <AttributeLink label="Order" value={taxonomy.order} href={`/order/${taxonomy.order}`} />
        <AttributeLink label="Family" value={taxonomy.family} href={`/family/${taxonomy.family}`} />
        <AttributeLink label="Genus" value={taxonomy.genus} href={`/genus/${taxonomy.genus}`} />
      </Group>

      <HighlightStack spacing={0}>

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


export function Taxonomy({ canonicalName }: { canonicalName: string }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Container maw={MAX_WIDTH} py={20}>
      <SurveyModal />
      <LoadOverlay visible={loading} />

      <Grid>
        <Grid.Col span={8}>
          <Stack spacing={20}>
            {data && <Details taxonomy={data.species.taxonomy} /> }
            {data && <Classification taxonomy={data.species.taxonomy} /> }
            <ExternalLinks canonicalName={canonicalName} species={data?.species} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <SpeciesPhoto photo={data?.species.photos[0]} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
