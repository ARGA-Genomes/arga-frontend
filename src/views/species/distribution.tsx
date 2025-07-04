"use client";

import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Grid,
  Stack,
  Text,
  Title,
  Box,
  Paper,
  Group,
  Switch,
  SwitchProps,
  ScrollArea,
  Divider,
  Flex,
} from "@mantine/core";

import { LoadOverlay } from "@/components/load-overlay";
import { AnalysisMap } from "@/components/mapping";
import { Marker } from "@/components/mapping/analysis-map";
import { Layer } from "@/app/type";
import { ExternalLinkButton } from "@/components/button-link-external";
import { IconArrowUpRight } from "@tabler/icons-react";
import { getCanonicalName } from "@/helpers/getCanonicalName";

const GET_DISTRIBUTION = gql`
  query SpeciesDistribution($canonicalName: String) {
    species(canonicalName: $canonicalName) {
      regions {
        ibra {
          names
          dataset {
            name
          }
        }
        imcra {
          names
          dataset {
            name
          }
        }
      }
      specimens(page: 1, pageSize: 1000) {
        total
        records {
          id
          recordId
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
      genomicComponents(page: 1, pageSize: 1000) {
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

interface RegionDistribution {
  names: string[];
  dataset: { name: string };
}

interface Regions {
  ibra: RegionDistribution[];
  imcra: RegionDistribution[];
}

interface Specimen {
  id: string;
  recordId?: string;
  latitude?: number;
  longitude?: number;
  color?: string;
  type: Layer;
}

interface QueryResults {
  species: {
    regions: Regions;
    specimens: {
      total: number;
      records: Specimen[];
    };
    wholeGenomes: {
      total: number;
      records: Specimen[];
    };
    markers: {
      total: number;
      records: Specimen[];
    };
    genomicComponents: {
      total: number;
      records: Specimen[];
    };
  };
}

const hasRegions = (regions: Regions) => {
  return regions.ibra.length > 0 || regions.imcra.length > 0;
};

interface DistributionAnalysisProps {
  regions?: Regions;
  markers?: Marker<null>[];
}

function DistributionAnalysis({ regions, markers }: DistributionAnalysisProps) {
  const flattened = {
    ibra: regions?.ibra.map((r) => r.names).flat() || [],
    imcra: regions?.imcra.map((r) => r.names).flat() || [],
  };

  return (
    <AnalysisMap
      regions={flattened}
      markers={markers}
      style={{
        borderTopLeftRadius: "12px",
        overflow: "hidden",
      }}
    ></AnalysisMap>
  );
}

interface MapFilterOptionProps extends SwitchProps {
  label: string;
  count: number;
  total: number;
}

function MapFilterOption({ label, count, total, ...switchProps }: MapFilterOptionProps) {
  const checkboxStyle = {
    labelWrapper: { width: "100%" },
  };

  const text = (
    <Group>
      <Text fz="lg" fw={550}>
        {label}
      </Text>
      <Text fz="lg">
        {count}/{total}
      </Text>
    </Group>
  );

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
  );
}

interface Filters {
  wholeGenomes: { total: number; count: number };
  loci: { total: number; count: number };
  specimens: { total: number; count: number };
  other: { total: number; count: number };
}

interface SummaryProps {
  regions?: Regions;
  filters: Filters;
  onFilter: (layer: Layer, enabled: boolean) => void;
}

function Summary({ regions, filters, onFilter }: SummaryProps) {
  return (
    <Flex direction="column" justify="space-between" h="100%">
      <ScrollArea mah={800}>
        <Stack gap="md" p="md" pt="xl">
          <Title order={3} fw={650}>
            Indexed data
          </Title>
          <Stack gap={5} mb={30}>
            <MapFilterOption
              onChange={(e) => {
                onFilter(Layer.WholeGenome, e.currentTarget.checked);
              }}
              size="md"
              color="bushfire"
              label="Whole genomes"
              count={filters.wholeGenomes.count}
              total={filters.wholeGenomes.total}
            />
            <MapFilterOption
              onChange={(e) => {
                onFilter(Layer.Loci, e.currentTarget.checked);
              }}
              size="md"
              color="moss.7"
              label="Loci"
              count={filters.loci.count}
              total={filters.loci.total}
            />
            <MapFilterOption
              onChange={(e) => {
                onFilter(Layer.OtherData, e.currentTarget.checked);
              }}
              size="md"
              color="moss.3"
              label="Genomic components"
              count={filters.other.count}
              total={filters.other.total}
            />
            <MapFilterOption
              onChange={(e) => {
                onFilter(Layer.Specimens, e.currentTarget.checked);
              }}
              size="md"
              color="rgba(103, 151, 180, 220)"
              label="Specimens"
              count={filters.specimens.count}
              total={filters.specimens.total}
            />
          </Stack>

          <Title order={3} fw={650}>
            Distribution
          </Title>
          <Text>
            {regions?.ibra
              .map((r) => r.names)
              .flat()
              .join(", ")}
          </Text>
          <Text>
            {regions?.imcra
              .map((r) => r.names)
              .flat()
              .join(", ")}
          </Text>
        </Stack>
      </ScrollArea>
    </Flex>
  );
}

function toMarker(color: [number, number, number, number], type: Layer, records?: Specimen[]) {
  if (!records) return [];
  return records.map((r) => {
    return {
      tooltip: r.recordId || "unknown",
      latitude: r.latitude,
      longitude: r.longitude,
      color: color,
      type: type,
    };
  });
}

export default function DistributionPage({ params }: { params: { name: string } }) {
  const [layers, setLayers] = useState({
    wholeGenome: true,
    loci: true,
    other: true,
    specimens: true,
  });
  const [allSpecimens, setAllSpecimens] = useState<Marker<null>[]>([]);
  const canonicalName = getCanonicalName(params);

  const { loading, error, data } = useQuery<QueryResults>(GET_DISTRIBUTION, {
    variables: { canonicalName },
  });

  useEffect(() => {
    const combined = [
      ...toMarker(
        [103, 151, 180, 220],
        Layer.Specimens,
        layers.specimens ? data?.species.specimens.records : undefined,
      ),
      ...toMarker([123, 161, 63, 220], Layer.Loci, layers.loci ? data?.species.markers.records : undefined),
      ...toMarker(
        [243, 117, 36, 220],
        Layer.WholeGenome,
        layers.wholeGenome ? data?.species.wholeGenomes.records : undefined,
      ),
      ...toMarker(
        [185, 210, 145, 220],
        Layer.OtherData,
        layers.other ? data?.species.genomicComponents.records : undefined,
      ),
    ];
    // filter out null island as well as specimens without coords
    setAllSpecimens(combined.filter((s) => s.latitude) as Marker<null>[]);
  }, [data, layers, setAllSpecimens]);

  let filters = null;
  if (data) {
    const specimens = data.species.specimens;
    const wholeGenomes = data.species.wholeGenomes;
    const markers = data.species.markers;
    const other = data.species.genomicComponents;

    // filter out null island as well as specimens without coords
    const validGenomes = wholeGenomes.records.filter((s) => s.latitude);
    const validMarkers = markers.records.filter((s) => s.latitude);
    const validSpecimens = specimens.records.filter((s) => s.latitude);
    const validOther = other.records.filter((s) => s.latitude);

    filters = {
      wholeGenomes: { total: wholeGenomes.total, count: validGenomes.length },
      loci: { total: markers.total, count: validMarkers.length },
      specimens: { total: specimens.total, count: validSpecimens.length },
      other: { total: other.total, count: validOther.length },
    };
  }

  const onFilter = (layer: Layer, enabled: boolean) => {
    setLayers({
      wholeGenome: layer === Layer.WholeGenome ? enabled : layers.wholeGenome,
      loci: layer === Layer.Loci ? enabled : layers.loci,
      other: layer === Layer.OtherData ? enabled : layers.other,
      specimens: layer === Layer.Specimens ? enabled : layers.specimens,
    });
  };

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Paper p="lg" radius="lg" withBorder>
      <Stack gap="lg">
        <Paper radius="lg" withBorder>
          <Grid>
            <Grid.Col span={{ xl: 9, lg: 8, md: 7, sm: 12, xs: 12 }} pb={0}>
              <Stack gap={20} pos="relative">
                <LoadOverlay visible={loading} />
                <Box h={800} pos="relative">
                  <DistributionAnalysis regions={data?.species.regions} markers={allSpecimens} />
                </Box>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ xl: 3, lg: 4, md: 5, sm: 12, xs: 12 }} pb={0}>
              {filters && <Summary regions={data?.species.regions} filters={filters} onFilter={onFilter} />}
            </Grid.Col>
            <Grid.Col span={12} py={0}>
              <Divider />
            </Grid.Col>
            <Grid.Col span={12}>
              {data?.species.regions && hasRegions(data.species.regions) && (
                <Group px="md" pb="lg" pt="sm">
                  <Text fw={300} size="xs">
                    Source
                  </Text>
                  <ExternalLinkButton
                    url={`https://biodiversity.org.au/afd/taxa/${name}`}
                    externalLinkName="Australian Faunal Directory"
                    outline
                    icon={IconArrowUpRight}
                  />
                </Group>
              )}
            </Grid.Col>
          </Grid>
        </Paper>
        <Text c={"attribute.5"} pt="sm">
          <b>Note:</b> location data may be generalised for sensitive species. Location data should be verified from
          individual data point custodians. Please refer to the specimen page for full details of metadata provenance
          for specific collection locations.
        </Text>
      </Stack>
    </Paper>
  );
}
