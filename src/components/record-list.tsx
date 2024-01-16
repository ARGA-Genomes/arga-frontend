import classes from './record-list.module.css';

import { Button, Grid, Paper, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { Eye } from "tabler-icons-react";


interface RecordItemProps {
  href?: string,
  children: React.ReactNode,
}

export function RecordItem({ href, children }: RecordItemProps) {
  const { hovered, ref } = useHover();

  return (
    <Paper
      radius={16}
      ref={ref}
      bg={ hovered ? "#F5F5F5" : "white" }
      withBorder
    >
      <Grid columns={24}>
        <Grid.Col span={21}>
          {children}
        </Grid.Col>
        <Grid.Col span={3}>
          <Link href={href || "#"}>
            <Button color="midnight" h="100%" w="100%" style={{ borderRadius: "0 16px 16px 0" }}>
            <Stack>
              <Eye size="30px" />
              view
            </Stack>
          </Button>
          </Link>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}


export function RecordList({ children }: { children: React.ReactNode[] }) {
  return (
    <Stack>
      { children.length > 0 ? children : <Text className={classes.emptyList}>no data</Text> }
    </Stack>
  )
}
