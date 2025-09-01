import { gql } from "@apollo/client";

export const DNA_EXTRACT = gql`
  fragment DnaExtractDetails on DnaExtract {
    recordId
  }
`;

export const DNA_EXTRACTION_EVENT = gql`
  fragment DnaExtractionEventDetails on DnaExtractionEvent {
    eventDate
    eventTime
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
`;
