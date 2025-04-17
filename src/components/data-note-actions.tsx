"use client";

import { ReactElement } from "react";
import { Paper, Text, Stack, Divider, UnstyledButton, Flex, ThemeIcon } from "@mantine/core";

import { IconCopy, IconDownload } from "@tabler/icons-react";
import Link from "next/link";

interface ActionButtonProps {
  label: string;
  icon: ReactElement;
  disabled?: boolean;
}

function ActionButton({ label, icon, disabled }: ActionButtonProps) {
  return (
    <UnstyledButton>
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

export function DataNoteActions() {
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
          The data used to generate the page statistics and graphics are accurate to dd/mm/yy. Data and graphics on this
          page may be shared under a{" "}
          <Link href="https://creativecommons.org/licenses/by/4.0/deed.en" target="_blank">
            CC BY 4.0 licence
          </Link>
          .
        </Text>
        <Divider my="xs" />
        <Stack gap="sm">
          <ActionButton disabled label="Copy page citation" icon={<IconCopy size="1rem" />} />
          <ActionButton disabled label="Download raw data as CSV" icon={<IconDownload size="1rem" />} />
          <ActionButton disabled label="Download graphics as PNG file" icon={<IconDownload size="1rem" />} />
        </Stack>
      </Stack>
    </Paper>
  );
}
