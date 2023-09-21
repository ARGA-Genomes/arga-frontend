'use client';

import { ApolloProvider } from '@apollo/client';
import createClient from './queries/client';

import RootStyleRegistry from './theme';
import { FeatureFlagProvider } from "./flags";
import { Shell } from './shell';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // make the apollo graphql client available on all pages
  const client = createClient();

  return (
    <html lang="en">
      <head/>
      <body>
        <RootStyleRegistry>
          <ApolloProvider client={client}>
            <FeatureFlagProvider>
              <Shell>
                {children}
              </Shell>
            </FeatureFlagProvider>
          </ApolloProvider>
        </RootStyleRegistry>
      </body>
    </html>
  )
}
