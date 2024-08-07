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
  Image,
  Flex,
  Skeleton,
} from "@mantine/core";
import { Taxonomy, IndigenousEcologicalKnowledge, Photo } from "@/app/type";

import { Attribute, AttributePill } from "@/components/highlight-stack";
import { useEffect, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { SpeciesImage } from "@/components/species-image";
import Link from "next/link";

const GET_TAXON = gql`
  query TaxonSpecies($rank: TaxonomicRank, $canonicalName: String) {
    taxon(rank: $rank, canonicalName: $canonicalName) {
      hierarchy {
        canonicalName
        rank
        depth
      }
    }
  }
`;

type ClassificationNode = {
  canonicalName: string;
  rank: string;
  depth: number;
};

type TaxonQuery = {
  taxon: {
    hierarchy: ClassificationNode[];
  };
};

const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        authorship
        status
        rank
        source
        sourceUrl
      }
      vernacularNames {
        datasetId
        vernacularName
        citation
        sourceUrl
      }
      synonyms {
        scientificName
        canonicalName
        authorship
      }
      photos {
        url
        source
        publisher
        license
        rightsHolder
      }
      indigenousEcologicalKnowledge {
        id
        sourceUrl
      }
      dataSummary {
        genomes
        loci
      }
    }
  }
`;

type VernacularName = {
  datasetId: string;
  vernacularName: string;
  citation?: string;
  sourceUrl?: string;
};

type Synonym = {
  scientificName: string;
  canonicalName: string;
  authorship?: string;
};

type speciesDataSummary = {
  genomes: number;
  loci: number;
};

type Species = {
  taxonomy: Taxonomy[];
  vernacularNames: VernacularName[];
  synonyms: Synonym[];
  photos: Photo[];
  indigenousEcologicalKnowledge?: IndigenousEcologicalKnowledge[];
  dataSummary: speciesDataSummary;
};

type QueryResults = {
  species: Species;
};

interface TaxonMatch {
  identifier: string;
  name: string;
  acceptedIdentifier: string;
  acceptedName: string;
}

interface SummaryInfoProps {
  label: string;
  value: string | number | undefined;
}

function SummaryInfo({ label, value }: SummaryInfoProps) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text>{label}</Text>
      <AttributePill value={value} />
    </Group>
  );
}

function DataSummary({
  speciesData,
}: {
  speciesData: speciesDataSummary | undefined;
}) {
  return (
    <Paper radius={16} p="md" withBorder>
      <Text fw={700} size="lg" pb={10}>
        Data Summary
      </Text>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper radius={16} p="md" withBorder>
            <Stack>
              <Stack>
                <Text fw={700} size="md">
                  Whole genome data
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo
                    label="Whole genome assemblies"
                    value={speciesData?.genomes}
                  />
                  <SummaryInfo
                    label="Partial genome assemblies"
                    value="No data"
                  />
                  <SummaryInfo label="Genome annotations" value="No data" />
                  <SummaryInfo
                    label="Organellar genome assemblies"
                    value="No data"
                  />
                </Stack>
              </Stack>
              <Stack>
                <Text fw={700} size="md">
                  Genomic components
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Sequence read files" value="No data" />
                  <SummaryInfo
                    label="Sequence alignment files"
                    value="No data"
                  />
                </Stack>
              </Stack>
              <Stack>
                <Text fw={700} size="md">
                  Partial genomic data
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Single loci" value={speciesData?.loci} />
                  <SummaryInfo label="Genetic variant sets" value="No data" />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack>
            <Paper radius={16} p="md" withBorder>
              <Stack>
                <Text fw={700} size="md">
                  Specimens
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Registered collections" value="No data" />
                  <SummaryInfo label="Other" value="No data" />
                </Stack>
              </Stack>
            </Paper>
            <Paper radius={16} p="md" withBorder>
              <Stack>
                <Text fw={700} size="md">
                  Protocols
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Methods" value="No data" />
                  <SummaryInfo label="Primers" value="No data" />
                  <SummaryInfo label="Assays" value="No data" />
                </Stack>
              </Stack>
            </Paper>
            <Paper radius={16} p="md" withBorder>
              <Stack>
                <Text fw={700} size="md">
                  Publications
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Genomics papers" value="No data" />
                  <SummaryInfo label="Other papers" value="No data" />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

interface ExternalLinkButtonProps {
  url?: string;
  externalLinkName?: string;
}

function ExternalLinkButton({
  url,
  externalLinkName,
}: ExternalLinkButtonProps) {
  return (
    <Button
      component="a"
      radius="xl"
      color="shellfish.6"
      size="xs"
      href={url}
      target="_blank"
    >
      <Text c="white" fw={600} size="sm" style={{ whiteSpace: "nowrap" }}>
        {externalLinkName}
      </Text>
    </Button>
  );
}

interface ExternalResourcesProps {
  canonicalName: string;
  species?: Species;
}

function ExternalResources(props: ExternalResourcesProps) {
  const [matchedTaxon, setMatchedTaxon] = useState<string[] | null>(null);

  // Fetch the taxon UID from the given name
  useEffect(() => {
    async function matchTaxon() {
      try {
        const response = await fetch(
          `https://api.ala.org.au/species/guid/${encodeURIComponent(
            props.canonicalName,
          )}`,
        );
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(
          matches.map(({ acceptedIdentifier }) => acceptedIdentifier),
        );
      } catch (error) {
        setMatchedTaxon([]);
      }
    }

    matchTaxon();
  }, [props.canonicalName]);

  return (
    <Paper radius={16} p="md" withBorder>
      <Stack>
        <Text fw={700} size="lg">
          External Resources
        </Text>
        <Paper radius={16} p="md" withBorder>
          <Text fw={700} size="md" pb={10}>
            Species information
          </Text>
          <Group>
            {matchedTaxon?.length !== 0 && (
              <ExternalLinkButton
                url={`https://bie.ala.org.au/species/${matchedTaxon?.[0]}`}
                externalLinkName="ALA"
              />
            )}
          </Group>
        </Paper>
        <Paper radius={16} p="md" withBorder>
          <Text fw={700} size="md" pb={10}>
            Taxonomy
          </Text>
          <Group></Group>
        </Paper>
      </Stack>
    </Paper>
  );
}

function Classification({ taxonomy }: { taxonomy: Taxonomy }) {
  const { loading, error, data } = useQuery<TaxonQuery>(GET_TAXON, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
    },
  });

  const hierarchy = data?.taxon.hierarchy.toSorted((a, b) => b.depth - a.depth);

  return (
    <Paper radius={16} p="md" withBorder>
      <LoadOverlay visible={loading} />

      <Group justify="space-between" pb={20}>
        <Text fw={700} size="lg">
          Higher classification
        </Text>
        <Group>
          <Text fw={300} size="xs">
            Source
          </Text>
          <Button
            component="a"
            radius="xl"
            variant="outline"
            color="shellfish.6"
            size="xs"
            href={taxonomy.sourceUrl}
            target="_blank"
          >
            <Text
              c="shellfish.6"
              fw={600}
              size="sm"
              style={{ whiteSpace: "nowrap" }}
            >
              {taxonomy.source}
            </Text>
          </Button>
        </Group>
      </Group>

      <Group>
        {error && <Text>{error.message}</Text>}
        {hierarchy?.map((node, idx) => (
          <Attribute
            key={idx}
            label={Humanize.capitalize(node.rank.toLowerCase())}
            value={node.canonicalName}
            href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
          />
        ))}
      </Group>
    </Paper>
  );
}

function SpeciesPhoto({ photo }: { photo?: Photo }) {
  return <SpeciesImage photo={photo} />;
}

export default function TaxonomyPage({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  const species = data?.species;
  const taxonomy = data?.species.taxonomy[0];

  return (
    <Grid>
      <LoadOverlay visible={loading} />
      <Grid.Col span={{ base: 12, xl: "auto" }}>
        <SpeciesPhoto photo={data?.species.photos[0]} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: "content" }}>
        <DataSummary speciesData={data?.species.dataSummary} />
      </Grid.Col>
      <Grid.Col span={{ base: "auto", xl: 3 }}>
        <ExternalResources
          canonicalName={canonicalName}
          species={data?.species}
        />
      </Grid.Col>
      {taxonomy && (
        <Grid.Col span={12}>
          <Classification taxonomy={taxonomy} />
        </Grid.Col>
      )}
    </Grid>
  );
}
