'use client';

import { Container, Grid, Group, Paper, Text } from "@mantine/core";
import { MAX_WIDTH } from "../app/constants";


interface HeaderProps {
  dataType: string,
}

function Header({ dataType }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Group gap={40}>
          <Text c="dimmed" fw={400}>DATA TYPE</Text>
          <Text fz={38} fw={700}>{dataType}</Text>
        </Group>
      </Grid.Col>
    </Grid>
  )
}


export default function DataTypeHeader({ dataType }: { dataType: string }) {
  return (
    <Paper py={20} pos="relative">
      <Container maw={MAX_WIDTH}>
        <Header dataType={dataType} />
      </Container>
    </Paper>
  )
}
