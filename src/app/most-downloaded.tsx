'use client';

import * as Humanize from "humanize-plus";
import { Flex, Grid, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";


type DatasetProps = {
  total: number,
  name: string,
};

function Dataset(params: DatasetProps) {
  return (
    <Paper py={10} px={30} radius="xl" shadow={undefined} withBorder bg="shellfish.7">
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
      <Title order={1} color="wheat">Most downloaded</Title>

      <Stack>
        <Dataset total={14000} name="Whole genome" />
        <Dataset total={456} name="Mito genome" />
      </Stack>
    </Stack>
  )
}
