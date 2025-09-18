import classes from "./Slide.module.css";

import { DnaExtractDetails, Subsample } from "@/generated/types";
import { Box, Center, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconSubsample } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface ExtractionSlideProps {
  subsamples: Subsample[];
  extractions: DnaExtractDetails[];
}

export function ExtractionSlide({ subsamples, extractions }: ExtractionSlideProps) {
  const [extraction, setExtraction] = useState(extractions.at(0));
  const navWidth = 260;

  return (
    <Group wrap="nowrap" align="flex-start">
      <Box w={0} style={{ alignSelf: "flex-end", position: "relative" }}>
        <Box p={20}>
          <IconSubsample size={200} />
        </Box>
      </Box>

      <Stack w={navWidth} mb={240} mt="md" gap={0}>
        {extractions.map((record) => (
          <Paper
            maw={navWidth}
            key={record.entityId}
            radius="xl"
            shadow="none"
            my={5}
            p="xs"
            bg={record === extraction ? "midnight.1" : undefined}
            className={classes.item}
            onClick={() => setExtraction(record)}
          >
            <Group wrap="nowrap">
              <Text fz="xs" fw={300} c="midnight.7">
                Lab Sample ID
              </Text>
              <Text fz="xs" fw={600} c="midnight.7" truncate="start">
                {record.extractId}
              </Text>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Divider orientation="vertical" mx="md" mb="md" size="sm" color="shellfishBg.1" />

      {extraction && (
        <Stack w="100%">
          <Group>
            <EventDetails extraction={extraction} />
            <Publication />
          </Group>
          <SubsampleDetails subsample={subsamples[0]} />
          <ExtractionDetails extraction={extraction} />
        </Stack>
      )}
    </Group>
  );
}

function EventDetails({ extraction }: { extraction: DnaExtractDetails }) {
  return (
    <Paper radius="xl" bg="midnight.0" py="sm" px="xl" shadow="none" mr="auto">
      <DataTable>
        <DataTable.RowValue label="ARGA event ID">{extraction.extractId}</DataTable.RowValue>
        <DataTable.RowValue label="Event date">{extraction.eventDate}</DataTable.RowValue>
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

function ExtractionDetails({ extraction }: { extraction: DnaExtractDetails }) {
  return (
    <Stack>
      <Text fw={700} fz="md" c="midnight.7">
        Nucleic acid extract
      </Text>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Extract number</th>
            <td width="50%">{extraction.extractId}</td>
            <th>Nucleic acid type</th>
            <td width="50%">{extraction.nucleicAcidType}</td>
          </tr>
          <tr>
            <th>Extracted by</th>
            <td width="50%">{extraction.extractedBy}</td>
            <th>Extracted date</th>
            <td width="50%">{extraction.eventDate}</td>
          </tr>
          <tr>
            <th>Laboratory/Facility</th>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <th>Extraction method</th>
            <td width="50%">{extraction.extractionMethod}</td>
            <th>Lysis method</th>
            <td width="50%">{extraction.cellLysisMethod}</td>
          </tr>
          <tr>
            <th>Nucleic acid concentration</th>
            <td width="50%">{extraction.concentration}</td>
            <th>Quantification method</th>
            <td width="50%">{extraction.quantification}</td>
          </tr>
          <tr>
            <th>Number of extracts pooled</th>
            <td colSpan={3}>{extraction.numberOfExtractsPooled}</td>
          </tr>
          <tr>
            <th>Extract preservation</th>
            <td colSpan={3}>{extraction.preservationMethod}</td>
          </tr>
          <tr>
            <th>Nucleic acid conformation</th>
            <td colSpan={3}>{extraction.conformation}</td>
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
