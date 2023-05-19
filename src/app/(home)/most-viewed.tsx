'use client';

import * as Humanize from "humanize-plus";
import { Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";


type DatasetProps = {
  total: number,
  name: string,
};

function Dataset(params: DatasetProps) {
  return (
    <Paper px={20} pt={30} pb={60} radius="lg" shadow={undefined} withBorder bg="midnight.5">
      <Stack align="center" justify="flex-start">
        <Title order={2} color="white">{Humanize.compactInteger(params.total)}</Title>
        <Text size="sm" color="white" align="center">{params.name}</Text>
      </Stack>
    </Paper>
  )
}


export default function MostViewedCard() {
  return (
    <Stack>
      <Title order={2} color="wheat.3">Most viewed dataset</Title>

      <SimpleGrid cols={3}>
        <Dataset total={23000} name="Whole genome" />
        <Dataset total={12500} name="Species" />
        <Dataset total={7500} name="Mito genome" />
      </SimpleGrid>
    </Stack>
  )
}
