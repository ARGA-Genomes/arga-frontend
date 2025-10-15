import {
  DatasetDetails,
  SourceContentType,
  Source as SourceRaw,
} from "@/generated/types";
import { gql } from "@apollo/client";
import {
  Container,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

// Project components
import { DataPageCitation } from "@/components/page-citation";

// Local imports
import { MAX_WIDTH } from "../constants";
import { GroupedSources } from "./_components/content-type-container";
import { getClient } from "@/lib/ApolloClient";

const GET_DATASETS = gql`
  query DatasetsAndSources {
    sources {
      name
      author
      rightsHolder
      accessRights
      license
      listsId
      reusePill
      accessPill
      contentType

      datasets {
        name
        shortName
        description
        url
        citation
        license
        rightsHolder
        createdAt
        updatedAt
        reusePill
        accessPill
        publicationYear
      }
    }
  }
`;

interface Source extends SourceRaw {
  lastUpdated?: string;
}

interface GroupedSources {
  contentType: string;
  sources: Source[];
}

// Enable ISR with revalidation every 3600 seconds (1 hour)
export const revalidate = 3600;

const client = getClient();
const { error, data } = await client.query<{ sources: Source[] }>({
  query: GET_DATASETS,
});

export default function DatasetsPage() {
  const filteredSources = data?.sources.map((source) => ({
    ...source,
    datasets: source.datasets.filter((dataset) => dataset.name !== ""), // Remove datasets with an empty `name`
  }));

  const sourcesWithLastUpdated = filteredSources?.map((source) => {
    return {
      ...source,
      lastUpdated: findSourceLastUpdated(source.datasets),
    };
  });

  const groupedSources = sourcesWithLastUpdated
    ? groupByContentType(sourcesWithLastUpdated).filter(
      (group) => group.contentType !== "Unknown",
    )
    : [];

  return (
    <Stack gap="md" my="xl">
      <Paper py={30}>
        <Container maw={MAX_WIDTH}>
          <Stack gap={0}>
            <Text c="dimmed" fw={400}>
              DATA SOURCES
            </Text>
            <Text fz={38} fw={700}>
              ARGA Indexed Data Sources
            </Text>
          </Stack>
        </Container>
      </Paper>

      <Paper py="lg">
        <Container maw={MAX_WIDTH} pb={16}>
          {groupedSources.length > 0 && (
            <GroupedSources groups={groupedSources} />
          )}
          <DataPageCitation />
        </Container>
      </Paper>
    </Stack>
  );
}

function findSourceLastUpdated(datasets: DatasetDetails[]): string {
  return datasets.reduce((latest, d) => {
    const updatedAt = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
    return updatedAt > new Date(latest).getTime() ? d.updatedAt : latest;
  }, "01/01/1970");
}

function groupByContentType(sources: Source[]): GroupedSources[] {
  const desiredOrder: SourceContentType[] = [
    "GENOMIC_DATA",
    "ECOLOGICAL_TRAITS",
    "ETHNOBIOLOGY",
    "BIOCHEMICAL_TRAITS",
    "SPECIMENS",
    "TAXONOMIC_BACKBONE",
    "NONGENOMIC_DATA",
    "MIXED_DATATYPES",
    "FUNCTIONAL_TRAITS",
    "MORPHOLOGICAL_TRAITS",
  ];

  const grouped = sources.reduce((acc: Record<string, Source[]>, source) => {
    const contentType = source.contentType || "Unknown"; // Default to 'Unknown' if contentType is undefined

    // If this contentType doesn't exist in the accumulator, create a new array
    if (!acc[contentType]) {
      acc[contentType] = [];
    }

    // Push the current source into the corresponding contentType group
    acc[contentType].push(source);

    return acc;
  }, {});

  // Convert the object into an array of GroupedSources and sort by the desired order
  return Object.keys(grouped)
    .map((contentType) => ({
      contentType,
      sources: grouped[contentType],
    }))
    .sort((a, b) => {
      const indexA = desiredOrder.indexOf(a.contentType as SourceContentType);
      const indexB = desiredOrder.indexOf(b.contentType as SourceContentType);
      return (
        (indexA !== -1 ? indexA : desiredOrder.length) -
        (indexB !== -1 ? indexB : desiredOrder.length)
      );
    });
}