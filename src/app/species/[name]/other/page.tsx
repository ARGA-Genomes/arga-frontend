"use client";;
import { use } from "react";

import { Center, Text } from "@mantine/core";

export default function OtherDataPage(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);

  return (
    <Center p='xl' h={300}>
      <Text size='lg' c='dimmed'>Placeholder other genetic data page for {params.name}</Text>
    </Center>
  );
}
