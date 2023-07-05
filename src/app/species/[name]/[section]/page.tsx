'use client';

import {Box, Paper, Tabs, Text, Tooltip} from "@mantine/core";
import { Barcode } from "./barcode";
import { Resources } from "./resources";
import { Specimens } from "./specimens";
import { Summary } from "./summary";
import { TraceTable } from "./traces";
import { WholeGenome } from "./wholeGenome";
import { useRouter } from "next/navigation";


function DataTabs({ name, section }: { name: string, section: string }) {
  const router = useRouter();
  const canonicalName = name.replaceAll("_", " ");

  function changeTab(value: string) {
    router.push(`/species/${name}/${value}`);
  }

  return (
    <Tabs defaultValue="summary" value={section} onTabChange={changeTab}>
      <Tabs.List style={{ paddingTop: 25 }}>
        <Tooltip label="Summary"><Tabs.Tab value="summary"><Text color="grey">Summary</Text></Tabs.Tab></Tooltip>
        <Tabs.Tab value="whole_genome"><Text color="grey">Whole Genomes</Text></Tabs.Tab>
        <Tabs.Tab value="traces"><Text color="grey">Traces</Text></Tabs.Tab>
        <Tabs.Tab value="mitogenome"><Text color="grey">Organellar Genomes</Text></Tabs.Tab>
        <Tabs.Tab value="barcode"><Text color="grey">Barcode Data</Text></Tabs.Tab>
        <Tabs.Tab value="other_genomic"><Text color="grey">Other Genomic Data</Text></Tabs.Tab>
        <Tabs.Tab value="other_nongenomic"><Text color="grey">Other Non genomic Data</Text></Tabs.Tab>
        <Tabs.Tab value="specimen"><Text color="grey">Specimen</Text></Tabs.Tab>
        <Tabs.Tab value="gallery"><Text color="grey">Gallery</Text></Tabs.Tab>
        <Tabs.Tab value="resources"><Text color="grey">Resources</Text></Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="summary" pt="xs">
        <Summary canonicalName={canonicalName}/>
      </Tabs.Panel>
      <Tabs.Panel value="whole_genome" pt="xs">
        <WholeGenome canonicalName={canonicalName}/>
      </Tabs.Panel>
      <Tabs.Panel value="traces" pt="xs">
        <TraceTable canonicalName={canonicalName}/>
      </Tabs.Panel>
      <Tabs.Panel value="mitogenome" pt="xs">
        tab content
      </Tabs.Panel>
      <Tabs.Panel value="barcode" pt="xs">
        <Barcode canonicalName={canonicalName}/>
      </Tabs.Panel>
      <Tabs.Panel value="other_genomic" pt="xs">
        tab content
      </Tabs.Panel>
      <Tabs.Panel value="other_nongenomic" pt="xs">
        tab content
      </Tabs.Panel>
      <Tabs.Panel value="specimen" pt="xs">
        <Specimens canonicalName={canonicalName} />
      </Tabs.Panel>
      <Tabs.Panel value="gallery" pt="xs">
      </Tabs.Panel>
      <Tabs.Panel value="resources" pt="xs">
        <Resources canonicalName={canonicalName}/>
      </Tabs.Panel>
    </Tabs>
  )
}


interface SpeciesSectionProps {
  params: {
    name: string,
    section: string,
  },
}

export default function SpeciesSection({ params }: SpeciesSectionProps) {
  return (
    <Box pos="relative">
      <DataTabs name={params.name} section={params.section} />
    </Box>
  )
}
