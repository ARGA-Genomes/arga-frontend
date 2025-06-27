"use client";

import classes from "./page.module.css";

import { DateTime } from "luxon";
import { gql, useQuery } from "@apollo/client";
import { AnalysisMap } from "@/components/mapping";
import { RecordTable, SortOrder } from "@/components/RecordTable";
import { AttributePillContainer, AttributePillValue } from "@/components/data-fields";
import { LoadOverlay, LoadPanel } from "@/components/load-overlay";
import SimpleBarGraph from "@/components/graphing/SimpleBarGraph";
import {
  AccessionEvent,
  CollectionEvent,
  SpecimenMapMarker,
  SpecimenOverview,
  SpecimenSummary,
  YearValue,
} from "@/queries/specimen";
import {
  Grid,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Skeleton,
  Box,
  Table,
  Group,
  Image,
  Tooltip,
  Button,
  Center,
  useMantineTheme,
} from "@mantine/core";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3";
import { useSpecies } from "@/app/species-provider";
import { getVoucherStatus, getVoucherColour, getVoucherRGBA } from "@/helpers/colors";
import { IconCircleCheck, IconCircleX, IconMicroscope } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Marker } from "@/components/mapping/analysis-map";
import { useStateHistory } from "@mantine/hooks";

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
  query SpecimenCard($entityId: String) {
    specimen(by: { entityId: $entityId }) {
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

const GET_SPECIMENS = gql`
  query SpeciesSpecimens($canonicalName: String, $page: Int, $pageSize: Int) {
    species(canonicalName: $canonicalName) {
      specimens(page: $page, pageSize: $pageSize) {
        total
        records {
          ...SpecimenSummary
        }
      }
    }
  }
`;

interface SpecimensQuery {
  species: {
    specimens: {
      total: number;
      records: SpecimenSummary[];
    };
  };
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

interface OverviewBlockProps {
  title: string;
  children?: React.ReactNode;
  loading: boolean;
  hasData?: boolean;
}

function OverviewBlock({ title, children, loading, hasData }: OverviewBlockProps) {
  return (
    <Skeleton visible={loading} radius="md" className={classes.skeletonOverview}>
      <Paper radius="lg" p={20} bg="wheatBg.0" withBorder style={{ borderColor: "var(--mantine-color-wheatBg-1)" }}>
        <Stack gap="sm">
          <Group justify="space-between" wrap="nowrap">
            <Text fw={700} c="midnight" fz="xs">
              {title}
            </Text>
            <DataCheckIcon value={hasData} />
          </Group>
          <Center>{children}</Center>
        </Stack>
      </Paper>
    </Skeleton>
  );
}

function Overview({ name }: { name: string }) {
  const { loading, error, data } = useQuery<OverviewQuery>(GET_SPECIMENS_OVERVIEW, {
    variables: { canonicalName: name },
  });

  const specimens = data?.species.overview.specimens;
  function col<T, R>(value?: T, retValue?: R): R | undefined {
    return value ? retValue : undefined;
  }

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
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    Total number of specimens
                  </Text>
                  <AttributePillContainer color="white" className={classes.pill}>
                    {specimens?.total}
                  </AttributePillContainer>
                </Grid.Col>
                <Grid.Col span={8} px={50}>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    Collection years
                  </Text>
                  <Box h={100}>{specimens && <CollectionYearsGraph data={specimens?.collectionYears} />}</Box>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
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
              {specimens?.majorCollections.map((collection) => (
                <Grid.Col span={6} key={collection}>
                  <AttributePillContainer color="white" className={classes.pill}>
                    {collection}
                  </AttributePillContainer>
                </Grid.Col>
              ))}
            </Grid>
          </OverviewBlock>
        </Grid.Col>

        <Grid.Col span={1}>
          <OverviewBlock title="Holotype" loading={loading} hasData={!!specimens?.holotype}>
            <AttributePillContainer
              className={classes.holotypePill}
              color={col(specimens?.holotype, "white")}
              withBorder={!!specimens?.holotype}
            >
              {specimens?.holotype}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Other types" loading={loading} hasData={!!specimens?.otherTypes}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.otherTypes, "white")}>
              {specimens?.otherTypes}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Formal vouchers" loading={loading} hasData={!!specimens?.formalVouchers}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.formalVouchers, "white")}>
              {specimens?.formalVouchers}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Tissue available" loading={loading} hasData={!!specimens?.tissues}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.tissues, "white")}>
              {specimens?.tissues}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Genomic DNA available" loading={loading} hasData={!!specimens?.genomicDna}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.genomicDna, "white")}>
              {specimens?.genomicDna}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Australian material" loading={loading} hasData={!!specimens?.australianMaterial}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.australianMaterial, "white")}>
              {specimens?.australianMaterial}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
        <Grid.Col span={1}>
          <OverviewBlock title="Non-Australian material" loading={loading} hasData={!!specimens?.nonAustralianMaterial}>
            <AttributePillContainer className={classes.pill} color={col(specimens?.nonAustralianMaterial, "white")}>
              {specimens?.nonAustralianMaterial}
            </AttributePillContainer>
          </OverviewBlock>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Explorer({ name }: { name: string }) {
  const [selectedSpecimen, handlers, history] = useStateHistory<SpecimenMapMarker | null>(null);

  const { loading, error, data } = useQuery<MappingQuery>(GET_SPECIMEN_MAP_MARKERS, {
    variables: { canonicalName: name },
  });

  // sort the map markers so that holotypes and other more uncommon types are rendered last
  function getRenderLayer(typeStatus?: string, collectionRepositoryId?: string) {
    const status = getVoucherStatus(typeStatus, collectionRepositoryId);

    if (status === "holotype") return 0;
    else if (status === "paratype") return 1;
    else if (status === "registered voucher") return 2;
    else return 3;
  }

  const markers: Marker<SpecimenMapMarker>[] =
    data?.species.mapping.specimens.map((specimen) => ({
      latitude: specimen.latitude,
      longitude: specimen.longitude,
      tooltip: specimen.institutionCode
        ? `${specimen.institutionCode} ${specimen.collectionRepositoryId}`
        : "not registered",
      color: getVoucherRGBA(200, specimen.typeStatus, specimen.collectionRepositoryId),
      renderLayer: getRenderLayer(specimen.typeStatus, specimen.collectionRepositoryId),
      data: specimen,
    })) ?? [];

  function onMarkerClick(marker: SpecimenMapMarker) {
    handlers.set(marker);
  }

  return (
    <Paper>
      <Title order={3}>Interactive specimen explorer</Title>
      <Grid>
        <Grid.Col span={7}>
          <Paper pos="relative" radius="xl" style={{ overflow: "hidden" }} h="100%">
            <LoadOverlay visible={loading} error={error} />
            <AnalysisMap markers={markers} onMarkerClick={onMarkerClick} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack>
            <HolotypeCard />
            <SpecimenCard entityId={selectedSpecimen?.entityId} />
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
    variables: { entityId: overviewResult.data?.species.overview.specimens.holotypeEntityId },
  });

  const collection = data?.specimen.collections[0];
  const accession = data?.specimen.accessions[0];

  return (
    <LoadPanel visible={loading} error={error} radius="xl" p="lg" bg="bushfire.0">
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
          <Image w={200} h={200} src="/icons/specimen-type/holotype_neotype_syntype.svg" alt="Holotype badge" />
          <Button bg="midnight.9" radius="xl">
            record history
          </Button>
        </Stack>
      </Group>
    </LoadPanel>
  );
}

function SpecimenCard({ entityId }: { entityId?: string }) {
  const { loading, error, data } = useQuery<SpecimenCardQuery>(GET_SPECIMEN_CARD, {
    skip: !entityId,
    variables: { entityId },
  });

  const collection = data?.specimen.collections[0];
  const accession = data?.specimen.accessions[0];

  return (
    <LoadPanel visible={loading} error={error} radius="xl" p="lg" withBorder>
      <Title order={4}>Specimen</Title>

      <Table variant="vertical" withRowBorders={false} className={classes.cardTable}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>Registration number</Table.Th>
            <Table.Td>{accession?.collectionRepositoryId}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Institution</Table.Th>
            <Table.Td>{accession?.institutionCode}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Specimen status</Table.Th>
            <Table.Td>{data && getVoucherStatus(accession?.typeStatus, accession?.collectionRepositoryId)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Preparation type</Table.Th>
            <Table.Td>{accession?.preparation}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Collection location</Table.Th>
            <Table.Td>{collection?.locality}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Coordinates</Table.Th>
            <Table.Td>
              {collection?.latitude} {collection?.longitude}
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Collected by</Table.Th>
            <Table.Td>{collection?.collectedBy}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Identified by</Table.Th>
            <Table.Td>{accession?.identifiedBy}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </LoadPanel>
  );
}

function AllSpecimens() {
  const { details } = { ...useSpecies() };

  const { loading, error, data } = useQuery<SpecimensQuery>(GET_SPECIMENS, {
    skip: !details,
    variables: { canonicalName: details?.name, page: 1, pageSize: 100 },
  });

  const specimens = data?.species.specimens;

  return (
    <LoadPanel visible={loading} error={error} radius="lg" p="lg" bg="shellfishBg.0" mih={500}>
      <Stack>
        <Title order={3} c="shellfish">
          All specimens
        </Title>

        <Group>
          <Text fw={700} fz="xs" c="midnight.9">
            Showing {specimens?.records.length} of {specimens?.total}
          </Text>
        </Group>

        <ScrollArea h={700} type="always" style={{ borderRadius: "var(--mantine-radius-lg)" }}>
          <RecordTable
            radius="lg"
            columns={[
              <RecordTable.Column key="voucher" label="Voucher status" sorting={SortOrder.Ascending} />,
              <RecordTable.Column key="id" label="Specimen number" />,
              <RecordTable.Column key="institution" label="Institution" />,
              <RecordTable.Column key="country" label="Country" />,
              <RecordTable.Column key="date" label="Collection date" />,
              <RecordTable.Column key="score" label="Collection metadata score" />,
              <RecordTable.Column key="genomes" label="Whole genomes" width={1} color="shellfishBg.0" />,
              <RecordTable.Column key="loci" label="Single loci" width={1} />,
              <RecordTable.Column key="other" label="Other genetic data" width={1} color="shellfishBg.0" />,
              <RecordTable.Column key="view" label="View full record" width={1} />,
              <RecordTable.Column key="ala" label="View in ALA" width={1} />,
            ]}
          >
            {specimens?.records.map((record) => (
              <RecordTable.Row key={record.entityId}>
                <AttributePillValue
                  value={getVoucherStatus(record.typeStatus, record.collectionRepositoryId)}
                  color={getVoucherColour(record.typeStatus, record.collectionRepositoryId)}
                  textColor="white"
                  popoverDisabled
                />
                <Text fw={600} c="midnight">
                  {record.collectionRepositoryId}
                </Text>
                {record.institutionCode}
                {record.country}
                {record.collectedAt &&
                  DateTime.fromISO(record.collectedAt).toLocaleString({
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                <SmallScore specimen={record} />
                <DataCheckIcon value={record.fullGenomes} />
                <DataCheckIcon value={record.loci} />
                <DataCheckIcon value={record.otherGenomic} />
                <Button color="midnight.9" radius="lg">
                  <IconMicroscope />
                </Button>
                <Button color="shellfish" variant="outline" bg="white" radius="lg">
                  <IconMicroscope />
                </Button>
              </RecordTable.Row>
            ))}
          </RecordTable>
        </ScrollArea>
      </Stack>
    </LoadPanel>
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

function DataCheckIcon({ value }: { value?: number | string | boolean | null | undefined }) {
  const theme = useMantineTheme();
  const size = 35;

  return (
    <Paper radius="xl" p={0} m={0} h={size} w={size}>
      {value ? <IconCircleCheck color={theme.colors.moss[5]} size={size} /> : <IconCircleX color="red" size={size} />}
    </Paper>
  );
}

function SmallScore({ specimen }: { specimen: SpecimenSummary }) {
  const isRegistered = specimen.collectionRepositoryId;
  const hasCollectionData = specimen.collectedAt && specimen.latitude && specimen.longitude;
  const hasGenomicData = specimen.sequences && specimen.sequences > 0;

  return (
    <Center>
      <Paper radius="xl" c="moss" p={8} px="lg" className={classes.scoreContainer} withBorder>
        <Group gap={10}>
          <SmallScorePip value={!!isRegistered} yes="Specimen is registered" no="Specimen is not registered" />
          <SmallScorePip
            value={!!hasCollectionData}
            yes="Specimen has full collection data"
            no="Specimen does not have full collection data"
          />
          <SmallScorePip
            value={!!hasGenomicData}
            yes="Specimen has linked genetic data"
            no="Specimen does not have linked genetic data"
          />
        </Group>
      </Paper>
    </Center>
  );
}

interface SmallScorePipProps {
  value: boolean;
  yes: string;
  no: string;
}

function SmallScorePip({ value, yes, no }: SmallScorePipProps) {
  return (
    <Tooltip position="bottom" label={value ? yes : no} withArrow>
      <motion.svg width={20} height={20} whileHover={{ scale: 2.0 }}>
        <circle cx={10} cy={10} r={5} className={value ? classes.scoreYes : classes.scoreNo} />
      </motion.svg>
    </Tooltip>
  );
}
