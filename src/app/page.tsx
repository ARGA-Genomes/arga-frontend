'use client';

import { Paper, Container, Grid, Text, Image, Title, Box, Stack, Flex, Group } from "@mantine/core";
import BrowseData from './browse-data';
import MostDownloadedCard from "./most-downloaded";
import MostViewedCard from "./most-viewed";
import SpeciesSearch from "./species-search";
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
    <Box>
      <Paper bg="midnight.6" p={0} m={0} radius={35}>
        <Flex justify="center" align="center" direction="row" wrap="wrap" px={100} pt={100} gap={54}>
          <Image
            src="search_logo_reversed.png"
            alt="Australian Reference Genome Atlas"
            width={353}
            height={100}
            sx={{ flexGrow: 0 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <SpeciesSearch />
          </Box>
        </Flex>

        <Box pt={136} px={50} pb={58}>
          <BrowseData/>
        </Box>
      </Paper>

      <Title order={2} mt={20} color="white" py={20}>This month&apos;s highlights</Title>
      <Highlights />

      <ConferenceInfo />
    </Box>
  );
}
