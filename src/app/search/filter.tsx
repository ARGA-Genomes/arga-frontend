'use client';

import { Paper, Chip, Autocomplete, Badge, ActionIcon, Button, Collapse, Divider, SimpleGrid } from "@mantine/core";
import { useState } from "react";
import { Plus, X } from "tabler-icons-react";


enum Kingdom {
  Bacteria,
  Animalia,
  Protista,
  Fungi,
  Protozoa,
  Archea,
  Plantae,
  Chromista,
  Eukaryota,
  Virus,
};
const KingdomTypes = [
  "Bacteria",
  "Animalia",
  "Protista",
  "Fungi",
  "Protozoa",
  "Archea",
  "Plantae",
  "Chromista",
  "Eukaryota",
  "Virus",
];

type FilterParams = {
  kingdom?: Kingdom[],
  phylum?: string[],
  class?: string[],
  family?: string[],
  genus?: string[],
};

const FilterTypes = [
  "Kingdom",
  "Phylum",
  "Class",
  "Family",
  "Genus",
];


type FilterBarProps = {
  onAddFilter: (type: string, value: string) => void,
}

function FilterBar(props: FilterBarProps) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");
  const [val, setVal] = useState("");

  const addFilter = (val: string) => {
    setVal(val);
    props.onAddFilter(type, val);
  };

  return (
    <SimpleGrid cols={1}>
      <Button onClick={() => setShow(show => !show)}><Plus />Add filter</Button>

      <Collapse in={show}>
        <Autocomplete placeholder="Filter type" value={type} onChange={setType} data={FilterTypes} />
        <Autocomplete placeholder="Filter value" value={val} onChange={addFilter} data={KingdomTypes} disabled={type ? false : true} />
      </Collapse>
    </SimpleGrid>
  );
}


type FilterTagProps = {
  type: string,
  value: string,
  children?: React.ReactNode,
};

function FilterTag(props: FilterTagProps) {
  const removeButton = (
    <ActionIcon size="xs" color="black" radius="xl" variant="transparent">
      <X size={14} color="white" />
    </ActionIcon>
  );

  return (
    <Badge color="midnight" variant="filled" sx={{ paddingRight: 3 }} rightSection={removeButton} radius="sm">
      {props.type}: {props.value}
      { props.children }
    </Badge>
  );
}


export default function SearchFilter() {
  const [params, setParams] = useState<FilterParams>({ kingdom: [Kingdom.Animalia] });

  const setFilter = (_type: string, val: string) => {
    const filter: FilterParams = { phylum: (params.phylum || []).concat([val]) };
    setParams({...filter, ...params});
  }

  return (
    <Paper bg="#e7f4ff" p="lg" radius="md" shadow="xl" withBorder>
      <Chip.Group>
        {params.kingdom?.map(filter => <FilterTag type="Kingdom" value={Kingdom[filter]} key={filter} />)}
        {params.phylum?.map(filter => <FilterTag type="Phylum" value={filter} key={filter} />)}
      </Chip.Group>
      <Divider my="md" />
      <FilterBar onAddFilter={setFilter} />
    </Paper>
  );
}
