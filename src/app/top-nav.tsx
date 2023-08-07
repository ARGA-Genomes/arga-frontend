'use client';

import Link from 'next/link';
import {NavLink, createStyles, Group, Image, Grid, MediaQuery} from '@mantine/core';
import {
  Header,
  Container,
  Burger,
  Paper,
  Transition
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

// Custom navbar link styles. We define class with emotion here
// as this particular component wont be used anywhere else
const useStyles = createStyles((theme, _params, _getRef) => ({
  nav_link: {
    color: "white",
    borderRadius: theme.radius.sm,
    height: 70,
    alignItems: "start",
    paddingLeft: "20px",
    paddingRight: "20px",

    "&:hover, &:focus": {
      backgroundColor: "black",
    },

    span: {
      fontSize: "16px",
    },
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  header: {
    color: "white",    
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  burger: {
    color: 'white',
    [theme.fn.largerThan('md')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    // padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: "black",
    },

    [theme.fn.smallerThan('md')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  root: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'transparent'
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: "black",
      color: "white",
    },
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}


export function TopNav({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(links[0]);
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link })}
      onClick={(event) => {
        event.preventDefault();
        console.log(link)
        setActive(link);
        close();
      }}
    >
      {link.label}
    </a>
  ));

  // return (

  //   <Group position="apart" h="inherit">
  //     <Link href="/">
  //       <Image src="/arga-logo.svg" alt="Australian Reference Genome Atlas" width={250} />
  //     </Link>
  //       <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm">
  //             <Link href="/">
  //               <NavLink label="Home" className={classes.nav_link} />
  //             </Link>
  //             <Link href="/">
  //               <NavLink label="Databases" className={classes.nav_link} />
  //             </Link>
  //             <Link href="/">
  //               <NavLink label="Resources" className={classes.nav_link} />
  //             </Link>
  //             <Link href="/">
  //               <NavLink label="Help" className={classes.nav_link} />
  //             </Link>
  //       </Burger>     
  //     <MediaQuery largerThan="md"  styles={{ display: 'none' }}>
  //       <Grid>
  //         <Grid.Col span={3}>
  //           <Link href="/">
  //             <NavLink label="Home" className={classes.nav_link} />
  //           </Link>
  //         </Grid.Col>
  //         <Grid.Col span={3}>
  //           <Link href="/">
  //             <NavLink label="Databases" className={classes.nav_link} />
  //           </Link>
  //         </Grid.Col>
  //         <Grid.Col span={3}>
  //           <Link href="/">
  //             <NavLink label="Resources" className={classes.nav_link} />
  //           </Link>
  //         </Grid.Col>
  //         <Grid.Col span={3}>
  //           <Link href="/">
  //             <NavLink label="Help" className={classes.nav_link} />
  //           </Link>
  //         </Grid.Col>
  //       </Grid>
  //     </MediaQuery>
  //   </Group>

  //   )

    return (
      <Header height="rem(60)" mb={120} className={classes.root}>
        <Container className={classes.header}>
          <Group spacing={5} className={classes.links}>
          <Link href="/">
            <Image src="/arga-logo.svg" alt="Australian Reference Genome Atlas" width={250} />
          </Link>
            {items}
          </Group>
  
          <Burger opened={opened} onClick={toggle} className={classes.burger} size="md" />
  
          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Container>
      </Header>
    );
}
