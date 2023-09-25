'use client';

import { Container, Grid, Group, Paper, Text } from "@mantine/core";
import { Taxonomy } from "@/app/type";
import IconBar from "./icon-bar";
import { MAX_WIDTH } from "../constants";


interface HeaderProps {
  rank: string,
  classification: string,
}

function Header({ rank, classification }: HeaderProps) {
  return (
    <Grid>
      <Grid.Col span="auto">
        <Group spacing={40}>
          <Text c="dimmed" weight={400}>{rank}</Text>
          <Text size={38} weight={700}>{classification}</Text>
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
