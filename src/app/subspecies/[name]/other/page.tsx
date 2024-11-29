"use client";

import { Center, Text } from "@mantine/core";

export default function OtherDataPage({ params }: { params: { name: string } }) {

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder other genetic data page for {params.name}</Text>
    </Center>
  );
}
