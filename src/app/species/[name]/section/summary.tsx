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
  Stack,
  Text,
} from "@mantine/core";
import { Photo, Taxonomy, Regions, StatsSpecies, IndigenousEcologicalKnowledge, TraceFile } from "@/app/type";
import Link from "next/link";

import { ArgaMap, BioRegionLayers, SpecimensLayer } from "@/app/components/mapping";
import { Attribute, HighlightStack } from "@/app/components/highlight-stack";
import { ExternalLink } from "tabler-icons-react";
import { useEffect, useState } from "react";
import { SurveyModal } from "@/app/components/survey-modal";
import { LoadOverlay } from "@/app/components/load-overlay";
import { MAX_WIDTH } from "@/app/constants";


const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    stats {
      species(canonicalName: $canonicalName) {
        total
        wholeGenomes
        organelles
        barcodes
      }
    }
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authority
        kingdom
        phylum
        class
        order
        family
        genus
        synonyms {
          scientificName
        }
      }
      photos {
        url
        referenceUrl
        publisher
        license
        rightsHolder
      }
      regions {
        ibra {
          name
        }
        imcra {
          name
        }
      }
      specimens(page: 1) {
        total
        records {
          id
          accession
          typeStatus
          latitude
          longitude
          institutionName
        }
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
      }
    }
  }
`;

type Specimen = {
  id: string,
  accession: string,
  typeStatus?: string,
  latitude?: number,
  longitude?: number,
  institutionName?: string,
};

type Species = {
    taxonomy: Taxonomy,
    photos: Photo[],
    regions: Regions,
    traceFiles: TraceFile[],
    specimens: { total: number, records: Specimen[] },
    indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[],
};

type StatsResults = {
  species: StatsSpecies,
};

type QueryResults = {
  stats: StatsResults,
  species: Species,
};


function SpeciesPhoto({ photo }: { photo?: Photo }) {
  function small(url: string) {
    return url.replace("original", "medium");
  }

  return (
    <Paper radius="md" sx={{ border: "1px solid #c1c1c1" }}>
      <Image
        width={375}
        height={300}
        radius="md"
        src={photo ? small(photo.url) : ""}
        alt="Species image"
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


interface DataSummaryProps {
  canonicalName: string,
  stats: StatsSpecies,
  specimens?: Specimen[],
}

function DataSummary({ canonicalName, stats, specimens }: DataSummaryProps) {
  const name = canonicalName.replaceAll(" ", "_");
  const otherData = stats.total - stats.wholeGenomes - stats.organelles - stats.barcodes;

  return (
    <Stack>
      <Text fw={700}>Indexed Data</Text>
    <SimpleGrid cols={4}>
      <Attribute label="Whole Genomes" value={stats.wholeGenomes} href={`/species/${name}/whole_genome`} />
      <Attribute label="Genetic Loci*" value={stats.barcodes} href={`/species/${name}/barcode`} />
      <Attribute label="Specimens" value={specimens?.length} href={`/species/${name}/specimen`} />
      <Attribute label="Other Genetic Data" value={otherData} href={`/species/${name}/other_genomic`} />
    </SimpleGrid>
    </Stack>
  );
}


interface DistributionProps {
  taxonomy: Taxonomy,
  regions: Regions,
  specimens?: Specimen[],
}

function Distribution({ taxonomy, regions, specimens }: DistributionProps) {
  const attribution = "Australian Faunal Directory";
  const sourceUrl = `https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`;
  const allRegions = [...regions.ibra, ...regions.imcra];

  return (
    <Paper radius="md" bg="attribute.0" sx={{ border: "1px solid #c1c1c1" }}>
      <Grid gutter={0}>
        <Grid.Col span="auto">
          <Box h={500} sx={(theme) => ({
            overflow: "hidden",
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: allRegions.length > 0 ? 0 : theme.radius.md,
          })}>
            <ArgaMap>
              <BioRegionLayers regions={allRegions.map(region => region.name)} />
              {specimens && <SpecimensLayer specimens={specimens} />}
            </ArgaMap>
          </Box>
        </Grid.Col>

        <Grid.Col span={4} py="xs" px={30} miw={200}>
          <Text size="xl" weight={600} mb="sm">
            Distribution
          </Text>

              <Text c="dimmed" size="sm" mb="xs">
                {allRegions.map((region) => region.name).join(", ")}
              </Text>
              <Attribution name={attribution} url={sourceUrl} />

        </Grid.Col>
      </Grid>
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
    <Box>
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
    </Box>
  );
}


function Attribution({ name, url }: { name: string; url: string }) {
  return (
    <Text color="dimmed" size="sm" weight="bold">
      Source:{" "}
      <Link style={{ fontSize: 14 }} href={url} target="_blank">
        {name}
      </Link>
    </Text>
  );
}


interface TaxonomyProps {
  taxonomy: Taxonomy,
}

function Taxonomy({ taxonomy }: TaxonomyProps) {
  const attribution = "Australian Faunal Directory";
  const sourceUrl = `https://biodiversity.org.au/afd/taxa/${taxonomy.canonicalName}`;
  const { classes } = useSpeciesSummaryStyles();
  
  return (
    <Box>
      <HighlightStack spacing={0}>
        <Text fw={700} mb={10}>Higher Classification</Text>
          <Link href={`/kingdom/${taxonomy.kingdom}`} className={classes.indent}>{taxonomy.kingdom}</Link>
          <Link href={`/phylum/${taxonomy.phylum}`} className={classes.indent}>{taxonomy.phylum}</Link>
          <Link href={`/class/${taxonomy.class}`} className={classes.indent}>{taxonomy.class}</Link>
          <Link href={`/order/${taxonomy.order}`} className={classes.indent}>{taxonomy.order}</Link>
          <Link href={`/family/${taxonomy.family}`} className={classes.indent}>{taxonomy.family}</Link>
          <Link href={`/genus/${taxonomy.genus}`} className={classes.indent}>{taxonomy.genus}</Link>
          <Text color="black" italic className={classes.indent}>{taxonomy.canonicalName}</Text>

        { taxonomy.synonyms.length > 0 && <>
          <Text fw={700} mb={10} mt={20}>Synonyms</Text>
          { taxonomy.synonyms.map(synonym => (
            <Text key={synonym.scientificName} className={classes.indent}>{synonym.scientificName}</Text>
          ))}
        </>}
      </HighlightStack>
    </Box>
  );
}


export function Summary({ canonicalName }: { canonicalName: string }) {
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
        <Grid.Col span="content">
          <Stack spacing={20}>
            <SpeciesPhoto photo={data?.species.photos[0]} />
            {data && <Taxonomy taxonomy={data.species.taxonomy} /> }
            <ExternalLinks canonicalName={canonicalName} species={data?.species} />
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack spacing={30}>
          {data?.stats ? <DataSummary canonicalName={canonicalName} stats={data.stats.species} specimens={data.species.specimens.records} /> : null}
          {data && (
            <Distribution
              taxonomy={data.species.taxonomy}
              regions={data.species.regions}
              specimens={data.species.specimens.records}
            />
          )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

const useSpeciesSummaryStyles = createStyles((theme, _params, _getRef) => {
  return {
    indent: {
      marginLeft: '10px'
    }
  }
});
