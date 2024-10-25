import {
  ActionIcon,
  Container,
  Flex,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { DataTable, DataTableRow } from "./data-table";
import { useParams, usePathname } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { LoadOverlay } from "./load-overlay";
import { Taxonomy } from "@/app/type";
import { MAX_WIDTH } from "@/app/constants";
import * as Humanize from "humanize-plus";
import { useClipboard } from "@mantine/hooks";
import { useRef } from "react";
import { IconCopy } from "@tabler/icons-react";

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
  const page = Humanize.capitalize(location.split("/").pop() || "");
  const clipboard = useClipboard({ timeout: 500 });
  const citation = useRef<HTMLParagraphElement>(null);

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
                <Flex align="center" gap="sm">
                  <Tooltip label={clipboard.copied ? "Copied" : "Copy"}>
                    <ActionIcon
                      color="midnight.8"
                      size="sm"
                      onClick={() =>
                        clipboard.copy(citation.current?.innerText)
                      }
                    >
                      <IconCopy size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Text fw={600} fz="sm" c="midnight.7" ref={citation}>
                    Australian Reference Genome Atlas. {date.getFullYear()}.{" "}
                    <i>
                      {taxonomy?.canonicalName} {taxonomy?.authorship}, {page}
                    </i>
                    , The Australian Reference Genome Atlas. Accessed at:{" "}
                    <a
                      aria-label="Citation Link"
                      href={`https://app.arga.org.au${location}`}
                    >
                      https://app.arga.org.au{location}
                    </a>{" "}
                    on {date.getDate()}-{date.getMonth() + 1}-
                    {date.getFullYear()}
                  </Text>
                </Flex>
              </DataTableRow>
            </DataTable>
          </Stack>
        </Paper>
      </Container>
    </Paper>
  );
}
