"use client";

import * as Humanize from "humanize-plus";
import {
  Card,
  Image,
  Stack,
  Text,
  Skeleton,
  Box,
  createStyles,
} from "@mantine/core";
import Link from "next/link";

interface BrowseCardProps {
  total?: number;
  category: string;
  image: string;
  link: string;
}

function BrowseCardShell({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link} style={{ height: "100%" }}>
      <Card
        shadow="none"
        radius="lg"
        bg="shellfish.0"
        sx={{ "&:hover": { backgroundColor: "#c6e6e3" } }}
        h="100%"
      >
        <Card.Section p="md">{children}</Card.Section>
      </Card>
    </Link>
  );
}

const useStyles = createStyles({
  skeleton: {
    "::before": {
      background: "#486471",
    },
    "::after": {
      background: "#6797b4",
    },
  },
});

function BrowseCard({ link, category, total, image }: BrowseCardProps) {
  const { classes } = useStyles();
  const loading = !total;

  return (
    <BrowseCardShell link={link || ""}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          className={classes.skeleton}
          visible={loading}
          circle
          width={80}
          height={80}
          miw={80}
          mih={80}
          mr="lg"
        >
          <Image src={image} height={80} width={80} alt="" />
        </Skeleton>
        <Stack w="100%" spacing={4}>
          <Skeleton className={classes.skeleton} visible={loading} color="red">
            <Text size="md" weight={600}>
              {category || "Category Here"}
            </Text>
          </Skeleton>
          <Skeleton className={classes.skeleton} visible={loading}>
            <Text size={30} weight={500}>
              {Humanize.compactInteger(total || 100000)}
            </Text>
            <Text size={14} mt={-6}>
              Records
            </Text>
          </Skeleton>
        </Stack>
      </Box>
    </BrowseCardShell>
  );
}

export { BrowseCard };
