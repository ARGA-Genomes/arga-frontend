'use client';

import { AppShell, Box, Container, Flex, Header } from '@mantine/core';
import { TopNav } from './top-nav';
import { Footer } from './footer'
import {HeaderResponsiveProps} from './type'

// The shell is the visual layout of the site that wraps all content
// with the top navigation bar and the footer. It also defines the
// page dimension constraints to make responsive layouts easier in
// each page.
export function Shell({ children }: { children: React.ReactNode }) {

  const MAX_WIDTH = {xs: "100%", sm: "100%", md: "100%", lg: "80%", xl: "80%" };

  const headerLinks:HeaderResponsiveProps = {
    links: [
      {link: "/", label: "Home"},
      {link: "/", label: "Databases"},
      {link: "/", label: "Resources"},
      {link: "/", label: "Help"},
  ]
  }

  return (
    <AppShell
      padding={0}
      header={
        <Header height={120} bg="midnight.8" withBorder={false} sx={{ "z-index": 2000 }}>
          <Container maw={MAX_WIDTH} px={30} h="inherit">
            <TopNav links={headerLinks.links} />
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
