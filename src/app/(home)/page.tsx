"use client";

import {
  Paper,
  Grid,
  Text,
  Title,
  Stack,
  TextInput,
  Container,
  Flex,
  Box,
  Center,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import BrowseGrouping from "./browse-grouping";
import BrowseTaxon from "./browse-taxon";
import { Search as IconSearch } from "tabler-icons-react";
import { useState } from "react";
import BrowseType from "@/app/(home)/browse-type";
import { MAX_WIDTH } from "../constants";
import { ShowStats, ShowTaxonomicCoverageStats } from "./stats";
import classes from "./page.module.css";

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
    </form>
  );
}

export default function HomePage() {
  return (
    <Stack gap={0}>
      <Box bg="midnight.6" w="100%">
        <Box m={60}>
          <Center>
            <Flex
              direction={{ base: "column", xl: "row" }}
              gap={{ base: 30, xl: 100 }}
              // justify="center"
              // align="center"
              // justify="space-between"
            >
              <Stack gap={30} w={610}>
                <Title order={3} c="wheat.4" fz={28}>
                  deepen discovery - trawl traits - curate collections
                </Title>
                <Text c="white" size="lg">
                  For plants, animals, microbes and other species endemic or
                  relevant to Australia, the Australian Reference Genome Atlas
                  (ARGA) locates and aggregates genomic data, including:
                </Text>
                <Text c="white" fw={700} size="lg">
                  &#x2022; reference genome assemblies &#x2022; genome
                  annotations &#x2022; population and variant sets &#x2022; DNA
                  barcodes &#x2022; coding and non-coding DNA sequences &#x2022;
                  raw genomics data
                </Text>
                <Text c="white" size="lg">
                  Search by species, higher classification, data type or
                  ecological and phenotypic traits. Get started by entering any
                  word in the search bar below, or scroll down to browse
                  pre-filtered groupings.
                </Text>
                <Stack>
                  <Title order={3} c="moss.5" fz={30} fw={600}>
                    Search for data
                  </Title>
                  <Search />
                </Stack>
              </Stack>
              <Box>
                <ShowStats />
              </Box>
            </Flex>
          </Center>
        </Box>
      </Box>
      <Box bg="midnight.7" w="100%">
        <Stack mx={60} gap={40}>
          <Stack gap={80}>
            <Stack gap={40} pt={40} align="center">
              <Title order={3} c="moss.5" fz={30} fw={600}>
                Browse by data type
              </Title>
              <BrowseType />
            </Stack>
            <Stack gap={40} align="center">
              <Title order={3} c="moss.5" fz={30} fw={600}>
                Browse by taxonomic group
              </Title>
              <BrowseTaxon />
            </Stack>
            <Stack gap={40} align="center">
              <Title order={3} c="moss.5" fz={30} fw={600}>
                Browse by functional or ecological group
              </Title>
              <BrowseGrouping />
            </Stack>
          </Stack>
          <Group gap={80} pb={40} align="flex-start" justify="center">
            <Stack gap={40} align="center">
              <Title order={3} c="moss.5" fz={30} fw={600}>
                Taxonomic coverage
              </Title>
              <ShowTaxonomicCoverageStats />
            </Stack>
            <Stack gap={40} className={classes.bottomStack} display="none">
              <Title order={3} c="moss.5" fz={30} fw={600}>
                Recent updates
              </Title>
              <Paper
                w={400}
                h={425}
                bg="midnight.6"
                radius="lg"
                shadow="sm"
              ></Paper>
            </Stack>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
}
