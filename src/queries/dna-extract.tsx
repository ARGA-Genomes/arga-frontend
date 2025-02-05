import { gql } from "@apollo/client";

export const DNA_EXTRACT = gql`
  fragment DnaExtractDetails on DnaExtract {
    recordId
  }
`;

export interface DnaExtract {
  recordId: string,
}

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

export interface DnaExtractionEvent {
  eventDate?: string,
  eventTime?: string,
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
