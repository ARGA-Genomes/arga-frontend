"use client";

import { MantineProvider } from "@mantine/core";
import { argaBrandLight } from '@/app/theme';

interface BrowseDatasetLayoutProps {
  children: React.ReactNode;
}

export default function BrowseDatasetLayout({ children }: BrowseDatasetLayoutProps) {
  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      {children}
    </MantineProvider>
  );
}
