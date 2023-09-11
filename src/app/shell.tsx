'use client';

import { AppShell, Box, Container, Flex, Header, Image } from '@mantine/core';
import { TopNav } from './top-nav';
import { Footer } from './footer'
import { footerLinks, headerLinks } from './constants';

// The shell is the visual layout of the site that wraps all content
// with the top navigation bar and the footer. It also defines the
// page dimension constraints to make responsive layouts easier in
// each page.
export function Shell({ children }: { children: React.ReactNode }) {

  const MAX_WIDTH = {xs: "100%", sm: "100%", md: "100%", lg: "95%", xl: "95%" };

  return (
    <AppShell
      padding={0}
      header={
        <Header height={200} bg="midnight.8" withBorder={false} sx={{ "z-index": 2000 }}>
          <Container maw={MAX_WIDTH} px={30} h="inherit">
            <TopNav links={headerLinks.links} />
          </Container>
        </Header>
      }
      footer={
        <Box bg="midnight.8" mx={0}>
          <Container maw={MAX_WIDTH}>
            <Footer links={footerLinks.links}/>
          </Container>
          <Flex align="flex-end" justify="flex-end">
                  <Image src="dna_footer.jpg" width={'100%'} height={160} /> 
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
