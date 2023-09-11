"use client";

import {
  Paper,
  Grid,
  Text,
  Title,
  Box,
  Stack,
  Button,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import BrowseGrouping from "./browse-grouping";
import BrowseTaxon from "./browse-taxon";
import MostDownloadedCard from "./most-downloaded";
import MostViewedCard from "./most-viewed";
import VisitorGraph from "./visitor_graph";
import { Search as IconSearch } from "tabler-icons-react";
import { useState } from "react";
import BrowseType from "@/app/(home)/browse-type";
import {createStyles} from '@mantine/core';

const useStyles = createStyles((theme, _params, _getRef) => ({
}));

function Highlights() {
  return (
    <Box>
      <Grid gutter={30}>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <Stack spacing={30}>
            <Paper p={30} radius="xl" bg="midnight.6">
              <MostViewedCard />
            </Paper>

            <Paper p={30} radius="lg" bg="midnight.6">
              <MostDownloadedCard />
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <VisitorGraph />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

function ConferenceInfo() {
  return (
    <Paper mt={30} p={30} radius="lg" bg="midnight.5">
      <Title order={2} color="wheat.3">
        Up and coming conference
      </Title>
      <Grid>
        <Grid.Col>
          <Stack mt={40} mb={30}>
            <Title order={1} color="white">
              See you at the 2023 eResearch Brisbane
            </Title>
            <Text color="white">
              Building name. Street address and our booth number. See you there.
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

function Search() {
  const router = useRouter();

  const [value, setValue] = useState("");

  function onSearch(searchTerms: string) {
    router.push(`/search?q=${encodeURIComponent(searchTerms)}&type=species`);
  }

  return (
    // <Paper p={20} radius="xl">
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSearch(value);
      }}
    >
      <Grid align="center">
        <Grid.Col xs={12} sm={12} md={10} lg={10} xl={8} span="auto">
          <TextInput
            placeholder="e.g. sequence accession, taxon identifier, genus name"
            value={value}
            onChange={(val) => setValue(val.target.value)}
            iconWidth={60}
            size="xl"
            radius="lg"
            styles={{
              input: {
                height: 55,
                fontSize: "16px",
                fontWeight: "normal",
                border: 0,
                color: "#707070",
              },
            }}
            icon={<IconSearch size={28} color="black" />}
          />
        </Grid.Col>
        <Grid.Col span="content">
          {/* <Button size="xl" type="submit" className="primary_button">
             Search
          </Button> */}
        </Grid.Col>
      </Grid>
    </form>
    // </Paper>
  );
}

export default function HomePage() {
  const {  theme } = useStyles();

  return (
    <Box>
      <Paper bg="midnight.6" h={'auto'} pl='10000px' ml='-10000px' pr='10000px' mr='-10000px' mt = '-40px'>
        <Box  py={80} sx={{ textAlign: 'justify'}}>
        <Grid gutter={30}>
          <Grid.Col xs={1} sm={1} md={1} lg={1} xl={1}>
          </Grid.Col>  
          <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          
            <h2 style={{ color: theme.colors.wheat[4], marginTop: '0px', marginBottom: '0px', fontWeight: '550' }}>
              deepen discovery - trawl traits - curate collections
            </h2>
            <p style={{ color: "white" }}>For plants, animals, microbes and other species endemic or relevant to Australia, the Australian Reference
              Genome Atlas (ARGA) locates and aggregates genomic data, including <b> reference genome assemblies &#x2022;
                genome annotations &#x2022; population and variant sets &#x2022; DNA barcodes &#x2022; coding and non-coding DNA sequences &#x2022;
                raw genomics data
              </b>
            </p>
          </Grid.Col>
        </Grid>
        </Box>
      </Paper>

        <Box px={50} py={20}>
          <h2 style={{ color: theme.colors.moss[3], fontSize: '24px', fontWeight: '550'}}>Search for data</h2>
          <Search />
        </Box>

        <Box px={50} py={20}>
          <h2 style={{ color: theme.colors.moss[3], fontWeight: '550' }}>
            Browse By type
          </h2>
          <BrowseType />
        </Box>

        <Box px={50} py={20}>
          <h2 style={{ color: theme.colors.moss[3], fontWeight: '550' }}>
            Browse By taxon
          </h2>
          <BrowseTaxon />
        </Box>

        <Box px={50} py={30}>
          <h2 style={{ color: theme.colors.moss[3], fontWeight: '550'  }}>
            Browse By group
          </h2>
          <BrowseGrouping />
        </Box>
    </Box>
  );
}
