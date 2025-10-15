"use client";

import { MAX_WIDTH } from "@/app/constants";
import { IconExtraction, IconGenomicDataProducts } from "@/components/ArgaIcons";
import { CardSlider } from "@/components/CardSlider";
import { DataProductSlide, Product } from "@/components/slides/DataProduct";
import { TimelineNavbar } from "@/components/TimelineNavbar";
import { gql, useQuery } from "@apollo/client";
import { Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { use, useState } from "react";

const GET_DATA_PRODUCTS = gql`
  query OrganismDataProducts($entityId: String) {
    organism(by: { entityId: $entityId }) {
      dataProducts {
        ...DataProductDetails

        publication {
          doi
          citation
        }

        custodian {
          fullName
          orcid
        }
      }
    }
  }
`;

interface OrganismQuery {
  organism: {
    dataProducts: Product[];
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
        <Title order={3}>Genomic and genetic data product timeline</Title>
      </Container>
      <Provenance entityId={params.entityId} />
    </Stack>
  );
}

function Provenance({ entityId }: { entityId: string }) {
  const { loading, error, data } = useQuery<OrganismQuery>(GET_DATA_PRODUCTS, {
    variables: { entityId },
  });

  const [card, setCard] = useState(1);
  return (
    <Stack>
      <TimelineNavbar selected={card} onSelected={setCard}>
        <Link href="data_preparation">
          <TimelineNavbar.Item label="Nucleic acid extraction" icon={<IconExtraction size={60} />} />
        </Link>
        <TimelineNavbar.Item label="Genomic and genetic data products" icon={<IconGenomicDataProducts size={60} />} />
      </TimelineNavbar>

      <CardSlider card={card} onSelected={setCard}>
        <CardSlider.Card title="Nucleic acid extraction" href="data_preparation"></CardSlider.Card>
        <CardSlider.Card title="Genetic data products">
          {error && <Text>{error.message}</Text>}
          {data && <DataProductSlide products={data.organism.dataProducts} />}
        </CardSlider.Card>
      </CardSlider>
    </Stack>
  );
}
