import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Checkbox,
  CheckboxProps,
  Combobox,
  Divider,
  Flex,
  Group,
  InputBase,
  InputBaseProps,
  Kbd,
  Pill,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  TooltipProps,
  UnstyledButton,
  useCombobox,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { useLocalStorage } from "@mantine/hooks";
import { IconMinus, IconPlus, IconTrashFilled } from "@tabler/icons-react";

// Classes
import { parseAsAttribute } from "@/helpers/searchParamParser";
import { isEqual } from "lodash-es";
import { GenericFilter } from "./filtering-redux/generic";
import dropdownClasses from "./search-dropdown.module.css";
import classes from "./search.module.css";

const SearchAttributeCheck: CheckboxProps["icon"] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus stroke="4" {...others} /> : <IconPlus stroke="4" {...others} />;

interface SearchAttributeProps {
  name: string;
  value: string;
  include: boolean;
  tooltip?: Omit<TooltipProps, "children">;
  onSwitch: () => void;
  onRemove: () => void;
}

export function SearchAttribute({ name, value, include, tooltip, onSwitch, onRemove }: SearchAttributeProps) {
  const inner = (
    <Pill
      styles={{ label: { display: "flex", alignItems: "center" } }}
      size="xl"
      withRemoveButton
      removeButtonProps={{ style: { transform: "scale(0.8)", opacity: 0.75 } }}
      onRemove={onRemove}
    >
      <Flex align="center" justify="center" gap="xs">
        <Checkbox
          icon={SearchAttributeCheck}
          checked={include}
          onChange={onSwitch}
          indeterminate={!include}
          color="midnight.9"
          size="xs"
        />{" "}
        <Text size="sm" pb={2}>
          <b>{name}: </b> {value}
        </Text>
      </Flex>
    </Pill>
  );

  return tooltip ? <Tooltip {...tooltip}>{inner}</Tooltip> : inner;
}

export function DisplaySearchAttribute({ attribute }: { attribute: InputQueryAttribute }) {
  return (
    <Tooltip {...getTooltipForAttribute(attribute)}>
      <Pill styles={{ label: { display: "flex", alignItems: "center" } }} size="xl">
        <Flex align="center" justify="center" gap="xs">
          <Checkbox
            readOnly
            icon={SearchAttributeCheck}
            checked={attribute.include}
            indeterminate={!attribute.include}
            color="gray.5"
            size="xs"
          />{" "}
          <Text size="sm" pb={2}>
            <b>{attribute.name}: </b> {attribute.value}
          </Text>
        </Flex>
      </Pill>
    </Tooltip>
  );
}

// Define the interface for each entry
export interface QueryAttribute {
  group: string;
  field: string;
  name: string;
  description: string;
  example: string;
}

export interface InputQueryAttribute extends QueryAttribute {
  value: string;
  include: boolean;
}

export function buildTantivyQuery(attributes: InputQueryAttribute[], freeText: string = ""): string {
  // Remove duplicate attributes by field, value, and include
  const uniqueAttributes = attributes.filter(
    (attr, index) =>
      attributes.findIndex(
        (a) => a.field === attr.field && a.value.trim() === attr.value.trim() && a.include === attr.include
      ) === index
  );
  const clauses: string[] = [];
  const textTerm = freeText.trim();
  if (textTerm.length > 0) {
    // Add the raw free‐text clause (Tantivy will search default fields)
    clauses.push(textTerm);
  }

  // Group attributes by field into {includes: string[], excludes: string[]}
  const fieldMap = new Map<string, { includes: string[]; excludes: string[] }>();

  for (const attr of uniqueAttributes) {
    const val = attr.value.trim();
    if (!val) continue;

    if (!fieldMap.has(attr.field)) {
      fieldMap.set(attr.field, { includes: [], excludes: [] });
    }
    const bucket = fieldMap.get(attr.field)!;
    if (attr.include) {
      bucket.includes.push(val);
    } else {
      bucket.excludes.push(val);
    }
  }

  // Build one clause per field
  for (const [field, { includes, excludes }] of fieldMap.entries()) {
    // 1) If there are includes → group them under `field:…`
    if (includes.length > 0) {
      // Quote any value containing whitespace
      const formatValue = (v: string) => (/\s/.test(v) ? `"${v}"` : v);

      // First include must carry the `field:` prefix
      const firstInc = formatValue(includes[0]);
      let clause = `${field}:${firstInc}`;

      // Subsequent includes can drop the repeated `field:` prefix
      for (let i = 1; i < includes.length; i++) {
        clause += " " + formatValue(includes[i]);
      }

      // Append each exclude as ` -excludeValue` (Tantivy treats it as `-field:excludeValue`)
      for (const exVal of excludes) {
        clause += " -" + formatValue(exVal);
      }

      clauses.push(clause);
    }
    // 2) If no includes but some excludes → each gets its own `-field:value`
    else if (excludes.length > 0) {
      const formatValue = (v: string) => (/\s/.test(v) ? `"${v}"` : v);

      for (const exVal of excludes) {
        clauses.push(`-${field}:${formatValue(exVal)}`);
      }
    }
    // If both includes and excludes are empty, nothing for this field.
  }

  return clauses.join(" ");
}

// Create the array of data attributes
export const SEARCH_ATTRIBUTES: QueryAttribute[] = [
  {
    group: "Taxonomic attributes",
    field: "canonical_name",
    name: "Canonical Name",
    description: "Accepted scientific name, including genus and/or species names",
    example: "Pteropus alecto",
  },
  {
    group: "Taxonomic attributes",
    field: "common_names",
    name: "Common Names",
    description: "Common or vernacular names for a species",
    example: "Black flying-fox",
  },
  {
    group: "Taxonomic attributes",
    field: "kingdom",
    name: "Kingdom",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Animalia",
  },
  {
    group: "Taxonomic attributes",
    field: "phylum",
    name: "Phylum",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Chordata",
  },
  {
    group: "Taxonomic attributes",
    field: "class",
    name: "Class",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Mammalia",
  },
  {
    group: "Taxonomic attributes",
    field: "order",
    name: "Order",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Chiroptera",
  },
  {
    group: "Taxonomic attributes",
    field: "family",
    name: "Family",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Pteropodidae",
  },
  {
    group: "Taxonomic attributes",
    field: "genus",
    name: "Genus",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Pteropus",
  },
  {
    group: "Taxonomic attributes",
    field: "regnum",
    name: "Regnum",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Plantae",
  },
  {
    group: "Taxonomic attributes",
    field: "division",
    name: "Division",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Charophyta",
  },
  {
    group: "Taxonomic attributes",
    field: "classis",
    name: "Classis",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Equisetopsida",
  },
  {
    group: "Taxonomic attributes",
    field: "ordo",
    name: "Ordo",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Fagales",
  },
  {
    group: "Taxonomic attributes",
    field: "familia",
    name: "Familia",
    description: "Taxonomic ranks (note: this is currently case-sensitive)",
    example: "Casuarinaceae",
  },
  {
    group: "Genomic data attributes",
    field: "accession",
    name: "Accession",
    description: "Accession number assigned to a sequence datum by the source repository",
    example: "GCA_900500725.1",
  },
  {
    group: "Genomic data attributes",
    field: "level",
    name: "Level",
    description: "The assembly level for a genome: contig, scaffold, chromosome, complete genome",
    example: "Scaffold",
  },
  {
    group: "Specimen data attributes",
    field: "institution_code",
    name: "Institution Code",
    description:
      "The code for the institution, such as a museum, where a specimen has been deposited. Most institution codes will follow the convention recorded in the Global Registry of Scientific Collections (GRSciColl)",
    example: "AM",
  },
  {
    group: "Specimen data attributes",
    field: "collection_code",
    name: "Collection Code",
    description: "The code for a specific collection within an institution",
    example: "Ichthyology",
  },
  {
    group: "Specimen data attributes",
    field: "recorded_by",
    name: "Recorded By",
    description: "The group or individual who originally collected the specimen",
    example: "Sandy Desert Survey",
  },
  {
    group: "Specimen data attributes",
    field: "identified_by",
    name: "Identified By",
    description: "The group or individual who taxonomically identified the specimen",
    example: "John Smith",
  },
  {
    group: "Specimen data attributes",
    field: "collected_by",
    name: "Collected By",
    description: "The group or individual who collected the specimen",
    example: "John Smith",
  },
  {
    group: "Other data attributes",
    field: "data_source",
    name: "Data Source",
    description: "Repository or database providing sequence or specimen data",
    example: "NCBI Genbank",
  },
  {
    group: "Other data attributes",
    field: "data_type",
    name: "Data Type",
    description: "The type of data as defined in ARGA",
    example: "Genome",
  },
];

export const SEARCH_ATTRIBUTES_MAP: Record<string, QueryAttribute> = SEARCH_ATTRIBUTES.reduce((map, attribute) => {
  map[attribute.field] = attribute;
  return map;
}, {} as Record<string, QueryAttribute>);

export const getTooltipForAttribute = (attribute: QueryAttribute): Omit<TooltipProps, "children"> => ({
  zIndex: 3000,
  position: "bottom",
  radius: "lg",
  p: "sm",
  label: (
    <Stack gap="xs">
      <Badge color="midnight">{attribute.group}</Badge>
      <Text size="xs">{attribute.description}</Text>
      <Divider color="gray.8" />
      <Text size="xs">
        <b>Example: </b> {attribute.example}
      </Text>
    </Stack>
  ),
});

interface SearchSuggestionProps {
  attribute: InputQueryAttribute;
  value: string;
  onAdd: () => void;
}

function SearchSuggestion({ attribute, value, onAdd }: SearchSuggestionProps) {
  return (
    <Tooltip {...getTooltipForAttribute(attribute)}>
      <UnstyledButton className={classes.suggestion} onClick={onAdd}>
        <Pill
          style={{ border: "1px dashed black", backgroundColor: "transparent" }}
          size="xl"
          styles={{ label: { display: "flex", alignItems: "center" } }}
        >
          <Flex justify="center" align="center" gap="xs">
            <Text size="sm">
              Filter <b>{attribute.name}</b> by &apos;{value}&apos;
            </Text>
            <IconPlus size="1rem" />
          </Flex>
        </Pill>
      </UnstyledButton>
    </Tooltip>
  );
}
interface SearchProps extends InputBaseProps {
  placeholder?: string;
}

interface SearchRequest {
  search: string;
  attributes: InputQueryAttribute[];
}

export function useSearchAttributes() {
  return useLocalStorage<InputQueryAttribute[]>({ key: "search-attributes", defaultValue: [] });
}

export function Search(props: SearchProps) {
  const [previous, setPrevious] = useLocalStorage<SearchRequest[]>({ key: "search-previous", defaultValue: [] });
  const [attributes, setAttributes] = useSearchAttributes();

  const combobox = useCombobox();
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const searchLower = search.toLowerCase().trim();
  const [flash, setFlash] = useState<boolean>(false);

  const suggestions = SEARCH_ATTRIBUTES.filter(
    (attr) => search.length > 0 && attr.name.toLowerCase().includes(searchLower)
  ).slice(0, 5);

  const attributeSuggestion: InputQueryAttribute | null = useMemo(() => {
    // Ignore this lint for the next line becuase it's needed for the regex
    // eslint-disable-next-line no-useless-escape
    const found = SEARCH_ATTRIBUTES.find((attr) => new RegExp(`^${attr.name} [a-zA-Z0-9 \._]+$`).test(search)) || null;
    return found
      ? {
          ...found,
          value: search.substring(found.name.length + 1),
          include: true,
        }
      : found;
  }, [search]);

  const handlePreviousSelect = useCallback(
    (prev: SearchRequest) => {
      // apply the previous search
      setSearch(prev.search);
      setAttributes(prev.attributes);

      // trigger flash
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    },
    [setSearch, setAttributes]
  );

  const handleAttributeAdd = useCallback(() => {
    if (attributeSuggestion) {
      setAttributes([...attributes, attributeSuggestion]);
      setSearch("");
    }
  }, [attributes, attributeSuggestion, setAttributes]);

  const handleAttributeRemove = useCallback(
    ({ field, value }: InputQueryAttribute) => {
      setAttributes(attributes.filter((attr) => !(attr.field === field && attr.value === value)));
    },
    [attributes, setAttributes]
  );

  const handleAttributeSwitch = useCallback(
    ({ field, value }: InputQueryAttribute) => {
      setAttributes(
        attributes.map((attr) =>
          attr.field === field && attr.value === value ? { ...attr, include: !attr.include } : attr
        )
      );
    },
    [attributes, setAttributes]
  );

  const handleSearch = useCallback(() => performSearch(search, attributes, previous), [search, attributes, previous]);

  const performSearch = (
    _search: string,
    _attributes: InputQueryAttribute[],
    _previous: SearchRequest[],
    skip: boolean = false
  ) => {
    router.push(
      `/search?q=${_search}${attributes.length > 0 ? `&attributes=${parseAsAttribute.serialize(_attributes)}` : ""}`
    );

    // Reset search & filter state
    setSearch("");
    setAttributes([]);

    if (!skip && !(_previous[0]?.search === _search && isEqual(_previous[0]?.attributes, _attributes))) {
      setPrevious([{ search: _search, attributes: _attributes }, ..._previous.slice(0, 5)]);
    }
  };

  return (
    <Combobox classNames={dropdownClasses} store={combobox} transitionProps={{ transition: "pop" }}>
      <Combobox.Target>
        <Box pos="relative" w="100%">
          {suggestions.length > 0 && search.length > 0 && (
            <InputBase
              {...props}
              value={
                search.startsWith(suggestions[0].name)
                  ? `${suggestions[0].name} [i.e. ${suggestions[0].example}]`
                  : search + suggestions[0].name.slice(search.length)
              }
              pos="absolute"
              disabled
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                color: "rgba(0, 0, 0, 0.5)",
                backgroundColor: "transparent",
                borderColor: "transparent",
                pointerEvents: "none",
                zIndex: 3,
              }}
              rightSection={suggestions.length > 0 && <Kbd>Tab</Kbd>}
              rightSectionWidth={60}
            />
          )}
          <InputBase
            {...props}
            classNames={{ input: flash ? classes.flash : undefined }}
            pos="relative"
            value={search}
            onChange={(val) => {
              setSearch(val.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                if (suggestions.length > 0 && !attributeSuggestion) {
                  setSearch(suggestions[0].name + " ");
                } else if (attributeSuggestion) {
                  handleAttributeAdd();
                }
              }
              if (e.key === "Enter") {
                if (attributeSuggestion) {
                  handleAttributeAdd();
                } else {
                  handleSearch();
                }
              }
            }}
            onClick={() => combobox.openDropdown()}
            styles={{ input: { border: "none" } }}
            rightSection={(suggestions.length > 0 || attributeSuggestion) && <Kbd>Tab</Kbd>}
            rightSectionWidth={60}
          />
        </Box>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <Stack className={flash ? classes.flash : undefined} gap={0}>
            <Flex
              style={{
                transition: "all ease 200ms",
                overflow: "hidden",
                height: suggestions.length > 0 ? 31 : 0,
                paddingTop: suggestions.length > 0 ? 4 : 0,
              }}
              gap={5}
              px={5}
            >
              {suggestions.length > 0 && (
                <Text c="gray.8" size="sm">
                  Suggested:{" "}
                </Text>
              )}
              {suggestions.map((suggestion, i) => {
                const name = suggestion.name;
                const matchIndex = name.toLowerCase().indexOf(searchLower);
                if (matchIndex === -1) {
                  return (
                    <Text size="sm" c="gray.6" key={suggestion.field}>
                      {name}
                      {i < suggestions.length - 1 ? ", " : ""}
                    </Text>
                  );
                }
                const before = name.substring(0, matchIndex);
                const matchText = name.substring(matchIndex, matchIndex + searchLower.length);
                const after = name.substring(matchIndex + searchLower.length);
                return (
                  <Text size="sm" c="gray.6" key={suggestion.field}>
                    {before}
                    <b>{matchText}</b>
                    {after}
                    {i < suggestions.length - 1 ? ", " : ""}
                  </Text>
                );
              })}
            </Flex>
            {suggestions.length > 0 && <Divider mb={5} />}
            <Flex h={32} gap={5} mb={5} align="center">
              {!attributeSuggestion && attributes.length === 0 ? (
                <Center w="100%">
                  <Text style={{ fontSize: 14 }} c="gray.6">
                    No search filters applied
                  </Text>
                </Center>
              ) : (
                <ScrollArea.Autosize>
                  <Flex gap={5} align="center">
                    {attributeSuggestion && (
                      <SearchSuggestion
                        value={search.substring(attributeSuggestion.name.length + 1)}
                        attribute={attributeSuggestion}
                        onAdd={handleAttributeAdd}
                      />
                    )}
                    {attributes.map((attribute, idx) => (
                      <GenericFilter
                        key={idx}
                        name={attribute.name}
                        value={attribute.value}
                        include={attribute.include}
                        onSwitch={() => handleAttributeSwitch(attribute)}
                        onRemove={() => handleAttributeRemove(attribute)}
                        tooltip={getTooltipForAttribute(attribute)}
                      />
                    ))}
                  </Flex>
                </ScrollArea.Autosize>
              )}
              {attributes.length > 0 && (
                <ActionIcon color="gray.5" size="md" radius="lg" onClick={() => setAttributes([])}>
                  <IconTrashFilled size="1rem" />
                </ActionIcon>
              )}
            </Flex>
          </Stack>
          <Divider mb={5} />
          {previous.length > 0 ? (
            <>
              {previous.map((prev, idx) => (
                <Combobox.Option key={idx} value={idx.toString()} onClick={() => handlePreviousSelect(prev)}>
                  <Flex gap="sm" align="center">
                    <Text size="sm" c={prev.search.length > 0 ? undefined : "gray.6"}>
                      {prev.search.length > 0 ? prev.search : "No search term"}
                    </Text>
                    {prev.attributes.length > 0 ? "+" : ""}
                    {prev.attributes.length > 0 && (
                      <Group gap={5}>
                        {prev.attributes.map((attr, idx) => (
                          <GenericFilter
                            key={idx}
                            name={attr.name}
                            value={attr.value}
                            include={attr.include}
                            tooltip={getTooltipForAttribute(attr)}
                            readOnly
                          />
                        ))}
                      </Group>
                    )}
                  </Flex>
                </Combobox.Option>
              ))}
              <Combobox.Option value="__clear_all" onClick={() => setPrevious([])}>
                <Center>
                  <Text size="sm" fw="bold" c="gray.6">
                    Clear history
                  </Text>
                </Center>
              </Combobox.Option>
            </>
          ) : (
            <Combobox.Empty>No previous searches</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
