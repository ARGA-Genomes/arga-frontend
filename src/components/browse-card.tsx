"use client";

import classes from './browse-card.module.css';

import * as Humanize from 'humanize-plus';
import {
  Image,
  Stack,
  Text,
  Skeleton,
  Paper,
} from "@mantine/core";
import Link from "next/link";

export interface BrowseCardProps {
  total?: number;
  category: string;
  image: string;
  link: string;
}


/* sx={(theme) => ({ "&:hover": {backgroundColor: theme.colors.midnight[8] }, height: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'start' })} */

function BrowseCard({ link, category, total, image }: BrowseCardProps) {
  const loading = total === undefined;
  const imageSize = 150

    /* style={{
*   display: "flex",
*   flexDirection: "row",
*   justifyContent: "center",
*   paddingTop: "30px"
* }} */

  return (
    <Paper radius="md" bg="midnight.7" p={10} className={classes.card}>
      <Link href={link}>
      <Stack align="center" gap={5}>
        <Skeleton
          className={classes.skeleton}
          visible={loading}
          circle
          width={imageSize}
          height={imageSize}
          miw={imageSize}
          mih={imageSize}
        >
          <Image src={image} height={imageSize} width={imageSize} alt={category} />
        </Skeleton>
        <Skeleton className={classes.skeleton} visible={loading} color="red">
          <Text size="md" fw={450} ta={"center"} c="grey.0">
            {category || "Category Here"}
          </Text>
        </Skeleton>
        <Skeleton className={classes.skeleton} visible={loading}>
          <Text size="sm" fw={400} ta={"center"} c="grey.4">
            {Humanize.compactInteger(total || 0, 2)} records
          </Text>
        </Skeleton>
      </Stack>
      </Link>
    </Paper>
  );
}

export { BrowseCard };
