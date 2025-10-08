import "@mantine/core/styles.css";
import "./global.css";
import classes from "./layout.module.css";

import { AppShell, AppShellHeader, AppShellMain, MantineProvider } from "@mantine/core";

import Fathom from "@/components/fathom";
import { TraceLoaderProvider } from "@/components/traces/context";
import { ApolloWrapper } from "@/lib/ApolloWrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { theme } from "../theme";
import { Footer } from "./footer";
import { SourceProvider } from "./source-provider";
import { TopNav } from "./top-nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
