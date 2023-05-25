'use client';

import { Grid, Paper, Text } from "@mantine/core";
import { QueryResults} from "@/app/type";
import dynamic from "next/dynamic";
import Link from "next/link";

const RegionMap = dynamic(() => import('../../components/region-map'), {
  ssr: false,
  loading: () => <Text>Loading map...</Text>,
})

function WholeGenomeSection({ data }: { data : QueryResults }) {

  const regions = data.species.regions;

  return (
    <Paper bg="midnight.6" p={40} radius={35}>
      <Grid>
        <Grid.Col span={3}>
          <Link
            href={{
              pathname: `/species/wholeGenome`,
              query: {name : data.species.taxonomy.canonicalName.replaceAll(" ", "_") },
            }}><Text color="blue">Whole Genome Summary</Text></Link>
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
          <WholeGenomeSection data={data}/>
        </Grid.Col>
      </Grid>
    </>);
}
