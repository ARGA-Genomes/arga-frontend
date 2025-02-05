"use client";

import classes from "./footer.module.css";

import Link from "next/link";
import {
  Flex,
  Group,
  Image,
  Stack,
  Text,
  Box,
} from "@mantine/core";
import { IconBrandXFilled, IconBrandGithubFilled } from "@tabler/icons-react";
import { IconOSF } from "../components/osf-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreativeCommons } from "@fortawesome/free-brands-svg-icons";
import { faCreativeCommonsBy } from "@fortawesome/free-brands-svg-icons";

interface FooterLinkParams {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkParams) {
  return (
    <Link className={classes["footer-link"]} href={href}>
      {children}
    </Link>
  );
}

export function Footer() {
  const maxWidth = "150px";
  const minWidth = "150px";
  const mawImage = {
    base: "50%",
    xs: maxWidth,
    sm: maxWidth,
    md: maxWidth,
    lg: maxWidth,
    xl: maxWidth,
  };

  return (
    <Box w="100%" bg="midnight.11">
      <Group justify="center" className={classes.footerGroup}>
        <Stack className={classes["footer-nav"]}>
          <Flex className={classes.footerFlex} gap="md">
            <FooterLink href="https://arga.org.au/contact/">
              Contact us
            </FooterLink>
            <FooterLink href="https://arga.org.au/about/">
              About ARGA
            </FooterLink>
            <FooterLink href="https://arga.org.au/data-use-policy/">
              Data Policy
            </FooterLink>
            <FooterLink href="mailto:support@arga.org.au">Help</FooterLink>
            <FooterLink href="https://arga.org.au/user-guide/">
              User-guide
            </FooterLink>
            <FooterLink href="https://arga.org.au/user-guide/#acknowledging-arga">
              Acknowledging ARGA
            </FooterLink>
          </Flex>
          <Group className={classes.footerSocials}>
            <FooterLink href="https://twitter.com/ARGA_Genomes">
              <IconBrandXFilled stroke={0.25} className={classes.footerIcon} />
            </FooterLink>
            <FooterLink href="https://github.com/ARGA-Genomes">
              <IconBrandGithubFilled
                stroke={0.25}
                className={classes.footerIcon}
              />
            </FooterLink>
            <FooterLink href="https://osf.io/nc7tp/">
              <IconOSF className={classes.footerIcon} />
            </FooterLink>
          </Group>
        </Stack>
        <Stack align="center" gap={20} className={classes.footerLogos}>
          <Group gap={40} justify="center" align="center">
            <Image
              src="/ala-logo.svg"
              maw={mawImage}
              miw={minWidth}
              fit="scale-down"
              alt=""
            />
            <Image
              src="/biocommons-logo.svg"
              maw={mawImage}
              miw={minWidth}
              fit="scale-down"
              alt=""
            />
            <Image
              src="/bioplatforms-logo.svg"
              maw={mawImage}
              miw={minWidth}
              fit="scale-down"
              alt=""
            />
            <Image
              src="/ardc-logo.svg"
              maw={mawImage}
              miw={minWidth}
              fit="scale-down"
              alt=""
            />
            <Image
              src="/ncris-logo.svg"
              maw={mawImage}
              miw={minWidth}
              fit="scale-down"
              alt=""
            />
          </Group>
          <Text c="gray.2" size="sm" maw={930}>
            The Australian Reference Genome Atlas (ARGA) is powered by the Atlas
            of Living Australia, in collaboration with Bioplatforms Australia
            and Australian BioCommons. The platform is enabled by the Australian
            Government’s National Collaborative Research Infrastructure Strategy
            (NCRIS) through funding from the Atlas of Living Australia,
            Bioplatforms Australia and the Australian Research Data Commons
            (ARDC) (https://doi.org/10.47486/DC011).
          </Text>
          <Text c="gray.2" size="sm" maw={930}>
            <Link href={"https://arga.org.au"}>
              Australian Reference Genome Atlas (ARGA)
            </Link>{" "}
            by &copy; Atlas of Living Australia, Australian BioCommons and
            Bioplatforms Australia is licensed under{" "}
            <Link
              href={
                "https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1"
              }
            >
              CC BY 4.0
            </Link>{" "}
            <FontAwesomeIcon icon={faCreativeCommons} color="white" size="lg" />{" "}
            <FontAwesomeIcon
              icon={faCreativeCommonsBy}
              color="white"
              size="lg"
            />
          </Text>
        </Stack>
      </Group>
      <Image src="/gene-pattern.svg" h={160} />
    </Box>
  );
}
