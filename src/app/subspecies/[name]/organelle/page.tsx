"use client";

import { Center, Text } from "@mantine/core";

export default function OrganelleChromosomesPage({ params }: { params: { name: string } }) {

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder organelle chromosomes page for {params.name}</Text>
    </Center>
  );
}