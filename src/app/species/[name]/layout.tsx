"use client";

import classes from "./layout.module.css";

import { Container, Group, Paper, Stack, Tabs, Text } from "@mantine/core";
import SpeciesHeader from "@/components/species-header";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
import { RedirectType, redirect, usePathname, useSearchParams } from "next/navigation";
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

  if (!tab)
    redirect(`/species/${name}/distribution`, RedirectType.replace);

  return (
    <Tabs
      variant="pills"
      className={classes.tabStyles}
      radius={10}
      mt={10}
      defaultValue="distribution"
      value={tab}
      onChange={changeTab}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="distribution">Data Distribution</Tabs.Tab>
          <Tabs.Tab value="taxonomy">Taxonomy</Tabs.Tab>
          <Tabs.Tab value="whole_genomes">Whole Genomes</Tabs.Tab>
          <Tabs.Tab value="markers">Markers</Tabs.Tab>
          <Tabs.Tab value="resources">Other Genetic Data</Tabs.Tab>
          <Tabs.Tab value="specimens">Specimen</Tabs.Tab>
        </Tabs.List>
      </Container>

      <Paper pos="relative" py={30} mt= {10}>
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
      <Stack gap={0} mt="xl">
        <Container mb={20} w="100%" maw={MAX_WIDTH}>
          <Link href={previousUrl}>
            <Group gap={5}>
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
  );
}
