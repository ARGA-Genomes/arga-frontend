'use client';

import { AppShell, Box, Container, Flex, Header, Image } from '@mantine/core';
import { TopNav } from './top-nav';
import { Footer } from './footer'
import { footerLinks, headerLinks, MAX_WIDTH } from './constants';


export function Shell({ children }: { children: React.ReactNode }) {

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
      <Box mt={36}>
        {children}
      </Box>
    </AppShell>
  );
}
