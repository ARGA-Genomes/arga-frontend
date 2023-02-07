'use client';

import Link from 'next/link';
import { Flex, Grid, NavLink, createStyles } from '@mantine/core';
import { Home } from 'tabler-icons-react';


const useStyles = createStyles((theme, _params, _getRef) => ({
  nav_link: {
    color: "white",
    borderRadius: theme.radius.sm,
    maxHeight: 26,

    "&:hover, &:focus": {
      backgroundColor: theme.colors["moss"][4],
    },
  },

  link: {
    textDocration: "none",
  },
}));


export function TopNav() {
  const { classes } = useStyles();

  return (
    <Grid>
      <Grid.Col span="auto">
        <Flex gap="md" justify="flex-end" align="center" direction="row">
          <Link href="/" className={classes.link}>
            <NavLink label="Home" icon={<Home color="white" size={18} />} className={classes.nav_link} />
          </Link>
        </Flex>
      </Grid.Col>
    </Grid>
    )
}
