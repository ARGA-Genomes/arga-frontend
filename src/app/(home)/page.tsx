"use client";

import {
  Paper,
  Grid,
  Text,
  Title,
  Stack,
  TextInput,
  Container,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import BrowseGrouping from "./browse-grouping";
import BrowseTaxon from "./browse-taxon";
import { Search as IconSearch } from "tabler-icons-react";
import { useState } from "react";
import BrowseType from "@/app/(home)/browse-type";
import { MAX_WIDTH } from "../constants";
import ShowStats from "./stats";


function Search() {
  const router = useRouter();

  const [value, setValue] = useState("");

  function onSearch(searchTerms: string) {
    router.push(`/search?q=${encodeURIComponent(searchTerms)}`);
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSearch(value);
      }}
    >
      <Grid align="center">
        <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 6 }}>
          <TextInput
            placeholder="e.g. sequence accession, species name"
            value={value}
            onChange={(val) => setValue(val.target.value)}
            leftSectionWidth={60}
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
            leftSection={<IconSearch size={28} color="black" />}
          />
        </Grid.Col>
      </Grid>
    </form>
  );
}

export default function HomePage() {
  return (
    <Paper bg="midnight.7" radius={0}>
      <Paper bg="midnight.6" py={80} px={150} style={{textAlign: 'justify'}}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 6 }}>
            <Stack>
              <Title order={3} c="wheat.4">
                deepen discovery - trawl traits - curate collections
              </Title>
              <Text c="white">
                For plants, animals, microbes and other species endemic or relevant to Australia, the Australian Reference
                Genome Atlas (ARGA) locates and aggregates genomic data, including: &nbsp; <br></br>
                <b>
                &#x2022; reference genome assemblies &#x2022; genome annotations &#x2022; population and variant sets &#x2022;
                  DNA barcodes &#x2022; coding and non-coding DNA sequences &#x2022; raw genomics data
                </b>
            </Text>
            <Text c="white">
                  Search by species, higher classification, data type or ecological and phenotypic traits. Get started by entering any word in the search bar below, or scroll down to browse pre-filtered groupings.
              </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper>
        <ShowStats />
      </Paper>

      <Container maw={MAX_WIDTH} py={100}>
        <Stack gap={80}>
          <Stack gap={40}>
            <Title order={3} c="moss.5" fz={30} fw={600}>Search for data</Title>   
            <Search />
          </Stack>
          <Stack gap={40} pt={40}>
            <Title order={3} c="moss.5" fz={30} fw={600}>Browse by data type</Title>
            <BrowseType />
          </Stack>
          <Stack gap={40}>
            <Title order={3} c="moss.5" fz={30} fw={600}>Browse by taxonomic group</Title>
            <BrowseTaxon />
          </Stack>
          <Stack gap={40}>
            <Title order={3} c="moss.5" fz={30} fw={600}>Browse by functional or ecological group</Title>
            <BrowseGrouping />
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
}
