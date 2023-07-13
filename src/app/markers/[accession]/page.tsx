"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Assembly, AssemblyStats, BioSample, Marker } from "@/app/type";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { HorizontalSection } from "@mantine/core/lib/AppShell/HorizontalSection/HorizontalSection";

const GET_MARKER = gql`
  query MarkerDetails($accession: String) {
    marker(accession: $accession) {
      id
      accession
      basepairs
      fastaUrl
      sourceUrl
      gbAcs
      markerCode
      materialSampleId
      nucleotide
      recordedBy
      shape
      type
      version
      extraData
    }
  }
`;

type QueryResults = {
  marker: Marker;
};

interface FieldProps {
  label: string;
  value?: string | number;
}

function Field(props: FieldProps) {
  return (
    <Box>
      <Text color="dimmed" size="xs">
        {props.label}
      </Text>
      <Text size="sm" weight="bold" c={props.value ? "black" : "dimmed"}>
        {props.value || "Not Supplied"}
      </Text>
    </Box>
  );
}

function LongField(props: FieldProps) {
   return (
    <Box>
      <Text color="dimmed" size="xs">
        {props.label}
      </Text>
      <textarea cols={25} rows={4} readOnly={true} value={props.value} />
    </Box>
  );
}


function GeneData({ gene }: { gene: Object }) {
  console.log(gene);
   return (
    <Grid>
      { Object.entries(gene).map(([key, value]) => (
        <Grid.Col span={3} key={key}>
          { key == 'CDS_translation'
          ? <LongField label={Humanize.capitalize(key.replace(/_/g, ' '))} value={value} />
          : <Field label={Humanize.capitalize(key.replace(/_/g, ' '))} value={value} />
          }
        </Grid.Col>
      ))}
    </Grid>
  )
}


function ExtraData({ marker }: { marker: Marker }) {
  let obj = JSON.parse(marker.extraData.replace(/'/g, '"'));
  return (
    <>
      { obj.map((gene: Object) => (
        <>
          <Divider m={20} />
          <GeneData gene={gene} />
        </>
      ))}
    </>
  )
}


function Details({ marker }: { marker: Marker }) {
  return (
    <Box>
    <Grid>
      <Grid.Col span={8}>
        <Title order={4} mb={20}>
          {marker.accession}
        </Title>
      </Grid.Col>
      <Grid.Col span={4}>
        <Flex justify="flex-end">
          <Button
            component="a"
            href={marker.sourceUrl}
            target="_blank"
          >
            Marker Source
          </Button>
          <Button ml={20}
            component="a"
            href={marker.fastaUrl}
            target="_blank"
          >
            Get Fasta
          </Button>
        </Flex>
      </Grid.Col>

      <Grid.Col span={3}>
        <Field label="Accession" value={marker.accession} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Base pairs" value={marker.basepairs} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="GB Acs" value={marker.gbAcs} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Marker code" value={marker.markerCode} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Material sample ID" value={marker.materialSampleId} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Recorded by" value={marker.recordedBy} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Shape" value={marker.shape} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Type" value={marker.type} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Field label="Version" value={marker.version} />
      </Grid.Col>
    </Grid>

    <ExtraData marker={marker} />
    </Box>
  );
}


export default function MarkerPage({ params }: { params: { accession: string } }) {
  const { loading, error, data } = useQuery<QueryResults>(GET_MARKER, {
    variables: {
      accession: params.accession,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Box>
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: "xl", color: "moss.5" }}
        visible={loading}
      />
      <Paper radius="lg" p={30}>
        {data && <Details marker={data.marker} />}
      </Paper>
    </Box>
  );
}
