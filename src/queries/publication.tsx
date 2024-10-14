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

export type Publication = {
  entityId: string;
  title: string;
  authors: string[];
  publishedYear: number;
  publishedDate?: string;
  language?: string;
  publisher?: string;
  doi?: string;
  sourceUrls: string[];
  publicationType?: string;
  citation?: string;
};
