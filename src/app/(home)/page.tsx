'use client';

import { Paper, Grid, Text, Title, Box, Stack, Button, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import BrowseGrouping from './browse-grouping';
import BrowseTaxon from "./browse-taxon";
import MostDownloadedCard from "./most-downloaded";
import MostViewedCard from "./most-viewed";
import VisitorGraph from "./visitor_graph";
import { Search as IconSearch } from "tabler-icons-react";
import { useState } from "react";
import BrowseData from "@/app/(home)/browse-data";


function Highlights() {
  return (
    <Box>
      <Grid gutter={30}>
        <Grid.Col xs={12} sm={12} md={4} lg={4} xl={4}>
          <Stack spacing={30}>
            <Paper p={30} radius="lg" bg="midnight.6">
              <MostViewedCard />
            </Paper>

            <Paper p={30} radius="lg" bg="midnight.6">
              <MostDownloadedCard />
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={8} lg={8} xl={8}>
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
    // <Paper p={20} radius="xl">
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
            styles={{ input: { height: 55, fontSize: "16px", fontWeight: 'normal', border: 0, color: "#707070" } }}
            icon={<IconSearch size={28} />}
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Button size="xl" type="submit" className="primary_button">Search</Button>
        </Grid.Col>
      </Grid>
      </form>
    // </Paper>
  )
}


export default function HomePage() {
  return (
    <Box>
      <Paper bg="midnight.6" p={0} m={0} radius={35}>
        <Box px={50} py={40}>
          <h2 style={{color: 'white', fontWeight: 'normal'}}>Search By</h2>
          <Search />
        </Box>

        <Box px={50} pb={58}>
          <h2 style={{color: 'white', fontWeight: 'normal'}}>Browse By Data Types</h2>
          <BrowseData/>
        </Box>

        <Box px={50} pb={58}>
          <h2 style={{color: 'white', fontWeight: 'normal'}}>Browse By Taxon</h2>
          <BrowseTaxon/>
        </Box>

        <Box px={50} pb={58}>
          <h2 style={{color: 'white', fontWeight: 'normal'}}>Browse By Groupings</h2>
          <BrowseGrouping/>
        </Box>
      </Paper>

      <Box py={30}>
        <h2 style={{color: 'white', fontWeight: 'normal'}}>This month&apos;s highlights</h2>
        <Highlights />

        <ConferenceInfo />
      </Box>
    </Box>
  );
}
