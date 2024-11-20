"use client";

import classes from "./layout.module.css";

import { gql, useQuery } from "@apollo/client";
import { Container, Paper, Stack, Tabs } from "@mantine/core";
import SpeciesHeader from "@/components/species-header";
import { RedirectType, redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";
import { PreviousPage } from "@/components/navigation-history";
import { PageCitation } from "@/components/page-citation";

const GET_SPECIES_DATA_SUMMARY = gql`
  query SpeciesWithDataSummary($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      dataSummary {
        genomes
        loci
        specimens
        other
        totalGenomic
      }
    }
  }
`;

type QueryResults = {
  species: {
    dataSummary: {
      genomes?: number;
      loci?: number;
      specimens?: number;
      other?: number;
      totalGenomic?: number;
    };
  };
};

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
      router.replace(`/species/${name}/${value}`);
    }
  }

  const canonicalName = name.replaceAll("_", " ");
  const { data } = useQuery<QueryResults>(GET_SPECIES_DATA_SUMMARY, {
    variables: { canonicalName },
  });

  const summary = data?.species.dataSummary;

  // based on the current url the active tab should always be
  // the fourth component in the path name
  const tab = path?.split("/")[3];

  if (!tab) redirect(`/species/${name}/summary`, RedirectType.replace);

  return (
    <Tabs
      variant="unstyled"
      radius={10}
      mt={40}
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
          <Tabs.Tab value="components">Genetic libraries</Tabs.Tab>
          <Tabs.Tab value="markers">Single locus data</Tabs.Tab>
          <Tabs.Tab value="population_genetics">Population genetics</Tabs.Tab>
          <Tabs.Tab value="other">Other genetic data</Tabs.Tab>
          {/* <Tabs.Tab value="annotations">Genome annotations</Tabs.Tab> */}
          {/* <Tabs.Tab value="variants">Variant sets</Tabs.Tab> */}
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
  const canonicalName = params.name.replaceAll("_", " ");

  return (
    <Stack gap={0} mt="xl">
      <Container mb={20} w="100%" maw={MAX_WIDTH}>
        <PreviousPage />
      </Container>
      <SpeciesHeader canonicalName={canonicalName} />
      <DataTabs name={params.name}>
        <Container maw={MAX_WIDTH}>{children}</Container>
      </DataTabs>
      <PageCitation />
    </Stack>
  );
}
