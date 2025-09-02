"use client";

import { gql, useQuery } from "@apollo/client";
import { Grid, Group, Paper, Stack, Text } from "@mantine/core";
import * as Humanize from "humanize-plus";

import { useDatasets } from "@/app/source-provider";
import { ExternalLinkButton } from "@/components/button-link-external";
import { AttributePill } from "@/components/data-fields";
import { AttributePill as AttributePillStack } from "@/components/highlight-stack";
import { LoadOverlay } from "@/components/load-overlay";
import { SpeciesPhoto } from "@/components/species-image";
import { Species, SpeciesGenomicDataSummary, Taxon, Taxonomy } from "@/generated/types";
import { getCanonicalName } from "@/helpers/getCanonicalName";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const GET_TAXON = gql`
  query TaxonSpecies($rank: TaxonomicRank, $canonicalName: String, $datasetId: UUID) {
    taxon(by: { classification: { rank: $rank, canonicalName: $canonicalName, datasetId: $datasetId } }) {
      hierarchy {
        canonicalName
        rank
        depth
      }
    }
  }
`;

const GET_SUMMARY = gql`
  query SpeciesSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        rank
      }
      photos {
        url
        source
        publisher
        license
        rightsHolder
      }
      dataSummary {
        genomes
        loci
      }
    }
  }
`;
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
      <AttributePillStack value={value} />
    </Group>
  );
}

function DataSummary({ speciesData }: { speciesData?: SpeciesGenomicDataSummary }) {
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
                  <SummaryInfo label="Whole genome assemblies" value={speciesData?.genomes} />
                  <SummaryInfo label="Partial genome assemblies" value="No data" />
                  <SummaryInfo label="Genome annotations" value="No data" />
                  <SummaryInfo label="Organellar genome assemblies" value="No data" />
                </Stack>
              </Stack>
              <Stack>
                <Text fw={700} size="md">
                  Genomic components
                </Text>
                <Stack justify="space-between" pl={10}>
                  <SummaryInfo label="Sequence read files" value="No data" />
                  <SummaryInfo label="Sequence alignment files" value="No data" />
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
        const response = await fetch(`https://api.ala.org.au/species/guid/${encodeURIComponent(props.canonicalName)}`);
        const matches = (await response.json()) as TaxonMatch[];
        setMatchedTaxon(matches.map(({ acceptedIdentifier }) => acceptedIdentifier));
      } catch {
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
                icon={IconArrowUpRight}
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
  const { names } = useDatasets();
  const dataset = names.get("Atlas of Living Australia");

  const { loading, error, data } = useQuery<{ taxon: Taxon }>(GET_TAXON, {
    variables: {
      rank: taxonomy.rank,
      canonicalName: taxonomy.canonicalName,
      datasetId: dataset?.id,
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
          <ExternalLinkButton url={dataset?.url} externalLinkName={dataset?.name} outline icon={IconArrowUpRight} />
        </Group>
      </Group>

      <Group>
        {error && <Text>{error.message}</Text>}
        {hierarchy?.map((node, idx) => (
          <AttributePill
            key={idx}
            labelColor="midnight.8"
            popoverDisabled
            hoverColor="midnight.0"
            label={Humanize.capitalize(node.rank.toLowerCase())}
            value={node.canonicalName}
            href={`/${node.rank.toLowerCase()}/${node.canonicalName}`}
            icon={IconArrowUpRight}
            showIconOnHover
            miw={100}
          />
        ))}
      </Group>
    </Paper>
  );
}

export default function SummaryPage({ params }: { params: { name: string } }) {
  const canonicalName = getCanonicalName(params);

  const { loading, error, data } = useQuery<{ species: Species }>(GET_SUMMARY, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  // just use the first one for now while the backend guarantees it. we want
  // to phase this endpoint out but for now there is too much yak shaving involved
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
        <ExternalResources canonicalName={canonicalName} species={data?.species} />
      </Grid.Col>
      {taxonomy && (
        <Grid.Col span={12}>
          <Classification taxonomy={taxonomy} />
        </Grid.Col>
      )}
    </Grid>
  );
}
