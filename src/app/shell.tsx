'use client';

import { AppShell, Box, Flex, Header, Image } from '@mantine/core';
import { TopNav } from './top-nav';
import { Footer } from './footer'

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding={0}
      header={
        <Header height={40} px="md" bg="black" withBorder={false}>
          <TopNav />
        </Header>
      }
      footer={
        <Box bg="midnight.8" mx={0}>
          <Footer />
          <Flex align="flex-end" justify="flex-end">
                  {/* <Image src="dna_footer.jpg" width={600} height={80} /> */}
          </Flex>
        </Box>
      }
    >
      {children}
    </AppShell>
  );
}
