'use client';

import classes from "./footer.module.css";

import Link from 'next/link';
import { Container, Flex, Grid, Group, Image, Stack, Text } from '@mantine/core';


interface FooterLinkParams {
  href: string,
  children: React.ReactNode,
}

function FooterLink({ href, children }: FooterLinkParams) {
  return (
    <Link className={classes['footer-link']} href={href}>{children}</Link>
  )
}

export function Footer() {
  const maxWidth: string = "150px"
  const minWidth: string = "150px"
  const mawImage = {
    base: "50%", xs:maxWidth, sm:maxWidth, md:maxWidth, lg:maxWidth, xl: maxWidth
  }

  return (
    <Flex py={50} align="center">
      <Grid style={{width: "100%"}}>
        <Grid.Col span={{ base: 12, md: 2, lg: 2, xl: 2 }}>
          <Stack className={classes['footer-nav']}>
            <FooterLink href="https://arga.org.au/contact/">Contact us</FooterLink>
            <FooterLink href="https://arga.org.au/about/">About us</FooterLink>
            <FooterLink href="https://arga.org.au/help/">Help</FooterLink>
            <FooterLink href="https://arga.org.au/acknowledging/">Acknowledging ARGA</FooterLink>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 10, lg: 10, xl: 10 }}>
          <Group justify="center" style={{width: "100%", justifyContent: "space-between"}} >
            <Image src="/ala-logo.svg" mx = {20} my = {50 } maw = {mawImage } miw={minWidth} fit="scale-down" alt="" />
            <Image src="/biocommons-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />
            <Image src="/bioplatforms-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />
            <Image src="/ardc-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />
            <Image src="/ncris-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />
          </Group>
          <Container fluid={true}>
            <Text c="white" size="sm">
              The Australian Reference Genome Atlas (ARGA) is powered by the Atlas of Living Australia,
              in collaboration with Bioplatforms Australia and Australian BioCommons. The platform is
              enabled by the Australian Government’s National Collaborative Research Infrastructure
              Strategy (NCRIS) through funding from the Atlas of Living Australia, Bioplatforms Australia
              and the Australian Research Data Commons (ARDC).
            </Text>
          </Container>
        </Grid.Col>
      </Grid>
    </Flex>
  );
}
