"use client";

import { MAX_WIDTH } from "@/app/constants";
import {
  IconExtraction,
  IconGenomicDataProducts,
  IconSubsample,
} from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { ExtractionSlide } from "@/components/slides/Extraction";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { DnaExtract, Subsample } from "@/generated/types";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Container, Stack, Text, Title } from "@mantine/core";
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
      <Container w="100%" maw={MAX_WIDTH}>
        <Title order={3}>Organism subsampling timeline</Title>
      </Container>
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
      <TimelineNavbar selected={card} onSelected={setCard}>
        <Link href="subsamples_and_tissues">
          <TimelineNavbar.Item
            label="Subsamples and tissues"
            icon={<IconSubsample size={60} />}
          />
        </Link>
        <TimelineNavbar.Item
          label="Nucleic acid extraction"
          icon={<IconExtraction size={60} />}
        />
        <Link href="data_products">
          <TimelineNavbar.Item
            label="Genomic and genetic data products"
            icon={<IconGenomicDataProducts size={60} />}
          />
        </Link>
      </TimelineNavbar>

      <CardSlider card={card}>
        <CardSlider.Card title="Subsamples and tissues"></CardSlider.Card>
        <CardSlider.Card title="Nucleic acid extraction" size="lg">
          {error && <Text>{error.message}</Text>}
          {data && (
            <ExtractionSlide
              subsamples={data.organism.subsamples}
              extractions={data.organism.extractions}
            />
          )}
        </CardSlider.Card>
        <CardSlider.Card title="Genetic data products"></CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
