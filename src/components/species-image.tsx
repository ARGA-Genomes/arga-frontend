"use client";

import classes from "./species-image.module.css";

import { BackgroundImage, Text, Group, Flex, BackgroundImageProps } from "@mantine/core";
import Link from "next/link";
import { Photo } from "@/app/type";

const FLAT_BOTTOM = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

interface SpeciesPhotoProps extends Omit<BackgroundImageProps, "src"> {
  photo?: Photo;
  flatBottom?: boolean;
}

export function SpeciesPhoto({ photo, flatBottom, ...rest }: SpeciesPhotoProps) {
  if (!photo) {
    return (
      <BackgroundImage
        {...rest}
        h="100%"
        w="100%"
        radius="lg"
        src="/no-image.png"
        style={flatBottom ? FLAT_BOTTOM : {}}
      />
    );
  }

  const url = photo.url.replace("original", "medium");

  return (
    <BackgroundImage
      {...rest}
      src={url}
      h="100%"
      w="100%"
      radius="lg"
      style={{ overflow: "hidden", ...(flatBottom ? FLAT_BOTTOM : {}) }}
    >
      <Flex align="flex-end" w="inherit" h="inherit">
        <Group className={classes.imageAttribution} p={5} px={15}>
          <Text fz="xs">&copy; {photo.rightsHolder}</Text>
          <Text fz="xs">
            {photo!.source ? (
              <Link href={photo.source || "#"} target="_blank">
                {photo.publisher}
              </Link>
            ) : (
              photo.publisher
            )}
          </Text>
          <Text fz="xs">{photo.license}</Text>
        </Group>
      </Flex>
    </BackgroundImage>
  );
}
