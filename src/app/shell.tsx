'use client';

import { AppShell, Box, Container, Flex, Header, Image } from '@mantine/core';
import { TopNav } from './top-nav';
import { Footer } from './footer'

const MAX_WIDTH=1512;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding={0}
      header={
        <Header height={77} bg="black" withBorder={false}>
          <Container maw={MAX_WIDTH}>
            <TopNav />
          </Container>
        </Header>
      }
      footer={
        <Box bg="midnight.8" mx={0}>
          <Container maw={MAX_WIDTH}>
            <Footer />
          </Container>
          <Flex align="flex-end" justify="flex-end">
                  {/* <Image src="dna_footer.jpg" width={600} height={80} /> */}
          </Flex>
        </Box>
      }
    >
      <Container py={36} px={32} maw={MAX_WIDTH}>
        {children}
      </Container>
    </AppShell>
  );
}
