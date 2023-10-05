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
import { Marker } from "@/components/mapping/analysis-map";


const GET_DISTRIBUTION = gql`
  query SpeciesDistribution($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      regions {
        ibra { name }
        imcra { name }
      }
      specimens(page: 1, pageSize: 1000) {
        total
        records {
          id
          latitude
          longitude
        }
      }
    }
  }
`;

type Regions = {
  ibra: { name: string }[],
  imcra: { name: string }[],
}

type Specimen = {
  id: string,
  latitude?: number,
  longitude?: number,
}

type QueryResults = {
  species: {
    regions: Regions,
    specimens: {
      total: number,
      records: Specimen[],
    }
  }
}


interface DistributionAnalysisProps {
  regions?: Regions,
  specimens?: Specimen[],
  onExpandToggle: () => void,
}

function DistributionAnalysis({ regions, specimens, onExpandToggle }: DistributionAnalysisProps) {
  const flattened = {
    ibra: regions?.ibra.map(r => r.name) || [],
    imcra: regions?.imcra.map(r => r.name) || [],
  };

  // filter out null island as well as specimens without coords
  const markers = specimens?.filter(s => s.latitude) as Marker[];

  return (
    <AnalysisMap regions={flattened} markers={markers}>
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
              <DistributionAnalysis
                regions={data?.species.regions}
                specimens={data?.species.specimens.records}
                onExpandToggle={() => {}}
              />
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
