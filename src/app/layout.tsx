'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import RootStyleRegistry from './theme';
import { FeatureFlagProvider } from "./flags";
import { Shell } from './shell';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // make the apollo graphql client available on all pages. for now just
  // use the memory cache to help reduce the total amount of server requests.
  // if we observe very common requests this is a good place to optimise both
  // the responsiveness of the app and the server load
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_ARGA_API_URL,
    cache: new InMemoryCache()
  });

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
