"use client";

import { Box, Container, Group, MantineProvider, Stack, Text } from "@mantine/core";
import { argaBrandLight } from '@/app/theme';
import SpeciesHeader from "@/app/components/species-header";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MAX_WIDTH } from "@/app/constants";

interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({ params, children }: SpeciesLayoutProps) {
  const canonicalName = params.name.replaceAll("_", " ");
  const searchParams = useSearchParams()
  const [previousUrl] = useState('/search?' + searchParams.get('previousUrl') || "")

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Stack spacing={0}>
        <Container mb={20} w="100%" maw={MAX_WIDTH}>
          <Link href={previousUrl}>
            <Group spacing={5}>
              <ArrowNarrowLeft />
              <Text fz={18}>Back to search results</Text>
            </Group>
          </Link>
        </Container>

      <SpeciesHeader canonicalName={canonicalName} />
      {children}
    </Stack>
    </MantineProvider>
  );
}
