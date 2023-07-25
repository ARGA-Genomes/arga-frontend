"use client";

import { Box } from "@mantine/core";
import SpeciesHeader from "@/app/components/species-header";


interface SpeciesLayoutProps {
  params: { name: string };
  children: React.ReactNode;
}

export default function SpeciesLayout({ params, children }: SpeciesLayoutProps) {
  const canonicalName = params.name.replaceAll("_", " ");
  return (
    <Box>
      <SpeciesHeader canonicalName={canonicalName} />
      {children}
    </Box>
  );
}
