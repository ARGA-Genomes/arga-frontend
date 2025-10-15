"use client";

import {
  Grid,
  Paper,
  Skeleton,
  Stack,
  Title,
  Text,
  ScrollArea,
  Group,
  Button,
  Center,
  Divider,
  Box,
  useMantineTheme,
  Container,
} from "@mantine/core";
import classes from "./page.module.css";

import { useSpecies } from "@/app/species-provider";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import {
  AssemblyDetails,
  Library,
  NameDetails,
  Specimen,
} from "@/generated/types";
import { DataTable } from "@/components/data-table";
import { DateTime } from "luxon";
import { Pill } from "@/components/Pills";
import {
  IconCircleCheck,
  IconCircleX,
  IconCloudUpload,
  IconDownload,
  IconLink,
  IconMicroscope,
  IconSearch,
} from "@tabler/icons-react";
import { AnalysisMap } from "@/components/mapping";
import { DataField } from "@/components/data-fields";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import {
  IconAnnotation,
  IconAssembly,
  IconChromosomes,
  IconContigs,
  IconDeposition,
  IconHiC,
  IconLibrary,
  IconScaffolds,
} from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { LibrarySlide } from "@/components/slides/Library";
import { MAX_WIDTH } from "@/app/constants";

const GET_ASSEMBLY = gql`
  query Assembly($entityId: String) {
    assembly(by: { entityId: $entityId }) {
      ...AssemblyDetails

      name {
        canonicalName
        authorship
      }

      specimens {
        entityId
      }

      libraries {
        ...LibraryDetails
      }
    }
  }
`;

type Assembly = AssemblyDetails & {
  name: Pick<NameDetails, "canonicalName" | "authorship">;
  specimens: Pick<Specimen, "entityId">;
  libraries: Library[];
};

type AssemblyQuery = {
  assembly: Assembly;
};

const GET_ASSEMBLIES = gql`
  query SpeciesAssemblies($canonicalName: String, $page: Int, $pageSize: Int) {
    species(canonicalName: $canonicalName) {
      assemblies(page: $page, pageSize: $pageSize) {
        total
        records {
          entityId
          assemblyId
          size
          type
          eventDate
        }
      }
    }
  }
`;

type AssemblyOverview = Pick<
  AssemblyDetails,
  "entityId" | "assemblyId" | "size" | "type" | "eventDate"
>;

type SpeciesAssembliesQuery = {
  species: {
    assemblies: {
      total: number;
      records: AssemblyOverview[];
    };
  };
};

export default function Page() {
  const [assembly, setAssembly] = useState<AssemblyOverview | undefined>(
    undefined,
  );

  return (
    <Stack gap="xl">
      <Overview />

      {assembly?.entityId && (
        <>
          <Container maw={MAX_WIDTH}>
            <Viewer entityId={assembly.entityId} />
          </Container>
          <Provenance entityId={assembly.entityId} />
        </>
      )}

      <AllAssemblies onSelected={setAssembly} />
    </Stack>
  );
}

function Overview() {
  const { details } = { ...useSpecies() };

  const { loading, error, data } = useQuery<SpeciesAssembliesQuery>(
    GET_ASSEMBLIES,
    {
      skip: !details,
      variables: { canonicalName: details?.name, page: 1, pageSize: 10 },
    },
  );

  return (
    <Paper radius="lg" bg="wheatBg.0">
      <Container maw={MAX_WIDTH} py="xl">
        <Title order={3} c="wheat">
          Genomic overview
        </Title>

        <Grid>
          <Grid.Col span={2}>
            <Skeleton
              visible={loading}
              radius="md"
              className={classes.skeletonOverview}
            >
              <Paper
                radius="lg"
                p={20}
                bg="wheatBg.0"
                withBorder
                style={{ borderColor: "var(--mantine-color-wheatBg-1)" }}
              >
                <Stack>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    INSDC reference genome available
                  </Text>
                  <Group>
                    <Text my="auto" fw={700} c="midnight" fz="xs">
                      Total number of assemblies
                    </Text>
                    <Text fz="xs" fw={700}>
                      <Pill.StandardNumber
                        variant="overview"
                        value={data?.species.assemblies.total}
                      />
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Skeleton>
          </Grid.Col>
          <Grid.Col span={10}>
            <ScrollArea>
              <Stack>
                {data?.species.assemblies.records.map((record) => (
                  <OverviewItem key={record.entityId} assembly={record} />
                ))}
              </Stack>
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Container>
    </Paper>
  );
}

function OverviewItem({ assembly }: { assembly: AssemblyOverview }) {
  return (
    <Paper
      className={classes.overviewItem}
      bg="wheatBg.0"
      radius="lg"
      px={20}
      py={10}
      withBorder
    >
      <Grid>
        <Grid.Col span={3}>
          <Group>
            Estimated size
            <Text fz="xs" fw={700}>
              <Pill.StandardText
                value={assembly.size?.toString()}
                variant="overview"
              />
            </Text>
          </Group>
        </Grid.Col>

        <Grid.Col span={3}>
          <Group>
            Estimation method
            <DataField />
          </Group>
        </Grid.Col>

        <Grid.Col span={3} className={classes.overviewItem}>
          <Group>
            Number of chromosomes
            <DataField />
          </Group>
        </Grid.Col>

        <Grid.Col span={3} className={classes.overviewItem}>
          <Group>
            Cell type
            <DataField />
          </Group>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Viewer({ entityId }: { entityId?: string }) {
  const { loading, error, data } = useQuery<AssemblyQuery>(GET_ASSEMBLY, {
    skip: !entityId,
    variables: { entityId },
  });

  const assembly = data?.assembly;
  if (!assembly) return <></>;

  return (
    <Paper>
      <Stack>
        <Group>
          <Title order={3}>Genome assembly viewer</Title>
          <Title order={4}>
            <Pill.Id value={assembly.assemblyId} />
          </Title>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Details assembly={assembly} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Statistics assembly={assembly} />
          </Grid.Col>
          <Grid.Col span={2}>
            <MetadataCheck assembly={assembly} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

function Details({ assembly }: { assembly: Assembly }) {
  const releaseDate =
    assembly.eventDate && DateTime.fromFormat(assembly.eventDate, "yyyy-mm-dd");

  return (
    <Stack>
      <Grid>
        <Grid.Col span={5}>
          <DataTable>
            <DataTable.RowValue label="Genome status">
              {assembly.representation}
            </DataTable.RowValue>
            <DataTable.RowValue label="Release type"></DataTable.RowValue>
            <DataTable.RowValue label="Assembly type">
              <Pill.AssemblyType value={assembly.type} />
            </DataTable.RowValue>
            <DataTable.RowValue label="Assembly name">
              {assembly.assemblyName}
            </DataTable.RowValue>
          </DataTable>
        </Grid.Col>

        <Grid.Col span={7}>
          <DataTable>
            <DataTable.RowValue label="Scientific name">
              <Pill.ScientificName name={assembly.name} />
            </DataTable.RowValue>
            <DataTable.RowValue label="Release date">
              {releaseDate?.toLocaleString({
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DataTable.RowValue>
            <DataTable.RowValue label="Sequencing platform">
              <Pill.StandardText />
            </DataTable.RowValue>
            <DataTable.RowValue label="Assembly method">
              <Pill.StandardText value={assembly.method} />
            </DataTable.RowValue>
          </DataTable>
        </Grid.Col>

        <Grid.Col span={3}>
          <DataAccess />
        </Grid.Col>
        <Grid.Col span={9}>
          <SpecimenDetails />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function DataAccess() {
  return (
    <Paper p="lg" radius="md" h="100%" withBorder>
      <Stack>
        <Title order={5}>Data access</Title>
        <Button
          radius="md"
          color="midnight.9"
          leftSection={<IconCircleCheck />}
        >
          add to list
        </Button>
        <Button radius="md" color="midnight.9" leftSection={<IconDownload />}>
          get data
        </Button>
        <Button
          radius="md"
          color="midnight.9"
          leftSection={<IconLink />}
          disabled
        >
          go to source
        </Button>
        <Button
          radius="md"
          color="midnight.9"
          leftSection={<IconCloudUpload />}
          disabled
        >
          send to Galaxy
        </Button>
      </Stack>
    </Paper>
  );
}

function SpecimenDetails() {
  return (
    <Paper p="lg" radius="md" bg="shellfishBg.0" h="100%">
      <Grid>
        <Grid.Col span={7}>
          <Stack h="100%">
            <Title order={5} c="shellfish">
              Specimen
            </Title>
            <DataTable>
              <DataTable.RowValue label="Sample ID"></DataTable.RowValue>
              <DataTable.RowValue label="Sample name"></DataTable.RowValue>
            </DataTable>
            <Button
              mt="auto"
              radius="md"
              variant="subtle"
              color="midnight.9"
              leftSection={<IconMicroscope />}
            >
              view specimen
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Paper
            pos="relative"
            radius="xl"
            style={{ overflow: "hidden" }}
            h="100%"
          >
            <AnalysisMap markers={[]} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Statistics({ assembly }: { assembly?: Assembly }) {
  return (
    <Paper p="lg" radius="md" bg="mossBg.0">
      <Title order={5} c="moss">
        Assembly statistics
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <StatisticItem label="Genome size">{assembly?.size}</StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Ungapped length">
            {assembly?.sizeUngapped}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Number of chromosomes"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Number of organelles"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={12}>
          <Divider size="sm" color="shellfishBg.1" />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Assembly level">
            {assembly?.level}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Genome coverage">
            {assembly?.coverage}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="GC percentage">
            {assembly?.guanineCytosinePercent}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="BUSCO score">
            {assembly?.completeness}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={12}>
          <Divider size="sm" color="shellfishBg.1" />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Number of scaffolds">
            {assembly?.numberOfScaffolds}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Scaffold N50"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Scaffold L50"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Number of contigs">
            {assembly?.numberOfContigs}
          </StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Contig N50"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Contig L50"></StatisticItem>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

interface StatisticItemProps {
  label: string;
  children?: React.ReactNode;
}

function StatisticItem({ label, children }: StatisticItemProps) {
  return (
    <Stack>
      <Text className={classes.statLabel}>{label}</Text>
      <Box ml="lg" className={classes.statValue}>
        {children}
      </Box>
    </Stack>
  );
}

function MetadataCheck({ assembly }: { assembly?: Assembly }) {
  return (
    <Paper p="lg" radius="md" bg="shellfishBg.0">
      <Stack>
        <Title order={5} c="shellfish">
          Metadata checker
        </Title>

        <DataCheck label="Specimen location" value={false} />
        <DataCheck label="Voucher accession" value={false} />
        <DataCheck label="Sequence read files" value={false} />
        <DataCheck label="Sequencing platform" value={false} />
        <DataCheck label="Assembly method" value={false} />
        <DataCheck label="Assembly statistics" value={false} />
        <DataCheck label="Genome publication" value={false} />
      </Stack>
    </Paper>
  );
}

function Provenance({ entityId }: { entityId: string }) {
  const [card, setCard] = useState(0);

  const { loading, error, data } = useQuery<AssemblyQuery>(GET_ASSEMBLY, {
    skip: !entityId,
    variables: { entityId },
  });

  const assembly = data?.assembly;
  if (!assembly) return <></>;

  return (
    <Stack>
      <Container w="100%" maw={MAX_WIDTH}>
        <Title order={3}>Assembly provenance timeline</Title>
      </Container>
      <TimelineNavbar onSelected={setCard}>
        <TimelineNavbar.Item
          label="Library preparation"
          icon={<IconLibrary size={60} />}
        />
        <TimelineNavbar.Item label="Contigs" icon={<IconContigs size={60} />} />
        <TimelineNavbar.Item
          label="Scaffolds"
          icon={<IconScaffolds size={60} />}
        />
        <TimelineNavbar.Item label="Hi-C" icon={<IconHiC size={60} />} />
        <TimelineNavbar.Item
          label="Chromosomes"
          icon={<IconChromosomes size={60} />}
        />
        <TimelineNavbar.Item
          label="Assemblies"
          icon={<IconAssembly size={60} />}
        />
        <TimelineNavbar.Item
          label="Annotations"
          icon={<IconAnnotation size={60} />}
        />
        <TimelineNavbar.Item
          label="Public release"
          icon={<IconDeposition size={60} />}
        />
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Library preparation" size="sm">
          <LibrarySlide libraries={assembly.libraries} />
        </CardSlider.Card>
        <CardSlider.Card title="Contigs" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Scaffolds" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Hi-C" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Chromosomes" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Assemblies" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Annotations" size="sm"></CardSlider.Card>
        <CardSlider.Card title="Public release" size="sm"></CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}

interface AllAssembliesProps {
  onSelected: (assembly: AssemblyOverview) => void;
}

function AllAssemblies({ onSelected }: AllAssembliesProps) {
  const { details } = { ...useSpecies() };

  const [pageSize, setPageSize] = useState<number>(100);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<SpeciesAssembliesQuery>(
    GET_ASSEMBLIES,
    {
      skip: !details,
      variables: { canonicalName: details?.name, page, pageSize },
    },
  );

  const assemblies = data?.species.assemblies;

  return (
    <Paper bg="shellfishBg.0">
      <Container maw={MAX_WIDTH} py="xl">
        <Stack>
          <Title order={3} c="shellfish">
            All genomes
          </Title>
          <ScrollArea>
            <Group wrap="nowrap">
              {assemblies?.records.map((assembly) => (
                <AssemblyItem
                  assembly={assembly}
                  key={assembly.assemblyId}
                  onSelected={onSelected}
                />
              ))}
            </Group>
          </ScrollArea>
        </Stack>
      </Container>
    </Paper>
  );
}

interface AssemblyItemProps {
  assembly: AssemblyOverview;
  onSelected: (assembly: AssemblyOverview) => void;
}

function AssemblyItem({ assembly, onSelected }: AssemblyItemProps) {
  const releaseDate =
    assembly.eventDate && DateTime.fromFormat(assembly.eventDate, "yyyy-mm-dd");

  return (
    <Paper
      radius="lg"
      py="xs"
      style={{ borderColor: "var(--mantine-color-shellfishBg-2)" }}
      withBorder
    >
      <Stack>
        <DataTable>
          <DataTable.RowValue label="Accession">
            {assembly.assemblyId}
          </DataTable.RowValue>
          <DataTable.RowValue label="Genome size">
            <Group>
              <Pill.Common value={assembly.size?.toString() ?? ""} />
            </Group>
          </DataTable.RowValue>
          <DataTable.RowValue label="Release date">
            {releaseDate?.toLocaleString({
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DataTable.RowValue>
        </DataTable>

        <Center>
          <Button
            leftSection={<IconSearch />}
            variant="subtle"
            c="midnight"
            color="midnight"
            onClick={() => onSelected(assembly)}
          >
            view record
          </Button>
        </Center>
      </Stack>
    </Paper>
  );
}

function DataCheck({ label, value }: { label: string; value: boolean }) {
  return (
    <Group wrap="nowrap">
      <DataCheckIcon value={value} />
      <Text fz="sm" fw={400} c="midnight.7">
        {label}
      </Text>
    </Group>
  );
}

function DataCheckIcon({
  value,
}: {
  value?: number | string | boolean | null | undefined;
}) {
  const theme = useMantineTheme();
  const size = 35;

  return (
    <Paper radius="xl" p={0} m={0} h={size} w={size}>
      {value ? (
        <IconCircleCheck color={theme.colors.moss[5]} size={size} />
      ) : (
        <IconCircleX color="red" size={size} />
      )}
    </Paper>
  );
}
