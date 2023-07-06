"use client";

import { gql, useQuery } from "@apollo/client";
import { SpecimenDetails } from "@/app/type";
import SpecimenEvents from "./specimen-details";
import {
  Box,
  LoadingOverlay,
  Paper,
  Text,
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
      </Paper>
    </Box>
  );
}
