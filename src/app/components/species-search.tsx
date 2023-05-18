'use client';

import { gql, useLazyQuery } from "@apollo/client";
import { Autocomplete, AutocompleteItem, Box, Group, Loader, MantineColor, SelectItemProps, Text } from "@mantine/core";
import { useDebouncedValue } from '@mantine/hooks';
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import { Search } from "tabler-icons-react";

const GET_SEARCH_SUGGESTIONS = gql`
query Suggestions($query: String) {
  search {
    suggestions(query: $query) {
      guid
      speciesName
      commonName
      matched
    }
  }
}
`;


type Suggestion = {
  guid: string,
  speciesName: string,
  commonName: string,
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

// The AutocompleteItem component that is shown in a drop down under the search input
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
SuggestionItem.displayName = "SuggestionItem";


// Search by taxonomy input component. This uses the mantine autocomplete
// component with dynamic data and custom AutocompleteItems. It will also
// debounce the input to avoid sending superfluous requests for each change.
export default function SpeciesSearch() {
  const router = useRouter();

  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [debounced] = useDebouncedValue(value, 500);

  // Construct the autocomplete items from the search suggestion results.
  // Rather than tie the backend payload to the frontend component we add some
  // indirection on the client side here to buffer against changes. Since very
  // few records actually get returned this is negligible
  const onCompleted = (results: QueryResults) => {
    const items = results.search.suggestions.map(suggestion => {
      const value = suggestion.commonName;
      const label = suggestion.matched;
      const speciesName = suggestion.speciesName;
      return { value, label, speciesName, id: `${label}-${value}` };
    });
    setSuggestions(items);
  };

  // use a lazy query here as we don't want to execute straight away
  const [getSuggestions, { loading, error }] = useLazyQuery<QueryResults>(
    GET_SEARCH_SUGGESTIONS,
    { onCompleted }
  );

  // debounce and send a search suggestion request when the input changes
  useEffect(() => {
    if (debounced) {
      getSuggestions({
        variables: { query: debounced }
      });
    }
  }, [debounced, getSuggestions]);

  function onSearch() {
    router.push(`/search?q=${encodeURIComponent(value)}&type=all`);
  }

  // the style is hardcoded as the home page search box for now
  // but this can easily be changed if the auto suggest functionality
  // is needed elsewhere
  return (
    <form onSubmit={(ev) => { ev.preventDefault(); onSearch() }}>
    <Autocomplete
      value={value}
      itemComponent={SuggestionItem}
      data={suggestions}
      onChange={val => setValue(val)}
      onItemSubmit={item => router.push(`/species/${item.value.replaceAll(" ", "_")}`)}
      rightSection={loading ? <Loader variant="bars" size={28} /> : <Search size={35} />}
      rightSectionWidth={100}
      limit={5}
      error={error?.message}
      filter={_ => true}
      size="xl"
      radius={20}
      styles={{ input: { height: 90 } }}
    />
    </form>
  )
}
