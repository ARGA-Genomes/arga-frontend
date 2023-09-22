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

export type Subsample = {
  recordId: string,
  materialSampleId?: string,
  institutionName?: string,
  institutionCode?: string,
  typeStatus?: string,
};

export const SUBSAMPLE_EVENT = gql`
  fragment SubsampleEventDetails on SubsampleEvent {
    preparationType
  }
`;

export type SubsampleEvent = {
  preparationType?: string,
}
