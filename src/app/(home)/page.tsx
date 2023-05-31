'use client';

import { Paper, Grid, Text, Title, Box, Stack, Button, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import BrowseData from './browse-data';
import BrowseTaxon from "./browse-taxon";
import MostDownloadedCard from "./most-downloaded";
import MostViewedCard from "./most-viewed";
import VisitorGraph from "./visitor_graph";
import { Search as IconSearch } from "tabler-icons-react";
import { useState } from "react";


function Highlights() {
  return (
    <Box>
      <Grid gutter={30}>
        <Grid.Col span={4}>
          <Stack spacing={30}>
            <Paper p={30} radius="lg" bg="midnight.6">
              <MostViewedCard />
            </Paper>

            <Paper p={30} radius="lg" bg="midnight.6">
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
      <Title order={2} color="wheat.3">Up and coming conference</Title>
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


function Search() {
  const router = useRouter();

  const [value, setValue] = useState("");

  function onSearch(searchTerms: string) {
    router.push(`/search?q=${encodeURIComponent(searchTerms)}&type=species`)
  }

  return (
    <Paper p={20} radius="xl">
      <form onSubmit={(ev) => { ev.preventDefault(); onSearch(value) }}>
      <Grid align="center">
        <Grid.Col span="auto">
          <TextInput
            placeholder="e.g. sequence accession, taxon identifier, genus name"
            value={value}
            onChange={val => setValue(val.target.value)}
            iconWidth={60}
            size="xl"
            radius={20}
            styles={{ input: { height: 90, fontSize: "24px", fontWeight: 500, border: 0 } }}
            icon={<IconSearch size={28} />}
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Button size="xl" radius="lg" color="midnight.5" type="submit">Search</Button>
        </Grid.Col>
      </Grid>
      </form>
    </Paper>
  )
}


export default function HomePage() {
  return (
    <Box>
      <Paper bg="midnight.6" p={0} m={0} radius={35}>
        <Box px={50} py={40}>
          <Title c="white" py={20}>Search By</Title>
          <Search />
        </Box>

        <Box px={50} pb={58}>
          <Title c="white" py={20}>Browse By Taxon</Title>
          <BrowseTaxon/>
        </Box>

        <Box px={50} pb={58}>
          <Title c="white" py={20}>Browse By Groupings</Title>
          <BrowseData/>
        </Box>
      </Paper>

      <Box py={30}>
        <Title order={1} mt={20} color="white" py={20}>This month&apos;s highlights</Title>
        <Highlights />

        <ConferenceInfo />
      </Box>
    </Box>
  );
}
