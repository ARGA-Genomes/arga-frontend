import { gql } from "@apollo/client";

export const DNA_EXTRACT = gql`
  fragment DnaExtractDetails on DnaExtract {
    entityId
    extractId
    subsampleId
    eventDate
    eventTime
    nucleicAcidType
    preparationType
    preservationType
    preservationMethod
    extractionMethod
    concentrationMethod
    conformation
    concentration
    concentrationUnit
    quantification
    absorbance260230Ratio
    absorbance260280Ratio
    cellLysisMethod
    actionExtracted
    numberOfExtractsPooled
  }
`;
