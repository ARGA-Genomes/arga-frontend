"use client";

import { Container, Group, MantineProvider, Paper, Stack, Tabs, Text } from "@mantine/core";
import { argaBrandLight } from '@/app/theme';
import SpeciesHeader from "@/app/components/species-header";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";


function DataTabs({ name, children }: { name: string, children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  function changeTab(value: string) {
    router.replace(`/species/${name}/${value}`);
  }

  // based on the current url the active tab should always be
  // the fourth component in the path name
  const tab = path?.split('/')[3];

  return (
    <Tabs
      variant="outline"
      radius={10}
      mt={40}
      defaultValue="taxonomy"
      value={tab}
      onTabChange={changeTab}
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          color: theme.colors["link"][0],
          padding: 25,
          paddingTop: 15,
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          ":hover": {
            backgroundColor: theme.white,
            borderColor: theme.white,
          },

          "&[data-active]": {
            backgroundColor: theme.white,
            borderColor: theme.white,
            color: theme.black,
            ":hover": {
              borderColor: theme.white,
            },
          },

          ":not(:first-of-type)": {
            marginLeft: 4,
          },
        },
        tabsList: {
          border: "none",
        },
      })}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="taxonomy">Taxonomy</Tabs.Tab>
          <Tabs.Tab value="whole_genomes">Whole Genomes</Tabs.Tab>
          <Tabs.Tab value="markers">Markers</Tabs.Tab>
          <Tabs.Tab value="resources">Other Genetic Data</Tabs.Tab>
          <Tabs.Tab value="specimens">Specimen</Tabs.Tab>
        </Tabs.List>
      </Container>

      <Paper pos="relative" py={30}>
        {children}
      </Paper>
    </Tabs>
  );
}


interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({ params, children }: SpeciesLayoutProps) {
  const canonicalName = params.name.replaceAll("_", " ");
  const searchParams = useSearchParams()
  const [previousUrl] = useState('/search?' + searchParams.get('previousUrl') || "")

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Stack spacing={0}>
        <Container mb={20} w="100%" maw={MAX_WIDTH}>
          <Link href={previousUrl}>
            <Group spacing={5}>
              <ArrowNarrowLeft />
              <Text fz={18}>Back to search results</Text>
            </Group>
          </Link>
        </Container>

        <SpeciesHeader canonicalName={canonicalName} />

        <DataTabs name={params.name}>
          <Container maw={MAX_WIDTH}>
            {children}
          </Container>
        </DataTabs>
      </Stack>
    </MantineProvider>
  );
}
