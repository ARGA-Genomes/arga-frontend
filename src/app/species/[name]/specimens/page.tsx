"use client";

import classes from "./page.module.css";

import { useSpecies } from "@/app/species-provider";
import { AreaGraphInput } from "@/components/AreaGraphInput";
import { AttributePillContainer, AttributePillValue } from "@/components/data-fields";
import { FilterGroup } from "@/components/filtering-redux/group";
import SimpleBarGraph from "@/components/graphing/SimpleBarGraph";
import SimpleVerticalBarGraph from "@/components/graphing/SimpleVerticalBarGraph";
import { LoadOverlay, LoadPanel } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";
import { Marker } from "@/components/mapping/analysis-map";
import { PaginationBar } from "@/components/pagination";
import { Pill } from "@/components/Pills";
import { RecordTable } from "@/components/RecordTable";
import { Species, Specimen, SpecimenMapMarker, SpecimenSummary } from "@/generated/types";
import { getVoucherColour, getVoucherRGBA, getVoucherStatus } from "@/helpers/colors";
import { getEnumKeyByValue, SortOrder } from "@/queries/common";
import {
  getFilterLabel,
  getFilterValues,
  HasData,
  SpecimenFilterItem,
  SpecimenOptions,
  SpecimenSortable,
  SpecimenSorting,
  StringValue,
  YearValue,
} from "@/queries/specimen";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Select,
  Skeleton,
  Stack,
  Table,
  TagsInput,
  Text,
  Title,
  Tooltip,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useSet, useStateHistory } from "@mantine/hooks";
import {
  IconAdjustments,
  IconCircleCheck,
  IconCircleX,
  IconDownload,
  IconMicroscope,
  IconX,
} from "@tabler/icons-react";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

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

const GET_SPECIMEN_CARD = gql`
  query SpecimenCard($entityId: String) {
    specimen(by: { entityId: $entityId }) {
      organismId

      collections {
        ...CollectionEventDetails
      }
      accessions {
        ...AccessionEventDetails
      }
      stats {
        ...SpecimenStatsDetails
      }
    }
  }
`;

type SpecimenCard = Pick<Specimen, "organismId" | "collections" | "accessions" | "stats">;
type SpecimenQuery = {
  specimen: SpecimenCard;
};

const GET_SPECIMENS = gql`
  query SpeciesSpecimens(
    $canonicalName: String
    $page: Int
    $pageSize: Int
    $filters: [SpecimenFilterItem]
    $sorting: SpecimenSorting
  ) {
    species(canonicalName: $canonicalName) {
      specimens(page: $page, pageSize: $pageSize, filters: $filters, sorting: $sorting) {
        total
        records {
          ...SpecimenSummary
        }
        options {
          institutions
          countries
        }
      }
    }
  }
`;

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
  const { loading, error, data } = useQuery<{ species: Species }>(GET_SPECIMENS_OVERVIEW, {
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
              <Grid gutter={50}>
                <Grid.Col span={2}>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    Total number of specimens
                  </Text>
                  <AttributePillContainer color="white" className={classes.pill}>
                    {specimens?.total}
                  </AttributePillContainer>
                </Grid.Col>
                <Grid.Col span={7}>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    Collection years
                  </Text>
                  <Box h={100}>{specimens && <CollectionYearsGraph data={specimens?.collectionYears} />}</Box>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Text fw={700} c="midnight" fz="xs" mb="sm">
                    Top 5 countries
                  </Text>
                  <Box h={100}>{specimens && <TopCountriesGraph data={specimens?.topCountries} />}</Box>
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
  const [selectedSpecimen, handlers] = useStateHistory<SpecimenMapMarker | null>(null);

  const { loading, error, data } = useQuery<{ species: Species }>(GET_SPECIMEN_MAP_MARKERS, {
    variables: { canonicalName: name },
  });

  // sort the map markers so that holotypes and other more uncommon types are rendered last
  function getRenderLayer(typeStatus?: string | null, collectionRepositoryId?: string | null) {
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
      <Title order={3} mb="lg">
        Interactive specimen explorer
      </Title>

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

  const overviewResult = useQuery<{ species: Species }>(GET_SPECIMENS_OVERVIEW, {
    skip: !details,
    variables: { canonicalName: details?.name },
  });

  const { loading, error, data } = useQuery<{ specimen: Specimen }>(GET_SPECIMEN_CARD, {
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
  const { loading, error, data } = useQuery<SpecimenQuery>(GET_SPECIMEN_CARD, {
    skip: !entityId,
    variables: { entityId },
  });

  const collection = data?.specimen.collections[0];
  const accession = data?.specimen.accessions[0];
  const stats = data?.specimen.stats;

  return (
    <LoadPanel visible={loading} error={error} radius="xl" p="lg" withBorder>
      <Title order={4}>Specimen</Title>

      <Group wrap="nowrap">
        <Table variant="vertical" withRowBorders={false} className={classes.cardTable}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Catalogue number</Table.Th>
              <Table.Td>
                <Group>
                  <Link href={`/organisms/${data?.specimen.organismId}/source`}>
                    <Pill.SpecimenRegistration accession={accession} />
                  </Link>
                </Group>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Institution</Table.Th>
              <Table.Td>{accession?.institutionCode}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Specimen status</Table.Th>
              <Table.Td>
                <Group>{data && <Pill.SpecimenStatus accession={accession} />}</Group>
              </Table.Td>
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

        {data && (
          <Paper bg="moss.1" p="lg" radius="xl" w={300}>
            <Stack gap="xs">
              <Text fw={600} fz={18}>
                Data indexed
              </Text>
              <Group wrap="nowrap" justify="space-between" ml="sm">
                <Text fz="md" fw={600} c="midnight.8">
                  Genome
                </Text>
                <DataCheckIcon value={stats?.fullGenomes} />
              </Group>
              <Group wrap="nowrap" justify="space-between" ml="sm">
                <Text fz="md" fw={600} c="midnight.8">
                  Libraries
                </Text>
                <DisabledDataCheckIcon />
              </Group>
              <Group wrap="nowrap" justify="space-between" ml="sm">
                <Text fz="md" fw={600} c="midnight.8">
                  Single loci
                </Text>
                <DataCheckIcon value={stats?.loci} />
              </Group>
              <Group wrap="nowrap" justify="space-between" ml="sm">
                <Text fz="md" fw={600} c="midnight.8">
                  SNPs
                </Text>
                <DisabledDataCheckIcon />
              </Group>
              <Group wrap="nowrap" justify="space-between" ml="sm">
                <Text fz="md" fw={600} c="midnight.8">
                  Other
                </Text>
                <DataCheckIcon value={stats?.otherGenomic} />
              </Group>
            </Stack>
          </Paper>
        )}
      </Group>
    </LoadPanel>
  );
}

function AllSpecimens() {
  const { details } = { ...useSpecies() };
  const [opened, setOpened] = useState(false);
  const [filters, setFilters] = useState<SpecimenFilterItem[]>([]);
  const [sorting, setSorting] = useState<SpecimenSorting>({
    sortable: SpecimenSortable.Status,
    order: SortOrder.Ascending,
  });
  const [pageSize, setPageSize] = useState<number>(100);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<{ species: Species }>(GET_SPECIMENS, {
    skip: !details,
    variables: { canonicalName: details?.name, page, pageSize, filters, sorting },
  });

  const specimens = data?.species.specimens;

  function removeFilter(filter: SpecimenFilterItem) {
    const newFilters = filters.filter((f) => f != filter);
    setFilters(newFilters);
  }

  return (
    <LoadPanel visible={loading} error={error} radius="lg" p="lg" bg="shellfishBg.0" mih={500}>
      <Stack>
        <Title order={3} c="shellfish">
          All specimens
        </Title>

        <Group justify="space-between">
          <Group gap="xl">
            <Text fw={700} fz="xs" c="midnight.9">
              Showing {specimens?.records.length} of {specimens?.total} specimens
            </Text>

            {filters.length && (
              <Group>
                <Text fw={700} fz="xs" c="midnight.9">
                  Filters:
                </Text>
                {filters.map((filter) => (
                  <FilterBadge filter={filter} onRemove={removeFilter} key={Object.keys(filter).join()} />
                ))}
              </Group>
            )}
          </Group>

          <Group>
            <Select
              size="xs"
              color="midnight.7"
              radius="xl"
              data={[
                { value: "20", label: "20 records" },
                { value: "50", label: "50 records" },
                { value: "100", label: "100 records" },
              ]}
              defaultValue="100"
              readOnly={false}
              onChange={(value) => {
                setPage(1);
                if (value) setPageSize(parseInt(value, 10));
              }}
            />

            <Button
              size="xs"
              color="midnight.7"
              radius="xl"
              variant={opened ? "filled" : "outline"}
              leftSection={<IconAdjustments size="1rem" />}
              onClick={() => setOpened(!opened)}
            >
              Filters
            </Button>

            <Button variant="subtle" color="mantine.7" radius="xl" disabled>
              <Stack gap={0}>
                <Center>
                  <IconDownload size={16} />
                </Center>
                <Text fz="xs" fw={500}>
                  Download
                </Text>
              </Stack>
            </Button>
          </Group>
        </Group>

        <Box h={700}>
          <FilterDrawer opened={opened} onClose={() => setOpened(false)}>
            <Filter
              filters={filters}
              options={specimens?.options}
              onApply={(filters) => {
                setOpened(false);
                setFilters(filters);
              }}
            />
          </FilterDrawer>

          <ScrollArea h="inherit" type="always" style={{ borderRadius: "var(--mantine-radius-lg)" }}>
            <SpecimenTable specimens={specimens?.records} sorting={sorting} onSort={setSorting} />
          </ScrollArea>
        </Box>

        <PaginationBar total={specimens?.total} page={page} pageSize={pageSize} onChange={setPage} />
      </Stack>
    </LoadPanel>
  );
}

interface SpecimenTableProps {
  specimens?: SpecimenSummary[];
  sorting: SpecimenSorting;
  onSort: (sorting: SpecimenSorting) => void;
}

function SpecimenTable({ specimens, sorting, onSort }: SpecimenTableProps) {
  return (
    <RecordTable
      radius="lg"
      onSort={onSort}
      sorting={sorting}
      columns={[
        <RecordTable.Column key={1} value={SpecimenSortable.Status} label="Voucher status" />,
        <RecordTable.Column key={2} value={SpecimenSortable.Voucher} label="Specimen number" />,
        <RecordTable.Column key={3} value={SpecimenSortable.Institution} label="Institution" />,
        <RecordTable.Column key={4} value={SpecimenSortable.Country} label="Country" />,
        <RecordTable.Column key={5} value={SpecimenSortable.CollectionDate} label="Collection date" />,
        <RecordTable.Column key={6} value={SpecimenSortable.MetadataScore} label="Collection metadata score" />,
        <RecordTable.Column
          key={7}
          value={SpecimenSortable.Genomes}
          label="Whole genomes"
          width={1}
          color="shellfishBg.0"
        />,
        <RecordTable.Column key={8} value={SpecimenSortable.Loci} label="Single loci" width={1} />,
        <RecordTable.Column
          key={9}
          value={SpecimenSortable.GenomicData}
          label="Other genetic data"
          width={1}
          color="shellfishBg.0"
        />,
        <RecordTable.Column key={10} value="view" label="View full record" width={1} />,
        <RecordTable.Column key={11} value="ala" label="View in ALA" width={1} />,
      ]}
    >
      {specimens?.map((record) => (
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
          <Link href={`/organisms/${record.organismId}/source`}>
            <Button color="midnight.9" radius="lg">
              <IconMicroscope />
            </Button>
          </Link>
          <Button color="shellfish" variant="outline" bg="white" radius="lg">
            <IconMicroscope />
          </Button>
        </RecordTable.Row>
      ))}
    </RecordTable>
  );
}

interface FilterDrawerProps extends PropsWithChildren {
  opened: boolean;
  onClose: () => void;
}

function FilterDrawer({ opened, onClose, children }: FilterDrawerProps) {
  return (
    <Transition mounted={opened} transition="fade-left" duration={200}>
      {(styles) => (
        <Box className={classes.filterDrawer} style={styles} onClick={onClose}>
          <Paper shadow="xl" p="lg" w="30%" className={classes.filterPane} onClick={(e) => e.stopPropagation()}>
            {children}
          </Paper>
        </Box>
      )}
    </Transition>
  );
}

interface FilterProps {
  filters?: SpecimenFilterItem[];
  options?: SpecimenOptions;
  onApply: (filters: SpecimenFilterItem[]) => void;
}

function Filter({ filters, options, onApply }: FilterProps) {
  const hasData = useSet<HasData>(filters?.find((f) => "data" in f)?.data);
  const institutions = useSet<string>(filters?.find((f) => "institution" in f)?.institution);
  const countries = useSet<string>(filters?.find((f) => "country" in f)?.country);

  // none of the methods to save the filter settings is pretty here but this
  // one is particularly eggregious. it would be worth rethinking this
  const collectedBetween = filters?.find((f) => "collectedBetween" in f)?.collectedBetween;
  const [yearRange, setYearRange] = useState<[number, number] | undefined>(
    collectedBetween
      ? [
          DateTime.fromFormat(collectedBetween.after, "yyyy-mm-dd").year,
          DateTime.fromFormat(collectedBetween.before, "yyyy-mm-dd").year,
        ]
      : undefined,
  );

  function setData(values: string[]) {
    hasData.clear();
    for (const value of values) {
      const filter = getEnumKeyByValue(HasData, value);
      if (filter) {
        hasData.add(HasData[filter]);
      }
    }
  }

  function setInstitutions(values: string[]) {
    institutions.clear();
    for (const value of values) {
      institutions.add(value);
    }
  }

  function setCountries(values: string[]) {
    countries.clear();
    for (const value of values) {
      countries.add(value);
    }
  }

  function applyFilters() {
    const filters = [];
    if (hasData.size) filters.push({ data: [...hasData] });
    if (institutions.size) filters.push({ institution: [...institutions] });
    if (countries.size) filters.push({ country: [...countries] });
    if (yearRange)
      filters.push({ collectedBetween: { after: `${yearRange[0]}-12-31`, before: `${yearRange[1]}-01-01` } });

    onApply(filters);
  }

  return (
    <Stack h="100%">
      <ScrollArea h="100%">
        <Stack>
          <FilterGroup
            title="Data types"
            description="Data derived from specimens"
            icon="/icons/data-type/Data type_ DNA.svg"
          >
            <Checkbox.Group value={[...hasData]} onChange={setData}>
              <Stack pt="md" gap="xs">
                <Checkbox.Card className={classes.checkbox} radius="xl" value={HasData.Genomes}>
                  <Group wrap="nowrap" align="flex-start">
                    <Checkbox.Indicator color="moss.3" />
                    <div>
                      <Text className={classes.checkboxLabel}>Genomes</Text>
                      <Text className={classes.checkboxDescription}>
                        Include specimens that have at least on full genome that has been derived from it
                      </Text>
                    </div>
                  </Group>
                </Checkbox.Card>

                <Checkbox.Card className={classes.checkbox} radius="xl" value={HasData.Loci}>
                  <Group wrap="nowrap" align="flex-start">
                    <Checkbox.Indicator color="moss.3" />
                    <div>
                      <Text className={classes.checkboxLabel}>Loci</Text>
                      <Text className={classes.checkboxDescription}>
                        Include specimens that have at least on loci that has been derived from it
                      </Text>
                    </div>
                  </Group>
                </Checkbox.Card>

                <Checkbox.Card className={classes.checkbox} radius="xl" value={HasData.GenomicData}>
                  <Group wrap="nowrap" align="flex-start">
                    <Checkbox.Indicator color="moss.3" />
                    <div>
                      <Text className={classes.checkboxLabel}>Genomic data</Text>
                      <Text className={classes.checkboxDescription}>
                        Include specimens that have any genomic data that has been derived from it
                      </Text>
                    </div>
                  </Group>
                </Checkbox.Card>
              </Stack>
            </Checkbox.Group>
          </FilterGroup>

          <FilterGroup
            title="Collection"
            description="Specimen collection details"
            icon="/icons/specimen-listing/Specimen listing_ collection.svg"
          >
            <TagsInput
              label="Institution"
              placeholder="Pick one or more institutions"
              description="The institution that hosts the specimen"
              data={options?.institutions}
              value={[...institutions]}
              onChange={setInstitutions}
              radius="lg"
              clearable
            />

            <TagsInput
              label="Country"
              placeholder="Pick one or more countries"
              description="The country where a specimen was collected from"
              data={options?.countries}
              value={[...countries]}
              onChange={setCountries}
              radius="lg"
              clearable
            />

            <YearRangeInput
              label="Collection date"
              description="Only include specimens collected within the specified years"
              value={yearRange}
              onChange={setYearRange}
            />
          </FilterGroup>
        </Stack>
      </ScrollArea>

      <Button onClick={applyFilters} radius="lg" color="midnight.9">
        Filter specimens
      </Button>
    </Stack>
  );
}

interface YearRangeInputProps {
  label?: string;
  description?: string;
  value?: [number, number];
  onChange?: (range: [number, number]) => void;
}
function YearRangeInput({ label, description, value, onChange }: YearRangeInputProps) {
  // for the collection years to restrict the range for the collection date range filter.
  // this uses the existing overview query which should already be cached on this page
  const { details } = { ...useSpecies() };
  const { data } = useQuery<{ species: Species }>(GET_SPECIMENS_OVERVIEW, {
    skip: !details,
    variables: { canonicalName: details?.name },
  });

  const specimens = data?.species.overview.specimens;

  return (
    specimens && (
      <AreaGraphInput
        label={label}
        description={description}
        value={value}
        data={specimens.collectionYears}
        getX={(d) => d.year}
        getY={(d) => d.value}
        onChange={onChange}
      />
    )
  );
}

interface FilterBadgeProps {
  filter: SpecimenFilterItem;
  onRemove: (filter: SpecimenFilterItem) => void;
}

function FilterBadge({ filter, onRemove }: FilterBadgeProps) {
  const [highlight, setHighlight] = useState(false);

  return (
    <Group wrap="nowrap" gap={0}>
      <Paper px="sm" className={highlight ? classes.filterBadgeLabelHover : classes.filterBadgeLabel}>
        <Text fz="xs">{getFilterLabel(filter)}</Text>
      </Paper>
      <Paper pl="sm" pr={5} className={highlight ? classes.filterBadgeValueHover : classes.filterBadgeValue}>
        <Group gap="xs">
          <Text fz="xs" fw={300}>
            {getFilterValues(filter)}
          </Text>
          <IconX
            size={10}
            onClick={() => onRemove(filter)}
            className={classes.filterBadgeRemove}
            onMouseOver={() => setHighlight(true)}
            onMouseOut={() => setHighlight(false)}
          />
        </Group>
      </Paper>
    </Group>
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

interface TopCountriesGraphProps {
  data: StringValue<number>[];
}

function TopCountriesGraph({ data }: TopCountriesGraphProps) {
  return (
    <ParentSize>
      {(parent) => {
        const xScale = scaleLinear({
          range: [0, parent.width],
          domain: [0, max(data, (d) => d.value) ?? 0],
        });

        const yScale = scaleBand({
          range: [0, parent.height - 20],
          domain: data.map((stat) => stat.label),
          padding: 0.4,
        });

        return (
          <SimpleVerticalBarGraph
            width={parent.width}
            height={parent.height}
            xScale={xScale}
            yScale={yScale}
            data={data}
            getX={(d: StringValue<number>) => d.value}
            getY={(d: StringValue<number>) => d.label}
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

function DisabledDataCheckIcon() {
  const size = 35;

  return (
    <Paper bg="lightgrey" radius="xl" p={0} m={0} h={size} w={size}>
      <IconCircleX color="grey" size={size} />
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
            yes="Specimen has date and location details"
            no="Specimen does not have date and location details"
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
