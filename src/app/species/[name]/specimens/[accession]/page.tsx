"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Timeline,
  Title,
} from "@mantine/core";
import { DataField } from "@/app/components/highlight-stack";
import { ArrowNarrowLeft, CircleCaretUp} from "tabler-icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTableStyles } from "@/app/components/data-fields";
import { ArgaMap } from "@/app/components/mapping";


const GET_SPECIMEN = gql`
  query SpecimenFullData($accession: String) {
    specimen(accession: $accession) {
      id
      accession
      organismId
      materialSampleId
      collectionCode
      institutionName
      institutionCode
      recordedBy
      identifiedBy
      typeStatus
      latitude
      longitude
      locationSource
      locality
      country
      countryCode
      county
      municipality
      stateProvince
      depth
      elevation
      depthAccuracy
      elevationAccuracy
      remarks
      identificationRemarks

      events {
        collections {
          id
          behavior
          catalogNumber
          degreeOfEstablishment
          envBroadScale
          establishmentMeans
          individualCount
          isolate
          lifeStage
          occurrenceStatus
          organismQuantity
          organismQuantityType
          otherCatalogNumbers
          pathway
          preparation
          recordNumber
          refBiomaterial
          reproductiveCondition
          sex
          sourceMatId
          specificHost
          strain
        }
        accessions {
          id
          institutionName
          institutionCode
          materialSampleId
          typeStatus
        }
      }
    }

    subsample(accession: $accession) {
      id
      accession
      materialSampleId
      institutionName
      institutionCode
      typeStatus

      events {
        subsamples {
          id
          preparationType
        }
      }
    }

    dnaExtract(accession: $accession) {
      id
      accession

      events {
        dnaExtracts {
          id
          extractedBy
          extractionMethod
          measurementMethod
          preparationType
          preservationType
          concentration
          concentrationMethod
          quality
          absorbance260230
          absorbance260280
        }
      }
    }
  }
`;

type CollectionEvent = {
  id: string,
  behavior?: string,
  catalogNumber?: string,
  degreeOfEstablishment?: string,
  envBroadScale?: string,
  establishmentMeans?: string,
  individualCount?: string,
  isolate?: string,
  lifeStage?: string,
  occurrenceStatus?: string,
  organismQuantity?: string,
  organismQuantityType?: string,
  otherCatalogNumbers?: string,
  pathway?: string,
  preparation?: string,
  recordNumber?: string,
  refBiomaterial?: string,
  reproductiveCondition?: string,
  sex?: string,
  sourceMatId?: string,
  specificHost?: string,
  strain?: string,
}

type AccessionEvent = {
  id: string,
  institutionName?: string,
  institutionCode?: string,
  materialSampleId?: string,
  typeStatus?: string,
}

type SubsampleEvent = {
  id: string,
  preparationType?: string,
}

type DnaExtractionEvent = {
  id: string,
  extractedBy?: string,
  extractionMethod?: string,
  measurementMethod?: string,
  preparationType?: string,
  preservationType?: string,
  concentration?: number,
  concentrationMethod?: string,
  quality?: string,
  absorbance260230?: number,
  absorbance260280?: number,
}

type SpecimenDetails = {
  id: string,
  accession: string,
  organismId?: string,
  materialSampleId?: string,
  collectionCode?: string,
  institutionName?: string,
  institutionCode?: string,
  recordedBy?: string,
  identifiedBy?: string,
  typeStatus?: string,
  latitude?: string,
  longitude?: string,
  locationSource?: string,
  locality?: string,
  country?: string,
  countryCode?: string,
  county?: string,
  municipality?: string,
  stateProvince?: string,
  depth?: string,
  elevation?: string,
  depthAccuracy?: string,
  elevationAccuracy?: string,
  remarks?: string,
  identificationRemarks?: string,

  events: {
    collections: CollectionEvent[],
    accessions: AccessionEvent[],
  },
};

type SubsampleDetails = {
  id: string,
  accession: string,
  materialSampleId?: string,
  institutionName?: string,
  institutionCode?: string,
  typeStatus?: string,

  events: {
    subsamples: SubsampleEvent[],
  },
};

type DnaExtractDetails = {
  id: string,
  accession: string,
  events: {
    dnaExtracts: DnaExtractionEvent[],
  },
};


type SpecimenQueryResults = {
  specimen: SpecimenDetails;
  subsample: SubsampleDetails;
  dnaExtract: DnaExtractDetails;
};


function SpecimenMap({ specimen }: { specimen : SpecimenDetails | undefined }) {
  return (
    <Box pos="relative" h={300} sx={theme => ({
      overflow: "hidden",
      borderRadius: theme.radius.lg,
    })}>
      <ArgaMap />
    </Box>
  )
}


function Collections({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const { classes } = useTableStyles();
  const collection = specimen?.events.collections[0];
  const coordinates = specimen?.latitude && `${specimen.latitude}, ${specimen.longitude}`;

  return (
    <Grid>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Field identifier</td>
              <td><DataField value={undefined}/></td>
            </tr>
            <tr>
              <td>Organism name</td>
              <td><DataField value={specimen?.organismId}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Collected by</td>
              <td><DataField value={specimen?.recordedBy}/></td>
            </tr>
            <tr>
              <td>Identified by</td>
              <td><DataField value={specimen?.identifiedBy}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={4}>
        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Collection location</td>
              <td><DataField value={specimen?.locality} /></td>
            </tr>
            <tr>
              <td>Coordinates</td>
              <td><DataField value={coordinates}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>

      <Grid.Col span={8}>
        <Grid>
          <Grid.Col span={6}>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td>Habitat</td>
                  <td><DataField value={collection?.envBroadScale} /></td>
                </tr>
                <tr>
                  <td>Elevation</td>
                  <td><DataField value={specimen?.elevation}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
          <Grid.Col span={6}>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td>Sampling protocol</td>
                  <td><DataField value={undefined} /></td>
                </tr>
                <tr>
                  <td>Depth (m)</td>
                  <td><DataField value={specimen?.depth}/></td>
                </tr>
              </tbody>
            </Table>
          </Grid.Col>
        </Grid>

        <Table className={classes.table}>
          <tbody>
            <tr>
              <td>Fixation method</td>
              <td><DataField value={collection?.preparation} /></td>
            </tr>
            <tr>
              <td>Other data</td>
              <td><DataField value={specimen?.remarks}/></td>
            </tr>
            <tr>
              <td>Source</td>
              <td><DataField value={specimen?.institutionName}/></td>
            </tr>
            <tr>
              <td>Publication</td>
              <td><DataField value={undefined}/></td>
            </tr>
          </tbody>
        </Table>
      </Grid.Col>

      <Grid.Col span={4}>
        <SpecimenMap specimen={specimen}/>
      </Grid.Col>
    </Grid>
  )
}


function Accessions({ specimen }: { specimen: SpecimenDetails | undefined }) {
  const { classes } = useTableStyles();
  const accession = specimen?.events.accessions[0];

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Registration number</td>
            <td><DataField value={accession?.materialSampleId}/></td>
          </tr>
          <tr>
            <td>Institution</td>
            <td><DataField value={accession?.institutionName}/></td>
          </tr>
          <tr>
            <td>Type status</td>
            <td><DataField value={accession?.typeStatus}/></td>
          </tr>
          <tr>
            <td>Organism name</td>
            <td><DataField value={specimen?.organismId}/></td>
          </tr>
          <tr>
            <td>Disposition</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Collection</td>
            <td><DataField value={specimen?.collectionCode}/></td>
          </tr>
          <tr>
            <td>Identified by</td>
            <td><DataField value={specimen?.identifiedBy}/></td>
          </tr>
          <tr>
            <td>Fixation method</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function Subsamples({ subsample }: { subsample: SubsampleDetails | undefined }) {
  const { classes } = useTableStyles();

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Sample number</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Subsample available</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Subsampled by</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Remarks</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Subsampling date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function DnaExtracts({ dnaExtract }: { dnaExtract: DnaExtractDetails | undefined }) {
  const { classes } = useTableStyles();

  return (
    <SimpleGrid cols={3}>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Extraction number</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Extract available</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Data source</td>
            <td><DataField value={undefined}/></td>
          </tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>Extracted by</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr>
            <td>Protocol</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
        </tbody>
      </Table>
      <Table className={classes.table}>
        <tbody>
          <tr>
            <td>DNA extraction date</td>
            <td><DataField value={undefined}/></td>
          </tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </Table>
    </SimpleGrid>
  )
}


function EventTimeline({ specimen }: { specimen: SpecimenDetails | undefined }) {
  return (
    <Timeline color="midnight" active={8} bulletSize={45} lineWidth={4}>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Collection</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Accession</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Subsampling</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>DNA extraction</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Amplification and sequencing</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Sequence assembly</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Sequence annotation</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Data deposition</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
      <Timeline.Item bullet={<CircleCaretUp size={50} />} title={<Text fz="sm" ml={20} weight={700}>Data reuse</Text>}>
        <Group>
          <Text ml={30} fz="xs" weight={300}>Event date</Text>
          <DataField value={undefined} fz="xs"/>
        </Group>
      </Timeline.Item>
    </Timeline>
  )
}


export default function SpecimenPage({ params }: { params: { accession: string } }) {
  let basePath = usePathname()?.replace(params.accession, '');

  const { loading, error, data } = useQuery<SpecimenQueryResults>(GET_SPECIMEN, {
    variables: {
      accession: params.accession,
    },
  });

  if (error) {
    return <Text>Error : {error.message}</Text>;
  }

  return (
    <Stack spacing={20}>
      <Link href={basePath || ''}>
        <Group spacing={5}>
          <ArrowNarrowLeft />
          <Text fz={18}>Back to specimens</Text>
        </Group>
      </Link>

      <Paper p={20} radius="lg" withBorder>
        <Group align="inherit">
          <Title order={3} mb={10}>{`Complete specimen view: ${data?.specimen.accession}`}</Title>
          <Text fz="sm" c="dimmed">Source</Text>
        </Group>

        <Grid gutter={0}>
          <Grid.Col span={3}>
            <Paper p={15} bg="#d6e4ed" h="100%" sx={{ borderRadius: "10px 0 10px 10px" }}>
              <EventTimeline specimen={data?.specimen} />
            </Paper>
          </Grid.Col>

          <Grid.Col span={9}>
            <Stack>
              <Paper px={20} pt={30} pb={15} bg="#eaf1f5" sx={{ borderRadius: "0 10px 10px 0" }}>
                <Title order={5}>Collection event</Title>
                <Collections specimen={data?.specimen} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Accession event</Title>
                <Accessions specimen={data?.specimen} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>Subsample event</Title>
                <Subsamples subsample={data?.subsample} />
              </Paper>
              <Paper px={20} pt={30} pb={15}>
                <Title order={5}>DNA extraction event</Title>
                <DnaExtracts dnaExtract={data?.dnaExtract} />
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
