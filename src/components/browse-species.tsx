import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Flex,
  getThemeColor,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

// Local components
import { PaginationBar, PaginationSize } from "./pagination";
import { FiltersDrawer } from "./filtering-redux/drawer";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { DocumentNode, OperationVariables, useQuery } from "@apollo/client";
import { FilterItem } from "./filtering-redux/filters/common";
import { DataItem, DataSummary, SpeciesCard } from "./species-card";
import { Photo } from "@/app/type";
import { get, range } from "lodash-es";
import { TableCardLayout, TableCardSwitch } from "./table-card-switch";

import classes from "./browse-species.module.css";
import { ExternalLinkButton } from "./button-link-external";
import { IconArrowsSort, IconArrowUpRight, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { VernacularGroupChip } from "./icon-bar";
import { DownloadButton } from "./download-btn";

interface SpeciesRecord {
  taxonomy: { canonicalName: string; status: string; source: string; sourceUrl: string; vernacularGroup: string };
  photo: Photo;
  dataSummary: DataSummary;
}

interface BrowseSpeciesProps {
  query: {
    content: DocumentNode;
    variables?: OperationVariables;
    key: string;
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
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort>(Sort.ScientificName);
  const [sortDir, setSortDir] = useState<boolean>(true);

  const [layout, setLayout] = useState<TableCardLayout>("card");
  const [pageSize, setPageSize] = useState<number>(layout === "card" ? 10 : 100);

  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [filterChips, setFilterChips] = useState<ReactElement[] | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  const {
    loading,
    error,
    data: rawData,
  } = useQuery(query.content, {
    variables: {
      page,
      pageSize,
      filters,
      sort,
      sortDirection: sortDir ? SortDirection.Asc : SortDirection.Desc,
      ...(query.variables || {}),
    },
  });

  useEffect(() => {
    if (rawData) setData(rawData);
  }, [rawData]);

  // Handle pagination changes on layout/filter change
  useEffect(() => {
    setPageSize(layout === "card" ? 10 : 100);

    if (layout === "card") {
      setSort(Sort.ScientificName);
      setSortDir(true);
    }
  }, [layout]);

  const records: SpeciesRecord[] = get(data, `${query.key}.records`) || [];
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
              options={layout === "card" ? [10, 25, 50] : [100, 250, 500]}
              value={pageSize}
              onChange={setPageSize}
            />
            <FiltersDrawer
              types={["dataType", "classification"]}
              onFilter={(filters) => {
                setFilters(filters);
                setPage(1);
              }}
              onFilterChips={setFilterChips}
            />
            <TableCardSwitch layout={layout} onChange={setLayout} />
            <Divider orientation="vertical" />
            <Tooltip position="bottom" label="Download data as CSV spreadsheet">
              <DownloadButton onClick={() => alert("download here")} />
            </Tooltip>
          </Group>
        </Grid.Col>
      </Grid>

      {error ? <Title order={4}>{error.message}</Title> : null}

      {!loading && records.length === 0 && (
        <Center>
          <Text>no data</Text>
        </Center>
      )}

      {layout === "table" && (
        <ScrollArea h={500} style={{ borderRadius: 14 }}>
          <Table ref={tableRef} classNames={classes} highlightOnHover highlightOnHoverColor="wheat.0" striped>
            <Table.Thead pos="sticky">
              <Table.Tr bg="midnight.9">
                {TABLE_HEADERS.map(({ name, span, sort: colSort, description }, i) => (
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
                      <Text size="sm" fw={600} fs="italic">
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
      )}

      {layout === "card" && (
        <SimpleGrid cols={5}>
          {loading
            ? range(0, pageSize).map((id) => <SpeciesCard key={id} />)
            : records.map((record) => <SpeciesCard key={record.taxonomy.canonicalName} species={record} />)}
        </SimpleGrid>
      )}

      <PaginationBar total={get(data, `${query.key}.total`)} page={page} pageSize={pageSize} onChange={setPage} />
    </Stack>
  );
}
