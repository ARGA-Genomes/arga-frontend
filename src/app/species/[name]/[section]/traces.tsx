'use client';

import { gql, useQuery } from "@apollo/client";

import { Box, Collapse, ColorSwatch, Grid, Group, LoadingOverlay, Paper, ScrollArea, Table, Text, ThemeIcon } from "@mantine/core";
import { TraceFile } from "@/app/type";
import { useListState } from "@mantine/hooks";
import {
  Link as IconLink,
  Thermometer,
  Box as IconBox,
  Speakerphone,
  WaveSine,
  AntennaBars5,
  Tag as IconTag,
  Mountain,
  Pencil as IconPencil,
  ScanEye,
  Versions as IconVersions,
} from 'tabler-icons-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const GET_TRACES = gql`
query Species($canonicalName: String) {
  species (canonicalName: $canonicalName) {
    traceFiles {
      id
      metadata
    }
  }
}`;

const GET_TRACE_DATA = gql`
query Traces($id: String) {
  traces(uuid: $id) {
    analyzed {
      g
      a
      t
      c
    }
  }
}`;


type AnalyzedData = {
  g?: number[],
  a?: number[],
  t?: number[],
  c?: number[],
}

type TraceData = {
  analyzed: AnalyzedData,
}

type TraceDataResults = {
  traces: TraceData,
};

type TraceFilesResults = {
  species: {
    traceFiles: TraceFile[]
  },
};


function Chromatograph({ data }: { data: AnalyzedData }) {
  if (!data.g) {
    return <Text>Cannot render graph. Missing analyzed G data</Text>
  }

  const chartData = {
    labels: [...Array(data.g.length).keys()],
    datasets: [
      {
        label: 'G',
        data: data.g,
        borderColor: 'black',
        backgroundColor: 'black',
        borderWidth: 1,
      },
      {
        label: 'A',
        data: data.a,
        borderColor: 'green',
        backgroundColor: 'green',
        borderWidth: 1,
      },
      {
        label: 'T',
        data: data.t,
        borderColor: 'red',
        backgroundColor: 'red',
        borderWidth: 1,
      },
      {
        label: 'C',
        data: data.c,
        borderColor: 'blue',
        backgroundColor: 'blue',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      }
    }
  }

  return (
    <ScrollArea w={1408} type="always">
      <Box w={data.g.length} h={300}>
        <Line options={options} data={chartData} />
      </Box>
    </ScrollArea>
  )
}


interface TraceFieldProps {
  label: string,
  value?: string,
  icon: React.ReactNode,
}

function TraceField(props: TraceFieldProps) {
  return (
    <Group position="left">
      <ThemeIcon variant='light' size={28} radius='xl'>
        { props.icon}
      </ThemeIcon>
      <Box>
        <Text color='dimmed' size='xs'>{props.label}</Text>
        <Text size='sm' weight='bold' c={props.value ? "black" : "dimmed"}>
          {props.value || "Not Supplied"}
        </Text>
      </Box>
    </Group>
  )
}


function TraceDetails({ record }: { record: TraceFile }) {
  const { loading, error, data } = useQuery<TraceDataResults>(GET_TRACE_DATA, {
    variables: { id: record.id },
  });

  return (
    <Box>
      <LoadingOverlay visible={loading} />

      <Grid>
        <Grid.Col span={3}>
          <TraceField label="Total capillaries" value={record.metadata['total_capillaries']} icon={<IconLink size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Run temperature" value={record.metadata['run']['temperature'] + "C"} icon={<Thermometer size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Protocol" value={record.metadata['run']['protocol_name']} icon={<Thermometer size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Pixel bin size" value={record.metadata['pixel_bin_size']} icon={<IconBox size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Baseline noise - G" value={record.metadata['baseline_noise'][0]} icon={<Speakerphone size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Baseline noise - A" value={record.metadata['baseline_noise'][1]} icon={<Speakerphone size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Baseline noise - T" value={record.metadata['baseline_noise'][2]} icon={<Speakerphone size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Baseline noise - C" value={record.metadata['baseline_noise'][3]} icon={<Speakerphone size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Dye 1 wavelength" value={record.metadata['dyes']['dye1']['wavelength']} icon={<WaveSine size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 2 wavelength" value={record.metadata['dyes']['dye2']['wavelength']} icon={<WaveSine size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 3 wavelength" value={record.metadata['dyes']['dye3']['wavelength']} icon={<WaveSine size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 4 wavelength" value={record.metadata['dyes']['dye4']['wavelength']} icon={<WaveSine size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Dye 1 signal strength" value={record.metadata['dye_signal_strength'][0]} icon={<AntennaBars5 size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 2 signal strength" value={record.metadata['dye_signal_strength'][1]} icon={<AntennaBars5 size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 3 signal strength" value={record.metadata['dye_signal_strength'][2]} icon={<AntennaBars5 size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Dye 4 signal strength" value={record.metadata['dye_signal_strength'][3]} icon={<AntennaBars5 size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Dye name" value={record.metadata['dyes']['name']} icon={<IconTag size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Peak spacing - avg last calculated" value={record.metadata['peak_spacing']['avg_last_calculated']} icon={<Mountain size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Peak spacing - avg used in last analysis" value={record.metadata['peak_spacing']['avg_used_in_last_analysis']} icon={<Mountain size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Basecaller" value={record.metadata['peak_spacing']['basecaller_name']} icon={<IconTag size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Results group" value={record.metadata['results_group']['name']} icon={<IconPencil size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Starting scan" value={record.metadata['analysis']['starting_scan_first']} icon={<ScanEye size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Ending scan" value={record.metadata['analysis']['ending_scan_first']} icon={<ScanEye size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Reference scan" value={record.metadata['analysis']['ref_scan_first']} icon={<ScanEye size='1rem' />} />
        </Grid.Col>

        <Grid.Col span={3}>
          <TraceField label="Data collection software version" value={record.metadata['software_versions']['data_collection']} icon={<IconVersions size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Firmware version" value={record.metadata['software_versions']['firmware']} icon={<IconVersions size='1rem' />} />
        </Grid.Col>
        <Grid.Col span={3}>
          <TraceField label="Sizecaller version" value={record.metadata['software_versions']['sizecaller']} icon={<IconVersions size='1rem' />} />
        </Grid.Col>
      </Grid>

      <Group position="right" spacing={20} mt={10}>
        <Group spacing={5}>
          <ColorSwatch color="black" size={14} />
          <Text fw={600} size={14}>G</Text>
        </Group>

        <Group spacing={5}>
          <ColorSwatch color="green" size={14} />
          <Text fw={600} size={14}>A</Text>
        </Group>

        <Group spacing={5}>
          <ColorSwatch color="red" size={14} />
          <Text fw={600} size={14}>T</Text>
        </Group>

        <Group spacing={5}>
          <ColorSwatch color="blue" size={14} />
          <Text fw={600} size={14}>C</Text>
        </Group>
      </Group>
      { data ? <Chromatograph data={data.traces.analyzed} /> : null }
    </Box>
  )
}

interface TraceRecordProps {
  record: TraceFile,
  selected: boolean,
  onSelected: (record: TraceFile) => void;
}

function TraceRecord(props: TraceRecordProps) {
  return (
    <>
    <tr
      style={{ cursor: 'pointer' }}
      onClick={() => props.onSelected(props.record)}
    >
      <td style={{ paddingLeft: 25 }}>{props.record.metadata['run']['name']}</td>
      <td>{props.record.metadata['sample_name']}</td>
      <td>{props.record.metadata['data_collection']['start_date']}</td>
      <td>{props.record.metadata['scans']}</td>
    </tr>
    <tr>
      <td colSpan={8} style={{ padding: 0, border: 'none' }}>
        <Collapse in={props.selected}>
          <Box p={20} bg="gray.1">
            { props.selected ? <TraceDetails record={props.record} /> : null }
          </Box>
        </Collapse>
      </td>
    </tr>
    </>
  )
}

function FileTable({ records }: { records: TraceFile[] }) {
  const [selected, handler] = useListState<TraceFile>([]);

  function toggle(record: TraceFile) {
    let idx = selected.indexOf(record);
    if (idx >= 0) {
      handler.remove(idx);
    } else {
      handler.append(record);
    }
  }

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <td style={{ paddingLeft: 25 }}>Run Name</td>
          <td>Sample Name</td>
          <td>Data Collected</td>
          <td>Scans</td>
        </tr>
      </thead>
      <tbody>
        { records.map(record => (
          <TraceRecord
            record={record}
            selected={selected.indexOf(record) >= 0}
            onSelected={toggle}
            key={record.id}
          />
        ))}
      </tbody>
    </Table>
  )
}

export function TraceTable({ canonicalName }: { canonicalName : string }): JSX.Element {
  const { loading, error, data } = useQuery<TraceFilesResults>(GET_TRACES, {
    variables: {
      canonicalName,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  const records = data?.species.traceFiles;
  /* const wholeGenomeRecords = data.species.data.filter((record) => record.refseqCategory == "representative genome" ||
  *   record.refseqCategory == "reference genome" || record.accession?.includes("GC")); */

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor="black"
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
      />

      <Paper radius="lg" py={25}>
        { records ? <FileTable records={records} /> : null }
      </Paper>
    </Box>
  );
}
