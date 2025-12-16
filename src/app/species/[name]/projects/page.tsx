"use client";
import { useSpecies } from "@/app/species-provider";
import { Group, Paper, Stack, Title } from "@mantine/core";

export default function Page() {
  const { details } = { ...useSpecies() };
  if (!details) return;

  return (
    <Paper radius="md" withBorder>
      <Group>
        <ProjectList />
        <ProjectDetails />
      </Group>
    </Paper>
  );
}

function ProjectList() {
  return (
    <Stack>
      <Title order={6}>Funded projects</Title>
    </Stack>
  );
}

function ProjectDetails() {
  return (
    <Stack>
      <Title order={6}>Project details</Title>
    </Stack>
  );
}
