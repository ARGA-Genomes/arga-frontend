'use client';

import { Grid, Paper, Text } from "@mantine/core";
import { WholeGenome} from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";
import GenomeTable from "@/app/species/[name]/commonGenomeRecordTable";

const PointMap = dynamic(() => import('../../components/point-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function WholeGenomeSection({ data }: { data : WholeGenome[] }) {

  const coordinates = data.map(record => record.coordinates);

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={8}>
          <Link
            href={{
              pathname: `${window.location.href}/wholeGenome`
            }}><Text color="blue" underline>Whole Genome Summary (Refseq)</Text></Link>
        </Grid.Col>

        <Grid.Col span="auto">
          <PointMap coordinates={coordinates}/>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export function WholeGenome({ records }: { records : WholeGenome[] }) {
  return (
    <>
      <WholeGenomeSection data={records}/>
      <Paper radius="lg" py={25}  mt={15}>
        <GenomeTable records={records} />
      </Paper>
    </>
  );
}
