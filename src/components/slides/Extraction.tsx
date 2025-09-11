import classes from "./Slide.module.css";

import { Subsample } from "@/generated/types";
import { Box, Center, Divider, Group, Paper, SimpleGrid, Stack, Table, Text } from "@mantine/core";
import { useState } from "react";
import { IconSubsample } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface ExtractionSlideProps {
  subsamples: Subsample[];
}

export function ExtractionSlide({ subsamples }: ExtractionSlideProps) {
  const [subsample, setSubsample] = useState(subsamples.at(0));
  const navWidth = 260;

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <Box p={20}>
          <IconSubsample size={200} />
        </Box>
      </Box>

      <Stack w={navWidth} mb={240} mt="md" gap={0}>
        {subsamples.map((record) => (
          <Paper
            maw={navWidth}
            key={record.entityId}
            radius="xl"
            shadow="none"
            my={5}
            p="xs"
            bg={record === subsample ? "midnight.1" : undefined}
            className={classes.item}
            onClick={() => setSubsample(record)}
          >
            <Group wrap="nowrap">
              <Text fz="xs" fw={300} c="midnight.7">
                Tissue ID
              </Text>
              <Text fz="xs" fw={600} c="midnight.7" truncate="start">
                {record.subsampleId}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Divider orientation="vertical" mx="md" mb="md" size="sm" color="shellfishBg.1" />

      {subsample && (
        <Stack w="100%">
          <Group>
            <EventDetails subsample={subsample} />
            <Publication />
          </Group>
          <SubsampleDetails subsample={subsample} />
          <ExtractionDetails extraction={subsample} />
        </Stack>
      )}
    </Group>
  );
}

function EventDetails({ subsample }: { subsample: Subsample }) {
  return (
    <Paper radius="xl" bg="midnight.0" py="sm" px="xl" shadow="none" mr="auto">
      <DataTable>
        <DataTable.RowValue label="ARGA event ID">{subsample.subsampleId}</DataTable.RowValue>
        <DataTable.RowValue label="Event date">{subsample.eventDate}</DataTable.RowValue>
      </DataTable>
    </Paper>
  );
}

function SubsampleDetails({ subsample }: { subsample: Subsample }) {
  return (
    <Stack>
      <Text fw={700} fz="md" c="midnight.7">
        Nucleic acid extract sample material
      </Text>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Subsample number</th>
            <td colSpan={3}>{subsample.subsampleId}</td>
          </tr>
          <tr>
            <th>Laboratory/Facility</th>
            <td width="50%">{subsample.institutionCode}</td>
            <th>Sample custodian</th>
            <td width="50%">{subsample.custodian}</td>
          </tr>
          <tr>
            <td colSpan={4}>
              <Center>
                <Divider w="60%" size="sm" color="shellfishBg.1" />
              </Center>
            </td>
          </tr>
          <tr>
            <th>Sample weight or volume</th>
            <td width="50%">{subsample.weightOrVolume}</td>
            <th>Sample processing</th>
            <td width="50%">{subsample.sampleProcessing}</td>
          </tr>
          <tr>
            <th>Preservation method</th>
            <td width="50%">{subsample.preservationMethod}</td>
            <th>Preservation temperature</th>
            <td width="50%">{subsample.preservationTemperature}</td>
          </tr>
          <tr>
            <th>Sample quality</th>
            <td width="50%">{subsample.quality}</td>
            <th></th>
            <td width="50%"></td>
          </tr>
          <tr>
            <th>Sample notes</th>
            <td width="50%">{subsample.notes}</td>
            <th></th>
            <td width="50%"></td>
          </tr>
          <tr>
            <td colSpan={4}>
              <Center>
                <Divider w="60%" size="sm" color="shellfishBg.1" />
              </Center>
            </td>
          </tr>
          <tr>
            <th>From Specimen/Tissue</th>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <th>Institution</th>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </Stack>
  );
}

function ExtractionDetails({ extraction }: { extraction: Subsample }) {
  return (
    <Stack>
      <Text fw={700} fz="md" c="midnight.7">
        Nucleic acid extract
      </Text>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Extract number</th>
            <td width="50%"></td>
            <th>Nucleic acid type</th>
            <td width="50%"></td>
          </tr>
          <tr>
            <th>Extracted by</th>
            <td width="50%"></td>
            <th>Extracted date</th>
            <td width="50%"></td>
          </tr>
          <tr>
            <th>Laboratory/Facility</th>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <th>Extraction method</th>
            <td width="50%"></td>
            <th>Lysis method</th>
            <td width="50%"></td>
          </tr>
          <tr>
            <th>Nucleic acid concentration</th>
            <td width="50%"></td>
            <th>Quantification method</th>
            <td width="50%"></td>
          </tr>
          <tr>
            <th>Number of extracts pooled</th>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <th>Extract preservation</th>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <th>Nucleic acid conformation</th>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </Stack>
  );
}

function Publication() {
  return (
    <Stack>
      <Text fw={600} fz="sm" c="midnight.9">
        Publication source
      </Text>
      <Text>publication</Text>
      <Text>doi</Text>
    </Stack>
  );
}
