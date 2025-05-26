"use client";

import classes from "./top-nav.module.css";

import { SavedDataManagerButton } from "@/components/DownloadManager";
import { Search } from "@/components/search";
import { gothamBold } from "@/theme";
import { Burger, Collapse, Flex, Group, Image, Modal, NavLink, Stack, Text } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { IconExternalLink, IconSearch } from "@tabler/icons-react";
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
  const [saved, _setSaved] = useLocalStorage<string[]>({
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
            <Flex gap="xs" align="center">
              <Image p="md" src="/arga-logomark.svg" h={100} w="auto" alt="Australian Reference Genome Atlas" />
              <Stack gap={0}>
                <Text style={{ fontFamily: gothamBold.style.fontFamily, fontSize: 32 }} fw="bold" c="white">
                  ARGA
                </Text>
                <Text c="midnight.2" fw={600} mt={-12}>
                  Australian Reference Genome Atlas
                </Text>
              </Stack>
            </Flex>
          </Link>

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
