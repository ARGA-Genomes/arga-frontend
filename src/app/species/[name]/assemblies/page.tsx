"use client";

import { Grid, Paper, Skeleton, Stack, Title, Text, ScrollArea, Group, Button, Center, Divider } from "@mantine/core";
import classes from "./page.module.css";

import { useSpecies } from "@/app/species-provider";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { AssemblyDetails } from "@/generated/types";
import { DataTable } from "@/components/data-table";
import { DateTime } from "luxon";
import { Pill } from "@/components/Pills";
import { IconSearch } from "@tabler/icons-react";

const GET_ASSEMBLY = gql`
  query Assembly($entityId: String) {
    assembly(entityId: $entityId) {
      assemblyId
      size
      type
      eventDate
    }
  }
`;

type Assembly = Pick<AssemblyDetails, "assemblyId" | "size" | "type" | "eventDate">;

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

type AssemblyOverview = Pick<AssemblyDetails, "entityId" | "assemblyId" | "size" | "type" | "eventDate">;

type SpeciesAssembliesQuery = {
  species: {
    assemblies: {
      total: number;
      records: AssemblyOverview[];
    };
  };
};

export default function Page() {
  const [assembly, setAssembly] = useState<AssemblyOverview | undefined>(undefined);

  return (
    <Stack gap="xl">
      <Overview />
      <Viewer entityId={assembly?.entityId} />
      <AllAssemblies onSelected={setAssembly} />
    </Stack>
  );
}

function Overview() {
  return (
    <Paper radius="lg" p={20} bg="wheatBg.0">
      <Title order={3} c="wheat">
        Genomic overview
      </Title>

      <Grid>
        <Grid.Col span={2}>
          <Skeleton visible={false} radius="md" className={classes.skeletonOverview}>
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
                <Text fw={700} c="midnight" fz="xs" mb="sm">
                  Total number of assemblies
                </Text>
              </Stack>
            </Paper>
          </Skeleton>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Viewer({ entityId }: { entityId?: string }) {
  const { loading, error, data } = useQuery<AssemblyQuery>(GET_ASSEMBLIES, {
    skip: !entityId,
    variables: { entityId },
  });

  const assembly = data?.assembly;

  return (
    <Paper>
      <Stack>
        <Group>
          <Title order={3}>Genome assembly viewer</Title>
          <Pill.IdTitle value={assembly?.assemblyId} />
        </Group>

        <Grid>
          <Grid.Col span={5}></Grid.Col>
          <Grid.Col span={5}>
            <Statistics assembly={assembly} />
          </Grid.Col>
          <Grid.Col span={2}></Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

function Statistics({ assembly }: { assembly?: Assembly }) {
  return (
    <Paper p="lg" radius="md" bg="moss.0">
      <Title order={5} c="moss">
        Assembly statistics
      </Title>
      <Grid>
        <Grid.Col span={3}>
          <StatisticItem label="Genome size"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Ungapped length"></StatisticItem>
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
          <StatisticItem label="Assembly level"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="Genome coverage"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="GC percentage"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={3}>
          <StatisticItem label="BUSCO score"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={12}>
          <Divider size="sm" color="shellfishBg.1" />
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Number of scaffolds"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Scaffold N50"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Scaffold L50"></StatisticItem>
        </Grid.Col>
        <Grid.Col span={4}>
          <StatisticItem label="Number of contigs"></StatisticItem>
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
      <Center>{children}</Center>
    </Stack>
  );
}

interface AllAssembliesProps {
  onSelected: (assembly: AssemblyOverview) => void;
}

function AllAssemblies({ onSelected }: AllAssembliesProps) {
  const { details } = { ...useSpecies() };
  if (!details) return;

  const [pageSize, setPageSize] = useState<number>(100);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<SpeciesAssembliesQuery>(GET_ASSEMBLIES, {
    skip: !details,
    variables: { canonicalName: details?.name, page, pageSize },
  });

  const assemblies = data?.species.assemblies;

  return (
    <Paper p="xl" bg="shellfishBg.0">
      <Stack>
        <Title order={3} c="shellfish">
          All genomes
        </Title>
        <ScrollArea>
          <Group wrap="nowrap">
            {assemblies?.records.map((assembly) => (
              <AssemblyItem assembly={assembly} key={assembly.assemblyId} onSelected={onSelected} />
            ))}
          </Group>
        </ScrollArea>
      </Stack>
    </Paper>
  );
}

interface AssemblyItemProps {
  assembly: AssemblyOverview;
  onSelected: (assembly: AssemblyOverview) => void;
}

function AssemblyItem({ assembly, onSelected }: AssemblyItemProps) {
  const releaseDate = assembly.eventDate && DateTime.fromFormat(assembly.eventDate, "yyyy-mm-dd");

  return (
    <Paper radius="lg" py="xs" style={{ borderColor: "var(--mantine-color-shellfishBg-2)" }} withBorder>
      <Stack>
        <DataTable>
          <DataTable.RowValue label="Accession">{assembly.assemblyId}</DataTable.RowValue>
          <DataTable.RowValue label="Genome size">
            <Group>
              <Pill.Common value={assembly.size ?? ""} />
            </Group>
          </DataTable.RowValue>
          <DataTable.RowValue label="Release date">
            {releaseDate?.toLocaleString({ year: "numeric", month: "long", day: "numeric" })}
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
