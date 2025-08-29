import { DocumentNode, OperationVariables, useLazyQuery } from "@apollo/client";
import {
  ActionIcon,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconArrowUpRight,
  IconDna2Off,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

// Local components
import { get, range } from "lodash-es";
import { FiltersDrawer } from "./filtering-redux/drawer";
import { FilterItem } from "./filtering-redux/filters/common";
import { PaginationBar, PaginationSize } from "./pagination";
import { DataItem, SpeciesCard } from "./species-card";
import { TableCardLayout, TableCardSwitch } from "./table-card-switch";

import { SpeciesCardPage, SpeciesCard as SpeciesCardType } from "@/generated/types";
import { generateCSV } from "@/helpers/downloadCSV";
import { saveAs } from "file-saver";
import Link from "next/link";
import classes from "./browse-species.module.css";
import { ExternalLinkButton } from "./button-link-external";
import { DownloadButton } from "./download-btn";
import { VernacularGroupChip } from "./icon-bar";

interface BrowseSpeciesProps {
  query: {
    content: DocumentNode;
    download: DocumentNode;
    variables?: OperationVariables;
  };
}

enum Sort {
  ScientificName = "SCIENTIFIC_NAME",
  CanonicalName = "CANONICAL_NAME",
  ClassificationHierarchy = "CLASSIFICATION_HIERARCHY",
  Genomes = "GENOMES",
  Loci = "LOCI",
  Specimens = "SPECIMENS",
  Other = "OTHER",
  TotalGenomic = "TOTAL_GENOMIC",
}

enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

interface TableHeader {
  name: string;
  description: string;
  sort?: Sort;
  span: number;
}

const TABLE_HEADERS: TableHeader[] = [
  { name: "Species name", description: "Name of the species", sort: Sort.ScientificName, span: 2 },
  { name: "Group", description: "Informal grouping of this species", span: 1 },
  { name: "Genomes", description: "Number of genome assemblies for this species", sort: Sort.Genomes, span: 1 },
  { name: "Libraries", description: "Number of genome libraries for this species", sort: Sort.Other, span: 1 },
  { name: "Loci", description: "Number of loci for this species", sort: Sort.Loci, span: 1 },
  { name: "Specimens", description: "Number of specimens for this species", sort: Sort.Specimens, span: 1 },
];

export function BrowseSpecies({ query }: BrowseSpeciesProps) {
  const [data, setData] = useState<SpeciesCardPage>();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort>(Sort.ScientificName);
  const [sortDir, setSortDir] = useState<boolean>(true);

  const [layout, setLayout] = useState<TableCardLayout>("card");
  const [pageSize, setPageSize] = useState<number>(layout === "card" ? 10 : 100);

  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [filterChips, setFilterChips] = useState<ReactElement[] | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  // Species query
  const [, { loading, error, data: rawData, refetch: fetchData }] = useLazyQuery(query.content);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Effect hook to load the data when variables change
  useEffect(() => {
    fetchData({
      ...(query.variables || {}),
      page,
      pageSize,
      sort,
      sortDirection: sortDir ? SortDirection.Asc : SortDirection.Desc,
      filters: [...(query.variables?.filters || []), ...filters],
    });
  }, [page, pageSize, sort, sortDir, filters]);

  // Download query
  const [, { refetch: fetchCSV }] = useLazyQuery(query.download, {
    variables: query.variables,
  });

  const download = useCallback(async () => {
    setDownloading(true);

    const { data: raw } = await fetchCSV();
    saveAs(
      new Blob([await generateCSV(get(raw, "download.csv"))], { type: "text/csv;charset=utf-8;" }),
      `arga-species-${new Date().toLocaleString()}.csv`
    );

    setDownloading(false);
  }, []);

  useEffect(() => {
    if (rawData) setData(rawData);
  }, [rawData]);

  // Handle pagination changes on layout/filter change
  useEffect(() => {
    setPageSize(layout === "card" ? 12 : 100);

    if (layout === "card") {
      setSort(Sort.ScientificName);
      setSortDir(true);
    }
  }, [layout]);

  const records: SpeciesCardType[] = get(data, "browse.species.records") || [];
  const dataSummarySize = 140;

  // Handle table header highlighting
  useEffect(() => {
    if (tableRef.current) {
      const head = tableRef.current?.querySelector("thead");
      let lastCol: string | undefined = undefined;

      tableRef.current.onmousemove = () => {
        const col = (document.querySelector("td:hover") as HTMLTableCellElement).dataset.col;
        if (lastCol !== col) {
          lastCol = col;

          head!.dataset.col = col;
        }
      };
      tableRef.current.onmouseleave = () => {
        head!.removeAttribute("data-col");
      };
    }
  }, [layout]);

  const handleSort = useCallback(
    (newSort: Sort) => {
      if (sort !== newSort) {
        setSort(newSort);
        setSortDir(false);
      } else {
        setSortDir(!sortDir);
      }
    },
    [sort, sortDir]
  );

  return (
    <Stack>
      <Grid align="baseline" mb="sm">
        <Grid.Col span="content">
          <Title order={5}>Browse species</Title>
        </Grid.Col>

        <Grid.Col span="auto">
          <Group>
            {filters.length === 0 && (
              <Text fz="sm" fw={500} c="dimmed">
                No filters
              </Text>
            )}
            <Group gap="xs">{filterChips}</Group>
          </Group>
        </Grid.Col>

        <Grid.Col span="content">
          <Group gap="lg" pr="sm">
            <PaginationSize
              options={layout === "card" ? [12, 24, 48] : [100, 250, 500]}
              value={pageSize}
              onChange={setPageSize}
            />
            <FiltersDrawer
              types={[
                "dataType",
                "vernacularGroup",
                "classification",
                "threatened",
                "bushfireRecovery",
                "industryCommerce",
              ]}
              onFilter={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
              }}
              onFilterChips={setFilterChips}
            />
            <TableCardSwitch layout={layout} onChange={setLayout} />
            <Divider orientation="vertical" />
            <Tooltip position="bottom" label="Download data as CSV spreadsheet">
              <DownloadButton loading={downloading} onClick={download} />
            </Tooltip>
          </Group>
        </Grid.Col>
      </Grid>
      {(() => {
        // Show the error
        if (error) {
          return <Title order={4}>{error.message}</Title>;
        } else if (!loading && records.length === 0) {
          return (
            <Center h={500}>
              <Group gap="md" align="center" justify="center">
                <ThemeIcon c="dimmed" size={64} variant="white">
                  <IconDna2Off size="3rem" />
                </ThemeIcon>
                <Title c="dimmed" order={3} fw={600} mt="md">
                  No data
                </Title>
              </Group>
            </Center>
          );
        } else if (layout === "table") {
          return (
            <ScrollArea h={500} style={{ borderRadius: 14 }}>
              <Table ref={tableRef} classNames={classes} highlightOnHover highlightOnHoverColor="wheat.0" striped>
                <Table.Thead pos="sticky">
                  <Table.Tr bg="midnight.9">
                    {TABLE_HEADERS.map(({ name, span, sort: colSort, description }) => (
                      <Tooltip key={name} radius="md" position="bottom" withArrow label={description}>
                        <Table.Td colSpan={span} fw="bold" c="white" py="sm">
                          <Flex gap="xs" align="center" justify="center">
                            {name}
                            {colSort && (
                              <ActionIcon variant="subtle" color="midnight.3" onClick={() => handleSort(colSort)}>
                                {sort !== colSort ? (
                                  <IconArrowsSort size="1rem" />
                                ) : sortDir ? (
                                  <IconSortAscending size="1rem" />
                                ) : (
                                  <IconSortDescending size="1rem" />
                                )}
                              </ActionIcon>
                            )}
                          </Flex>
                        </Table.Td>
                      </Tooltip>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(loading ? range(0, pageSize).map(() => null) : records).map((record, idx) => (
                    <Table.Tr key={idx}>
                      <Table.Td w={110} data-col={1}>
                        <Skeleton visible={loading} radius="lg">
                          <ExternalLinkButton
                            style={{ width: 100 }}
                            url={record?.taxonomy.sourceUrl || "https://ala.org.au"}
                            externalLinkName={record?.taxonomy.source || "ALA"}
                            outline
                            icon={IconArrowUpRight}
                          />
                        </Skeleton>
                      </Table.Td>
                      <Table.Td data-col={2}>
                        <Skeleton visible={loading}>
                          <Text
                            component={Link}
                            size="sm"
                            fw={600}
                            fs="italic"
                            href={`/species/${record?.taxonomy.canonicalName}`}
                          >
                            {record?.taxonomy.canonicalName || "Canonical Name"}
                          </Text>
                        </Skeleton>
                      </Table.Td>
                      <Table.Td data-col={3} w={300} px="xl">
                        <Skeleton visible={loading} radius="lg">
                          <VernacularGroupChip group={record?.taxonomy.vernacularGroup || "Unknown"} />
                        </Skeleton>
                      </Table.Td>
                      <Table.Td data-col={4} w={dataSummarySize} p={0}>
                        <Center h={46} px={10} bg="rgba(0,0,0,0.05)">
                          <Skeleton visible={loading}>
                            <DataItem textWidth={17} count={record?.dataSummary.genomes || 0} />
                          </Skeleton>
                        </Center>
                      </Table.Td>
                      <Table.Td data-col={5} w={dataSummarySize}>
                        <Skeleton visible={loading}>
                          <DataItem textWidth={17} count={record?.dataSummary.other || 0} />
                        </Skeleton>
                      </Table.Td>
                      <Table.Td data-col={6} w={dataSummarySize} p={0}>
                        <Center h={46} px={10} bg="rgba(0,0,0,0.05)">
                          <Skeleton visible={loading}>
                            <DataItem textWidth={17} count={record?.dataSummary.loci || 0} />
                          </Skeleton>
                        </Center>
                      </Table.Td>
                      <Table.Td data-col={7} w={dataSummarySize}>
                        <Skeleton visible={loading}>
                          <DataItem textWidth={17} count={record?.dataSummary.specimens || 0} />
                        </Skeleton>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          );
        } else {
          return (
            <Grid>
              {loading
                ? range(0, pageSize).map((idx) => (
                    <Grid.Col key={idx} span={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>
                      <SpeciesCard />
                    </Grid.Col>
                  ))
                : records.map((record, idx) => (
                    <Grid.Col key={idx} span={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 3 }}>
                      <SpeciesCard species={record} />
                    </Grid.Col>
                  ))}
            </Grid>
          );
        }
      })()}

      <PaginationBar total={get(data, "browse.species.total")} page={page} pageSize={pageSize} onChange={setPage} />
    </Stack>
  );
}
