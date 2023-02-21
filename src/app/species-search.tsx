'use client';

import { gql, useLazyQuery } from "@apollo/client";
import { Autocomplete, AutocompleteItem, Group, Loader, MantineColor, SelectItemProps, Text } from "@mantine/core";
import { useDebouncedValue } from '@mantine/hooks';
import { forwardRef, useEffect, useState } from "react";
import { Search } from "tabler-icons-react";

const GET_SEARCH_SUGGESTIONS = gql`
query Suggestions($query: String) {
  search {
    suggestions(query: $query) {
      guid
      speciesName
      matched
    }
  }
}
`;


type Suggestion = {
  guid: string,
  speciesName: string,
  matched: string,
};

type SearchResults = {
  suggestions: Suggestion[],
};

type QueryResults = {
  search: SearchResults,
};


interface ItemProps extends SelectItemProps {
  color: MantineColor;
  speciesName: string;
}

const SuggestionItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, value, speciesName, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text>{speciesName}</Text>
          {speciesName != label ? (<Text size="sm">{label}</Text>) : null}
          <Text size="xs" color="dimmed">
            {value}
          </Text>
        </div>
      </Group>
    </div>
  )
);


export default function SpeciesSearch() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [debounced] = useDebouncedValue(value, 500);

  const onCompleted = (results: QueryResults) => {
    const items = results.search.suggestions.map(suggestion => {
      const value = suggestion.guid;
      const label = suggestion.matched;
      const speciesName = suggestion.speciesName;
      return { value, label, speciesName, id: `${label}-${value}` };
    });
    setSuggestions(items);
  };

  const [getSuggestions, { loading, error }] = useLazyQuery<QueryResults>(
    GET_SEARCH_SUGGESTIONS,
    { onCompleted }
  );


  useEffect(() => {
    if (debounced) {
      getSuggestions({
        variables: { query: debounced }
      });
    }
  }, [debounced]);


  return (
    <Autocomplete
      value={value}
      itemComponent={SuggestionItem}
      data={suggestions}
      onChange={val => setValue(val)}
      rightSection={loading ? <Loader variant="bars" size={28} /> : <Search size={28} />}
      rightSectionWidth={50}
      radius="md"
      size="lg"
      limit={5}
      error={error?.message}
      filter={_ => true}
    />
  )
}
