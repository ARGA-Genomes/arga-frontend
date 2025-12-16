"use client";

import classes from "./top-nav.module.css";

import { SavedDataManagerButton } from "@/components/DownloadManager";
import { Search } from "@/components/search";
import { Alert, Burger, Collapse, Flex, Group, Image, Modal, NavLink, Stack, Text } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconExternalLink, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { link: "/", label: <>APP HOME</> },
  { link: "/datasets", label: <>DATA SOURCES</> },
  {
    link: "https://arga.org.au/",
    label: (
      <>
        PROJECT HOME <IconExternalLink style={{ marginLeft: 8 }} size="0.9rem" />
      </>
    ),
  },
];

export function TopNav() {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(pathname === "/" ? 0 : 1);
  const [saved] = useLocalStorage<string[]>({
    key: "save-list",
    defaultValue: [],
  });

  const [savedOpened, savedHandler] = useDisclosure(false);

  const items = links.map((item, index) => (
    <Link
      key={item.link}
      href={item.link}
      onClick={() => {
        setActive(index);
        close();
      }}
    >
      <NavLink
        component="text"
        label={<Text fz={14}>{item.label}</Text>}
        active={active === index}
        className={classes.navlink}
        px={20}
        py={10}
      />
    </Link>
  ));

  return (
    <>
      <Stack gap={40} h="100%">
        <Modal opened={savedOpened} onClose={savedHandler.close} title="Saved list" size="auto" centered>
          {saved.map((item, idx) => (
            <Link href={item} key={idx}>
              <Text>{item}</Text>
            </Link>
          ))}
        </Modal>

        <Group justify="space-between" align="center" px={25} wrap="nowrap" h="100%">
          <Link
            href="/"
            onClick={() => {
              setActive(0);
            }}
          >
            <Image p="md" src="/arga-logo.svg" h={110} w="auto" alt="Australian Reference Genome Atlas" />
          </Link>

          <Alert
            radius="lg"
            variant="filled"
            color="wheatBg.5"
            title="Service delays over holidays."
            icon={<IconInfoCircle />}
            p="xs"
          >
            <Stack gap={0}>
              <Text fz="xs">Thank you for visiting ARGA. The ARGA Team is taking a break until 12 January 2026. </Text>
              <Text fz="xs">
                For urgent matters, please contact: support@ala.org.au. For general enquiries, please use our{" "}
                <a href="http://arga.org.au/contact" target="_blank">
                  contact page
                </a>
                .
              </Text>
              <Text fz="xs">
                We look forward to working with you again in the new year. Best wishes for your happy holidays, - ARGA
                Team.
              </Text>
            </Stack>
          </Alert>

          <div className={classes.actionsWrapper}>
            <Flex gap="lg" align="center" justify="space-between" mr={20} wrap="nowrap">
              <Search
                style={{ flexGrow: 1 }}
                leftSection={<IconSearch color="var(--mantine-color-midnight-11)" size="1rem" />}
                radius="md"
                classNames={{ root: classes.menuItems, input: classes.search }}
                placeholder="search ARGA"
              />
              <SavedDataManagerButton />
              <Burger opened={opened} onClick={toggle} size="md" color={"white"} className={classes.burgerNav} />
            </Flex>
            <Group wrap="nowrap" className={classes.menuItems}>
              {items}
            </Group>
          </div>
        </Group>
      </Stack>
      <Collapse in={opened}>
        <Stack className={classes.collapse} h="100vh" pt="xl">
          {items}
        </Stack>
      </Collapse>
    </>
  );
}
