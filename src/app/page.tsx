'use client';

import { Paper, Container, Grid, Text, TextInput, Image, Title, Box, Stack } from "@mantine/core";
import { Search } from "tabler-icons-react";
import BrowseData from './browse-data';
import MostDownloadedCard from "./most-downloaded";
import MostViewedCard from "./most-viewed";
import VisitorGraph from "./visitor_graph";


function Highlights() {
  return (
    <Box>
      <Grid gutter={30}>
        <Grid.Col span={4}>
          <Stack spacing={30}>
            <Paper p={30} radius="lg" bg="midnight.5">
              <MostViewedCard />
            </Paper>

            <Paper p={30} radius="lg" bg="midnight.5">
              <MostDownloadedCard />
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={8}>
          <VisitorGraph />
        </Grid.Col>
      </Grid>
    </Box>
  )
}

function ConferenceInfo() {
  return (
    <Paper mt={30} p={30} radius="lg" bg="midnight.5">
      <Title order={1} color="wheat.3">Up and coming conference</Title>
      <Grid>
        <Grid.Col>
          <Stack mt={40} mb={30}>
            <Title order={1} color="white">See you at the 2023 eResearch Brisbane</Title>
            <Text color="white">Building name. Street address and our booth number. See you there.</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


export default function HomePage() {
  return (
    <Box m={30} pb={50}>
      <Paper pt={60} pb={30} radius="lg" bg="midnight.6">
        <Container size="xl">
          <Grid align="center" gutter={40}>
            <Grid.Col span={3}>
              <Image src="logo_reversed.png" alt="Australian Reference Genome Atlas" />
            </Grid.Col>
            <Grid.Col span="auto">
              <TextInput
                radius="md"
                size="lg"
                rightSection={<Search size={28} />}
                rightSectionWidth={50}
              />
            </Grid.Col>
          </Grid>
        </Container>

        <Box px={30}>
          <Title order={2} mt={20} color="white" py={20}>Browse data</Title>
          <BrowseData/>
        </Box>
      </Paper>

      <Title order={2} mt={20} color="white" py={20}>This month&apos;s highlights</Title>
      <Highlights />

      <ConferenceInfo />
    </Box>
  );
}
