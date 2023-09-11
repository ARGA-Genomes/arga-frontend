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

export interface BrowseCardProps {
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
        radius={30}
        bg="inherit"
        maw={265}
        m={'auto'}
        sx={(theme) => ({ "&:hover": {backgroundColor: theme.colors.midnight[8] }, height: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'start' })}
      >
        <Card.Section>{children}</Card.Section>
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
  const imageSize = 150

  function displayShortenedTotal ( total: number | undefined): string  | number {
    if (total !== undefined) {
      if (total > 999 && total < 1000000) {
        return ((total/1000).toFixed(2) + 'K')
      }else if (total > 999999 && total < 1000000000) {
        return ((total/1000000).toFixed(2) + 'M')
      }
      return total
    }
    return '0'
  }

  return (
    <BrowseCardShell link={link || ""} >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: "30px"
        }}
      >

        <Stack  align={"center"} spacing={4}
>
          <Skeleton
            className={classes.skeleton}
            visible={loading}
            circle
            width={imageSize}
            height={imageSize}
            miw={imageSize}
            mih={imageSize}
          >
            <Image src={image} height={imageSize} width={imageSize} alt="" />
          </Skeleton>
          <Skeleton className={classes.skeleton} visible={loading} color="red">
            <Text size="md" weight={450} ta={"center"} color="grey.0">
              {category || "Category Here"}
            </Text>
          </Skeleton>
          <Skeleton className={classes.skeleton} visible={loading}>
            <Text size="sm" weight={400} ta={"center"} color="grey.4">
              {displayShortenedTotal(total)} records
            </Text>
          </Skeleton>
        </Stack>
      </Box>
    </BrowseCardShell>
  );
}

export { BrowseCard };
