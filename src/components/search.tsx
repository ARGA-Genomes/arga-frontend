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
import dropdownClasses from "./search-dropdown.module.css";
import classes from "./search.module.css";

const SearchAttributeCheck: CheckboxProps["icon"] = ({ indeterminate, ...others }) =>
  indeterminate ? <IconMinus stroke="4" {...others} /> : <IconPlus stroke="4" {...others} />;

interface SearchAttributeProps {
  attribute: InputQueryAttribute;
  onSwitch: (attribute: InputQueryAttribute) => void;
  onRemove: (attribute: InputQueryAttribute) => void;
}

function SearchAttribute({ attribute, onSwitch, onRemove }: SearchAttributeProps) {
  return (
    <Tooltip {...getTooltipForAttribute(attribute)}>
      <Pill
        styles={{ label: { display: "flex", alignItems: "center" } }}
        size="xl"
        withRemoveButton
        removeButtonProps={{ style: { transform: "scale(0.8)", opacity: 0.75 } }}
        onRemove={() => onRemove(attribute)}
      >
        <Flex align="center" justify="center" gap="xs">
          <Checkbox
            icon={SearchAttributeCheck}
            checked={attribute.include}
            onChange={() => onSwitch(attribute)}
            indeterminate={!attribute.include}
            color="midnight.9"
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
interface QueryAttribute {
  group: string;
  field: string;
  name: string;
  description: string;
  example: string;
}

interface InputQueryAttribute extends QueryAttribute {
  value: string;
  include: boolean;
}

// Create the array of data attributes
const ATTRIBUTES: QueryAttribute[] = [
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

const getTooltipForAttribute = (attribute: QueryAttribute): Omit<TooltipProps, "children"> => ({
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
              Filter <b>{attribute.name}</b> by '{value}'
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

export function Search(props: SearchProps) {
  const [previous, setPrevious] = useLocalStorage<SearchRequest[]>({ key: "previous-searches", defaultValue: [] });
  const [attributes, setAttributes] = useState<InputQueryAttribute[]>([]);

  const combobox = useCombobox();
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const suggestions = ATTRIBUTES.filter(
    (attr) => search.length > 0 && attr.name.toLowerCase().startsWith(search.toLowerCase().trim())
  ).slice(0, 5);

  const attributeSuggestion: InputQueryAttribute | null = useMemo(() => {
    const found = ATTRIBUTES.find((attr) => new RegExp(`^${attr.name} [a-zA-Z0-9 \._]+$`).test(search)) || null;
    return found
      ? {
          ...found,
          value: search.substring(found.name.length + 1),
          include: true,
        }
      : found;
  }, [search]);

  const handleAttributeAdd = useCallback(() => {
    if (attributeSuggestion) {
      setAttributes([...attributes, attributeSuggestion]);
      setSearch("");
    }
  }, [attributes, attributeSuggestion, setAttributes]);

  const handleAttributeRemove = useCallback(
    ({ field }: InputQueryAttribute) => {
      setAttributes(attributes.filter((attr) => attr.field !== field));
    },
    [attributes, setAttributes]
  );

  const handleAttributeSwitch = useCallback(
    ({ field }: InputQueryAttribute) => {
      setAttributes(attributes.map((attr) => (attr.field === field ? { ...attr, include: !attr.include } : attr)));
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
    const query = `${encodeURIComponent(_search)} ${_attributes
      .map((attr) => `${attr.include ? "" : "-"}${attr.field}:"${attr.value}"`)
      .join(" ")}`;

    router.push(`/search?q=${query}`);

    if (!skip) setPrevious([{ search: _search, attributes: _attributes }, ..._previous.slice(0, 5)]);
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
          <Stack gap={0}>
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
              {suggestions.map((suggestion, i) => (
                <Text size="sm" c="gray.6" key={suggestion.field}>
                  <b>{suggestion.name.substring(0, search.length)}</b>
                  {suggestion.name.substring(search.length)}
                  {i < suggestions.length - 1 ? ", " : ""}
                </Text>
              ))}
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
                      <SearchAttribute
                        key={idx}
                        attribute={attribute}
                        onSwitch={handleAttributeSwitch}
                        onRemove={handleAttributeRemove}
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
          <Divider />
          {previous.length > 0 ? (
            <>
              {previous.map((prev, idx) => (
                <Combobox.Option
                  key={idx}
                  value={idx.toString()}
                  onClick={() => performSearch(prev.search, prev.attributes, previous, true)}
                >
                  <Flex gap="sm" align="center">
                    <Text size="sm" c={prev.search.length > 0 ? undefined : "gray.6"}>
                      {prev.search.length > 0 ? prev.search : "No search term"}
                    </Text>
                    {prev.attributes.length > 0 ? "+" : ""}
                    {prev.attributes.map((attr) => (
                      <Pill styles={{ label: { display: "flex", alignItems: "center" } }} size="xl">
                        <Flex align="center" justify="center" gap="xs">
                          <Checkbox
                            readOnly
                            icon={SearchAttributeCheck}
                            checked={attr.include}
                            indeterminate={!attr.include}
                            color="gray.5"
                            size="xs"
                          />{" "}
                          <Text size="sm" pb={2}>
                            <b>{attr.name}: </b> {attr.value}
                          </Text>
                        </Flex>
                      </Pill>
                    ))}
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
