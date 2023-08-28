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
      variant="outline"
      radius={10}
      mt={40}
      defaultValue="summary"
      value={section}
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
      <Tabs.List>
        <Tooltip label="Summary">
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
        </Tooltip>
        <Tabs.Tab value="whole_genome">Whole Genomes</Tabs.Tab>
        <Tabs.Tab value="traces">Traces</Tabs.Tab>
        <Tabs.Tab value="barcode">Genetic Loci*</Tabs.Tab>
        <Tabs.Tab value="other_genomic">Other Genetic Data</Tabs.Tab>
        <Tabs.Tab value="specimen">Specimen</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="summary" bg="white" style={{ borderRadius: 20, borderTopLeftRadius: 0 }}>
        <Summary canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="whole_genome" bg="white" style={{ borderRadius: 20 }}>
        <WholeGenome canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="traces" bg="white" style={{ borderRadius: 20 }}>
        <TraceTable canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="barcode" bg="white" style={{ borderRadius: 20 }}>
        <Barcode canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="specimen" bg="white" style={{ borderRadius: 20 }}>
        <Specimens canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="other_genomic" bg="white" style={{ borderRadius: 20 }}>
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
