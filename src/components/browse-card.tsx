"use client";

import classes from "./browse-card.module.css";
import skelClasses from "./browse-card-skel.module.css";

import * as Humanize from "humanize-plus";
import { Image, Stack, Text, Skeleton, Paper } from "@mantine/core";
import Link from "next/link";

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
        <Stack align="center" gap={5}>
          <Skeleton
            classNames={skelClasses}
            visible={loading}
            circle
            width={imageSize}
            height={imageSize}
            miw={imageSize}
            mih={imageSize}
          >
            <Image src={image} height={imageSize} width={imageSize} alt={category} />
          </Skeleton>
          <Skeleton classNames={skelClasses} visible={loading} mt="xs">
            <Text size="md" fw={450} ta={"center"} c="white">
              {category}
            </Text>
          </Skeleton>
          {disabled ? (
            <Text size="sm" fw={400} ta={"center"} c="attribute">
              Coming soon
            </Text>
          ) : (
            total !== null && (
              <Skeleton classNames={skelClasses} visible={loading}>
                <Text size="sm" fw={400} ta={"center"} c="attribute">
                  {Humanize.compactInteger(total || 0, 2)} records
                </Text>
              </Skeleton>
            )
          )}
        </Stack>
      </Link>
    </Paper>
  );
}

export { BrowseCard };
