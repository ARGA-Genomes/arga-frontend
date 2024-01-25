"use client";

import classes from "./species-image.module.css";

import {
  BackgroundImage,
  BackgroundImageProps,
  Text,
  Group,
  Flex,
} from "@mantine/core";
import Link from "next/link";
import { Photo } from "@/app/type";


interface License {
  name: string,
  url: string,
}

const LICENSES: Record<string, License> = {
  "cc-by-nc-nd": { name: "cc-by-nc", url: "http://creativecommons.org/licenses/by-nc-nd/4.0"},
  "cc-by-nc-sa": { name: "cc-by-nc-sa", url: "http://creativecommons.org/licenses/by-nc-sa/4.0"},
  "cc-by-nc": { name: "cc-by-nc", url: "http://creativecommons.org/licenses/by-nc/4.0"},
  "cc-by-nd": { name: "cc-by-nd", url: "http://creativecommons.org/licenses/by-nd/4.0"},
  "cc-by-sa": { name: "cc-by-sa", url: "http://creativecommons.org/licenses/by-sa/4.0"},
  "cc-by": { name: "cc-by", url: "http://creativecommons.org/licenses/by/4.0"},
  "cc0": { name: "cc0", url: "http://creativecommons.org/publicdomain/zero/1.0"},

  "http://creativecommons.org/licenses/by-nc-sa/4.0/": { name: "cc-by-nc-sa", url: "http://creativecommons.org/licenses/by-nc-sa/4.0/"},
  "http://creativecommons.org/licenses/by-nc/4.0/": { name: "cc-by-nc", url: "http://creativecommons.org/licenses/by-nc/4.0/"},
  "http://creativecommons.org/licenses/by/4.0/": { name: "cc-by", url: "http://creativecommons.org/licenses/by/4.0/"},
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": { name: "cc-by-nc-nd", url: "http://creativecommons.org/licenses/by-nc-nd/4.0/"},

  "public domain mark": { name: "public domain", url: "http://creativecommons.org/publicdomain/mark/1.0"},
  "attribution-noncommercial 4.0 international": { name: "cc-by-nc", url: "https://creativecommons.org/licenses/by-nc/4.0/"},
  "attribution 4.0 international": { name: "cc-by", url: "https://creativecommons.org/licenses/by/4.0/"},
}


function Placeholder() {
  return (
    <BackgroundImage
      w="inherit"
      h="inherit"
      src="/no-image.png"
    />
  );
}


interface SpeciesPhotoProps {
  photo: Photo,
}

function SpeciesPhoto({ photo }: SpeciesPhotoProps) {
  const url = photo.url.replace("original", "medium");
  const license = LICENSES[photo.license?.toLowerCase()];

  return (
    <BackgroundImage src={url} w="inherit" h="inherit">
      <Flex align="flex-end" w="inherit" h="inherit">
        <Group className={classes.imageAttribution} p={5} px={15}>
        <Text fz="xs">&copy; {photo.rightsHolder}</Text>
        <Text fz="xs"><Link href={photo.referenceUrl || "#"} target="_blank">{photo.publisher}</Link></Text>
        <Text fz="xs"><Link href={license.url || "#"} target="_blank">({license.name.toUpperCase()})</Link></Text>
      </Group>
      </Flex>
    </BackgroundImage>
  );
}


interface SpeciesImageProps {
  photo?: Photo,
}

export function SpeciesImage({ photo }: SpeciesImageProps) {
  return photo ? <SpeciesPhoto photo={photo} /> : <Placeholder />
}
