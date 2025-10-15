import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import "./global.css";
import classes from "./layout.module.css";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  MantineProvider,
} from "@mantine/core";

import Fathom from "@/components/fathom";
import { TraceLoaderProvider } from "@/components/traces/context";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { theme } from "../theme";
import { Footer } from "./footer";
import { SourceProvider } from "./source-provider";
import { TopNav } from "./top-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "ARGA - %s",
    default: "ARGA",
  },
  description:
    "The Australian Reference Genome Atlas, an indexing service for aggregating, discovering, filtering and accessing complex life science data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Fathom />
        <ApolloWrapper>
          <MantineProvider theme={theme}>
            <SourceProvider>
              <TraceLoaderProvider>
                <NuqsAdapter>
                  <Shell>{children}</Shell>
                </NuqsAdapter>
              </TraceLoaderProvider>
            </SourceProvider>
          </MantineProvider>
        </ApolloWrapper>
        <script src="/workers.js" async></script>
      </body>
    </html>
  );
}

// The shell is the visual layout of the site that wraps all content
// with the top navigation bar and the footer. It also defines the
// page dimension constraints to make responsive layouts easier in
// each page.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 130 }} zIndex={2000} withBorder={false}>
      <AppShellHeader className={classes.header}>
        <TopNav />
      </AppShellHeader>

      <AppShellMain>{children}</AppShellMain>

      <Footer />
    </AppShell>
  );
}
