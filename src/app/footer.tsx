'use client';

import Link from 'next/link';
import { Container, Divider, Flex, Grid, Image, Stack, Text } from '@mantine/core';


export function Footer() {
  return (
    <Flex p={50}>
      <Stack>
        <Link href="./contact_us">Contact us</Link>
        <Link href="./help">Help</Link>
        <Link href="./acknowledging">Acknowledging ARGA</Link>
      </Stack>

      <Divider orientation="vertical" mx={80} />

      <Container size="xl" mb={200}>
        <Grid gutter={100}>
          <Grid.Col span={4}>
            <Image src="/ala-logo.svg" width={248} height={100} alt="" />
          </Grid.Col>

          <Grid.Col span={4}>
            <Image src="/biocommons-logo.svg" width={338} height={100} alt="" />
          </Grid.Col>

          <Grid.Col span={4}>
            <Image src="/bioplatforms-logo.svg" width={355} height={100} alt="" />
          </Grid.Col>

          <Grid.Col span={4}>
            <Image src="/ardc-logo.svg" width={307} height={100} alt="" />
          </Grid.Col>

          <Grid.Col span="auto">
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

          <Grid.Col span="content">
            <Image src="/ncris-logo.svg" width={193} height={139} alt="" />
          </Grid.Col>
        </Grid>
      </Container>
    </Flex>
  );
}
