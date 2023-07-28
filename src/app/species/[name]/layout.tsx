"use client";

import { Box, Group, MantineProvider, Stack, Text } from "@mantine/core";
import { argaBrandLight } from '@/app/theme';
import SpeciesHeader from "@/app/components/species-header";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";


interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({ params, children }: SpeciesLayoutProps) {
  const canonicalName = params.name.replaceAll("_", " ");
  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Stack spacing={0}>
        <Box mb={20}>
          <Link href="#">
            <Group spacing={5}>
              <ArrowNarrowLeft />
              <Text fz={18}>Back to search results</Text>
            </Group>
          </Link>
        </Box>

      <SpeciesHeader canonicalName={canonicalName} />
      {children}
    </Stack>
    </MantineProvider>
  );
}
