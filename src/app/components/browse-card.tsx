"use client";

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
        bg="inherit"
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
  const loading = total === undefined;

  return (
    <BrowseCardShell link={link || ""}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >

        <Stack  align={"center"} spacing={4}>
          <Skeleton
            className={classes.skeleton}
            visible={loading}
            circle
            width={80}
            height={80}
            miw={80}
            mih={80}
          >
            <Image src={image} height={80} width={80} alt="" ml="auto" mr="auto" display={"block"} />
          </Skeleton>
          <Skeleton className={classes.skeleton} visible={loading} color="red">
            <Text size="xl" weight={600} ta={"center"} color="bushfire.4">
              {category || "Category Here"}
            </Text>
          </Skeleton>
          <Skeleton className={classes.skeleton} visible={loading}>
            <Text size={20} weight={300} ta={"center"} color="white">
              {total} records
            </Text>
          </Skeleton>
        </Stack>
      </Box>
    </BrowseCardShell>
  );
}

export { BrowseCard };
