"use client";

import { BrowseDataSourcesCard } from "@/components/browse-datasource-card";
import { Carousel } from "@mantine/carousel";
import { Group } from "@mantine/core";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_DATASETS = gql`
  query DatasetsAndSources {
    sources {
      name
      author
      rightsHolder
      accessRights
      license

      datasets {
        name
      }
    }
  }
`;

type Dataset = {
  name: string;
  shortName?: string;
  description?: string;
  url?: string;
  citation?: string;
  license?: string;
  rightsHolder?: string;
  createdAt: string;
  updatedAt: string;
};

type Source = {
  name: string;
  author: string;
  rightsHolder: string;
  accessRights: string;
  license: string;
  datasets: Dataset[];
};

type QueryResults = {
  sources: Source[];
};

export default function BrowseDataSources() {
  const [datasets, setDatasets] = useState<Dataset[][] | null>(null);

  const { loading, error, data } = useQuery<QueryResults>(GET_DATASETS, {
    onCompleted: (data) => {
      // combine all the datasets from all the different datasources into one array
      const datasources = data.sources.map((source) => {
        return source.datasets;
      });
      const flatDatasets = datasources.flatMap((sources) => {
        return sources;
      });

      // datasets then are split into smaller arrays of length 8 to fit with the
      // carousel architecture ie. displaying 8 browse dataset cards per slide
      let groupedDatasets = [];
      for (let i = 0; i < flatDatasets.length; i += 8) {
        groupedDatasets.push(flatDatasets.slice(i, i + 8));
      }
      setDatasets(groupedDatasets);
    },
  });
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Carousel>
      {datasets?.map((datasetGroup, idx) => {
        return (
          <Carousel.Slide key={idx}>
            <Group gap={50} justify="center">
              {datasetGroup.map((dataset, idx) => {
                return <BrowseDataSourcesCard key={idx} name={dataset.name} />;
              })}
            </Group>
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}
