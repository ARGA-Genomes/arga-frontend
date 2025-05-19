"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, Title, Stack, TextInput, Flex, Box, Center, Group } from "@mantine/core";
import { /* IconArrowUpRight,*/ IconSearch } from "@tabler/icons-react";
import { ShowStats, TaxonomicComposition } from "./stats";
import { gql, useQuery } from "@apollo/client";

// Project components
// import { InternalLinkButton } from "@/components/button-link-internal";

// Local components
import RecentUpdatesContainer from "../../components/recent-updates-container";
import Browse from "./browse";
import classes from "./page.module.css";

// Browse data
import { grouping, taxon, type } from "./_data";

interface Counts {
  animals: number;
  plants: number;
  fungi: number;
  protista: number;
  chromista: number;
  allSpecies: number;
  wholeGenomes: number;
  loci: number;
  specimens: number;
  sources: [
    {
      name: string;
      total: number;
    }
  ];
}

const GET_COUNTS = gql`
  query {
    overview {
      animals: classification(by: { kingdom: "Animalia" })
      plants: classification(by: { kingdom: "Plantae" })
      fungi: classification(by: { kingdom: "Fungi" })
      protista: classification(by: { kingdom: "Protista" })
      chromista: classification(by: { kingdom: "Chromista" })
      allSpecies: classification(by: { domain: "Eukaryota" })
      wholeGenomes
      loci
      specimens
      sources {
        name
        total
      }
    }
  }
`;

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
        onChange={(val) => {
          setValue(val.target.value);
        }}
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
  const { error, data } = useQuery<{ overview: Counts }>(GET_COUNTS);

  // Format the data
  const formattedData = useMemo(() => {
    return data
      ? {
          ...data.overview,
          sources: data.overview.sources.reduce(
            (prev, cur) => ({
              ...prev,
              [cur.name.replaceAll(" ", "_")]: cur.total,
            }),
            { ARGA_Threatened_Species: 0 }
          ),
        }
      : null;
  }, [data]);

  return (
    <Stack gap={0}>
      <Box bg="midnight.9" w="100%">
        <Box m={60}>
          <Center>
            <Flex direction={{ base: "column", xl: "row" }} gap={{ base: 30, xl: 80 }} align="center">
              <Stack gap={50} w={640}>
                <Stack gap={30}>
                  <Title order={3} c="wheat.4" fz={24}>
                    deepen discovery — trawl traits — curate collections
                  </Title>
                  <Text c="white" fz={16}>
                    For plants, animals, microbes and other species endemic or relevant to Australia, the Australian
                    Reference Genome Atlas (ARGA) locates and aggregates genomic data, including:
                  </Text>
                  <Text c="white" fw={700} fz={16}>
                    &#x2022; reference genome assemblies &#x2022; genome annotations &#x2022; population and variant
                    sets &#x2022; DNA barcodes &#x2022; coding and non-coding DNA sequences &#x2022; raw genomics data
                  </Text>
                  <Text c="white" fz={16}>
                    Search by species, higher classification, data type or ecological and phenotypic traits. Get started
                    by entering any word in the search bar below, or scroll down to browse pre-filtered groupings.
                  </Text>
                </Stack>
                <Stack gap={5}>
                  <Title order={3} c="moss.5" fz={28} fw={600}>
                    Search for data
                  </Title>
                  <Search />
                </Stack>
              </Stack>
              <ShowStats />
            </Flex>
          </Center>
        </Box>
      </Box>
      <Box bg="midnight.10" w="100%">
        <Stack mt={80} mx={60} gap={80}>
          <Stack className={classes.browseStack} gap="md">
            <Stack gap={20} align="center">
              <Title order={3} c="moss.5" fz={28}>
                Browse by data type
              </Title>
              <Browse items={type} data={formattedData} error={error} />
            </Stack>
            <Stack gap={20} align="center">
              <Title order={3} c="moss.5" fz={28}>
                Browse by taxonomic group
              </Title>
              <Browse items={taxon} data={formattedData} error={error} />
            </Stack>
            <Stack gap={20} align="center" pb="xl">
              <Title order={3} c="moss.5" fz={28}>
                Browse by functional or ecological group
              </Title>
              <Browse items={grouping} data={formattedData} error={error} disabled />
              {/* <InternalLinkButton
                url={`/browse/groups`}
                icon={IconArrowUpRight}
                textColor="white"
                textSize="md"
                outline
              >
                View all groups
              </InternalLinkButton> */}
            </Stack>
          </Stack>
          <Group gap={140} pb={80} align="flex-start" justify="center">
            <Stack gap={40}>
              <Title order={3} c="moss.5" fz={28}>
                Taxonomic composition
              </Title>
              <Center>
                <TaxonomicComposition />
              </Center>
            </Stack>
            <Stack gap={40}>
              <Title order={3} c="moss.5" fz={28}>
                Recent updates
              </Title>
              <Center>
                <RecentUpdatesContainer />
              </Center>
            </Stack>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
}
