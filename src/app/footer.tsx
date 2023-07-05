'use client';

import Link from 'next/link';
import {Container, Divider, Flex, Grid, Image, MediaQuery, Stack, Text} from '@mantine/core';


export function Footer() {
  return (
    <Flex py={50} align="center">
      <Grid>
        <MediaQuery largerThan="md" styles={{borderRight: "groove"}}>
          <Grid.Col xs={12} sm={12} md={3} lg={3} xl={3}>
            <Stack>
              <Link href="./contact_us">Contact us</Link>
              <Link href="./about">About us</Link>
              <Link href="./help">Help</Link>
              <Link href="./acknowledging">Acknowledging ARGA</Link>

              <MediaQuery largerThan="md"  styles={{ display: 'none' }}>
                <Divider/>
              </MediaQuery>
            </Stack>
          </Grid.Col>
        </MediaQuery>
        <Grid.Col xs={12} sm={12} md={9} lg={9} xl={9}>
          <Container size="xl">
            <Grid gutter={100}>
            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Image src="/ala-logo.svg" maw={{base: "50%", xs:"30%", sm:"30%", md:"50%", lg:"100%", xl:"100%"}} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Image src="/biocommons-logo.svg" maw={{base: "50%", xs:"30%", sm:"30%", md:"50%", lg:"100%", xl:"100%"}} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Image src="/bioplatforms-logo.svg" maw={{base: "50%", xs:"30%", sm:"30%", md:"50%", lg:"100%", xl:"100%"}} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Image src="/ardc-logo.svg" maw={{base: "50%", xs:"30%", sm:"30%", md:"50%", lg:"100%", xl:"100%"}} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Container size={570}>
                <Text color="white" size="xs">
                  The Australian Reference Genome Atlas (ARGA) is powered by the Atlas of Living Australia,
                  in collaboration with Bioplatforms Australia and Australian BioCommons. The platform is
                  enabled by the Australian Government’s National Collaborative Research Infrastructure
                  Strategy (NCRIS) through funding from the Atlas of Living Australia, Bioplatforms Australia
                  and the Australian Research Data Commons (ARDC).
                </Text>
              </Container>
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Image src="/ncris-logo.svg" maw={{base: "50%", xs:"30%", sm:"30%", md:"50%", lg:"100%", xl:"100%"}} fit="scale-down" alt="" />
            </Grid.Col>
          </Grid>
          </Container>
        </Grid.Col>
      </Grid>
    </Flex>
  );
}
