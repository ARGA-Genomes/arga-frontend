"use client";

import { Group, Text, Paper, Container, Stack, Grid } from "@mantine/core";

import { PreviousPage } from "@/components/navigation-history";
import BrowseGrouping from "./browse-grouping";

export default function AllGroups() {
  return (
    <>
      <Group p="lg">
        <PreviousPage />
      </Group>
      <Paper>
        <Container fluid p="xl">
          <Stack gap="lg">
            <Text c="midnight.9" fw="bold" style={{ fontSize: 24 }}>
              Browse all traits and ecological groupings
            </Text>
            <Paper p="md" radius="lg" withBorder>
              <Text c="midnight.9" mb="sm">
                Select a group icon to browse species from that set
              </Text>
              <Grid>
                <Grid.Col span={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                  <Stack>
                    <Paper p="md" radius="lg" withBorder>
                      <Text fw="bold" c="midnight.9">
                        Ecosystems
                      </Text>
                      <BrowseGrouping />
                    </Paper>
                    <Paper p="md" radius="lg" withBorder>
                      <Text fw="bold" c="midnight.9">
                        Commercial applications
                      </Text>
                    </Paper>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                  <Paper p="md" radius="lg" withBorder>
                    <Text fw="bold" c="midnight.9">
                      Threatened and vulnerable
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Paper p="md" radius="lg" withBorder>
                    <Text fw="bold" c="midnight.9">
                      Other traits
                    </Text>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Paper>
          </Stack>
        </Container>
      </Paper>
    </>
  );
}
