'use client';

import { gql, useQuery } from "@apollo/client";
import SpeciesHeader from "@/app/components/species-header";
import { Container, Group, MantineProvider, Paper, Stack, Text } from "@mantine/core";
import { argaBrandLight } from "@/app/theme";
import { MAX_WIDTH } from "@/app/constants";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";


const GET_ASSEMBLY_SPECIES_NAME = gql`
query AssemblyDetails($accession: String) {
  assembly(accession: $accession) {
    canonicalName
  }
}`;

type QueryResults = {
  assembly: { canonicalName: string },
};


interface AssemblyLayoutProps {
  params: { accession: string },
  children: React.ReactNode,
}

export default function SpeciesLayout({ params, children }: AssemblyLayoutProps) {
  const { loading, error, data } = useQuery<QueryResults>(GET_ASSEMBLY_SPECIES_NAME, {
    variables: {
      accession: params.accession,
    },
  });

  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      <Stack spacing={0}>
        <Container mb={20} w="100%" maw={MAX_WIDTH}>
          <Link href="#">
            <Group spacing={5}>
              <ArrowNarrowLeft />
              <Text fz={18}>Back to search results</Text>
            </Group>
          </Link>
        </Container>

        { data && <SpeciesHeader canonicalName={data.assembly.canonicalName} /> }
        <Paper>
          <Container w="100%" maw={MAX_WIDTH} py={20}>
            {children}
          </Container>
        </Paper>
      </Stack>
    </MantineProvider>
  )
}
