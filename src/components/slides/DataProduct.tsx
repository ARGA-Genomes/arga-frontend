import { Agent, DataProduct, Publication } from "@/generated/types";
import { Group, Paper, ScrollArea, Stack } from "@mantine/core";
import { useState } from "react";
import { IconGenomicDataProducts, IconOrcid } from "../ArgaIcons";
import { SlideNavigation } from "./common";
import { DataTable } from "../data-table";
import Link from "next/link";

export type Product = DataProduct & {
  publication?: Pick<Publication, "doi" | "citation">;
  custodian?: Pick<Agent, "fullName" | "orcid">;
};

interface DataProductSlideProps {
  products: Product[];
}

export function DataProductSlide({ products }: DataProductSlideProps) {
  const [product, setProduct] = useState(products.at(0));

  return (
    <SlideNavigation
      icon={<IconGenomicDataProducts size={200} />}
      records={products}
      selected={product}
      onSelected={(record) => setProduct(record)}
      getLabel={(record) => record.extractId ?? record.sequenceAnalysisId ?? ""}
    >
      {product && (
        <Stack w="100%" mb="xl" mr="xl">
          <ScrollArea.Autosize>
            <ProductList products={products} />
          </ScrollArea.Autosize>
        </Stack>
      )}
    </SlideNavigation>
  );
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <Stack gap="lg">
      {products.map((product) => (
        <ProductDetails key={product.entityId} product={product} />
      ))}
    </Stack>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <Paper radius="xl" bg="shellfishBg.0" p="md" shadow="none">
      <DataTable>
        <DataTable.RowValue label="Sequencing sample ID">{product.sequenceSampleId}</DataTable.RowValue>
        <DataTable.RowValue label="Sequencing run ID">{product.sequenceRunId}</DataTable.RowValue>
        <DataTable.RowValue label="Sequencing notes">{product.notes}</DataTable.RowValue>
        <DataTable.RowValue label="Data context">{product.context}</DataTable.RowValue>
        <DataTable.RowValue label="Data type">{product.type}</DataTable.RowValue>
        <DataTable.RowValue label="Data custodian">
          <Group>
            {product.custodian?.fullName}
            {product.custodian?.orcid && (
              <a target="_blank" href={product.custodian.orcid}>
                <IconOrcid size={26} />
              </a>
            )}
          </Group>
        </DataTable.RowValue>
        <DataTable.RowValue label="Download location">
          {product.url && <Link href={product.url}>{product.url}</Link>}
        </DataTable.RowValue>
      </DataTable>
    </Paper>
  );
}
