"use client";

import classes from "./group-card.module.css";

import { Image, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { memo } from "react";
import { GroupItem } from "../_data/all";

export interface GroupCardProps extends GroupItem {
  disabled?: boolean;
}

function GroupCard({ category, image, href, source, filter, disabled }: GroupCardProps) {
  const imageSize = 125;
  const groupLink = href ?? filter ? `/browse/list-groups/${category}` : `/browse/sources/${source}`;

  return (
    <Paper radius="xl" p={20} className={`${classes.card} ${disabled ? classes.disabled : ""}`} maw={190}>
      <Link href={groupLink}>
        <Stack align="center" gap="md">
          <Image
            className={classes.image}
            src={image}
            height={imageSize}
            width={imageSize}
            mah={imageSize}
            maw={imageSize}
            alt={category}
          />
          <Text fw="bold" size="sm" ta={"center"} c="midnight.9">
            {category}
          </Text>
        </Stack>
      </Link>
    </Paper>
  );
}

// Memoize GroupCard to prevent unnecessary re-renders when props haven't changed
const MemoizedGroupCard = memo(GroupCard);

export { MemoizedGroupCard as GroupCard };
