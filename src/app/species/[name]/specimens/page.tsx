"use client";

import classes from "./page.module.css";

import { gql, useQuery } from "@apollo/client";
import { AnalysisMap } from "@/components/mapping";
import { AttributePillContainer } from "@/components/data-fields";
import SimpleBarGraph from "@/components/graphing/SimpleBarGraph";
import { AccessionEvent, CollectionEvent, SpecimenMapMarker, SpecimenOverview, YearValue } from "@/queries/specimen";
import { Grid, Paper, Stack, Text, Title, Skeleton, Box, Table, Group, Image, Tooltip, Button } from "@mantine/core";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3";
import { useSpecies } from "@/app/species-provider";

const GET_SPECIMENS_OVERVIEW = gql`
  query SpeciesSpecimens($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      overview {
        specimens {
          ...SpecimenOverviewDetails
        }
      }
    }
  }
`;

interface OverviewQuery {
  species: {
    overview: {
      specimens: SpecimenOverview;
    };
  };
}

const GET_SPECIMEN_MAP_MARKERS = gql`
  query SpeciesSpecimenMapMarkers($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      mapping {
        specimens {
          ...SpecimenMapMarkerDetails
        }
      }
    }
  }
`;

interface MappingQuery {
  species: {
    mapping: {
      specimens: SpecimenMapMarker[];
    };
  };
}

const GET_SPECIMEN_CARD = gql`
  query SpecimenCard($recordId: String) {
    specimen(by: { recordId: $recordId }) {
      collections {
        ...CollectionEventDetails
      }
      accessions {
        ...AccessionEventDetails
      }
    }
  }
`;

interface SpecimenCardQuery {
  specimen: {
    collections: CollectionEvent[];
    accessions: AccessionEvent[];
  };
}

interface OverviewBlockProps {
  title: string;
  children?: React.ReactNode;
  loading: boolean;
}

function OverviewBlock({ title, children, loading }: OverviewBlockProps) {
  return (
    <Skeleton visible={loading} radius="md" className={classes.skeletonOverview}>
      <Paper radius="lg" p={20} bg="wheatBg.0" withBorder style={{ borderColor: "var(--mantine-color-wheatBg-1)" }}>
        <Stack>
          <Text fw={700} c="midnight" fz="xs">
            {title}
          </Text>
          {children}
        </Stack>
      </Paper>
    </Skeleton>
  );
}

function Overview({ name }: { name: string }) {
  const { loading, error, data } = useQuery<OverviewQuery>(GET_SPECIMENS_OVERVIEW, {
    variables: { canonicalName: name },
  });

  return (
    <Paper radius="lg" p={20} bg="wheatBg.0">
      <Title order={3} c="wheat">
        Specimens overview
      </Title>

      {error?.message}

      <Grid columns={7}>
        <Grid.Col span={5}>
          <Skeleton visible={loading} radius="md" className={classes.skeletonOverview}>
            <Paper
              radius="lg"
              p={20}
              bg="wheatBg.0"
              withBorder
              style={{ borderColor: "var(--mantine-color-wheatBg-1)" }}
            >
              <Grid>
                <Grid.Col span={2}>
                  <Text fw={700} c="midnight" fz="xs">
                    Total number of specimens
                  </Text>
                  <AttributePillContainer color="white">
                    {data?.species.overview.specimens.total}
                  </AttributePillContainer>
                </Grid.Col>
                <Grid.Col span={8} px={50}>
                  <Text fw={700} c="midnight" fz="xs">
                    Collection years
                  </Text>
                  <Box h={100}>
                    {data && <CollectionYearsGraph data={data.species.overview.specimens.collectionYears} />}
                  </Box>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text fw={700} c="midnight" fz="xs">
                    Top 5 bioregions
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Skeleton>
        </Grid.Col>
        <Grid.Col span={2}>
          <OverviewBlock title="Major collections" loading={loading}>
            <Grid>
              {data?.species.overview.specimens.majorCollections.map((collection) => (
                <Grid.Col span={6} key={collection}>
                  <AttributePillContainer color="white">{collection}</AttributePillContainer>
                </Grid.Col>
              ))}
            </Grid>
          </OverviewBlock>
        </Grid.Col>

        <Grid.Col span={1}>
          <OverviewBlock title="Holotype" loading={loading}>
            <AttributePillContainer color="white">{data?.species.overview.specimens.holotype}</AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Other types" loading={loading}>
            <AttributePillContainer color="white">{data?.species.overview.specimens.otherTypes}</AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Formal vouchers" loading={loading}>
            <AttributePillContainer color="white">
              {data?.species.overview.specimens.formalVouchers}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Tissue available" loading={loading}>
            <AttributePillContainer color="white">{data?.species.overview.specimens.tissues}</AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Genomic DNA available" loading={loading}>
            <AttributePillContainer color="white">{data?.species.overview.specimens.genomicDna}</AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Australian material" loading={loading}>
            <AttributePillContainer color="white">
              {data?.species.overview.specimens.australianMaterial}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Non-Australian material" loading={loading}>
            <AttributePillContainer color="white">
              {data?.species.overview.specimens.nonAustralianMaterial}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Explorer({ name }: { name: string }) {
  const { loading, error, data } = useQuery<MappingQuery>(GET_SPECIMEN_MAP_MARKERS, {
    variables: { canonicalName: name },
  });

  const markers = data?.species.mapping.specimens.map((marker) => ({
    recordId: marker.collectionRepositoryId,
    latitude: marker.latitude,
    longitude: marker.longitude,
    color: [123, 161, 63, 220],
  }));

  return (
    <Paper>
      <Title order={3}>Interactive specimen explorer</Title>
      <Grid>
        <Grid.Col span={7}>
          <Paper pos="relative" radius="xl" style={{ overflow: "hidden" }} h="100%">
            <AnalysisMap markers={markers} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack>
            <HolotypeCard />
            <SpecimenCard />
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function HolotypeCard() {
  const { details } = { ...useSpecies() };

  const overviewResult = useQuery<OverviewQuery>(GET_SPECIMENS_OVERVIEW, {
    skip: !details,
    variables: { canonicalName: details?.name },
  });

  const { loading, error, data } = useQuery<SpecimenCardQuery>(GET_SPECIMEN_CARD, {
    skip: !overviewResult.data,
    variables: { recordId: overviewResult.data?.species.overview.specimens.holotype },
  });

  const collection = data?.specimen.collections[0];
  const accession = data?.specimen.accessions[0];

  return (
    <Paper radius="xl" p={20} bg="bushfire.0">
      <Title order={4}>Holotype</Title>

      <Group wrap="nowrap">
        <Table variant="vertical" withRowBorders={false} className={classes.cardTable}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Catalogue number</Table.Th>
              <Table.Td>
                {accession?.institutionCode} {accession?.collectionRepositoryId}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Institution</Table.Th>
              <Table.Td>{accession?.institutionName ?? accession?.institutionCode}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Collection</Table.Th>
              <Table.Td>{accession?.collectionRepositoryCode}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Type location</Table.Th>
              <Table.Td>{collection?.locality}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Coordinates</Table.Th>
              <Table.Td>
                {collection?.latitude}, {collection?.longitude}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Collected by</Table.Th>
              <Table.Td>{collection?.collectedBy}</Table.Td>
            </Table.Tr>
            <Tooltip
              label="person or persons providing identification as denoted in the registration of the specimen into a formalised institution or other informal collection"
              w={400}
              position="bottom"
              color="shellfish"
              transitionProps={{ transition: "pop", duration: 300 }}
              multiline
              withArrow
            >
              <Table.Tr>
                <Table.Th>Identified by</Table.Th>
                <Table.Td>{accession?.identifiedBy}</Table.Td>
              </Table.Tr>
            </Tooltip>
          </Table.Tbody>
        </Table>

        <Stack>
          <Image w={200} h={200} src="/icons/specimen-listing/Specimen listing_ accession.svg" alt="Holotype badge" />
          <Button bg="midnight.9" radius="xl">
            record history
          </Button>
        </Stack>
      </Group>
    </Paper>
  );
}

function SpecimenCard() {
  return (
    <Paper radius="xl" p={20} withBorder>
      <Title order={4}>Specimen</Title>

      <Table variant="vertical" withRowBorders={false} className={classes.cardTable}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>Registration number</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Institution</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Specimen status</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Preparation type</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Collection location</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Coordinates</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Collected by</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Identified by</Table.Th>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

function AllSpecimens() {
  return (
    <Paper radius="lg" p={20} bg="shellfishBg.0">
      <Title order={3} c="shellfish">
        All specimens
      </Title>
    </Paper>
  );
}

export default function Page() {
  const { details } = { ...useSpecies() };
  if (!details) return;

  return (
    <Stack gap="xl">
      <Overview name={details.name} />
      <Explorer name={details.name} />
      <AllSpecimens />
    </Stack>
  );
}

interface CollectionYearsGraphProps {
  data: YearValue<number>[];
}

function CollectionYearsGraph({ data }: CollectionYearsGraphProps) {
  return (
    <ParentSize>
      {(parent) => {
        const xScale = scaleBand({
          range: [0, parent.width],
          domain: data.map((stat) => stat.year),
          padding: 0.4,
        });

        const yScale = scaleLinear({
          range: [0, parent.height - 20],
          domain: [0, max(data, (d) => d.value) ?? 0],
        });

        return (
          <SimpleBarGraph
            width={parent.width}
            height={parent.height}
            xScale={xScale}
            yScale={yScale}
            data={data}
            getX={(d: YearValue<number>) => d.year}
            getY={(d: YearValue<number>) => d.value}
            tickValues={[min(xScale.domain()) ?? 0, max(xScale.domain()) ?? 0]}
          />
        );
      }}
    </ParentSize>
  );
}
