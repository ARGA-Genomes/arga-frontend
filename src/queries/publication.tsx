import { gql } from "@apollo/client";

export const PUBLICATION = gql`
  fragment Publication on Publication {
    entityId
    title
    authors
    publishedYear
    publishedDate
    language
    publisher
    doi
    sourceUrls
    publicationType
    citation
  }
`;
