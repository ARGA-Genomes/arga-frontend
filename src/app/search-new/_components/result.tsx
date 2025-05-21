import {
  Box,
  Center,
  Flex,
  Grid,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  StackProps,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import uniqBy from "lodash-es/uniqBy";
import { Item } from "../page";

import { AttributePill } from "@/components/highlight-stack";
import { DataSummary } from "@/components/species-card";
import { TableCardLayout } from "@/components/table-card-switch";
import { IconCircleCheck, IconCircleX, TablerIcon } from "@tabler/icons-react";
import { range } from "lodash-es";
import Link from "next/link";
import { ReactElement } from "react";
import classes from "./result.module.css";

interface TaxonResultProps {
  item: Item;
}

interface SupertextProps extends StackProps {
  label: string;
  labelColour?: string;
}

const Supertext = ({ children, label, labelColour, ...rest }: SupertextProps) => {
  return (
    <Stack gap={6} {...rest}>
      <Text c={labelColour || "midnight.9"} size="sm">
        {label}
      </Text>
      {children}
    </Stack>
  );
};

interface DetailsActionProps {
  colour: string;
  label: string;
  icon: TablerIcon;
}

const DetailsAction = ({ colour, label, icon: Icon }: DetailsActionProps) => {
  const theme = useMantineTheme();
  const themeColours = theme.colors[colour];
  const textColour = themeColours[8];

  return (
    <UnstyledButton
      h="100%"
      px="sm"
      py={4}
      w={125}
      bg={themeColours[1]}
      style={{ borderRadius: theme.radius.lg /*outline: `1px solid ${themeColours[3]}`*/ }}
    >
      <Flex direction="column" align="center" gap={4}>
        <Icon size="1rem" color={textColour} />
        <Text c={textColour} fw={600} size="sm">
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  );
};

const TableTaxonDetails = ({ item }: TaxonResultProps) => {
  return (
    <Flex gap="xl" align="flex-start" py="xs">
      <Supertext w={250} label="Accepted name">
        <Text c="midnight.9" fw="bold" fs="italic">
          {item.canonicalName}
        </Text>
      </Supertext>
      <Supertext w={200} label="Common name">
        <Text c="midnight.9" fw="bold">
          {item.commonNames?.[0] || "N/A"}
        </Text>
      </Supertext>
      <Supertext w={150} align="center" label="Reference genome">
        <ThemeIcon bg="white" radius="xl">
          {item.referenceGenome ? <IconCircleCheck color="green" /> : <IconCircleX color="red" />}
        </ThemeIcon>
      </Supertext>
      <Supertext w={100} align="center" label="Assemblies">
        <Text fw="bold" c="midnight.9">
          {item.dataSummary?.genomes}
        </Text>
      </Supertext>
      <Supertext w={100} align="center" label="Other data">
        <Text fw="bold" c="midnight.9">
          {item.dataSummary?.other}
        </Text>
      </Supertext>
      <Supertext w={100} align="center" label="Specimens">
        <Text fw="bold" c="midnight.9">
          {item.dataSummary?.specimens}
        </Text>
      </Supertext>
    </Flex>
  );
};

const CardTaxonDetails = ({ item }: TaxonResultProps) => {
  return (
    <Stack justify="space-between" w="100%" h="100%">
      <Stack>
        <Stack gap={4}>
          <Text lineClamp={2} c="midnight.9" fw="bold" fs="italic">
            {item.canonicalName}
          </Text>
          <Text c={(item.commonNames || []).length === 0 ? "midnight.4" : "midnight.9"} size="sm">
            {item.commonNames?.[0] || "No common name"}
          </Text>
        </Stack>
        <Paper p="md" radius="lg" bg="wheat.0">
          <SimpleGrid cols={2}>
            <Stack gap="xs" align="center">
              <ThemeIcon size={72} bg="white" radius="xl">
                {item.referenceGenome ? (
                  <IconCircleCheck size="3.5rem" color="green" />
                ) : (
                  <IconCircleX size="3.5rem" color="red" />
                )}
              </ThemeIcon>
              <Text c="midnight.9" size="sm">
                Reference genome
              </Text>
            </Stack>
            <Stack justify="space-between">
              {[
                { key: "genomes", name: "Assemblies" },
                { key: "loci", name: "Single loci" },
                { key: "specimens", name: "Specimens" },
              ].map(({ key, name }) => {
                const value = item.dataSummary[key as keyof DataSummary];

                return (
                  <Group key={key} pl={6}>
                    <Text style={{ textAlign: "right" }} w={32} size="sm" fw="bold" c="midnight.9">
                      {value}
                    </Text>
                    <Text ml={6} size="sm" c="midnight.9">
                      {name}
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          </SimpleGrid>
        </Paper>
        <Stack align="center" my="sm">
          <Text size="sm">Genetic data coverage</Text>
          <Group>
            <Tooltip label="Reference" radius="md">
              <ThemeIcon variant={item.referenceGenome ? "filled" : "outline"} size="lg" color="moss.2" radius="xl" />
            </Tooltip>
            <Tooltip label="Assembly" radius="md">
              <ThemeIcon
                variant={item.dataSummary.genomes > 0 ? "filled" : "outline"}
                size="lg"
                color="bushfire.2"
                radius="xl"
              />
            </Tooltip>
            <Tooltip label="Loci" radius="md">
              <ThemeIcon
                variant={item.dataSummary.loci > 0 ? "filled" : "outline"}
                size="lg"
                color="wheat.2"
                radius="xl"
              />
            </Tooltip>
            <Tooltip label="Other" radius="md">
              <ThemeIcon
                variant={item.dataSummary.other > 0 ? "filled" : "outline"}
                size="lg"
                color="shellfish.2"
                radius="xl"
              />
            </Tooltip>
          </Group>
        </Stack>
      </Stack>
      <Supertext label="Latest record">
        <Text size="sm" fw="bold" c="midnight.9">
          {item.eventDate || "not known"}
        </Text>
      </Supertext>
    </Stack>
  );
};

const TableSpecimenDetails = ({ item }: TaxonResultProps) => {
  const theme = useMantineTheme();

  return (
    <Flex gap="xl" align="flex-start" py="xs">
      <Supertext w={250} label="Identification">
        <Text c="midnight.9" fw="bold" fs="italic">
          {item.canonicalName}
        </Text>
      </Supertext>
      <Supertext w={200} label="Registration number">
        <Text c="midnight.9" fw="bold">
          {item.accession}
        </Text>
      </Supertext>
      <Flex justify="flex-start" align="center" w={200} h="100%">
        <Paper py={5} px={15} radius="xl" style={{ border: `1px solid ${theme.colors["shellfish"][2]}` }}>
          <Text size="sm" fw={600} c="shellfish.8">
            {item.dataSource}
          </Text>
        </Paper>
      </Flex>
      <Supertext w={150} label="Collection date">
        <Text fw="bold" c="midnight.9">
          {item.eventDate || "Unknown"}
        </Text>
      </Supertext>
      <Supertext w={100} label="Location">
        <Text fw="bold" c="midnight.9">
          {item.eventLocation || "Unknown"}
        </Text>
      </Supertext>
    </Flex>
  );
};

const CardSpecimenDetails = ({ item }: TaxonResultProps) => {
  return (
    <Stack justify="space-between" h="100%" w="100%">
      <Stack>
        <Stack gap={4}>
          <Text lineClamp={2} c="midnight.9" fw="bold" fs="italic">
            {item.canonicalName}
          </Text>
          <Text c={(item.commonNames || []).length === 0 ? "midnight.4" : "midnight.9"} size="sm">
            {item.commonNames?.[0] || "No common name"}
          </Text>
        </Stack>
        <Paper p="sm" radius="lg" bg="wheat.0">
          <Stack gap="xs">
            <Supertext label="Registration Number">
              <Text fw="bold" c="midnight.9">
                {item.accession}
              </Text>
            </Supertext>
            <Paper py={5} px={15} radius="xl" style={{ border: `1px solid var(--mantine-color-shellfish-2)` }}>
              <Text size="sm" fw={600} c="shellfish.8">
                {item.dataSource}
              </Text>
            </Paper>
          </Stack>
        </Paper>
      </Stack>
      <SimpleGrid mt="md" cols={2}>
        <Supertext label="Location">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.eventLocation || "not known"}
          </Text>
        </Supertext>
        <Supertext label="Collection year">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.eventDate || "not known"}
          </Text>
        </Supertext>
      </SimpleGrid>
    </Stack>
  );
};

const TableGenomeDetails = ({ item }: TaxonResultProps) => {
  const theme = useMantineTheme();

  return (
    <Flex style={{ flexGrow: 1 }} gap="xl" align="flex-start" justify="space-between">
      <Flex gap="xl" align="flex-start" py="xs">
        <Supertext w={150} label="Accession number">
          <Text c="midnight.9" fw="bold">
            {item.accession}
          </Text>
        </Supertext>
        <Flex style={{ alignSelf: "center" }} w={150}>
          <Paper py={5} px={15} radius="xl" style={{ border: `1px solid ${theme.colors["shellfish"][2]}` }}>
            <Text size="sm" fw={600} c="shellfish.8">
              {item.dataSource}
            </Text>
          </Paper>
        </Flex>
        <Supertext w={250} label="Identification">
          <Text c="midnight.9" fw="bold">
            {item.canonicalName}
          </Text>
        </Supertext>
        <Supertext w={150} label="Assembly level">
          <AttributePill value={item.assemblyType} />
        </Supertext>
        {/* <Supertext align="center" w={100} label="Genome size">
          <Text fw="bold" c="midnight.9">
            TODO: Pull in data for this
          </Text>
        </Supertext>
        <Supertext align="center" w={50} label="BUSCO">
          <Text fw="bold" c="midnight.9">
            TODO: Pull in data for this
          </Text>
        </Supertext>
        <Supertext align="center" w={50} label="N50">
          <Text fw="bold" c="midnight.9">
            TODO: Pull in data for this
          </Text>
        </Supertext> */}
      </Flex>
      {/* <Flex direction="row" h="100%" gap="xs" p="xs">
        <DetailsAction icon={IconDownload} label="download" colour="bushfire" />
        <DetailsAction icon={IconCircleCheck} label="add to list" colour="bushfire" />
      </Flex> */}
    </Flex>
  );
};

const CardGenomeDetails = ({ item }: TaxonResultProps) => {
  return (
    <Stack justify="space-between" h="100%" w="100%">
      <Stack>
        <Stack gap={4}>
          <Text lineClamp={2} c="midnight.9" fw="bold" fs="italic">
            {item.canonicalName}
          </Text>
          <Text c={(item.commonNames || []).length === 0 ? "midnight.4" : "midnight.9"} size="sm">
            {item.commonNames?.[0] || "No common name"}
          </Text>
        </Stack>
        <Paper p="sm" radius="lg" bg="wheat.0">
          <Stack gap="xs">
            <Supertext label="Accession Number">
              <Text fw="bold" c="midnight.9">
                {item.accession}
              </Text>
            </Supertext>
            <Paper py={5} px={15} radius="xl" style={{ border: `1px solid var(--mantine-color-shellfish-2)` }}>
              <Text size="sm" fw={600} c="shellfish.8">
                {item.dataSource}
              </Text>
            </Paper>
            <AttributePill value={item.assemblyType} />
          </Stack>
        </Paper>
      </Stack>
      <SimpleGrid mt="md" cols={1}>
        <Supertext label="Release date">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.releaseDate || "not known"}
          </Text>
        </Supertext>
      </SimpleGrid>
    </Stack>
  );
};

const TableLociDetails = ({ item }: TaxonResultProps) => {
  return (
    <Flex style={{ flexGrow: 1 }} gap="xl" align="flex-start" justify="space-between">
      <Flex gap="xl" align="flex-start" py="xs">
        <Supertext w={150} label="Accession number">
          <Text c="midnight.9" fw="bold">
            {item.accession}
          </Text>
        </Supertext>
        <Flex style={{ alignSelf: "center" }} w={150}>
          <Paper py={5} px={15} radius="xl" style={{ border: `1px solid var(--mantine-color-shellfish-2)` }}>
            <Text size="sm" fw={600} c="shellfish.8">
              {item.dataSource}
            </Text>
          </Paper>
        </Flex>
        <Supertext w={250} label="Identification">
          <Text c="midnight.9" fw="bold">
            {item.canonicalName}
          </Text>
        </Supertext>
        <Supertext w={150} label="Locus">
          <Text fw="bold" c="midnight.9">
            {item.locusType}
          </Text>
        </Supertext>
        {/* <Supertext w={150} label="Fragment size">
          <Text fw="bold" c="midnight.7">
            TODO: pull in actual data
          </Text>
        </Supertext>
        <Supertext w={150} label="Location">
          <AttributePill value="TODO: pull in actual data" />
        </Supertext> */}
      </Flex>
      {/* <Flex direction="row" h="100%" gap="xs" p="xs">
        <DetailsAction icon={IconDownload} label="download" colour="wheat" />
        <DetailsAction icon={IconCircleCheck} label="add to list" colour="wheat" />
      </Flex> */}
    </Flex>
  );
};

const CardLociDetails = ({ item }: TaxonResultProps) => {
  return (
    <Stack justify="space-between" h="100%" w="100%">
      <Stack>
        <Stack gap={4}>
          <Text lineClamp={2} c="midnight.9" fw="bold" fs="italic">
            {item.canonicalName}
          </Text>
          <Text c={(item.commonNames || []).length === 0 ? "midnight.4" : "midnight.9"} size="sm">
            {item.commonNames?.[0] || "No common name"}
          </Text>
        </Stack>
        <Paper p="sm" radius="lg" bg="wheat.0">
          <Stack gap="xs">
            <Supertext label="Accession Number">
              <Text fw="bold" c="midnight.9">
                {item.accession}
              </Text>
            </Supertext>
            <Supertext label="Locus">
              <Text fw="bold" c="midnight.9">
                {item.locusType}
              </Text>
            </Supertext>
            <Paper py={5} px={15} radius="xl" style={{ border: `1px solid var(--mantine-color-shellfish-2)` }}>
              <Text size="sm" fw={600} c="shellfish.8">
                {item.dataSource}
              </Text>
            </Paper>
          </Stack>
        </Paper>
      </Stack>
      <SimpleGrid mt="md" cols={1}>
        <Supertext label="Release date">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.releaseDate || "not known"}
          </Text>
        </Supertext>
      </SimpleGrid>
    </Stack>
  );
};

type ResultDetails = {
  [key: string]: {
    label: string;
    colour: string;
    icon: string;
    link: (data: Item) => string;
    tableComponent: ({ item }: TaxonResultProps) => ReactElement;
    cardComponent: ({ item }: TaxonResultProps) => ReactElement;
  };
};

const resultType: ResultDetails = {
  TAXON: {
    label: "SPECIES REPORT",
    colour: "moss",
    icon: "Data type_ Species (and subspecies) report.svg",
    link: (item) => `/species/${item.canonicalName}`,
    tableComponent: TableTaxonDetails,
    cardComponent: CardTaxonDetails,
  },
  GENOME: {
    label: "WHOLE GENOME",
    colour: "bushfire",
    icon: "Data type_ Whole genome.svg",
    link: (item) => `/species/${item.canonicalName}/whole_genome/${item.accession}`,
    tableComponent: TableGenomeDetails,
    cardComponent: CardGenomeDetails,
  },
  LOCUS: {
    label: "SINGLE LOCUS",
    colour: "wheat",
    icon: "Data type_ Markers.svg",
    link: (item) => `/species/${item.canonicalName}/markers/${item.accession}`,
    tableComponent: TableLociDetails,
    cardComponent: CardLociDetails,
  },
  SPECIMEN: {
    label: "SPECIMEN",
    colour: "shellfish",
    icon: "Data type_ Specimen.svg",
    link: (item) => `/species/${item.canonicalName}/specimen/${item.accession}`,
    tableComponent: TableSpecimenDetails,
    cardComponent: CardSpecimenDetails,
  },
};

export function TableResult({ item }: { item?: Item }) {
  if (!item)
    return (
      <Paper className={classes.result} radius="sm" bg="gray.0">
        <Flex pl="lg" direction="row" gap="xl">
          <Center>
            <Skeleton w={150} h={30.3} radius="xl" />
          </Center>
          <Flex gap="xl" py="xs">
            {range(0, 5).map((idx) => (
              <Stack key={idx} h={54.297} w={150} gap={6}>
                <Skeleton>
                  <Text size="sm">Label</Text>
                </Skeleton>
                <Skeleton>
                  <Text>Content</Text>
                </Skeleton>
              </Stack>
            ))}
          </Flex>
        </Flex>
      </Paper>
    );

  const { label, colour, link, tableComponent: Component } = resultType[item.type];

  return (
    <Paper component={Link} href={link(item)} className={classes.result} radius="sm" bg={`${colour}.0`}>
      <Flex pl="lg" direction="row" gap="xl">
        <Center>
          <Paper w={150} py={5} px={15} bg={`${colour}.2`} radius="xl">
            <Center>
              <Text size="sm" fw="bold" c={`${colour}.9`}>
                {label}
              </Text>
            </Center>
          </Paper>
        </Center>
        <Component item={item} />
      </Flex>
    </Paper>
  );
}

export function CardResult({ item }: { item?: Item }) {
  if (!item)
    return (
      <Paper h="100%" radius="lg" style={{ border: `1px solid var(--mantine-color-midnight-0)` }}>
        <Flex direction="column" gap="sm" h="100%">
          <Group
            p="md"
            justify="space-between"
            bg="gray.0"
            style={{
              borderTopLeftRadius: "var(--mantine-radius-lg)",
              borderTopRightRadius: "var(--mantine-radius-lg)",
            }}
          >
            <Skeleton radius="xl">
              <Paper py={5} px="xl" radius="xl">
                <Center>
                  <Text size="sm">Loading</Text>
                </Center>
              </Paper>
            </Skeleton>
          </Group>
          <Box p="md" pb="md" h="100%">
            <Skeleton h={200} radius="lg" />
          </Box>
        </Flex>
      </Paper>
    );

  const { label, colour, link, cardComponent: Component } = resultType[item.type];

  return (
    <Paper
      component={Link}
      href={link(item)}
      className={classes.card}
      h="100%"
      radius="lg"
      style={{ border: `1px solid var(--mantine-color-${colour}-1)` }}
    >
      <Flex direction="column" gap="sm" h="100%">
        <Group
          p="md"
          justify="space-between"
          bg={`${colour}.0`}
          style={{ borderTopLeftRadius: "var(--mantine-radius-lg)", borderTopRightRadius: "var(--mantine-radius-lg)" }}
        >
          <Paper py={5} px="xl" bg={`${colour}.2`} radius="xl">
            <Center>
              <Text size="sm" fw="bold" c={`${colour}.9`}>
                {label}
              </Text>
            </Center>
          </Paper>
        </Group>
        <Box px="md" pb="md" h="100%">
          <Component item={item} />
        </Box>
      </Flex>
    </Paper>
  );
}

interface ResultsProps {
  items?: Item[];
  layout: TableCardLayout;
}

export function Results({ items, layout }: ResultsProps) {
  const results = uniqBy(items, (item) => Object.values(item).join("-"));

  if (!items) {
    return layout === "table" ? (
      <ScrollArea>
        <Stack gap={4}>
          {range(0, 10).map((idx) => (
            <TableResult key={idx} />
          ))}
        </Stack>
      </ScrollArea>
    ) : (
      <Grid>
        {range(0, 12).map((idx) => (
          <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }} key={idx}>
            <CardResult />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  return layout === "table" ? (
    <ScrollArea>
      <Stack gap={4}>
        {results.map((result, idx) => (
          <TableResult key={idx} item={result} />
        ))}
      </Stack>
    </ScrollArea>
  ) : (
    <Grid>
      {results.map((result, idx) => (
        <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }} key={idx}>
          <CardResult item={result} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
