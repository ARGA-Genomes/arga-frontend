"use client";

import classes from "./top-nav.module.css";

import Link from "next/link";
import { Burger, NavLink, Group, Image, Stack, Text, Modal, useMantineTheme, Collapse } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { SavedDataManagerButton } from "@/components/DownloadManager";

const links = [
  { link: "/", label: "APP HOME" },
  { link: "/datasets", label: "DATA SOURCES" },
  { link: "https://arga.org.au/", label: "PROJECT HOME" },
];

export function TopNav() {
  const theme = useMantineTheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [saved, _setSaved] = useLocalStorage<string[]>({
    key: "save-list",
    defaultValue: [],
  });
  const [savedOpened, savedHandler] = useDisclosure(false);

  const items = links.map((item, index) => (
    <Link
      key={item.label}
      href={item.link}
      onClick={() => {
        setActive(index);
        close();
      }}
    >
      <NavLink
        component="text"
        label={<Text fz={16}>{item.label}</Text>}
        active={active === index}
        className={classes.navlink}
        px={30}
        pb={25}
      />
    </Link>
  ));

  return (
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
          <Image p="md" src="/arga-logo.svg" alt="Australian Reference Genome Atlas" />
        </Link>

        <Stack h="100%">
          <Group align="center" justify="end" mr={20} wrap="nowrap" h="100%" className={classes.cart}>
            <SavedDataManagerButton />
            <Burger opened={opened} onClick={toggle} size="md" color={"white"} className={classes.burgerNav} />
          </Group>

          <Group wrap="nowrap" className={classes.menuItems}>
            {items}
          </Group>
        </Stack>
      </Group>

      <Collapse in={opened}>
        <Stack h="100vh" bg={theme.colors.midnight[11]}>
          {items}
        </Stack>
      </Collapse>

      {/* <Stack hiddenFrom="md" bg={theme.colors.midnight[8]}>
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(_styles) => <Stack gap="0">{items}</Stack>}
        </Transition>
      </Stack> */}
    </Stack>
  );
}
