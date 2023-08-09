'use client';

import Link from 'next/link';
import {NavLink, createStyles, Group, Image, Grid, MediaQuery, Stack} from '@mantine/core';
import {
  Header,
  Container,
  Burger,
  Paper,
  Transition
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { HeaderResponsiveProps } from './type';

// Custom navbar link styles. We define class with emotion here
// as this particular component wont be used anywhere else
const useStyles = createStyles((theme, _params, _getRef) => ({
  nav_link: {
    color: 'white',
    borderRadius: theme.radius.sm,
    height: 70,
    alignItems: 'start',
    paddingLeft: '20px',
    paddingRight: '20px',

    '&:hover, &:focus': {
      backgroundColor: 'black',
    },

    span: {
      fontSize: '16px',
    }
  },
  dropdown: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    overflow: 'hidden',
    background: theme.colors.midnight[8],

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
    height: 'unset'
  },

  link: {
    lineHeight: 1,
    borderRadius: theme.radius.sm,
  },

  root: {
    backgroundColor: 'transparent',
    border: 'none'
  },

  linkActive: {
    backgroundColor: 'black',
  },

  header: {
    height: 'inherit',
    display: 'flex',
    justifyContent: 'space-between'
  },

  argaImg: {
    height: 'inherit',
    alignItems: 'center'
  }
}));


export function TopNav({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(links[0]);
  const items = links.map((link) => (
    <Link
      key={link.label}
      href='/'
      className={cx(classes.link, { [classes.linkActive]: active === link })}
      onClick={() => {
        setActive(link);
        close();
      }}
    >
      <NavLink label={link.label} className={classes.nav_link}/>
    </Link>
  ));
    return (
      <Header className={classes.root} height='inherit'>
        <Container className={classes.header}>
        <Group position='right' align='center' h='inherit'>
          <Link href='/' >
              <Image src='/arga-logo.svg' alt='Australian Reference Genome Atlas' width={250} />
          </Link>
        </Group>

        <Group position='apart' h='inherit' className={classes.links}>
          <Group position='right' align='end' h='inherit'>
            {items}
          </Group>
        </Group>
  
          <Burger opened={opened} onClick={toggle} className={classes.burger} size='md' color='white'/>
  
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
