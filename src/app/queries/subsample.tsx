import { gql } from "@apollo/client";

export const SUBSAMPLE = gql`
  fragment SubsampleDetails on Subsample {
    accession
    materialSampleId
    institutionName
    institutionCode
    typeStatus
  }
`;

export type Subsample = {
  accession: string,
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
