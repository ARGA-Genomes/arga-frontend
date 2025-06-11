import {
  ActionIcon,
  Badge,
  Combobox,
  Flex,
  Group,
  InputBase,
  Loader,
  ScrollAreaAutosize,
  SegmentedControl,
  Text,
  useCombobox,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";

import { IconTrashFilled } from "@tabler/icons-react";
import { GenericFilter } from "../generic";
import { ClassificationFilter } from "../groups/classification";
import classes from "./taxon.module.css";

export interface TaxonAutocomplete {
  commonName: string | null;
  guid: string;
  name: string;
  rankString: string;
  scientificNameMatches: string[];
}

interface TaxonSearchProps {
  onSelect: (taxon: TaxonAutocomplete) => void;
}

function TaxonSearchOption({ taxon }: { taxon: TaxonAutocomplete }) {
  return (
    <Combobox.Option value={taxon.guid}>
      <Flex w="100%" justify="space-between" align="space-between" gap="sm">
        <Text
          size="sm"
          dangerouslySetInnerHTML={{
            __html:
              taxon.scientificNameMatches[0] || `${taxon.name} ${taxon.commonName ? ` (${taxon.commonName})` : ""}`,
          }}
        />
        <Badge size="sm" variant="light" color="midnight">
          {taxon.rankString}
        </Badge>
      </Flex>
    </Combobox.Option>
  );
}

interface TaxonFilterProps extends ClassificationFilter {
  onRemove: () => void;
  onIncludeToggle: (include: boolean) => void;
}

export function TaxonFilter({ guid, disabled, name, rank, include, onRemove, onIncludeToggle }: TaxonFilterProps) {
  return (
    <Flex align="center" justify="space-between" key={guid}>
      <Group gap={12}>
        <ActionIcon disabled={disabled} size="sm" radius="md" color="red" variant="light" onClick={onRemove}>
          <IconTrashFilled size="0.75rem" />
        </ActionIcon>
        <Text opacity={disabled ? 0.5 : 1} size="sm" fw={600}>
          {name}
        </Text>
        <Badge opacity={disabled ? 0.5 : 1} size="sm" variant="light" color="midnight">
          {rank}
        </Badge>
      </Group>
      <SegmentedControl
        value={include ? "Include" : "Exclude"}
        onChange={(value) => onIncludeToggle(value === "Include" ? true : false)}
        disabled={disabled}
        radius="lg"
        size="xs"
        data={["Include", "Exclude"]}
      />
    </Flex>
  );
}

export function renderTaxonFilterChips(
  filters: ClassificationFilter[],
  onChange: (filters: ClassificationFilter[]) => void
) {
  const handleRemove = (currentFilter: ClassificationFilter) =>
    onChange(filters.filter((filter) => filter.guid !== currentFilter.guid));

  const handleSwitch = (currentFilter: ClassificationFilter) =>
    onChange(
      filters.map((filter) => (filter.guid === currentFilter.guid ? { ...filter, include: !filter.include } : filter))
    );

  return filters.map((filter) => (
    <GenericFilter
      key={filter.guid}
      name={filter.rank.charAt(0) + filter.rank.substring(1).toLowerCase()}
      onSwitch={() => handleSwitch(filter)}
      onRemove={() => handleRemove(filter)}
      value={filter.name}
      include={filter.include}
    />
  ));
}

export function TaxonSearch({ onSelect }: TaxonSearchProps) {
  const [options, setOptions] = useState<TaxonAutocomplete[]>([]);
  const combobox = useCombobox();

  // Search state
  const [searching, setSearching] = useState<boolean>(false);
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [search] = useDebouncedValue<string | null>(searchRaw, 150);
  const searchLast = useRef<string>(null);

  useEffect(() => {
    async function searchBie() {
      try {
        setSearching(true);

        const resp = await fetch(
          `${
            process.env.NEXT_PUBLIC_ALA_BIE_API_URL || "https://api.ala.org.au/species"
          }/search/auto?q=${encodeURIComponent(search!)}&idxType=TAXON&limit=30`
        );

        const seen = new Set();
        const data = ((await resp.json()) as { autoCompleteList: TaxonAutocomplete[] }).autoCompleteList.reduce(
          (prev, taxon) => {
            if (!seen.has(taxon.name) && !["species", "subspecies", "variety", "unranked"].includes(taxon.rankString)) {
              seen.add(taxon.name);
              return [...prev, taxon];
            }

            return prev;
          },
          [] as TaxonAutocomplete[]
        );

        setOptions(data);
        setSearching(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (search !== null && search !== "" && searchLast.current !== search) {
      searchBie();
    }
  }, [search]);

  const handleAdd = (taxon: TaxonAutocomplete | null) => {
    if (taxon) {
      onSelect(taxon);
      setOptions([]);
      setTimeout(() => setSearchRaw(""), 10);
      combobox.closeDropdown();
    }
  };

  useEffect(() => {
    combobox.selectFirstOption();
  }, [options, combobox]);

  return (
    <Group gap={16}>
      <Combobox
        store={combobox}
        withinPortal={false}
        classNames={classes}
        onOptionSubmit={(selectedGuid) => {
          const taxon = options.find(({ guid }) => guid === selectedGuid)!;
          searchLast.current = taxon.name;

          handleAdd(taxon);
        }}
        radius="lg"
        position="bottom"
        middlewares={{ flip: false, shift: false }}
      >
        <Combobox.Target>
          <InputBase
            w="100%"
            value={searchRaw}
            onChange={(event) => {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
              setSearchRaw(event.currentTarget.value);
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              setSearchRaw(search || "");
            }}
            placeholder="Search taxon"
            rightSectionPointerEvents="none"
            rightSection={searching && <Loader color="shellfish" size={18} />}
            radius="lg"
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {options.length === 0 ? (
              <Combobox.Empty>{searching ? "Searching..." : "No options found"}</Combobox.Empty>
            ) : (
              <ScrollAreaAutosize mah={200} type="scroll">
                {options.map((option) => (
                  <TaxonSearchOption key={option.guid} taxon={option} />
                ))}
              </ScrollAreaAutosize>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Group>
  );
}
