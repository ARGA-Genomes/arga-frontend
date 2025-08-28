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

import { useSavedData } from "@/components/DownloadManager";
import { AttributePill } from "@/components/highlight-stack";
import { DataSummary } from "@/components/species-card";
import { TableCardLayout } from "@/components/table-card-switch";
import {
  FullTextSearchItem,
  GenomeItem as GenomeItemRaw,
  LocusItem as LocusItemRaw,
  SpecimenItem as SpecimenItemRaw,
  TaxonItem as TaxonItemRaw,
} from "@/generated/types";
import { IconCircleCheck, IconCircleX, IconDownload, TablerIcon } from "@tabler/icons-react";
import { range } from "lodash-es";
import Link from "next/link";
import { ReactElement, useCallback } from "react";
import classes from "./result.module.css";

// Additional props to be added
interface TaxonItem extends TaxonItemRaw {
  referenceGenome?: string;
  eventDate?: string;
}

interface SpecimenItem extends SpecimenItemRaw {
  commonNames?: string[];
}

interface GenomeItem extends GenomeItemRaw {
  commonNames?: string[];
  eventDate?: string;
}

interface LocusItem extends LocusItemRaw {
  commonNames?: string[];
  releaseDate?: string;
}

interface ResultProps<T = GenomeItem | LocusItem | SpecimenItem | TaxonItem> {
  item: T;
  link: string;
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
  w?: string | number;
  colour: string;
  label: string;
  disabled?: boolean;
  icon: TablerIcon;
  onClick?: () => void;
}

const DetailsAction = ({ w, colour, label, disabled, icon: Icon, onClick }: DetailsActionProps) => {
  const theme = useMantineTheme();
  const themeColours = theme.colors[colour];
  const textColour = themeColours[8];

  return (
    <UnstyledButton
      h="100%"
      px="sm"
      py={4}
      w={w || 125}
      bg={disabled ? themeColours[0] : themeColours[1]}
      style={{ borderRadius: theme.radius.lg }}
      className={disabled ? classes.disabled : classes.hover}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      disabled={disabled}
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

const TableTaxonDetails = ({ item, link }: ResultProps<TaxonItem>) => {
  return (
    <Flex className={classes.hover} component={Link} href={link} gap="xl" align="flex-start" py="xs">
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

const CardTaxonDetails = ({ item, link }: ResultProps<TaxonItem>) => {
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
          {item.eventDate || "no data"}
        </Text>
      </Supertext>
    </Stack>
  );
};

const TableSpecimenDetails = ({ item, link }: ResultProps<SpecimenItem>) => {
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

const CardSpecimenDetails = ({ item, link }: ResultProps<SpecimenItem>) => {
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
            {item.eventLocation || "no data"}
          </Text>
        </Supertext>
        <Supertext label="Collection year">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.eventDate || "no data"}
          </Text>
        </Supertext>
      </SimpleGrid>
    </Stack>
  );
};

const TableGenomeDetails = ({ item, link }: ResultProps<GenomeItem>) => {
  const [saved, setSaved] = useSavedData();
  const theme = useMantineTheme();

  const downloadParts = item.sourceUri ? item.sourceUri.split("/") : [];
  const downloadUrl = item.sourceUri
    ? `${item.sourceUri}/${downloadParts[downloadParts.length - 1]}_genomic.fna.gz`
    : null;

  const inCart = saved.find(({ url }) => url === downloadUrl) !== undefined;

  const handleDownloadGenome = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }, [saved, downloadUrl]);

  const handleSaveGenome = useCallback(() => {
    if (downloadUrl && !inCart) {
      setSaved([
        ...saved,
        {
          url: downloadUrl,
          label: item.accession || "",
          dataType: "whole genome",
          scientificName: item.canonicalName || "Unknown",
          datePublished: item.eventDate || "Unknown",
          dataset: { id: "", name: item.dataSource || "Unknown dataset" },
        },
      ]);
    }
  }, [saved, downloadUrl, inCart]);

  return (
    <Flex style={{ flexGrow: 1 }} gap="xl" align="flex-start" justify="space-between">
      <Flex className={classes.hover} component={Link} href={link} gap="xl" align="flex-start" py="xs">
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
          <AttributePill value={item.assemblyType || "Unknown"} />
        </Supertext>
      </Flex>
      <Flex direction="row" h="100%" gap="xs" p="xs">
        <DetailsAction
          icon={IconDownload}
          label="download"
          colour="bushfire"
          onClick={handleDownloadGenome}
          disabled={!downloadUrl}
        />
        <DetailsAction
          icon={IconCircleCheck}
          label={inCart ? "in cart" : "add to cart"}
          colour="bushfire"
          onClick={handleSaveGenome}
          disabled={!downloadUrl || inCart}
        />
      </Flex>
    </Flex>
  );
};

const CardGenomeDetails = ({ item }: ResultProps<GenomeItem>) => {
  const [saved, setSaved] = useSavedData();

  const downloadParts = item.sourceUri ? item.sourceUri.split("/") : [];
  const downloadUrl = item.sourceUri
    ? `${item.sourceUri}/${downloadParts[downloadParts.length - 1]}_genomic.fna.gz`
    : null;

  const inCart = saved.find(({ url }) => url === downloadUrl) !== undefined;

  const handleDownloadGenome = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }, [saved, downloadUrl]);

  const handleSaveGenome = useCallback(() => {
    if (downloadUrl && !inCart) {
      setSaved([
        ...saved,
        {
          url: downloadUrl,
          label: item.accession || "",
          dataType: "whole genome",
          scientificName: item.canonicalName || "Unknown",
          // datePublished: item.eventDate || "Unknown",
          dataset: { id: "", name: item.dataSource || "Unknown dataset" },
        },
      ]);
    }
  }, [saved, downloadUrl, inCart]);

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
            <AttributePill value={item.assemblyType || "Unknown"} />
          </Stack>
        </Paper>
      </Stack>
      <SimpleGrid mt="md" cols={1}>
        <Supertext label="Release date">
          <Text size="sm" fw="bold" c="midnight.9">
            {item.releaseDate || "no data"}
          </Text>
        </Supertext>
      </SimpleGrid>
      <SimpleGrid mt="md" cols={2}>
        <DetailsAction
          w="100%"
          icon={IconDownload}
          label="download"
          colour="bushfire"
          onClick={handleDownloadGenome}
          disabled={!downloadUrl}
        />
        <DetailsAction
          w="100%"
          icon={IconCircleCheck}
          label={inCart ? "in cart" : "add to cart"}
          colour="bushfire"
          onClick={handleSaveGenome}
          disabled={!downloadUrl || inCart}
        />
      </SimpleGrid>
    </Stack>
  );
};

const TableLociDetails = ({ item: rawItem, link }: ResultProps<LocusItem>) => {
  const item = rawItem as LocusItem;
  return (
    <Flex
      className={classes.hover}
      component={Link}
      href={link}
      style={{ flexGrow: 1 }}
      gap="xl"
      align="flex-start"
      justify="space-between"
    >
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
      </Flex>
    </Flex>
  );
};

const CardLociDetails = ({ item: rawItem }: ResultProps<LocusItem>) => {
  const item = rawItem! as LocusItem;
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
            {item.releaseDate || "no data"}
          </Text>
        </Supertext>
      </SimpleGrid>
    </Stack>
  );
};

type ResultDetails = {
  TAXON: {
    label: (data: FullTextSearchItem) => string;
    colour: string;
    icon: string;
    link: (data: FullTextSearchItem) => string;
    tableComponent: ({ item, link }: ResultProps<TaxonItem>) => ReactElement;
    cardComponent: ({ item, link }: ResultProps<TaxonItem>) => ReactElement;
  };
  GENOME: {
    label: (data: FullTextSearchItem) => string;
    colour: string;
    icon: string;
    link: (data: FullTextSearchItem) => string;
    tableComponent: ({ item, link }: ResultProps<GenomeItem>) => ReactElement;
    cardComponent: ({ item, link }: ResultProps<GenomeItem>) => ReactElement;
  };
  LOCUS: {
    label: (data: FullTextSearchItem) => string;
    colour: string;
    icon: string;
    link: (data: FullTextSearchItem) => string;
    tableComponent: ({ item, link }: ResultProps<LocusItem>) => ReactElement;
    cardComponent: ({ item, link }: ResultProps<LocusItem>) => ReactElement;
  };
  SPECIMEN: {
    label: (data: FullTextSearchItem) => string;
    colour: string;
    icon: string;
    link: (data: FullTextSearchItem) => string;
    tableComponent: ({ item, link }: ResultProps<SpecimenItem>) => ReactElement;
    cardComponent: ({ item, link }: ResultProps<SpecimenItem>) => ReactElement;
  };
};

const resultType: ResultDetails = {
  TAXON: {
    label: (item) =>
      ["species", "subspecies"].includes((item as TaxonItem).rank!)
        ? `${(item as TaxonItem).rank!.toUpperCase()}`
        : "HIGHER TAXON",
    colour: "moss",
    icon: "Data type_ Species (and subspecies) report.svg",
    link: (item) => `/${(item as TaxonItem).rank}/${item.canonicalName}`,
    tableComponent: TableTaxonDetails,
    cardComponent: CardTaxonDetails,
  },
  GENOME: {
    label: () => "WHOLE GENOME",
    colour: "bushfire",
    icon: "Data type_ Whole genome.svg",
    link: (item) => `/species/${item.canonicalName}/whole_genomes/${(item as GenomeItem).accession}`,
    tableComponent: TableGenomeDetails,
    cardComponent: CardGenomeDetails,
  },
  LOCUS: {
    label: () => "SINGLE LOCUS",
    colour: "wheat",
    icon: "Data type_ Markers.svg",
    link: (item) => `/species/${item.canonicalName}/markers/${(item as LocusItem).accession}`,
    tableComponent: TableLociDetails,
    cardComponent: CardLociDetails,
  },
  SPECIMEN: {
    label: () => "SPECIMEN",
    colour: "shellfish",
    icon: "Data type_ Specimen.svg",
    link: (item) => `/species/${item.canonicalName}/specimens/${(item as SpecimenItem).accession}`,
    tableComponent: TableSpecimenDetails,
    cardComponent: CardSpecimenDetails,
  },
};

export function TableResult({ item }: { item?: FullTextSearchItem }) {
  if (!item)
    return (
      <Paper className={classes.result} radius="sm" bg="gray.0">
        <Flex pl="lg" direction="row" gap="xl">
          <Center>
            <Skeleton w={175} h={30.3} radius="xl" />
          </Center>
          <Flex gap="xl" py="xs">
            {range(0, 5).map((idx) => (
              <Stack key={idx} h={54.297} w={250} gap={6}>
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

  const { label, colour, link } = resultType[item.type];

  const renderTableComponent = () => {
    switch (item.type) {
      case "TAXON":
        return <TableTaxonDetails item={item as TaxonItem} link={link(item)} />;
      case "GENOME":
        return <TableGenomeDetails item={item as GenomeItem} link={link(item)} />;
      case "LOCUS":
        return <TableLociDetails item={item as LocusItem} link={link(item)} />;
      case "SPECIMEN":
        return <TableSpecimenDetails item={item as SpecimenItem} link={link(item)} />;
      default:
        return null;
    }
  };

  return (
    <Paper className={classes.result} radius="sm" bg={`${colour}.0`}>
      <Flex pl="lg" direction="row" gap="xl">
        <Center className={classes.hover} component={Link} href={link(item)}>
          <Paper w={175} py={5} px={15} bg={`${colour}.2`} radius="xl">
            <Center>
              <Text size="sm" fw="bold" c={`${colour}.9`}>
                {label(item)}
              </Text>
            </Center>
          </Paper>
        </Center>
        {renderTableComponent()}
      </Flex>
    </Paper>
  );
}

export function CardResult({ item }: { item?: FullTextSearchItem }) {
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

  const { label, colour, link } = resultType[item.type];

  const renderCardComponent = () => {
    switch (item.type) {
      case "TAXON":
        return <CardTaxonDetails item={item as TaxonItem} link={link(item)} />;
      case "GENOME":
        return <CardGenomeDetails item={item as GenomeItem} link={link(item)} />;
      case "LOCUS":
        return <CardLociDetails item={item as LocusItem} link={link(item)} />;
      case "SPECIMEN":
        return <CardSpecimenDetails item={item as SpecimenItem} link={link(item)} />;
      default:
        return null;
    }
  };

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
                {label(item)}
              </Text>
            </Center>
          </Paper>
        </Group>
        <Box px="md" pb="md" h="100%">
          {renderCardComponent()}
        </Box>
      </Flex>
    </Paper>
  );
}

interface ResultsProps {
  items?: FullTextSearchItem[];
  perPage: number;
  layout: TableCardLayout;
}

export function Results({ items, perPage, layout }: ResultsProps) {
  if (!items) {
    return layout === "table" ? (
      <ScrollArea>
        <Stack gap={4}>
          {range(0, perPage).map((idx) => (
            <TableResult key={idx} />
          ))}
        </Stack>
      </ScrollArea>
    ) : (
      <Grid>
        {range(0, perPage).map((idx) => (
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
        {items.map((result, idx) => (
          <TableResult key={idx} item={result} />
        ))}
      </Stack>
    </ScrollArea>
  ) : (
    <Grid>
      {items.map((result, idx) => (
        <Grid.Col span={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 3 }} key={idx}>
          <CardResult item={result} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
