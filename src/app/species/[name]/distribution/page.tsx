"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Stack,
  Text,
  Title,
  Box,
} from "@mantine/core";

import { ArrowsMinimize } from "tabler-icons-react";
import { LoadOverlay } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";


const GET_DISTRIBUTION = gql`
  query SpeciesDistribution($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      regions {
        ibra { name }
        imcra { name }
      }
    }
  }
`;

type Regions = {
  ibra: { name: string }[],
  imcra: { name: string }[],
}

type QueryResults = {
  species: {
    regions: Regions,
  }
}


interface DistributionAnalysisProps {
  regions?: Regions,
  onExpandToggle: () => void,
}

function DistributionAnalysis({ regions, onExpandToggle }: DistributionAnalysisProps) {
  const flattened = {
    ibra: regions?.ibra.map(r => r.name) || [],
    imcra: regions?.imcra.map(r => r.name) || [],
  };

  return (
    <AnalysisMap regions={flattened}>
      <Button onClick={() => onExpandToggle()} rightSection={<ArrowsMinimize />} style={{ zIndex: 1000, right: 20, top: 20, position: "absolute" }}>
        Close
      </Button>
    </AnalysisMap>
  )
}


export default function DistributionPage({ params }: { params: { name: string } }) {
  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_DISTRIBUTION, {
    variables: { canonicalName },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <>
      <Title order={4}>Indexed data distribution</Title>
      <Grid>
        <Grid.Col span={8}>
          <Stack gap={20} pos="relative">
            <LoadOverlay visible={loading} />
            <Box h={800} pos="relative">
              <DistributionAnalysis regions={data?.species.regions} onExpandToggle={() => {}} />
            </Box>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Title order={3}>Indexed data</Title>
          <Title order={3}>Distribution</Title>
        </Grid.Col>
      </Grid>
    </>
  );
}
