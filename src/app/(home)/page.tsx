"use client";

import { gql, useQuery } from "@apollo/client";
import { Anchor, Box, Center, Flex, Group, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowUpRight, IconSearch, IconSpeakerphone } from "@tabler/icons-react";
import { useMemo } from "react";
import { ShowStats, TaxonomicComposition } from "./stats";

// Project components
import { InternalLinkButton } from "@/components/button-link-internal";

// Local components
import RecentUpdatesContainer from "../../components/recent-updates-container";
import Browse from "./browse";
import classes from "./page.module.css";

// Browse data
import { Search } from "@/components/search";
import { Overview } from "@/generated/types";
import { grouping, taxon, type } from "./_data";

interface Counts extends Overview {
  animals: number;
  plants: number;
  fungi: number;
  protista: number;
  chromista: number;
  allSpecies: number;
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

export default function HomePage() {
  const { error, data } = useQuery<{ overview: Counts }>(GET_COUNTS);
  const [opened, { close }] = useDisclosure(true);

  // Format the data
  const formattedData = useMemo(() => {
    return data
      ? {
        ...data.overview,
        sources: data.overview.sources.reduce(
          (prev, cur) => ({
            ...prev,
            [cur.name]: cur.total,
          }),
          { "ARGA Threatened Species": 0 }
        ),
      }
      : null;
  }, [data]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        radius="xl"
        centered
        zIndex={3000}
        title={
          <Flex align="center" pt="sm">
            <ThemeIcon size="xl" color="wheat.4" variant="transparent">
              <IconSpeakerphone size="3rem" style={{ transform: 'rotate(-25deg)' }} />
            </ThemeIcon>
            <Text px="sm" ff="heading" component="span" fw={700} fz="1.5rem" c="wheat.4">
              Important announcement
            </Text>
          </Flex>
        }
        transitionProps={{ transition: "pop", duration: 300 }}
        styles={{
          content: { backgroundColor: "var(--mantine-color-shellfish-6)" },
          header: { backgroundColor: "var(--mantine-color-shellfish-6)" },
          close: { color: "var(--mantine-color-wheat-4)" },
        }}
      >
        <Stack px="sm" pb="md" gap="md">
          <Title order={4} c="white">
            Our Australian Reference Genome Atlas (ARGA) pilot project has now concluded.
          </Title>
          <Text c="white">
            You may continue to access ARGA until 31 August 2026. Open-access software, documentation and other project
            artefacts remain available through ARGA&apos;s{" "}
            <Anchor c="wheat.4" href="https://github.com/ARGA-Genomes" target="_blank" underline="always">
              GitHub repository
            </Anchor>{" "}
            and{" "}
            <Anchor c="wheat.4" href="https://osf.io/nc7tp/" target="_blank" underline="always">
              OSF project page
            </Anchor>
            .
          </Text>
          <Text c="white">
            We thank all our infrastructure partners, in particular the{" "}
            <Anchor c="wheat.4" href="https://ala.org.au" target="_blank" underline="always">
              Atlas of Living Australia
            </Anchor>
            , the{" "}
            <Anchor c="wheat.4" href="https://www.biocommons.org.au/" target="_blank" underline="always">
              Australian BioCommons
            </Anchor>{" "}
            and{" "}
            <Anchor c="wheat.4" href="https://bioplatforms.com/" target="_blank" underline="always">
              BioPlatforms Australia
            </Anchor>
            , as well as the{" "}
            <Anchor c="wheat.4" href="https://ardc.edu.au/" target="_blank" underline="always">
              Australian Research Data Commons
            </Anchor>
            . ARGA was enabled by funding from the{" "}
            <Anchor c="wheat.4" href="https://www.education.gov.au/ncris" target="_blank" underline="always">
              National Collaborative Research Infrastructure Strategy
            </Anchor>
            . Through many conversations and page visits here, you have helped us create a vision for genomics data
            sharing. All of us here at the ARGA team thank each and every one of you for your insights, time and
            support.
          </Text>
        </Stack>
      </Modal>
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
                  <Stack gap="lg">
                    <Title order={3} c="moss.5" fz={28} fw={600}>
                      Search for data
                    </Title>
                    <Search
                      placeholder="e.g. sequence accession, species name"
                      leftSectionWidth={60}
                      size="xl"
                      radius="lg"
                      leftSection={<IconSearch size={24} color="black" />}
                    />
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
                <Browse items={type} data={formattedData} error={error} disabled />
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
                <Browse items={grouping} data={formattedData} error={error} />
                <InternalLinkButton
                  url={`/browse/list-groups`}
                  icon={IconArrowUpRight}
                  textColor="white"
                  textSize="md"
                  outline
                >
                  View all groups
                </InternalLinkButton>
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
    </>
  );
}
