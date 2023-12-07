'use client';

import { Container, Grid, Group, Paper, Text } from "@mantine/core";
import { MAX_WIDTH } from "../app/constants";


interface HeaderProps {
  rank: string,
  classification: string,
}

function Header({ rank, classification }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Group gap={40}>
          <Text c="dimmed" fw={400}>{rank}</Text>
          <Text fz={38} fw={700} fs={rank === 'GENUS' ? 'italic' : ''}>{classification}</Text>
        </Group>
      </Grid.Col>
      <Grid.Col span="content">
              {/* <IconBar taxonomy={taxonomy} /> */}
      </Grid.Col>
    </Grid>
  )
}


export default function ClassificationHeader({ rank, classification }: { rank: string, classification: string }) {
  return (
    <Paper py={20} pos="relative">
      <Container maw={MAX_WIDTH}>
        <Header rank={rank} classification={classification} />
      </Container>
    </Paper>
  )
}
