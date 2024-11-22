"use client";

import * as Humanize from "humanize-plus";
import { Image, Stack, Text, Skeleton, Paper } from "@mantine/core";
import Link from "next/link";

export interface BrowseDataSourcesCardProps {
  name?: string;
  records?: number;
  link?: string;
}

function BrowseDataSourcesCard({
  name,
  records,
  link,
}: BrowseDataSourcesCardProps) {
  return (
    <Paper radius="xl" bg="midnight.6" w={260} h={150} p={30}>
      {name}
    </Paper>
  );
}

export { BrowseDataSourcesCard };
