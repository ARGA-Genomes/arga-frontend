import classes from "./Slide.module.css";

import { DnaExtract, Subsample } from "@/generated/types";
import { Center, Divider, Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconOrcid, IconSubsample } from "../ArgaIcons";
import { EventDetails, PublicationDetails, SlideNavigation } from "./common";

interface ExtractionSlideProps {
  subsamples: Subsample[];
  extractions: DnaExtract[];
}

export function ExtractionSlide({ subsamples, extractions }: ExtractionSlideProps) {
  const [extraction, setExtraction] = useState(extractions.at(0));

  return (
    <SlideNavigation
      icon={<IconSubsample size={200} />}
      records={extractions}
      selected={extraction}
      onSelected={(record) => setExtraction(record)}
      getLabel={(record) => record.extractId}
    >
      {extraction && (
        <Stack w="100%" mb="xl">
          <Group wrap="nowrap">
            <EventDetails version="" />
            <PublicationDetails publication={extraction.publication} />
          </Group>
          <SubsampleDetails subsample={subsamples[0]} />
          <ExtractionDetails extraction={extraction} />
        </Stack>
      )}
    </SlideNavigation>
  );
}

function SubsampleDetails({ subsample }: { subsample: Subsample }) {
  return (
    <Stack gap={5}>
      <Text fw={700} fz="xs" c="midnight.7">
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

function ExtractionDetails({ extraction }: { extraction: DnaExtract }) {
  return (
    <Stack gap={5}>
      <Text fw={700} fz="xs" c="midnight.7">
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
            <td width="50%">
              <Group>
                {extraction.extractedBy?.fullName}
                {extraction.extractedBy?.orcid && (
                  <a target="_blank" href={extraction.extractedBy.orcid}>
                    <IconOrcid size={26} />
                  </a>
                )}
              </Group>
            </td>
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
