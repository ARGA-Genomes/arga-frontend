'use client';

import '@mantine/core/styles.css';
import './global.css';
import classes from './layout.module.css';

import { ApolloProvider } from '@apollo/client';
import createClient from '../queries/client';

import { AppShell, Container, Image, MantineProvider, Paper } from '@mantine/core';

import { theme } from '../theme';
import { TopNav } from './top-nav';
import { MAX_WIDTH } from './constants';
import { Footer } from './footer';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // make the apollo graphql client available on all pages
  const client = createClient();

  return (
    <html lang="en">
      <head/>
      <body>
        <ApolloProvider client={client}>
          <MantineProvider theme={theme}>
            <Shell>
              {children}
            </Shell>
          </MantineProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}

// The shell is the visual layout of the site that wraps all content
// with the top navigation bar and the footer. It also defines the
// page dimension constraints to make responsive layouts easier in
// each page.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 165 }} zIndex={2000} withBorder={false}>
      <AppShell.Header bg="midnight.8">
        <TopNav />
      </AppShell.Header>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      <Paper className={classes.footer} radius={0}>
        <Container maw={MAX_WIDTH}>
          <Footer />
        </Container>
          <Image src="/dna_footer.jpg" h={160} />
      </Paper>
    </AppShell>
  )
}
