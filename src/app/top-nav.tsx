'use client';

import classes from './top-nav.module.css';

import Link from 'next/link';
import { Burger, Transition, NavLink, Group, Image, Stack, Text, Avatar, Indicator, Modal } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { useState } from 'react';
import { Checklist } from 'tabler-icons-react';


const links = [
  { link: "/", label: "APP HOME" },
  { link: "/datasets", label: "DATA SOURCES" },
  { link: "https://arga.org.au/", label: "PROJECT HOME" },
]


export function TopNav() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [saved, _setSaved] = useLocalStorage<string[]>({ key: 'save-list', defaultValue: [] });
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
  }

  return (
    <Stack>

    <Modal opened={savedOpened} onClose={savedHandler.close} title="Saved list" size="auto" centered>
      { saved?.map((item, idx) => <Link href={item}><Text key={idx}>{item}</Text></Link>) }
    </Modal>

    <Group justify="space-between" align="end" px={30}>
      <Link href='/' >
        <Image py={30} src='/arga-logo.svg' alt='Australian Reference Genome Atlas' width={450} />
      </Link>

      <Burger hiddenFrom='md' opened={opened} onClick={toggle} size='md' color={'white'} />

      <Stack>
        <Group align="center" justify="end" mr={20}>
          <Indicator inline label={saved?.length} size={16} color="bushfire" disabled={!saved?.length}>
            <Avatar size="lg" onClick={showSaved} component="a" href="#">
              <Checklist size={30} color="white" />
            </Avatar>
          </Indicator>
        </Group>
        <Group visibleFrom="md">
          {items}
        </Group>
      </Stack>
    </Group>


      <Stack hiddenFrom="md">
        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {(_styles) => <Stack>{items}</Stack>}
        </Transition>
      </Stack>

    </Stack>
  );
}
