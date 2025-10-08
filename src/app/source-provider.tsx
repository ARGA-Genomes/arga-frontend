"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React, { ReactNode } from "react";

const GET_DETAILS = gql`
  query SourcesCache {
    sources {
      datasets {
        id
        name
        url
      }
    }
  }
`;

export interface Dataset {
  id: string;
  name: string;
  url?: string;
}

interface Source {
  datasets: Dataset[];
}

interface QueryResults {
  sources: Source[];
}

interface DatasetContextValue {
  ids: Map<string, Dataset>;
  names: Map<string, Dataset>;
}

const DatasetsContext = React.createContext<DatasetContextValue>({ ids: new Map(), names: new Map() });

export function SourceProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<QueryResults>(GET_DETAILS);

  const context = {
    ids: new Map(),
    names: new Map(),
  };

  if (data) {
    const records = data.sources.flatMap((s) => s.datasets);
    for (const dataset of records) {
      context.ids.set(dataset.id, dataset);
      context.names.set(dataset.name, dataset);
    }
  }

  return <DatasetsContext.Provider value={context}>{children}</DatasetsContext.Provider>;
}

export const useDatasets = () => React.useContext(DatasetsContext);
