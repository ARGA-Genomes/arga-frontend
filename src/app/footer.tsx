'use client';

import Link from 'next/link';
import {Container, Divider, Flex, Grid, Image, MediaQuery, Stack, Text, createStyles} from '@mantine/core';
import { HeaderAndFooterProps } from './type';
import theme from './theme';

const useStyles = createStyles((theme, _params, _getRef) => ({
  footerLink: {
    color: theme.colors["bushfire"][6]
  }
}));

export function Footer({ links }: HeaderAndFooterProps) {

  const { classes } = useStyles();

  const footerLinks = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.footerLink}> {link.label} </Link>
  ));

  const maxWidth: string = "200px"
  const minWidth: string = "200px"
  const mawImage = {
    base: "50%", xs:maxWidth, sm:maxWidth, md:maxWidth, lg:maxWidth, xl:"100%"
  }

  return (
    <Flex py={50} align="center">
      <Grid>
        <MediaQuery largerThan="md" styles={{borderRight: "groove"}}>
          <Grid.Col xs={12} sm={12} md={3} lg={3} xl={3}>
            <Stack>
              {footerLinks}
              <MediaQuery largerThan="md"  styles={{ display: 'none' }}>
                <Divider/>
              </MediaQuery>
            </Stack>
          </Grid.Col>
        </MediaQuery>
        <Grid.Col xs={12} sm={12} md={9} lg={9} xl={9}>
          <Container size="xl">
            <Grid gutter={100}>
            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Image src="/ala-logo.svg" maw={mawImage} miw={minWidth} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Image src="/biocommons-logo.svg" maw={mawImage} miw={minWidth} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Image src="/bioplatforms-logo.svg" maw={mawImage} miw={minWidth} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Image src="/ardc-logo.svg" maw={mawImage} miw={minWidth} fit="scale-down" alt="" />
            </Grid.Col>

            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
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

            <Grid.Col xs={12} sm={12} md={6} lg={6} xl={4}>
              <Image src="/ncris-logo.svg" maw={mawImage} miw={minWidth} fit="scale-down" alt="" />
            </Grid.Col>
          </Grid>
          </Container>
        </Grid.Col>
      </Grid>
    </Flex>
  );
}
