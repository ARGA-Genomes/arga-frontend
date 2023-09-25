"use client";

import { MantineProvider } from "@mantine/core";
import { argaBrandLight } from '@/app/theme';

interface BrowseLayoutProps {
  children: React.ReactNode;
}

export default function BrowseLayout({ children }: BrowseLayoutProps) {
  return (
    <MantineProvider inherit withGlobalStyles withNormalizeCSS theme={argaBrandLight}>
      {children}
    </MantineProvider>
  );
}
