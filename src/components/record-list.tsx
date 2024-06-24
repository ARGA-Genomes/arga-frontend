import classes from "./record-list.module.css";

import { Button, Grid, Paper, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import Link from "next/link";
import { IconEye } from "@tabler/icons-react";

interface RecordItemProps {
  href?: string;
  target?: string;
  rightSection?: React.ReactNode;
  children: React.ReactNode;
}

export function RecordItem({
  href,
  target,
  children,
  rightSection,
}: RecordItemProps) {
  const { hovered, ref } = useHover();

  const right = rightSection || (
    <Button
      color="midnight.10"
      h="100%"
      w="100%"
      style={{ borderRadius: "0 16px 16px 0" }}
    >
      <Stack>
        <IconEye size="30px" />
        view
      </Stack>
    </Button>
  );

  return (
    <Paper radius={16} ref={ref} bg={hovered ? "#F5F5F5" : "white"} withBorder>
      <Grid columns={24}>
        <Grid.Col span={21}>{children}</Grid.Col>
        <Grid.Col span={3}>
          {href ? (
            <Link href={href || "#"} target={target}>
              {right}
            </Link>
          ) : (
            right
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export function RecordList({ children }: { children: React.ReactNode[] }) {
  return (
    <Stack>
      {children.length > 0 ? (
        children
      ) : (
        <Text className={classes.emptyList}>no data</Text>
      )}
    </Stack>
  );
}
