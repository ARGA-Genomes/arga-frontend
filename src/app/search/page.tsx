"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Alert, Box, Container, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { IconExclamationMark, IconSearch } from "@tabler/icons-react";
import * as Humanize from "humanize-plus";
import { parseAsInteger, useQueryState } from "nuqs";

import { PaginationBar, PaginationSize } from "@/components/pagination";

import { FiltersDrawer } from "@/components/filtering-redux/drawer";
import { GenericFilter } from "@/components/filtering-redux/generic";
import {
  buildTantivyQuery,
  getTooltipForAttribute,
  InputQueryAttribute,
  Search as SearchComponent,
} from "@/components/search";
import { TableCardLayout, TableCardSwitch } from "@/components/table-card-switch";
import { Search } from "@/generated/types";
import { parseAsAttribute } from "@/helpers/searchParamParser";
import { Suspense, useEffect, useState } from "react";
import { MAX_WIDTH } from "../constants";
import { Results } from "./_components/result";

const SEARCH_FULLTEXT = gql`
  query FullTextSearch($query: String, $page: Int, $perPage: Int) {
    search {
      fullText(query: $query, page: $page, perPage: $perPage) {
        total
        records {
          ... on TaxonItem {
            type
            status
            score
            canonicalName
            subspecies
            synonyms
            commonNames
            rank
            classification {
              kingdom
              phylum
              class
              order
              family
              genus
              regnum
              division
              classis
              ordo
              familia
            }
            dataSummary {
              genomes
              loci
              specimens
              other
              totalGenomic
            }
          }
          ... on GenomeItem {
            type
            status
            score
            canonicalName
            accession
            genomeRep
            dataSource
            level
            assemblyType
            referenceGenome
            releaseDate
            sourceUri
          }
          ... on LocusItem {
            type
            status
            score
            canonicalName
            accession
            locusType
            dataSource
            voucherStatus
            eventDate
            eventLocation
          }
          ... on SpecimenItem {
            type
            status
            score
            canonicalName
            accession
            dataSource
            institutionCode
            collectionCode
            recordedBy
            identifiedBy
            eventDate
            eventLocation
          }
        }
      }
    }
  }
`;

function SearchPage() {
  const [layout, setLayout] = useState<TableCardLayout>("table");
  const [rawQuery] = useQueryState("q", { defaultValue: "" });
  const [attributes, setAttributes] = useQueryState("attributes", parseAsAttribute.withDefault([]));

  const [filters, setFilters] = useState<InputQueryAttribute[]>([]);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState("perPage", parseAsInteger.withDefault(10));

  const [lastResultCount, setLastResultCount] = useState<number | null>(null);

  const allAttributes = [...attributes, ...filters];
  const query = buildTantivyQuery(allAttributes, rawQuery);

  const { loading, error, data } = useQuery<{ search: Search }>(SEARCH_FULLTEXT, {
    variables: {
      query,
      page,
      perPage,
    },
  });

  // Handle pagination changes on layout/filter change
  useEffect(() => {
    setPerPage(layout === "card" ? 12 : 10);
  }, [layout]);

  // Effect hook to stop the search results jumping to 0 when paginating
  useEffect(() => {
    if (data) setLastResultCount(data.search.fullText.total);
  }, [data]);

  const handleAttributeSwitch = (
    item: InputQueryAttribute,
    items: InputQueryAttribute[],
    setItems: (items: InputQueryAttribute[]) => void
  ) =>
    setItems(
      items.map((filterAttr) =>
        item.field === filterAttr.field && item.value === filterAttr.value
          ? { ...filterAttr, include: !filterAttr.include }
          : filterAttr
      )
    );

  const handleAttributeRemove = (
    item: InputQueryAttribute,
    items: InputQueryAttribute[],
    setItems: (items: InputQueryAttribute[]) => void
  ) => setItems(items.filter((filterAttr) => !(item.field === filterAttr.field && item.value === filterAttr.value)));

  return (
    <>
      <Box p="md">
        <SearchComponent
          placeholder="e.g. sequence accession, species name"
          leftSectionWidth={60}
          size="xl"
          radius="lg"
          leftSection={<IconSearch size={24} color="black" />}
        />
      </Box>

      <Paper>
        <Container maw={MAX_WIDTH} fluid py="xl">
          <Stack>
            <Group justify="space-between">
              <Text fz="lg">
                {lastResultCount !== null ? (
                  <>
                    <b>
                      {1 + perPage * (page - 1)}-{Math.min(page * perPage, lastResultCount)}
                    </b>{" "}
                    of <b>{Humanize.formatNumber(lastResultCount)}</b>{" "}
                  </>
                ) : (
                  "Loading "
                )}
                search results{lastResultCount ? " found" : ""} for{" "}
                <b>{rawQuery.length > 0 ? rawQuery : "everything"}</b>
              </Text>
              <Group>
                <PaginationSize
                  options={layout === "card" ? [12, 24, 48] : [10, 25, 50]}
                  value={perPage}
                  onChange={setPerPage}
                />
                <FiltersDrawer
                  types={["searchDataType", "classification"]}
                  onSearchFilter={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                  }}
                />
                <TableCardSwitch layout={layout} onChange={setLayout} />
              </Group>
            </Group>
            {allAttributes.length > 0 && (
              <Group>
                {attributes.map((attr, idx) => (
                  <GenericFilter
                    key={idx}
                    name={attr.name}
                    value={attr.value}
                    include={attr.include}
                    tooltip={getTooltipForAttribute(attr)}
                    onSwitch={() => handleAttributeSwitch(attr, attributes, setAttributes)}
                    onRemove={() => handleAttributeRemove(attr, attributes, setAttributes)}
                  />
                ))}
                {attributes.length > 0 && filters.length > 0 && <Divider orientation="vertical" />}
                {filters.length > 0 && (
                  <Text size="sm" c="dimmed" mb={3}>
                    Page filters
                  </Text>
                )}
                {filters.map((attr, idx) => (
                  <GenericFilter
                    key={idx}
                    name={attr.name}
                    value={attr.value}
                    include={attr.include}
                    tooltip={getTooltipForAttribute(attr)}
                    onSwitch={() => handleAttributeSwitch(attr, filters, setFilters)}
                    onRemove={() => handleAttributeRemove(attr, filters, setFilters)}
                  />
                ))}
              </Group>
            )}
            {error && (
              <Alert radius="lg" variant="light" color="red" title="Unexpected failure" icon={<IconExclamationMark />}>
                <Text c="red">{error.message}</Text>
              </Alert>
            )}
            <Results layout={layout} items={data?.search.fullText.records} perPage={perPage} />
            <PaginationBar total={data?.search.fullText.total} page={page} pageSize={perPage} onChange={setPage} />
          </Stack>
        </Container>
      </Paper>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
