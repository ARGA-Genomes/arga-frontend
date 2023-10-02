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


function ConferenceInfo() {
  return (
    <Paper mt={30} p={30} radius="lg" bg="midnight.5">
      <Title order={2} c="wheat.3">
        Up and coming conference
      </Title>
      <Grid>
        <Grid.Col>
          <Stack mt={40} mb={30}>
            <Title order={1} c="white">
              See you at the 2023 eResearch Brisbane
            </Title>
            <Text c="white">
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
        <Grid.Col span={{ base: 12, md: 10, lg: 10, xl: 8 }}>
          <TextInput
            placeholder="e.g. sequence accession, taxon identifier, genus name"
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
    // </Paper>
  );
}

export default function HomePage() {
  return (
    <Paper bg="midnight.7">
      <Paper bg="midnight.6" py={80} px={150}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 6 }}>
            <Stack>
              <Title order={3} c="wheat.4">
                deepen discovery - trawl traits - curate collections
              </Title>
              <Text c="white">
                For plants, animals, microbes and other species endemic or relevant to Australia, the Australian Reference
                Genome Atlas (ARGA) locates and aggregates genomic data, including
                <b>
                  reference genome assemblies &#x2022; genome annotations &#x2022; population and variant sets &#x2022;
                  DNA barcodes &#x2022; coding and non-coding DNA sequences &#x2022; raw genomics data
                </b>
            </Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>

      <Container maw={MAX_WIDTH} py={50}>
      <Stack gap={80}>
        <Stack gap={40}>
          <Title order={3} c="moss.3" fz={24} fw={550}>Search for data</Title>
          <Search />
        </Stack>
        <Stack gap={40}>
          <Title order={3} c="moss.3" fw={550}>Browse by data type</Title>
          <BrowseType />
        </Stack>
        <Stack gap={40}>
          <Title order={3} c="moss.3" fw={550}>Browse by taxonomic group</Title>
          <BrowseTaxon />
        </Stack>
        <Stack gap={40}>
          <Title order={3} c="moss.3" fw={550}>Browse by functional or ecological group</Title>
          <BrowseGrouping />
        </Stack>
      </Stack>
      </Container>
    </Paper>
  );
}
