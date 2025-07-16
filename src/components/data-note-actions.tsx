"use client";

import { ReactElement, useCallback, useState } from "react";
import {
  Paper,
  Text,
  Stack,
  Divider,
  UnstyledButton,
  Flex,
  ThemeIcon,
  UnstyledButtonProps,
  Loader,
} from "@mantine/core";
import Link from "next/link";

import { IconDownload } from "@tabler/icons-react";
import { downloadImages } from "@/helpers/downloadImages";
import { DocumentNode, gql, OperationVariables, useLazyQuery } from "@apollo/client";
import { downloadCSV } from "@/helpers/downloadCSV";

function getCurrentDate() {
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
}

interface ActionButtonProps extends UnstyledButtonProps {
  label: string;
  icon: ReactElement;
  disabled?: boolean;
  onClick?: () => void;
}

function ActionButton({ label, icon, disabled, onClick, ...rest }: ActionButtonProps) {
  return (
    <UnstyledButton onClick={onClick} {...rest}>
      <Flex gap={12} align="center">
        <ThemeIcon radius="md" color={disabled ? "midnight.1" : "midnight.11"}>
          {icon}
        </ThemeIcon>
        <Text size="sm" fw={600} c={disabled ? "midnight.1" : "midnight.11"}>
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  );
}

export interface DownloadQuery {
  download: DocumentNode;
  fields: { key: string; name: string }[];
  variables: OperationVariables;
  name: string;
}

interface DataNoteActionProps {
  query?: DownloadQuery;
}

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

export function DataNoteActions({ query }: DataNoteActionProps) {
  const [downloadingData, setDownloadingData] = useState<boolean>(false);
  const [downloadingImages, setDownloadingImages] = useState<boolean>(false);

  // Download query
  const [, { refetch: fetchCSV }] = useLazyQuery(query?.download || GET_DETAILS, {
    variables: query?.variables,
  });

  const handleDownloadData = useCallback(() => {
    async function download() {
      if (!query) return;

      setDownloadingData(true);
      await downloadCSV(fetchCSV, query.name, query.fields);
      setDownloadingData(false);
    }

    if (!downloadingData) download();
  }, [downloadingData]);

  const handleDownloadImages = useCallback(() => {
    async function download() {
      setDownloadingImages(true);
      await downloadImages(query?.name || "taxon");
      setDownloadingImages(false);
    }

    if (!downloadingImages) download();
  }, [downloadImages]);

  return (
    <Paper radius="lg" p="md" h="100%" withBorder>
      <Stack>
        <Text c="midnight.9" size="xs" fw="bold">
          Note:
        </Text>
        <Text c="midnight.11" size="xs">
          For the purposes of these data summaries, a “whole genome” is interpreted as being an entire assembly of the
          genome, with or without chromosome assemblies (i.e. assemblies which are at least represented as “scaffold
          assemblies” in the{" "}
          <Link href="https://www.ncbi.nlm.nih.gov/home/genomes/" target="_blank">
            NCBI GenBank Genomes Database
          </Link>
          ).
        </Text>
        <Text c="midnight.11" size="xs">
          The higher classification of Australia&apos;s biodiversity is driven by the taxonomic system managed by the{" "}
          <Link href="https://ala.org.au" target="_blank">
            Atlas of Living Australia
          </Link>
          . The Atlas of Living Australia hosts a record of all of the species that appear on the{" "}
          <Link href="https://biodiversity.org.au/nsl/" target="_blank">
            Australian National Species List
          </Link>
          , and services nationally agreed nomenclature for these species.
        </Text>
        <Text c="midnight.11" size="xs">
          The data used to generate the page statistics and graphics are accurate to {getCurrentDate()}. Data and
          graphics on this page may be shared under a{" "}
          <Link href="https://creativecommons.org/licenses/by/4.0/deed.en" target="_blank">
            CC BY 4.0 licence
          </Link>
          .
        </Text>
        <Divider my="xs" />
        <Stack gap="sm">
          <ActionButton
            disabled={downloadingData || !query}
            onClick={handleDownloadData}
            label="Download raw data as CSV"
            icon={downloadingData ? <Loader color="white" size="1rem" /> : <IconDownload size="1rem" />}
          />
          <ActionButton disabled={true} label="Download graphics as PNG file" icon={<IconDownload size="1rem" />} />
        </Stack>
      </Stack>
    </Paper>
  );
}
