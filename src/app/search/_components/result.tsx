import {
  Center,
  Flex,
  Paper,
  ScrollArea,
  Stack,
  StackProps,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Item } from "../page";
import uniqBy from "lodash-es/uniqBy";

import classes from "./result.module.css";
import { ReactElement } from "react";
import { IconCircleCheck, IconCircleX, IconDownload, TablerIcon } from "@tabler/icons-react";
import { AttributePill } from "@/components/highlight-stack";
import { text } from "d3";

interface TaxonResultProps {
  item: Item;
}

interface SupertextProps extends StackProps {
  label: string;
}

const Supertext = ({ children, label, ...rest }: SupertextProps) => {
  return (
    <Stack gap={6} {...rest}>
      <Text c="midnight.11" size="sm">
        {label}
      </Text>
      {children}
    </Stack>
  );
};

const TaxonDetails = ({ item }: TaxonResultProps) => {
  return (
    <Flex gap="xl" align="flex-start" py="xs">
      <Supertext w={250} label="Accepted name">
        <Text c="midnight.11" fw="bold" fs="italic">
          {item.canonicalName}
        </Text>
      </Supertext>
      <Supertext w={200} label="Common name">
        <Text c="midnight.11" fw="bold">
          {item.commonNames?.[0] || "N/A"}
        </Text>
      </Supertext>
      <Supertext w={150} align="center" label="Reference genome">
        <ThemeIcon bg="white" radius="xl">
          {item.referenceGenome ? <IconCircleCheck color="green" /> : <IconCircleX color="red" />}
        </ThemeIcon>
      </Supertext>
      <Supertext w={100} align="center" label="Assemblies">
        <Text fw="bold" c="midnight.11">
          {item.dataSummary?.genomes}
        </Text>
      </Supertext>
      <Supertext w={100} align="center" label="Other data">
        <Text fw="bold" c="midnight.11">
          {item.dataSummary?.other}
        </Text>
      </Supertext>
      <Supertext w={100} align="center" label="Specimens">
        <Text fw="bold" c="midnight.11">
          {item.dataSummary?.specimens}
        </Text>
      </Supertext>
    </Flex>
  );
};

const SpeciemnDetails = ({ item }: TaxonResultProps) => {
  const theme = useMantineTheme();

  return (
    <Flex gap="xl" align="flex-start" py="xs">
      <Supertext w={250} label="Identification">
        <Text c="midnight.11" fw="bold" fs="italic">
          {item.canonicalName}
        </Text>
      </Supertext>
      <Supertext w={200} label="Registration number">
        <Text c="midnight.11" fw="bold">
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
        <Text fw="bold" c="midnight.11">
          {item.eventDate || "Unknown"}
        </Text>
      </Supertext>
      <Supertext w={100} label="Location">
        <Text fw="bold" c="midnight.11">
          {item.eventLocation || "Unknown"}
        </Text>
      </Supertext>
    </Flex>
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

const GenomeDetails = ({ item }: TaxonResultProps) => {
  const theme = useMantineTheme();

  return (
    <Flex style={{ flexGrow: 1 }} gap="xl" align="flex-start" justify="space-between">
      <Flex gap="xl" align="flex-start" py="xs">
        <Supertext w={150} label="Accession number">
          <Text c="midnight.11" fw="bold">
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
          <Text c="midnight.11" fw="bold">
            {item.canonicalName}
          </Text>
        </Supertext>
        <Supertext w={150} label="Assembly level">
          <AttributePill value={item.assemblyType} />
        </Supertext>
        <Supertext align="center" w={100} label="Genome size">
          <Text fw="bold" c="midnight.11">
            {"1.6 Gb" /* TODO: pull in data for this */}
          </Text>
        </Supertext>
        <Supertext align="center" w={50} label="BUSCO">
          <Text fw="bold" c="midnight.11">
            {"95.3%" /* TODO: pull in data for this */}
          </Text>
        </Supertext>
        <Supertext align="center" w={50} label="N50">
          <Text fw="bold" c="midnight.11">
            {"32" /* TODO: pull in data for this */}
          </Text>
        </Supertext>
      </Flex>
      <Flex direction="row" h="100%" gap="xs" p="xs">
        <DetailsAction icon={IconDownload} label="download" colour="bushfire" />
        <DetailsAction icon={IconCircleCheck} label="add to list" colour="bushfire" />
      </Flex>
    </Flex>
  );
};

const LociDetails = ({ item }: TaxonResultProps) => {
  const theme = useMantineTheme();
  console.log(item);

  return (
    <Flex style={{ flexGrow: 1 }} gap="xl" align="flex-start" justify="space-between">
      <Flex gap="xl" align="flex-start" py="xs">
        <Supertext w={150} label="Accession number">
          <Text c="midnight.11" fw="bold">
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
          <Text c="midnight.11" fw="bold">
            {item.canonicalName}
          </Text>
        </Supertext>
        <Supertext w={150} label="Locus">
          <Text fw="bold" c="midnight.11">
            {item.locusType}
          </Text>
        </Supertext>
        <Supertext w={150} label="Fragment size">
          <Text fw="bold" c="midnight.7">
            {"1,642 bp" /* TODO: pull in actual data */}
          </Text>
        </Supertext>
        <Supertext w={150} label="Location">
          <AttributePill value={"nuclear" /* TODO: pull in actual data */} />
        </Supertext>
      </Flex>
      <Flex direction="row" h="100%" gap="xs" p="xs">
        <DetailsAction icon={IconDownload} label="download" colour="wheat" />
        <DetailsAction icon={IconCircleCheck} label="add to list" colour="wheat" />
      </Flex>
    </Flex>
  );
};

type ResultDetails = {
  [key: string]: {
    label: string;
    colour: string;
    component: ({ item }: TaxonResultProps) => ReactElement;
  };
};

const resultType: ResultDetails = {
  TAXON: {
    label: "species",
    colour: "moss",
    component: TaxonDetails,
  },
  GENOME: {
    label: "whole genome",
    colour: "bushfire",
    component: GenomeDetails,
  },
  LOCUS: {
    label: "single locus",
    colour: "wheat",
    component: LociDetails,
  },
  SPECIMEN: {
    label: "specimen",
    colour: "shellfish",
    component: SpeciemnDetails,
  },
};

export function Result({ item }: { item: Item }) {
  const { label, colour, component: Component } = resultType[item.type];

  return (
    <Paper className={classes.result} radius="sm" bg={`${colour}.0`}>
      <Flex pl="lg" direction="row" gap="xl">
        <Center>
          <Paper w={150} py={5} px={15} bg={`${colour}.2`} radius="xl">
            <Center>
              <Text fw="bold" c={`${colour}.9`}>
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

export function Results({ items }: { items: Item[] }) {
  const results = uniqBy(items, (item) => Object.values(item).join("-"));

  return (
    <ScrollArea>
      <Stack gap={4}>
        {results.map((result, idx) => (
          <Result key={idx} item={result} />
        ))}
      </Stack>
    </ScrollArea>
  );
}
