import React, { ReactNode } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_DETAILS = gql`
  query SourcesCache {
    sources {
      datasets {
        id
        name
      }
    }
  }
`;

type Dataset = {
  id: string;
  name: string;
};

type Source = {
  datasets: Dataset[];
};

type QueryResults = {
  sources: Source[];
};

const DatasetsContext = React.createContext<Map<string, Dataset>>(new Map());

export function SourceProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<QueryResults>(GET_DETAILS);
  let datasets = new Map();

  if (data) {
    const records = data.sources.flatMap((s) => s.datasets);
    for (const dataset of records) {
      datasets.set(dataset.id, dataset);
    }
  }

  return (
    <DatasetsContext.Provider value={datasets}>
      {children}
    </DatasetsContext.Provider>
  );
}

export const useDatasets = () => React.useContext(DatasetsContext);
