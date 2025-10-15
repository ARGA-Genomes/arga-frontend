"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Center,
  Grid,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { Attribute, AttributePill, DataField } from "@/components/data-fields";
import { LoadOverlay } from "@/components/load-overlay";
import { PaginationBar } from "@/components/pagination";
import { RecordItem, RecordList } from "@/components/record-list";
import { GenomicComponent, Species } from "@/generated/types";
import { getCanonicalName } from "@/helpers/getCanonicalName";
import { IconExternalLink } from "@tabler/icons-react";
import { useState } from "react";

const PAGE_SIZE = 5;

const GET_SPECIES = gql`
  query SpeciesComponents($canonicalName: String, $page: Int, $pageSize: Int) {
    species(canonicalName: $canonicalName) {
      genomicComponents(page: $page, pageSize: $pageSize) {
        total
        records {
          sequenceId
          datasetName
          recordId
          accession
          latitude
          longitude
          materialSampleId
          sequencedBy
          depositedBy
          estimatedSize
          releaseDate
          dataType
          accessRights
          sourceUri
        }
      }
    }
  }
`;

function RecordItemContent({ record }: { record: GenomicComponent }) {
  return (
    <Grid p={20}>
      <Grid.Col span={2}>
        <Attribute label="Accession">
          <Box pt={5}>
            <DataField value={record.accession} />
          </Box>
        </Attribute>
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Data type" value={record.dataType} />
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Library type" value={undefined} />
      </Grid.Col>
      <Grid.Col span={1}>
        <AttributePill label="Access status" value={record.accessRights} />
      </Grid.Col>
      <Grid.Col span={1}>
        <AttributePill label="Data license" value={undefined} />
      </Grid.Col>
      <Grid.Col span={2}>
        <AttributePill label="Source" value={record.datasetName} />
      </Grid.Col>
      <Grid.Col span={2}>
        <Attribute label="Publication date">
          <Box pt={5}>
            <DataField value={record.releaseDate} />
          </Box>
        </Attribute>
      </Grid.Col>
    </Grid>
  );
}

function GenomicComponentList({ records }: { records: GenomicComponent[] }) {
  return (
    <RecordList>
      {records.map((record, idx) => (
        <RecordItem
          key={idx}
          href={record.sourceUri || "#"}
          target="_blank"
          rightSection={
            <Button
              color="midnight.10"
              h="100%"
              w="100%"
              disabled={!record.sourceUri}
              style={{ borderRadius: "0 16px 16px 0" }}
            >
              <Stack>
                <Center>
                  <IconExternalLink size="30px" />
                </Center>
                go to source
              </Stack>
            </Button>
          }
        >
          <RecordItemContent record={record} />
        </RecordItem>
      ))}
    </RecordList>
  );
}

export default function GenomicComponents({
  params,
}: {
  params: { name: string };
}) {
  const canonicalName = getCanonicalName(params);
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery<{ species: Species }>(GET_SPECIES, {
    variables: {
      canonicalName,
      page,
      pageSize: PAGE_SIZE,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Paper radius="lg" p={20} withBorder>
      <Title order={3}>Genomic components</Title>

      <Grid py={20}>
        <Grid.Col span={12}>
          <Box pos="relative" mih={568}>
            <LoadOverlay visible={loading} />
            {data?.species.genomicComponents ? (
              <GenomicComponentList
                records={data.species.genomicComponents.records}
              />
            ) : null}
          </Box>
        </Grid.Col>

        <Grid.Col span={12}>
          <PaginationBar
            total={data?.species.genomicComponents.total}
            page={page}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
