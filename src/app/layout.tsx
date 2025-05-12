"use client";

import "@mantine/core/styles.css";
import "./global.css";
import classes from "./layout.module.css";

import { ApolloProvider } from "@apollo/client";
import createClient from "../queries/client";

import { AppShell, MantineProvider } from "@mantine/core";

import { theme } from "../theme";
import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { TraceLoaderProvider } from "@/components/traces/context";
import Fathom from "@/components/fathom";
import { SourceProvider } from "./source-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // make the apollo graphql client available on all pages
  const client = createClient();

  return (
    <html lang="en">
      <body>
        <Fathom />
        <ApolloProvider client={client}>
          <MantineProvider theme={theme}>
            <SourceProvider>
              <TraceLoaderProvider>
                <Shell>{children}</Shell>
              </TraceLoaderProvider>
            </SourceProvider>
          </MantineProvider>
        </ApolloProvider>

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
    //165
    <AppShell header={{ height: 180 }} zIndex={2000} withBorder={false}>
      <AppShell.Header className={classes.header}>
        <TopNav />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <Footer />
    </AppShell>
  );
}
