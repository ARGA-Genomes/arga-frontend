"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Grid,
  Stack,
  Text,
  Title,
  Box,
  Paper,
  Group,
  Switch,
  SwitchProps,
} from "@mantine/core";

import { ArrowBarRight } from "tabler-icons-react";
import { LoadOverlay } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";
import { Marker } from "@/components/mapping/analysis-map";
import { useEffect, useState } from "react";


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
      wholeGenomes(page: 1, pageSize: 1000) {
        total
        records {
          recordId
          latitude
          longitude
        }
      }
      markers(page: 1, pageSize: 1000) {
        total
        records {
          recordId
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
    },
    wholeGenomes: {
      total: number,
      records: Specimen[],
    },
    markers: {
      total: number,
      records: Specimen[],
    },
  }
}


interface DistributionAnalysisProps {
  regions?: Regions,
  markers?: Marker[],
}

function DistributionAnalysis({ regions, markers }: DistributionAnalysisProps) {
  const flattened = {
    ibra: regions?.ibra.map(r => r.name) || [],
    imcra: regions?.imcra.map(r => r.name) || [],
  };

  return (
    <AnalysisMap
      regions={flattened}
      markers={markers}
      style={{ borderRadius: 'var(--mantine-radius-lg) 0 0 var(--mantine-radius-lg)', overflow: 'hidden' }}
    >
    </AnalysisMap>
  )
}


interface MapFilterOptionProps extends SwitchProps {
  label: string,
  count: number,
  total: number,
}

function MapFilterOption({ label, count, total, ...switchProps }: MapFilterOptionProps) {
  let checkboxStyle = {
    labelWrapper: { width: '100%' },
  }

  const text = (
    <Group>
      <Text fz="lg" fw={550}>{label}</Text>
      <Text fz="lg">{count}/{total}</Text>
    </Group>
  )

  return (
    <Switch
      size="md"
      onLabel="ON"
      defaultChecked
      label={text}
      labelPosition="left"
      styles={checkboxStyle}
      {...switchProps}
    />
  )
}


type Filters = {
  wholeGenomes: { total: number, count: number },
  loci: { total: number, count: number },
  specimens: { total: number, count: number },
  other: { total: number, count: number },
}

enum Layer {
  WholeGenome,
  Loci,
  Specimens,
  OtherData,
}

interface SummaryProps {
  regions?: Regions,
  filters: Filters,
  onFilter: (layer: Layer, enabled: boolean) => void;
}

function Summary({ regions, filters, onFilter }: SummaryProps ) {
  return (
    <Stack>
      <Group justify="end">
        <Button
          variant="subtle"
          leftSection={<ArrowBarRight/>}
          style={{ borderRadius: "0 var(--mantine-radius-lg) 0 0"}}
        >
          Hide
        </Button>
      </Group>

      <Stack p={10} gap="md">
        <Title order={3} fw={650}>Indexed data</Title>
        <Stack gap={5} mb={30}>
          <MapFilterOption onChange={e => onFilter(Layer.WholeGenome, e.currentTarget.checked)} size="md" color="bushfire" label="Whole genomes" count={filters.wholeGenomes.count} total={filters.wholeGenomes.total} />
          <MapFilterOption onChange={e => onFilter(Layer.Loci, e.currentTarget.checked)} size="md" color="moss.7" label="Loci" count={filters.loci.count} total={filters.loci.total} />
          <MapFilterOption onChange={e => onFilter(Layer.OtherData, e.currentTarget.checked)} size="md" color="moss.3" label="Other data" count={filters.other.count} total={filters.other.total} />
          <MapFilterOption onChange={e => onFilter(Layer.Specimens, e.currentTarget.checked)} size="md" color="midnight.4" label="Specimens" count={filters.specimens.count} total={filters.specimens.total} />
        </Stack>

        <Title order={3} fw={650}>Distribution</Title>
        <Text>{regions?.ibra.map(r => r.name).join(", ")}</Text>
        <Text>{regions?.imcra.map(r => r.name).join(", ")}</Text>
      </Stack>
    </Stack>
  )
}


function toMarker (color: [number, number, number, number], records?: Specimen[]) {
  if (!records) return [];
  return records.map(r => {
    return {
      latitude: r.latitude,
      longitude: r.longitude,
      color: color,
    }
  })
}

export default function DistributionPage({ params }: { params: { name: string } }) {
  const [layers, setLayers] = useState({ wholeGenome: true, loci: true, other: true, specimens: true });
  const [allSpecimens, setAllSpecimens] = useState<Marker[]>([]);

  const canonicalName = params.name.replaceAll("_", " ");

  const { loading, error, data } = useQuery<QueryResults>(GET_DISTRIBUTION, {
    variables: { canonicalName },
  });


  useEffect(() => {
    const combined = [
      ...toMarker([243, 117, 36, 220], layers.wholeGenome ? data?.species.wholeGenomes.records : undefined),
      ...toMarker([123, 161, 63, 220], layers.loci ? data?.species.markers.records : undefined),
      ...toMarker([103, 151, 180, 220], layers.specimens ? data?.species.specimens.records : undefined),
    ];
    // filter out null island as well as specimens without coords
    setAllSpecimens(combined.filter(s => s.latitude) as Marker[]);
  }, [data, layers, setAllSpecimens]);

  let filters = null;
  if (data) {
    const specimens = data?.species.specimens;
    const wholeGenomes = data?.species.wholeGenomes;
    const markers = data?.species.markers;

    // filter out null island as well as specimens without coords
    const validGenomes = wholeGenomes?.records.filter(s => s.latitude);
    const validMarkers = markers?.records.filter(s => s.latitude);
    const validSpecimens = specimens?.records.filter(s => s.latitude);

    filters = {
      wholeGenomes: { total: wholeGenomes.total, count: validGenomes.length },
      loci: { total: markers.total, count: validMarkers.length },
      specimens: { total: specimens.total, count: validSpecimens.length },
      other: { total: 0, count: 0 },
    }
  }

  const onFilter = (layer: Layer, enabled: boolean) => {
    setLayers({
      wholeGenome: layer === Layer.WholeGenome ? enabled : layers.wholeGenome,
      loci: layer === Layer.Loci ? enabled : layers.loci,
      other: layer === Layer.OtherData ? enabled : layers.other,
      specimens: layer === Layer.Specimens ? enabled : layers.specimens,
    })
  }

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Paper p="lg" radius="lg" withBorder>
      <Stack gap="lg">
        <Title order={4}>Indexed data distribution</Title>
        <Paper radius="lg" withBorder>
          <Grid>
            <Grid.Col span={9}>
              <Stack gap={20} pos="relative">
                <LoadOverlay visible={loading} />
                <Box h={800} pos="relative">
                  <DistributionAnalysis
                    regions={data?.species.regions}
                    markers={allSpecimens}
                  />
                </Box>
              </Stack>
            </Grid.Col>
            <Grid.Col span={3}>
              { filters && <Summary regions={data?.species.regions} filters={filters} onFilter={onFilter} />}
            </Grid.Col>
          </Grid>
        </Paper>
      </Stack>
    </Paper>
  );
}
