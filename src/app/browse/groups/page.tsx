"use client";

import { Group, Text, Paper, Container, Stack, Grid } from "@mantine/core";

import { PreviousPage } from "@/components/navigation-history";
import { GroupCard } from "./group-card";

// Data for rendering categories
import ecosystems from "./_data/ecosystems";
import commercial from "./_data/commercial";
import iek from "./_data/iek";
import phenotypic from "./_data/phenotypic";
import other from "./_data/other";
import threatened from "./_data/threatened";

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
                      <Text fw="bold" c="midnight.9" mb="sm">
                        Ecosystems
                      </Text>
                      <Group gap="xs" align="flex-start">
                        {ecosystems.map((group) => (
                          <GroupCard key={group.category} {...group} />
                        ))}
                      </Group>
                    </Paper>
                    <Paper p="md" radius="lg" withBorder>
                      <Text fw="bold" c="midnight.9" mb="sm">
                        Commercial applications
                      </Text>
                      <Group gap="xs" align="flex-start">
                        {commercial.map((group) => (
                          <GroupCard key={group.category} {...group} />
                        ))}
                      </Group>
                    </Paper>
                    <Paper p="md" radius="lg" withBorder>
                      <Text fw="bold" c="midnight.9" mb="sm">
                        Indigenous Ecological Knowledge
                      </Text>
                      <Group gap="xs" align="flex-start">
                        {iek.map((group) => (
                          <GroupCard key={group.category} {...group} />
                        ))}
                      </Group>
                    </Paper>
                    <Paper p="md" radius="lg" withBorder>
                      <Text fw="bold" c="midnight.9" mb="sm">
                        Phenotypic Traits
                      </Text>
                      <Group gap="xs" align="flex-start">
                        {phenotypic.map((group) => (
                          <GroupCard key={group.category} {...group} />
                        ))}
                      </Group>
                    </Paper>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                  <Paper p="md" radius="lg" h="100%" withBorder>
                    <Text fw="bold" c="midnight.9" mb="sm">
                      Threatened and vulnerable
                    </Text>
                    <Group gap="xs" align="flex-start">
                      {threatened.map((group) => (
                        <GroupCard key={group.category} {...group} />
                      ))}
                    </Group>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Paper p="md" radius="lg" withBorder>
                    <Text fw="bold" c="midnight.9" mb="sm">
                      Other traits
                    </Text>
                    <Group gap="xs" align="flex-start">
                      {other.map((group) => (
                        <GroupCard key={group.category} {...group} />
                      ))}
                    </Group>
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
