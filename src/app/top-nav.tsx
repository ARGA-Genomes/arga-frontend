'use client';

import Link from 'next/link';
import { Header, Container, Burger, Transition, NavLink, createStyles, Group, Image, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { HeaderAndFooterProps } from './type';

// Custom navbar link styles. We define class with emotion here
// as this particular component wont be used anywhere else
const useStyles = createStyles((theme, _params, _getRef) => ({
  nav_link: {
    color: 'white',
    height: 70,
    alignItems: 'start',
    paddingLeft: '30px',
    paddingRight: '30px',
    '&:hover': {
      background: theme.colors.midnight[8],
      borderBottom: '5px solid white',
      color: theme.colors.bushfire[4],
      [theme.fn.smallerThan('md')]: {
        borderBottom: 'none',
        textDecoration: 'underline 5px white',
        textUnderlineOffset: '10px'
      },
    },
    span: {
      fontSize: '22px',
      fontWeight: '600',
      height: '70px'
    }
  },
  nav_link_active: {
    color: theme.colors.wheat[4],
    height: 70,
    alignItems: 'start',
    paddingLeft: '30px',
    paddingRight: '30px',
    '&:hover': {
      color: theme.colors.wheat[4],
      background: theme.colors.midnight[8],
      borderBottom: '5px solid white',
      [theme.fn.smallerThan('md')]: {
        borderBottom: 'none',
        textDecoration: 'underline 5px white',
        textUnderlineOffset: '10px'
      },
    },
    span: {
      fontSize: '22px',
      fonWeight: '600',
      height: '70px'
    }
  },
  dropdown: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    overflow: 'hidden',
    background: theme.colors.midnight[8],

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
    gap: '0px'
  },

  burger: {
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
    height: 'unset'
  },

  link: {
    lineHeight: 1,
  },

  root: {
    backgroundColor: 'transparent',
    border: 'none'
  },

  linkActive: {
    borderBottom: '5px solid',
    borderBottomColor: 'white',
    height: 70,
    [theme.fn.smallerThan('md')]: {
      borderBottom: 'none',
      textDecoration: 'underline 5px white',
      textUnderlineOffset: '10px'
    },
    '&:hover': {
      borderBottom: 'none'
    },

  },

  header: {
    height: 'inherit',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100%'
  },

  argaImg: {
    height: 'inherit',
    alignItems: 'center'
  }
}));


export function TopNav({ links }: HeaderAndFooterProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx, theme } = useStyles();
  const [active, setActive] = useState(links[0]);
  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link })}
      onClick={() => {
        setActive(link);
        close();
      }}
    >
      <NavLink label={link.label} className={cx(classes.nav_link, { [classes.nav_link_active]: active === link })} />
    </Link>
  ));
  return (
    <Header className={classes.root} height='inherit'>
      <Container className={classes.header}>
        <Group position='right' align='center' h='inherit'>
          <Link href='/' >
            <Image src='/arga-logo.svg' alt='Australian Reference Genome Atlas' width={450} />
          </Link>
        </Group>

        <Group position='right' align='end' h='inherit' className={classes.links}>
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} className={classes.burger} size='md' color={'white'}/>

        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {(styles) => (
            <Stack className={classes.dropdown}>
              {items}
            </Stack>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
