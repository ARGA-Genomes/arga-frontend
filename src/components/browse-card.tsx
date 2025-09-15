"use client";

import classes from "./browse-card.module.css";

import { Group, Image, Paper, Skeleton, Stack, Text } from "@mantine/core";
import * as Humanize from "humanize-plus";
import Link from "next/link";

import skelClasses from "./browse-card-skel.module.css";

export interface BrowseCardProps {
  total?: number | null;
  category: string;
  image: string;
  link: string;
  disabled?: boolean;
}

function BrowseCard({ link, category, total, image, disabled }: BrowseCardProps) {
  const loading = total === undefined;
  const imageSize = 150;

  return (
    <Paper radius="xl" p={20} className={disabled ? classes.disabled : classes.card}>
      <Link
        href={link}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        <Stack align="center" gap="lg">
          <Image
            className={classes.image}
            src={image}
            height={imageSize}
            width={imageSize}
            maw={imageSize}
            mah={imageSize}
            alt={category}
          />
          <Stack gap={2}>
            <Text size="md" fw={450} ta={"center"} c="white">
              {category}
            </Text>
            {disabled ? (
              <Text size="sm" fw={400} ta={"center"} c="attribute">
                Coming soon
              </Text>
            ) : (
              total !== null && (
                <Group justify="center" ta="center" gap={4} w="100%">
                  {loading ? (
                    <Skeleton opacity={0.6} classNames={skelClasses} w={50} h={20.3} />
                  ) : (
                    <Text fw="bold" size="sm" c="attribute">
                      {Humanize.compactInteger(total || 0, 2)}
                    </Text>
                  )}
                  <Text size="sm" fw={400} c="attribute">
                    records
                  </Text>
                </Group>
              )
            )}
          </Stack>
        </Stack>
      </Link>
    </Paper>
  );
}

export { BrowseCard };
