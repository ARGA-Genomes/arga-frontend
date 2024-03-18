"use client";

import classes from "./top-nav.module.css";

import Link from "next/link";
import {
  Burger,
  Transition,
  NavLink,
  Group,
  Image,
  Stack,
  Text,
  Avatar,
  Indicator,
  Modal,
  useMantineTheme,
  Collapse,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { Checklist } from "tabler-icons-react";

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
        pb={40}
      />
    </Link>
  ));

  const showSaved = () => {
    savedHandler.open();
  };

  return (
    <Stack gap="0" h="100%">
      <Modal
        opened={savedOpened}
        onClose={savedHandler.close}
        title="Saved list"
        size="auto"
        centered
      >
        {saved?.map((item, idx) => (
          <Link href={item} key={idx}>
            <Text>{item}</Text>
          </Link>
        ))}
      </Modal>

      <Group
        justify="space-between"
        align="center"
        // px={30}
        wrap="nowrap"
        h="100%"
      >
        <Link href="/" onClick={() => setActive(0)}>
          <Image
            // py="50px"
            p="md"
            src="/arga-logo.svg"
            alt="Australian Reference Genome Atlas"
            width={450}
          />
        </Link>

        <Stack h="100%">
          <Group align="center" justify="end" mr={20} wrap="nowrap" h="100%">
            <Indicator
              inline
              label={saved?.length}
              size={16}
              color="bushfire"
              disabled={!saved?.length}
            >
              <Avatar size="lg" onClick={showSaved} component="a" href="#">
                <Checklist size={30} color="white" />
              </Avatar>
            </Indicator>
            <Burger
              hiddenFrom="md"
              opened={opened}
              onClick={toggle}
              size="md"
              color={"white"}
            />
          </Group>
          <Group visibleFrom="md">{items}</Group>
        </Stack>
      </Group>

      <Collapse in={opened} hiddenFrom="md">
        <Stack h="100vh" bg={theme.colors.midnight[8]}>
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
