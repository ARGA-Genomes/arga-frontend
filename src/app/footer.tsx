'use client';

import Link from 'next/link';
import {Container, Divider, Flex, Grid, Group, Image, MediaQuery, Stack, Text, createStyles} from '@mantine/core';
import { HeaderAndFooterProps } from './type';
import theme from './theme';

const useStyles = createStyles((theme, _params, _getRef) => ({
  footerLink: {
    color: theme.colors.grey[2]
  }
}));

export function Footer({ links }: HeaderAndFooterProps) {

  const { classes } = useStyles();

  const footerLinks = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.footerLink}> {link.label} </Link>
  ));

  const maxWidth: string = "150px"
  const minWidth: string = "150px"
  const mawImage = {
    base: "50%", xs:maxWidth, sm:maxWidth, md:maxWidth, lg:maxWidth, xl: maxWidth
  }

  return (
    <Flex py={50} align="center" style={{borderTop: "solid white 3px"}} >
      <Grid style={{width: "100%"}}>
        <MediaQuery largerThan="md" styles={{borderRight: "solid white 6px"}}>
          <Grid.Col xs={12} sm={12} md={2} lg={2} xl={2}>
            <Stack>
              {footerLinks}
              <MediaQuery largerThan="md"  styles={{ display: 'none' }}>
                <Divider size={3} color="white"/>
              </MediaQuery>
            </Stack>
          </Grid.Col>
        </MediaQuery>
        <Grid.Col xs={12} sm={12} md={10} lg={10} xl={10}>
            
              <Group position="center" style={{width: "100%", justifyContent: "space-between"}} >
              <Image src="/ala-logo.svg" mx = {20} my = {50 } maw = {mawImage } miw={minWidth} fit="scale-down" alt="" />

              <Image src="/biocommons-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />

              <Image src="/bioplatforms-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />

              <Image src="/ardc-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />

              <Image src="/ncris-logo.svg" mx = {20} my = {50 } maw = {mawImage} miw={minWidth} fit="scale-down" alt="" />
              </Group>
              <Container fluid={true}>
                <Text color="white" size="sm">
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
