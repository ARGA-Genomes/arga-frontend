import { gql } from "@apollo/client";

export const SUBSAMPLE = gql`
  fragment SubsampleDetails on Subsample {
    recordId
    materialSampleId
    institutionName
    institutionCode
    typeStatus
  }
`;

export const SUBSAMPLE_EVENT = gql`
  fragment SubsampleEventDetails on SubsampleEvent {
    eventDate
    eventTime
    subsampledBy
    preparationType
  }
`;
