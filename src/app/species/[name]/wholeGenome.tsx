'use client';

import { Badge, Box, Button, Card, Divider, Grid, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Photo, Taxonomy, Regions, GenomicData, QueryResults} from "@/app/type";
import Link from "next/link";
import * as Humanize from "humanize-plus";
import * as Luxon from "luxon";
import dynamic from "next/dynamic";
import {color} from "chart.js/helpers";

const RegionMap = dynamic(() => import('../../components/region-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function WholeGenomeDetails({ data }: { data : QueryResults }) {

  const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome");
  const regions = data.species.regions;

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={3}>
          <Text style={{ paddingBottom: 25 }}>Whole Genome (Refseq)</Text>
          <Stack>
            <Text color="white" c="dimmed">Species Name: {data.species.taxonomy.canonicalName}</Text>
            <Text c="dimmed">Reference Genome</Text>
            <Text color="white" c="dimmed">Refseq {wholeGenomeRecords.map((record => record.accession))}</Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span="auto">
          <RegionMap regions={regions.ibra.map(region => region.name)}/>
          <Text color="white" c="dimmed" fz="sm">
            {regions.ibra.map(region => region.name).join(", ")}
            {regions.imcra.map(region => region.name).join(", ")}
          </Text>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export function WholeGenome({ data }: { data : QueryResults }) {

  return (
    <>
      <Grid p={40}>
        <Grid.Col span="auto">
          <WholeGenomeDetails data={data}/>
        </Grid.Col>
      </Grid>
    </>);
}
