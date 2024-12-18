"use client";

import classes from "./layout.module.css";

import { Container, Paper, Stack, Tabs } from "@mantine/core";
import SpeciesHeader from "@/components/species-header";
import { RedirectType, redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";
import { PreviousPage } from "@/components/navigation-history";
import { PageCitation } from "@/components/page-citation";

function DataTabs({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  function changeTab(value: string | null) {
    if (value !== null) {
      router.replace(`/subspecies/${name}/${value}`);
    }
  }

  // based on the current url the active tab should always be
  // the fourth component in the path name
  const tab = path?.split("/")[3];

  if (!tab) redirect(`/subspecies/${name}/summary`, RedirectType.replace);

  return (
    <Tabs
      variant="unstyled"
      radius={10}
      mt="sm"
      defaultValue="summary"
      classNames={classes}
      value={tab}
      onChange={changeTab}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="distribution">Data distribution</Tabs.Tab>
          <Tabs.Tab value="whole_genomes">Genome assemblies</Tabs.Tab>
          <Tabs.Tab value="components">Gene libraries</Tabs.Tab>
          <Tabs.Tab value="variants">Variants and population sets</Tabs.Tab>
          <Tabs.Tab value="organelle">Organelle chromosomes</Tabs.Tab>
          <Tabs.Tab value="markers">Single loci</Tabs.Tab>
          <Tabs.Tab value="other">Other genetic data</Tabs.Tab>
          {/* <Tabs.Tab value="annotations">Genome annotations</Tabs.Tab> */}
          {/* <Tabs.Tab value="other">Other genomic data</Tabs.Tab> */}
          {/* <Tabs.Tab value="protocols">Protocols</Tabs.Tab> */}
          <Tabs.Tab value="specimens">Specimens</Tabs.Tab>
          {/* <Tabs.Tab value="gallery">Gallery</Tabs.Tab> */}
          {/* <Tabs.Tab value="publications">Publications</Tabs.Tab> */}
          <Tabs.Tab value="taxonomy">Taxonomy</Tabs.Tab>
        </Tabs.List>
      </Container>

      <Paper pos="relative" py="md">
        {children}
      </Paper>
    </Tabs>
  );
}

interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({
  params,
  children,
}: SpeciesLayoutProps) {
  const name = decodeURIComponent(params.name);
  const canonicalName = name.replaceAll("_", " ");

  return (
    <Stack gap={0} mt="xl">
      <Container mb={20} w="100%" maw={MAX_WIDTH}>
        <PreviousPage />
      </Container>
      <SpeciesHeader canonicalName={canonicalName} />
      <DataTabs name={name}>
        <Container maw={MAX_WIDTH}>{children}</Container>
      </DataTabs>
      <PageCitation />
    </Stack>
  );
}
