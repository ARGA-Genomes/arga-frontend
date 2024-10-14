import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createFragmentRegistry } from "@apollo/client/cache";

import { ACCESSION_EVENT, COLLECTION_EVENT, SPECIMEN } from "./specimen";
import { SUBSAMPLE, SUBSAMPLE_EVENT } from "./subsample";
import { DNA_EXTRACT, DNA_EXTRACTION_EVENT } from "./dna-extract";
import { TAXON_TREE_NODE_STATISTICS } from "./stats";
import {
  ANNOTATIONS_EVENT,
  ASSEMBLY_EVENT,
  DATA_DEPOSITION_EVENT,
  SEQUENCE,
  SEQUENCING_EVENT,
  SEQUENCING_RUN_EVENT,
} from "./sequence";
import { TAXON_NAME, TAXON_SOURCE, TAXON_NODE } from "./taxa";
import { PUBLICATION } from "./publication";

export default function createClient() {
  const fragments = createFragmentRegistry(
    SPECIMEN,
    SUBSAMPLE,
    DNA_EXTRACT,
    SEQUENCE,
    COLLECTION_EVENT,
    ACCESSION_EVENT,
    SUBSAMPLE_EVENT,
    DNA_EXTRACTION_EVENT,
    SEQUENCING_EVENT,
    SEQUENCING_RUN_EVENT,
    ASSEMBLY_EVENT,
    ANNOTATIONS_EVENT,
    TAXON_TREE_NODE_STATISTICS,
    DATA_DEPOSITION_EVENT,
    TAXON_NAME,
    TAXON_SOURCE,
    TAXON_NODE,
    PUBLICATION,
  );

  // for now just use the memory cache to help reduce the total amount of server requests.
  // if we observe very common requests this is a good place to optimise both
  // the responsiveness of the app and the server load
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_ARGA_API_URL || "/api",
    cache: new InMemoryCache({
      fragments,
    }),
  });
}
