"use client";

import classes from "./species-image.module.css";

import { BackgroundImage, Text, Group, Flex } from "@mantine/core";
import Link from "next/link";
import { Photo } from "@/app/type";
import { getLicense } from "@/helpers/getLicense";

function Placeholder() {
  return <BackgroundImage h={{ base: "300px", xl: "100%" }} w="100%" radius="lg" src="/no-image.png" />;
}

interface SpeciesPhotoProps {
  photo: Photo;
}

function SpeciesPhoto({ photo }: SpeciesPhotoProps) {
  const url = photo.url.replace("original", "medium");
  const license = photo.license && getLicense(photo.license.toLowerCase());

  return (
    <BackgroundImage src={url} w="100%" h={{ base: "300px", xl: "100%" }} radius="lg" style={{ overflow: "hidden" }}>
      <Flex align="flex-end" w="inherit" h="inherit">
        <Group className={classes.imageAttribution} p={5} px={15}>
          <Text fz="xs">&copy; {photo.rightsHolder}</Text>
          <Text fz="xs">
            {photo.source ? (
              <Link href={photo.source || "#"} target="_blank">
                {photo.publisher}
              </Link>
            ) : (
              photo.publisher
            )}
          </Text>
          <Text fz="xs">
            {license && license.url ? (
              <Link href={license.url} target="_blank">
                {license.name}
              </Link>
            ) : (
              photo.license
            )}
          </Text>
        </Group>
      </Flex>
    </BackgroundImage>
  );
}

interface SpeciesImageProps {
  photo?: Photo;
}

export function SpeciesImage({ photo }: SpeciesImageProps) {
  return photo ? <SpeciesPhoto photo={photo} /> : <Placeholder />;
}
