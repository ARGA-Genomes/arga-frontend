'use client';

import * as Humanize from "humanize-plus";
import { Grid, Paper, Stack, Text, Title } from "@mantine/core";


type DatasetProps = {
  total: number,
  name: string,
};

function Dataset(params: DatasetProps) {
  return (
    <Paper py={10} px={30} radius="xl" shadow={undefined} withBorder bg="midnight.5">
      <Grid>
        <Grid.Col span={6}>
          <Text size="sm" color="white" align="left">{params.name}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" color="white" align="right">{Humanize.compactInteger(params.total)} downloads</Text>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


export default function MostDownloadedCard() {
  return (
    <Stack>
      <Title order={2} color="wheat.3">Most downloaded</Title>

      <Stack>
        <Dataset total={14000} name="Whole genome" />
        <Dataset total={456} name="Mito genome" />
      </Stack>
    </Stack>
  )
}
