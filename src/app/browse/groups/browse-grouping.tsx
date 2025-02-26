"use client";

import { gql, useQuery } from "@apollo/client";
import { Group } from "@mantine/core";
import { GroupCard } from "./group-card";

interface Overview {
  allSpecies: number;
  sources: [
    {
      name: string;
      total: number;
    }
  ];
}

const GET_OVERVIEW = gql`
  query {
    overview {
      allSpecies
      sources {
        name
        total
      }
    }
  }
`;

interface OverviewResults {
  overview: Overview;
}

export default function BrowseGrouping() {
  const { error, data } = useQuery<OverviewResults>(GET_OVERVIEW);
  if (error) return <p>Error : {error.message}</p>;

  const sources: Record<string, number> = {};
  for (const source of data?.overview.sources || []) {
    sources[source.name] = source.total;
  }

  return (
    <Group justify="center">
      <GroupCard
        category="Argiculture"
        image="/card-icons/dataset/agriculture.svg"
        link="/browse/sources/ARGA_Commercial_Species"
      />
      <GroupCard
        category="Aquaculture"
        image="/card-icons/dataset/aquaculture.svg"
        link="/browse/sources/ARGA_Commercial_Species"
      />
      <GroupCard
        category="Terrestrial"
        image="/card-icons/dataset/terrestrial.svg"
        link="/browse/sources/ARGA_Commercial_Species"
      />
      <GroupCard
        category="Threatened"
        image="/card-icons/dataset/threatened.svg"
        link="/browse/sources/ARGA_Threatened_Species"
      />
      <GroupCard
        category="Bushfire Recovery"
        image="/card-icons/dataset/fire_vulnerable.svg"
        link="/browse/sources/ARGA_Bushfire_Recovery"
      />
      <GroupCard
        category="Commercial"
        image="/card-icons/dataset/commercial_and_trade_fishes.svg"
        link="/browse/sources/ARGA_Commercial_Species"
      />
      <GroupCard
        category="Venomous and Poisonous"
        image="/card-icons/dataset/venomous_and_poisonous.svg"
        link="/browse/sources/ARGA_Venomous_and_Poisonous_Species"
      />
    </Group>
  );
}
