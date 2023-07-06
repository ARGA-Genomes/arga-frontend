"use client";

import * as Humanize from "humanize-plus";
import { gql, useQuery } from "@apollo/client";
import { Specimen, SpecimenDetails } from "@/app/type";
import { SpecimenEvents } from "./specimen-details";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";


const GET_SPECIMEN = gql`
query SpecimenDetails($specimenId: String) {
  specimen(specimenId: $specimenId) {
    id
    typeStatus
    catalogNumber
    collectionCode
    institutionName
    institutionCode
    organismId
    latitude
    longitude
    recordedBy
    remarks

    events {
      id
      eventDate
      eventId
      eventRemarks
      fieldNotes
      fieldNumber
      habitat
      samplingEffort
      samplingProtocol
      samplingSizeUnit
      samplingSizeValue

      events {
        ... on CollectionEvent {
          id
          behavior
          catalogNumber
          degreeOfEstablishment
          establishmentMeans
          individualCount
          lifeStage
          occurrenceStatus
          organismId
          organismQuantity
          organismQuantityType
          otherCatalogNumbers
          pathway
          preparation
          recordNumber
          reproductiveCondition
          sex
        }
        ... on SequencingEvent {
          id
          genbankAccession
          organismId
          sequenceId
          targetGene
          dnaSequence
          runs {
            id
            direction
            pcrPrimerNameForward
            pcrPrimerNameReverse
            sequencePrimerForwardName
            sequencePrimerReverseName
            sequencingCenter
            sequencingDate
            targetGene
            traceId
            traceName
            traceLink
          }
        }
      }
    }
  }
}`;

type Species = {
  specimens: Specimen[],
}

type QueryResults = {
  species: Species,
}

type SpecimenQueryResults = {
  specimen: SpecimenDetails,
}


export default function SpecimenPage({ params,}: { params: { uuid: string }}) {
  const theme = useMantineTheme();

  const { loading, error, data } = useQuery<SpecimenQueryResults>(GET_SPECIMEN, {
    variables: {
      specimenId: params.uuid,
    },
  });

  if (error) {
    return (<Text>Error : {error.message}</Text>);
  }

  return (
    <Box pos="relative">
      <LoadingOverlay
        overlayColor={theme.colors.midnight[0]}
        transitionDuration={500}
        loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
        visible={loading}
        radius="xl"
      />

      <Paper radius="lg">
        { data ? <SpecimenEvents specimen={data.specimen} /> : null }
              {/* {data && <Details assembly={data.assembly} />}
        {data?.assembly.stats && <Stats stats={data.assembly.stats} />}
        {data?.assembly.biosamples.map((biosample) => (
          <BioSample biosample={biosample} key={biosample.id} />
        ))} */}
      </Paper>
    </Box>
  );
}
