'use client';

import { gql, useQuery } from "@apollo/client";
import { Paper, Chip, Autocomplete, Badge, ActionIcon, Button, Collapse, Divider, SimpleGrid, Select } from "@mantine/core";
import { useState } from "react";
import { Plus, X } from "tabler-icons-react";


const GET_TAXONOMY_FILTERS = gql`
query {
  search {
    filters {
      taxonomy {
        kingdom {
          totalMatches
          values {
            matches
            value
          }
        }

        phylum {
          totalMatches
          values {
            matches
            value
          }
        }

        class {
          totalMatches
          values {
            matches
            value
          }
        }

        family {
          totalMatches
          values {
            matches
            value
          }
        }

        genus {
          totalMatches
          values {
            matches
            value
          }
        }
      }
    }
  }
}
`

type FilterOption = {
  matches: number,
  value?: string,
};

type Filter = {
  totalMatches: number,
  values: FilterOption[],
};

type TaxonomyFilters = {
  kingdom: Filter,
  phylum: Filter,
  class: Filter,
  family: Filter,
  genus: Filter,
};

type Filters = {
  taxonomy: TaxonomyFilters,
};

type SearchResults = {
  filters: Filters,
};

type QueryResults = {
  search: SearchResults,
};

export type FilterParams = {
  kingdom: Set<string>,
  phylum: Set<string>,
  class: Set<string>,
  family: Set<string>,
  genus: Set<string>,
};


type AutocompleteData = {
  value: string,
  filter: Filter,
}

function wrapFilterData (filters: TaxonomyFilters): AutocompleteData[] {
  return [
    { value: "Kingdom", filter: filters.kingdom },
    { value: "Phylum", filter: filters.phylum },
    { value: "Class", filter: filters.class },
    { value: "Family", filter: filters.family },
    { value: "Genus", filter: filters.genus },
  ]
}


type FilterBarProps = {
  onAddFilter: (type: string, value: string) => void,
}

function FilterBar(props: FilterBarProps) {
  const [show, setShow] = useState(false);
  const [rank, setRank] = useState<AutocompleteData | null>(null);

  const addFilter = (val: string) => {
    if (!rank) return;

    setRank(null);
    setShow(false);
    props.onAddFilter(rank.value, val);
  };

  const addTaxonomy = (val: AutocompleteData) => {
    setRank(val);
  };

  const { loading, error, data } = useQuery<QueryResults>(GET_TAXONOMY_FILTERS);
  if (loading) return <>Loading..</>
  if (error) return <>Error: {error}</>
  if (!data) return <>No data</>;

  return (
    <SimpleGrid cols={1}>
      <Button onClick={() => setShow(show => !show)}><Plus />Add filter</Button>

      <Collapse in={show}>
        <Autocomplete
          placeholder="Taxonomy"
          onItemSubmit={addTaxonomy}
          data={wrapFilterData(data.search.filters.taxonomy)}
          limit={300}
        />
        {rank ? (
          <Select
            placeholder={`Filter by ${rank.value}`}
            searchable
            clearable
            nothingFound="No options"
            maxDropdownHeight={280}
            onChange={addFilter}
            data={rank.filter.values.map(item => { return { label: item.value || "", matches: item.matches, value: item.value || "" }})}
          />
        ) : (
          null
        )}
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


type SearchFilterProps = {
  onChange: (params: FilterParams) => void,
}

function SearchFilter(props: SearchFilterProps) {
  const [params, setParams] = useState<FilterParams>({
    kingdom: new Set(),
    phylum: new Set(),
    class: new Set(),
    family: new Set(),
    genus: new Set(),
  });

  const setFilter = (rank: string, val: string) => {
    const filter: FilterParams = {
      ...params,
      kingdom: rank == "Kingdom" ? new Set([...params.kingdom, val]) : params.kingdom,
      phylum: rank == "Phylum" ? new Set([...params.phylum, val]) : params.phylum,
      class: rank == "Class" ? new Set([...params.class, val]) : params.class,
      family: rank == "Family" ? new Set([...params.family, val]) : params.family,
      genus: rank == "Genus" ? new Set([...params.genus, val]) : params.genus,
    };
    setParams(filter);
    props.onChange(filter);
  }

  return (
    <Paper bg="#e7f4ff" p="lg" radius="md" shadow="xl" withBorder>
      <Chip.Group>
        {[...params.kingdom].map(filter => <FilterTag type="Kingdom" value={filter} key={filter} />)}
        {[...params.phylum].map(filter => <FilterTag type="Phylum" value={filter} key={filter} />)}
        {[...params.class].map(filter => <FilterTag type="Class" value={filter} key={filter} />)}
        {[...params.family].map(filter => <FilterTag type="Family" value={filter} key={filter} />)}
        {[...params.genus].map(filter => <FilterTag type="Genus" value={filter} key={filter} />)}
      </Chip.Group>
      <Divider my="md" />
      <FilterBar onAddFilter={setFilter} />
    </Paper>
  );
}


export { SearchFilter };
