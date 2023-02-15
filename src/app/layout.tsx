'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import RootStyleRegistry from './theme';
import { Shell } from './shell';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const client = new ApolloClient({
    uri: 'http://localhost:5000/api',
    cache: new InMemoryCache()
  });

  return (
    <html lang="en">
      <head/>
      <body>
        <RootStyleRegistry>
          <ApolloProvider client={client}>
            <Shell>
              {children}
            </Shell>
          </ApolloProvider>
        </RootStyleRegistry>
      </body>
    </html>
  )
}
