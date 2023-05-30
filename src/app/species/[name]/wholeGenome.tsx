'use client';

import { Grid, Paper, Text } from "@mantine/core";
import { QueryResults} from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";

const PointMap = dynamic(() => import('../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function WholeGenomeSection({ data }: { data : QueryResults }) {

  const otherWholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" &&
    !record.accession?.includes("GCF_"));
  const referenceGenome = data.species.data.filter((record) => record.refseqCategory == "reference genome"
    || record.accession?.includes("GCF_"));

  const coordinates = otherWholeGenomeRecords.map(record => record.coordinates);

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={3}>
          <Link
            href={{
              pathname: `/species/${data.species.taxonomy.canonicalName.replaceAll(" ", "_")}/wholeGenome`
            }}><Text color="blue">Whole Genome Summary</Text></Link>
        </Grid.Col>

        <Grid.Col span="auto">
          <PointMap coordinates={coordinates}/>
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
          <WholeGenomeSection data={data}/>
        </Grid.Col>
      </Grid>
    </>);
}
