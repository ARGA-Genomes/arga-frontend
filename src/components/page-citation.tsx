import { Container, Paper, Stack, Text } from "@mantine/core";
import { DataTable, DataTableRow } from "./data-table";
import { useParams, usePathname } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { LoadOverlay } from "./load-overlay";
import { Taxonomy } from "@/app/type";
import { MAX_WIDTH } from "@/app/constants";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type QueryResults = {
  species: {
    taxonomy: Taxonomy[];
  };
};

const GET_SPECIES = gql`
  query Species($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      taxonomy {
        canonicalName
        vernacularGroup
        authorship
      }
    }
  }
`;

export function PageCitation() {
  const params = useParams();
  const location = usePathname();

  const { loading, error, data } = useQuery<QueryResults>(GET_SPECIES, {
    variables: {
      canonicalName: (params.name as string).replaceAll("_", " "),
    },
  });

  const taxonomy = data?.species.taxonomy[0];
  const date = new Date();

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Paper pb="lg">
      <LoadOverlay visible={loading} />
      <Container maw={MAX_WIDTH}>
        <Paper p="md" radius="lg" withBorder>
          <Stack>
            <Text size="lg" fw="bold">
              Page information
            </Text>
            <DataTable>
              <DataTableRow label="Citation">
                <Text fw={600} fz="sm" c="midnight.7">
                  Australian Reference Genome Atlas {date.getFullYear()},{" "}
                  <i>
                    {taxonomy?.canonicalName} {taxonomy?.authorship}, Taxonomy
                  </i>
                  , The Australian Reference Genome Atlas, accessed{" "}
                  {date.getDate()} {months[date.getMonth()]}{" "}
                  {date.getFullYear()},{" "}
                  <a
                    aria-label="Citation Link"
                    href={`https://app.arga.org.au${location}`}
                  >
                    https://app.arga.org.au{location}
                  </a>
                </Text>
              </DataTableRow>
            </DataTable>
          </Stack>
        </Paper>
      </Container>
    </Paper>
  );
}
