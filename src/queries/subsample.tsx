import { gql } from "@apollo/client";

export const SUBSAMPLE = gql`
  fragment SubsampleDetails on SubsampleDetails {
    entityId
    subsampleId
    eventDate
    eventTime
    institutionName
    institutionCode
    sampleType
    name
    custodian
    description
    notes
    cultureMedia
    cultureMethod
    weightOrVolume
    preservationMethod
    preservationTemperature
    preservationDuration
    quality
    cellType
    cellLine
    cloneName
    labHost
    sampleProcessing
    samplePooling
  }
`;
