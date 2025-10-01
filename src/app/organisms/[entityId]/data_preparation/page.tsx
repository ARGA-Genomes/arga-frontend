"use client";

import { IconSubsample } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { ExtractionSlide } from "@/components/slides/Extraction";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { DnaExtract, Subsample } from "@/generated/types";
import { gql, useQuery } from "@apollo/client";
import { Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { use, useState } from "react";

const GET_EXTRACTIONS = gql`
  query OrganismExtractions($entityId: String) {
    organism(by: { entityId: $entityId }) {
      subsamples {
        ...SubsampleDetails
      }
      extractions {
        ...DnaExtractDetails

        publication {
          doi
          citation
        }

        extractedBy {
          fullName
          orcid
        }
      }
    }
  }
`;

interface OrganismQuery {
  organism: {
    subsamples: Subsample[];
    extractions: DnaExtract[];
  };
}

interface PageProps {
  params: Promise<{ entityId: string }>;
}

export default function Page(props: PageProps) {
  const params = use(props.params);

  return (
    <Stack gap="xl">
      <Provenance entityId={params.entityId} />
    </Stack>
  );
}

function Provenance({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_EXTRACTIONS, {
    variables: { entityId },
  });

  const [card, setCard] = useState(1);
  return (
    <Stack>
      <Title order={3}>Organism subsampling timeline</Title>
      <TimelineNavbar onSelected={setCard}>
        <Link href="subsamples_and_tissues">
          <TimelineNavbar.Item label="Subsamples and tissues" icon={<IconSubsample size={60} />} />
        </Link>
        <TimelineNavbar.Item label="Nucleic acid extraction" icon={<IconSubsample size={60} />} />
        <TimelineNavbar.Item label="Genetic data products" icon={<IconSubsample size={60} />} />
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Subsamples and tissues"></CardSlider.Card>
        <CardSlider.Card title="Nucleic acid extraction">
          {error && <Text>{error.message}</Text>}
          {data && <ExtractionSlide subsamples={data.organism.subsamples} extractions={data.organism.extractions} />}
        </CardSlider.Card>
        <CardSlider.Card title="Genetic data products"></CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
