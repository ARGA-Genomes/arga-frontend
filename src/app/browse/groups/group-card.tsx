"use client";

import classes from "./group-card.module.css";

import { Image, Stack, Text, Skeleton, Paper } from "@mantine/core";
import Link from "next/link";

export interface GroupCardProps {
  category: string;
  image: string;
}

function GroupCard({ category, image }: GroupCardProps) {
  const imageSize = 125;
  const groupLink = `/browse/groups/${category.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}`;

  return (
    <Paper radius="xl" p={20} className={classes.card} maw={190}>
      <Link href={groupLink}>
        <Stack align="center" gap="md">
          <Image src={image} height={imageSize} width={imageSize} mah={imageSize} maw={imageSize} alt={category} />
          <Text fw="bold" size="sm" ta={"center"} c="midnight.9">
            {category}
          </Text>
        </Stack>
      </Link>
    </Paper>
  );
}

export { GroupCard };
