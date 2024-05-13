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
import { ScrollArea } from "@mantine/core";
import RecentUpdatesContainer from "../../components/recent-updates-container";

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
      <Box bg="midnight.9" w="100%">
        <Box m={60}>
          <Center>
            <Flex
              direction={{ base: "column", xl: "row" }}
              gap={{ base: 30, xl: 80 }}
              align="center"
            >
              <Stack gap={50} w={640}>
                <Stack gap={30}>
                  <Title order={3} c="wheat.4" fz={24}>
                    deepen discovery — trawl traits — curate collections
                  </Title>
                  <Text c="white" fz={16}>
                    For plants, animals, microbes and other species endemic or
                    relevant to Australia, the Australian Reference Genome Atlas
                    (ARGA) locates and aggregates genomic data, including:
                  </Text>
                  <Text c="white" fw={700} fz={16}>
                    &#x2022; reference genome assemblies &#x2022; genome
                    annotations &#x2022; population and variant sets &#x2022;
                    DNA barcodes &#x2022; coding and non-coding DNA sequences
                    &#x2022; raw genomics data
                  </Text>
                  <Text c="white" fz={16}>
                    Search by species, higher classification, data type or
                    ecological and phenotypic traits. Get started by entering
                    any word in the search bar below, or scroll down to browse
                    pre-filtered groupings.
                  </Text>
                </Stack>
                <Stack gap={5}>
                  <Title order={3} c="moss.5" fz={28} fw={600}>
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
      <Box bg="midnight.10" w="100%">
        <Stack mt={80} mx={60} gap={80}>
          <Stack gap={80}>
            <Stack gap={20} align="center">
              <Title order={3} c="moss.5" fz={28}>
                Browse by data type
              </Title>
              <BrowseType />
            </Stack>
            <Stack gap={20} align="center">
              <Title order={3} c="moss.5" fz={28}>
                Browse by taxonomic group
              </Title>
              <BrowseTaxon />
            </Stack>
            <Stack gap={20} align="center">
              <Title order={3} c="moss.5" fz={28}>
                Browse by functional or ecological group
              </Title>
              <BrowseGrouping />
            </Stack>
          </Stack>
          <Group gap={80} pb={80} align="flex-start" justify="center">
            <Stack gap={40} className={classes.bottomStack}>
              <Title order={3} c="moss.5" fz={28}>
                Taxonomic coverage
              </Title>
              <ShowTaxonomicCoverageStats />
            </Stack>
            <Stack gap={40} className={classes.bottomStack}>
              <Title order={3} c="moss.5" fz={28}>
                Recent updates
              </Title>
              <RecentUpdatesContainer />
            </Stack>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
}
