"use client";

import classes from "./layout.module.css";

import { Container, Paper, Stack, Tabs, Text } from "@mantine/core";
import SpeciesHeader from "@/components/species-header";
import { RedirectType, redirect, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";
import { PreviousPage } from "@/components/navigation-history";


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
      variant="unstyled"
      radius={10}
      mt={40}
      defaultValue="distribution"
      classNames={classes}
      value={tab}
      onChange={changeTab}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="whole_genomes">Genome Assemblies</Tabs.Tab>
          <Tabs.Tab value="resources">Genomic Components</Tabs.Tab>
          <Tabs.Tab value="markers">Single Loci</Tabs.Tab>
          <Tabs.Tab value="distribution">Data Distribution</Tabs.Tab>
          <Tabs.Tab value="specimens">Specimens</Tabs.Tab>
          <Tabs.Tab value="taxonomy">Taxonomy</Tabs.Tab>
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

  return (
      <Stack gap={0} mt="xl">
        <Container mb={20} w="100%" maw={MAX_WIDTH}>
          <PreviousPage />
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
