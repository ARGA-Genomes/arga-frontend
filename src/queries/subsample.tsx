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

export interface Subsample {
  recordId: string,
  materialSampleId?: string,
  institutionName?: string,
  institutionCode?: string,
  typeStatus?: string,
}

export const SUBSAMPLE_EVENT = gql`
  fragment SubsampleEventDetails on SubsampleEvent {
    eventDate
    eventTime
    subsampledBy
    preparationType
  }
`;

export interface SubsampleEvent {
  eventDate?: string,
  eventTime?: string,
  subsampledBy?: string,
  preparationType?: string,
}
