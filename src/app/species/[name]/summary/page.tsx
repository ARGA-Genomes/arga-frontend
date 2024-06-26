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
} from "@mantine/core";
import { Taxonomy, IndigenousEcologicalKnowledge, Photo } from "@/app/type";

import { Attribute, AttributePill } from "@/components/highlight-stack";
import { IconExternalLink } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LoadOverlay } from "@/components/load-overlay";
import { DataTable, DataTableRow } from "@/components/data-table";
import { SpeciesImage } from "@/components/species-image";
import Link from "next/link";
import { theme } from "@/theme";

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

interface ExternalLinksProps {
  canonicalName: string;
  species?: Species;
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
          `https://api.ala.org.au/species/guid/${encodeURIComponent(
            props.canonicalName
          )}`
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
      <Text fw={700} mb={10} size="lg">
        External links
      </Text>
      <Group mt="md" gap="xs">
        <Button
          component="a"
          radius="md"
          color="gray"
          variant="light"
          size="xs"
          leftSection={<IconExternalLink size="1rem" color="black" />}
          loading={!matchedTaxon}
          disabled={Array.isArray(matchedTaxon) && matchedTaxon.length === 0}
          href={`https://bie.ala.org.au/species/${matchedTaxon?.[0] || ""}`}
          target="_blank"
        >
          <Text>
            View on&nbsp;<b>ALA</b>
          </Text>
        </Button>

        {props.species?.indigenousEcologicalKnowledge?.map((iek) => (
          <Button
            key={iek.id}
            component="a"
            radius="md"
            color="gray"
            variant="light"
            size="xs"
            leftSection={<IconExternalLink size="1rem" color="black" />}
            href={iek.sourceUrl}
            target="_blank"
          >
            <Text>
              View on&nbsp;<b>Profiles</b>
            </Text>
          </Button>
        ))}

        {hasFrogID && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<IconExternalLink size="1rem" />}
          >
            View on&nbsp;<b>FrogID</b>
          </Button>
        )}
        {hasAFD && (
          <Button
            radius="md"
            color="midnight"
            size="xs"
            leftSection={<IconExternalLink size="1rem" />}
          >
            View on&nbsp;<b>AFD</b>
          </Button>
        )}
      </Group>
    </Paper>
  );
}

interface DetailsProps {
  taxonomy: Taxonomy;
  commonNames: VernacularName[];
  synonyms: Synonym[];
}

function Details({ taxonomy, commonNames, synonyms }: DetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Paper radius={16} p="md" withBorder>
      <Group mb={10} align="baseline">
        <Text fw={700} size="lg">
          Taxonomy
        </Text>
        <Text fz="sm" fw={300}>
          Source:&nbsp;
          {taxonomy.sourceUrl ? (
            <Link href={taxonomy.sourceUrl} target="_blank">
              {taxonomy.source}
            </Link>
          ) : (
            taxonomy.source
          )}
        </Text>
      </Group>

      <SimpleGrid cols={2}>
        <DataTable>
          <DataTableRow label="Scientific name">
            <Group gap={10}>
              <Text fw={600} fz="sm" fs="italic">
                {taxonomy.canonicalName}
              </Text>
              <Text fw={600} fz="sm">
                {taxonomy.authorship}
              </Text>
            </Group>
          </DataTableRow>
          <DataTableRow label="Status">
            <Text fw={600} fz="sm">
              {taxonomy.status.toLowerCase()}
            </Text>
          </DataTableRow>
          <DataTableRow label="Synonyms">
            <Stack>
              {synonyms.map((synonym) => (
                <Text fw={600} fz="sm" key={synonym.scientificName}>
                  {synonym.scientificName}
                </Text>
              ))}
            </Stack>
          </DataTableRow>
        </DataTable>

        <DataTable>
          <DataTableRow label="Common names">
            <Group
              display="block"
              w={{ xs: 50, sm: 100, md: 150, lg: 200, xl: 270 }}
            >
              <Text fw={600} fz="sm" truncate="end">
                {commonNames.map((r) => r.vernacularName).join(", ")}
              </Text>
              <Button
                onClick={() => setIsOpen(true)}
                bg="none"
                c="midnight.4"
                pl={-5}
                className="textButton"
              >
                Show All
              </Button>
            </Group>
            <Modal
              opened={isOpen}
              onClose={() => setIsOpen(false)}
              className="commonNamesModal"
              centered
            >
              <Text fw={600} fz="sm">
                {commonNames.map((r) => r.vernacularName).join(", ")}
              </Text>
            </Modal>
          </DataTableRow>
          <DataTableRow label="Subspecies"></DataTableRow>
        </DataTable>
      </SimpleGrid>
    </Paper>
  );
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
            props.canonicalName
          )}`
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

interface Badge {
  icon: string;
  url: string;
}

const LICENSE_ICON: Record<string, Badge> = {
  "cc-by-nc-nd": {
    icon: "/badges/cc-by-nc-nd.svg",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0",
  },
  "cc-by-nc-sa": {
    icon: "/badges/cc-by-nc-sa.svg",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0",
  },
  "cc-by-nc": {
    icon: "/badges/cc-by-nc.svg",
    url: "http://creativecommons.org/licenses/by-nc/4.0",
  },
  "cc-by-nd": {
    icon: "/badges/cc-by-nd.svg",
    url: "http://creativecommons.org/licenses/by-nd/4.0",
  },
  "cc-by-sa": {
    icon: "/badges/cc-by-sa.svg",
    url: "http://creativecommons.org/licenses/by-sa/4.0",
  },
  "cc-by": {
    icon: "/badges/cc-by.svg",
    url: "http://creativecommons.org/licenses/by/4.0",
  },
  cc0: {
    icon: "/badges/cc-zero.svg",
    url: "http://creativecommons.org/publicdomain/zero/1.0",
  },

  "http://creativecommons.org/licenses/by-nc-sa/4.0/": {
    icon: "/badges/cc-by-nc-sa.svg",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  "http://creativecommons.org/licenses/by-nc/4.0/": {
    icon: "/badges/cc-by-nc.svg",
    url: "http://creativecommons.org/licenses/by-nc/4.0/",
  },
  "http://creativecommons.org/licenses/by/4.0/": {
    icon: "/badges/cc-by.svg",
    url: "http://creativecommons.org/licenses/by/4.0/",
  },
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": {
    icon: "/badges/cc-by-nc-nd.svg",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0/",
  },

  "public domain mark": {
    icon: "/badges/publicdomain.svg",
    url: "http://creativecommons.org/publicdomain/mark/1.0",
  },
  "attribution-noncommercial 4.0 international": {
    icon: "/badges/cc-by-nc.svg",
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
  },
  "attribution 4.0 international": {
    icon: "/badges/cc-by.svg",
    url: "https://creativecommons.org/licenses/by/4.0/",
  },
};

function LicenseIcon({ license }: { license: string }) {
  const badge = LICENSE_ICON[license.toLowerCase()];
  return badge ? (
    <Link href={badge.url} target="_blank">
      <Image src={badge.icon} h={15} w={80}></Image>
    </Link>
  ) : (
    <Text fz="sm" c="dimmed">
      {license}
    </Text>
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
