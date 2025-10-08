import { gql } from "@apollo/client";

export const DATA_PRODUCT = gql`
  fragment DataProductDetails on DataProduct {
    entityId
    extractId
    sequenceRunId
    sequenceSampleId
    sequenceAnalysisId
    notes
    context
    type
    fileType
    url
    licence
    access
  }
`;
