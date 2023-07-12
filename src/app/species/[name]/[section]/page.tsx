"use client";

import { Box, Paper, Tabs, Text, Tooltip } from "@mantine/core";
import { Barcode } from "./barcode";
import { Resources } from "./resources";
import { Specimens } from "./specimens";
import { Summary } from "./summary";
import { TraceTable } from "./traces";
import { WholeGenome } from "./wholeGenome";
import { useRouter } from "next/navigation";

function DataTabs({ name, section }: { name: string; section: string }) {
  const router = useRouter();
  const canonicalName = name.replaceAll("_", " ");

  function changeTab(value: string) {
    router.push(`/species/${name}/${value}`);
  }

  return (
    <Tabs
      mt={40}
      defaultValue="summary"
      value={section}
      onTabChange={changeTab}
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor: theme.colors["midnight"][7],
          color: theme.white,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          cursor: "pointer",
          fontSize: 17,
          display: "flex",
          alignItems: "center",
          borderTopLeftRadius: theme.radius.md,
          borderTopRightRadius: theme.radius.md,
          borderColor: theme.colors["midnight"][5],
          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          ":hover": {
            backgroundColor: theme.colors["midnight"][6],
            borderColor: theme.colors["midnight"][5],
          },

          "&[data-active]": {
            backgroundColor: theme.colors["midnight"][6],
            borderColor: theme.colors["shellfish"][5],
            color: theme.white,
            fontWeight: "bold",
            ":hover": {
              borderColor: theme.colors["shellfish"][5],
            },
          },

          ":not(:first-of-type)": {
            marginLeft: 4,
          },
        },
        tabsList: {
          borderColor: theme.colors["midnight"][5],
        },
      })}
    >
      <Tabs.List>
        <Tooltip label="Summary">
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
        </Tooltip>
        <Tabs.Tab value="whole_genome">Whole Genomes</Tabs.Tab>
        <Tabs.Tab value="traces">Traces</Tabs.Tab>
        {/*<Tabs.Tab value="organelles">Organellar Genomes</Tabs.Tab>*/}
        <Tabs.Tab value="barcode">Barcode Data</Tabs.Tab>
         <Tabs.Tab value="other_genomic">Other genetic data</Tabs.Tab>
        {/* <Tabs.Tab value="other_nongenomic">Other Non genomic Data</Tabs.Tab> */}
        <Tabs.Tab value="specimen">Specimen</Tabs.Tab>
        {/* <Tabs.Tab value="gallery">Gallery</Tabs.Tab> */}
        {/* <Tabs.Tab value="resources">Resources</Tabs.Tab> */}
      </Tabs.List>

      <Tabs.Panel value="summary" pt="xs">
        <Summary canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="whole_genome" pt="xs">
        <WholeGenome canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="traces" pt="xs">
        <TraceTable canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="organelles" pt="xs">
        tab content
      </Tabs.Panel>
      <Tabs.Panel value="barcode" pt="xs">
        <Barcode canonicalName={canonicalName} />
      </Tabs.Panel>
      {/* <Tabs.Panel value="other_genomic" pt="xs">
        tab content
      </Tabs.Panel> */}
      {/* <Tabs.Panel value="other_nongenomic" pt="xs">
        tab content
      </Tabs.Panel> */}
      <Tabs.Panel value="specimen" pt="xs">
        <Specimens canonicalName={canonicalName} />
      </Tabs.Panel>
      {/* <Tabs.Panel value="gallery" pt="xs" /> */}
      <Tabs.Panel value="resources" pt="xs">
        <Resources canonicalName={canonicalName} />
      </Tabs.Panel>
    </Tabs>
  );
}

interface SpeciesSectionProps {
  params: {
    name: string;
    section: string;
  };
}

export default function SpeciesSection({ params }: SpeciesSectionProps) {
  return (
    <Box pos="relative">
      <DataTabs name={params.name} section={params.section} />
    </Box>
  );
}
