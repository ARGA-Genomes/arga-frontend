"use client";

import { LoadOverlay } from "@/components/load-overlay";
import { gql, useQuery } from "@apollo/client";
import { Grid, Title, Paper, Button, Stack, Container } from "@mantine/core";
import Link from "next/link";
import { DateTime } from "luxon";
import { AttributePill } from "@/components/data-fields";
import { ExternalLink } from "tabler-icons-react";
import { MAX_WIDTH } from "../constants";


const GET_DATASETS = gql`
query DatasetsAndSources {
  sources {
    name
    author
    rightsHolder
    accessRights
    license

    datasets {
      globalId
      name
      shortName
      description
      url
      citation
      license
      rightsHolder
      createdAt
      updatedAt
    }
  }
}`;

type Dataset = {
  globalId: string,
  name: string,
  shortName?: string,
  description?: string,
  url?: string,
  citation?: string,
  license?: string,
  rightsHolder?: string,
  createdAt: string,
  updatedAt: string,
}

type Source = {
  name: string,
  author: string,
  rightsHolder: string,
  accessRights: string,
  license: string,
  datasets: Dataset[],
}

type QueryResults = {
  sources: Source[],
};


interface License {
  name: string,
  url: string,
}

const LICENSES: Record<string, License> = {
  "cc-by-nc-nd": { name: "(CC-BY-NC)", url: "http://creativecommons.org/licenses/by-nc-nd/4.0"},
  "cc-by-nc-sa": { name: "(CC-BY-NC-SA)", url: "http://creativecommons.org/licenses/by-nc-sa/4.0"},
  "cc-by-nc": { name: "(CC-BY-NC)", url: "http://creativecommons.org/licenses/by-nc/4.0"},
  "cc-by-nd": { name: "(CC-BY-ND)", url: "http://creativecommons.org/licenses/by-nd/4.0"},
  "cc-by-sa": { name: "(CC-BY-SA)", url: "http://creativecommons.org/licenses/by-sa/4.0"},
  "cc-by": { name: "(CC-BY)", url: "http://creativecommons.org/licenses/by/4.0"},
  "cc0": { name: "(CC0)", url: "http://creativecommons.org/publicdomain/zero/1.0"},

  "http://creativecommons.org/licenses/by-nc-sa/4.0/": { name: "CC-BY-NC-SA", url: "http://creativecommons.org/licenses/by-nc-sa/4.0/"},
  "http://creativecommons.org/licenses/by-nc/4.0/": { name: "CC-BY-NC", url: "http://creativecommons.org/licenses/by-nc/4.0/"},
  "http://creativecommons.org/licenses/by/4.0/": { name: "CC-BY", url: "http://creativecommons.org/licenses/by/4.0/"},
  "http://creativecommons.org/licenses/by-sa/4.0/": { name: "CC-BY-SA", url: "http://creativecommons.org/licenses/by-sa/4.0/"},
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": { name: "CC-BY-NC-ND", url: "http://creativecommons.org/licenses/by-nc-nd/4.0/"},

  "http://creativecommons.org/licenses/by-nc-sa/3.0/": { name: "CC-BY-NC-SA", url: "http://creativecommons.org/licenses/by-nc-sa/3.0/"},
  "http://creativecommons.org/licenses/by-nc/3.0/": { name: "CC-BY-NC", url: "http://creativecommons.org/licenses/by-nc/3.0/"},
  "http://creativecommons.org/licenses/by/3.0/": { name: "CC-BY", url: "http://creativecommons.org/licenses/by/3.0/"},
  "http://creativecommons.org/licenses/by-sa/3.0/": { name: "CC-BY-SA", url: "http://creativecommons.org/licenses/by-sa/3.0/"},
  "http://creativecommons.org/licenses/by-nc-nd/3.0/": { name: "CC-BY-NC-ND", url: "http://creativecommons.org/licenses/by-nc-nd/3.0/"},

  "public domain mark": { name: "Public Domain", url: "http://creativecommons.org/publicdomain/mark/1.0"},
  "attribution-noncommercial 4.0 international": { name: "(CC-BY-NC)", url: "https://creativecommons.org/licenses/by-nc/4.0/"},
  "attribution 4.0 international": { name: "(CC-BY)", url: "https://creativecommons.org/licenses/by/4.0/"},
}


function DatasetRow({ dataset }: { dataset: Dataset }) {
  const license = dataset.license ? LICENSES[dataset.license.toLowerCase()] : undefined;

  return (
    <Paper radius="lg">
      <Grid>
        <Grid.Col span={4} p="lg">
          <AttributePill label="Data source name" value={dataset.name} />
        </Grid.Col>
        <Grid.Col span={3} p="lg">
          <AttributePill label="Rights holder" value={dataset.rightsHolder} />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill
            label="Access rights"
            value={license?.name || dataset.license}
            href={license?.url}
            color={license ? "moss.3" : undefined}
          />
        </Grid.Col>
        <Grid.Col span={2} p="lg">
          <AttributePill label="Last updated" value={DateTime.fromISO(dataset.updatedAt).toLocaleString()} />
        </Grid.Col>
        <Grid.Col span={1}>
          <Link href={dataset.url || "#"} target="_blank">
            <Button
              w="100%"
              h="100%"
              color="midnight"
              style={{ borderRadius: "0 16px 16px 0" }}
              disabled={!dataset.url}
            >
              <Stack align="center">
                <ExternalLink size="30px" />
                Go to source
              </Stack>
            </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


function SourceRow({ source }: { source: Source }) {
  return (
    <Stack>
      <Title order={4}>{source.name}</Title>
      <Stack>
        { source.datasets.map((dataset, idx) => <DatasetRow dataset={dataset} key={idx} />) }
      </Stack>
    </Stack>
  )
}

export default function DatasetsPage() {
  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS);

  return (
      <Stack gap="xl" my="xl">
        <Paper py={20} pos="relative">
          <Container maw={MAX_WIDTH}>
            <Title>Data sources indexed in ARGA</Title>
          </Container>
        </Paper>

        <Paper py="lg">
          <Container maw={MAX_WIDTH}>
            <Paper p="lg" radius="lg" withBorder>
              <LoadOverlay visible={loading} />
              <Stack gap={50}>
                { data?.sources.map(source => <SourceRow source={source} key={source.name} />) }
              </Stack>
            </Paper>
          </Container>
        </Paper>
      </Stack>
  );
}
