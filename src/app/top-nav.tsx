'use client';

import Link from 'next/link';
import { NavLink, createStyles, Group, Image } from '@mantine/core';

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
    }
  },
}));


export function TopNav() {
  const { classes } = useStyles();

  return (
    <Group position="apart" h="inherit">
      <Link href="/">
        <Image src="/arga-logo.svg" alt="Australian Reference Genome Atlas" width={250} />
      </Link>
      <Group position="right" align="end" h="inherit">
        <Link href="/">
          <NavLink label="Home" className={classes.nav_link} />
        </Link>
        <Link href="/">
          <NavLink label="Databases" className={classes.nav_link} />
        </Link>
        <Link href="/">
          <NavLink label="Resources" className={classes.nav_link} />
        </Link>
        <Link href="/">
          <NavLink label="Help" className={classes.nav_link} />
        </Link>
      </Group>
    </Group>
    )
}
