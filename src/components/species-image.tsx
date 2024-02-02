"use client";

import classes from "./species-image.module.css";

import {
  BackgroundImage,
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
  "cc-by-nc-nd": { name: "(CC-BY-NC)", url: "http://creativecommons.org/licenses/by-nc-nd/4.0"},
  "cc-by-nc-sa": { name: "(CC-BY-NC-SA)", url: "http://creativecommons.org/licenses/by-nc-sa/4.0"},
  "cc-by-nc": { name: "(CC-BY-NC)", url: "http://creativecommons.org/licenses/by-nc/4.0"},
  "cc-by-nd": { name: "(CC-BY-ND)", url: "http://creativecommons.org/licenses/by-nd/4.0"},
  "cc-by-sa": { name: "(CC-BY-SA)", url: "http://creativecommons.org/licenses/by-sa/4.0"},
  "cc-by": { name: "(CC-BY)", url: "http://creativecommons.org/licenses/by/4.0"},
  "cc0": { name: "(CC0)", url: "http://creativecommons.org/publicdomain/zero/1.0"},

  "http://creativecommons.org/licenses/by-nc-sa/4.0/": { name: "(CC-BY-NC-SA)", url: "http://creativecommons.org/licenses/by-nc-sa/4.0/"},
  "http://creativecommons.org/licenses/by-nc/4.0/": { name: "(CC-BY-NC)", url: "http://creativecommons.org/licenses/by-nc/4.0/"},
  "http://creativecommons.org/licenses/by/4.0/": { name: "(CC-BY)", url: "http://creativecommons.org/licenses/by/4.0/"},
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": { name: "(CC-BY-NC-ND)", url: "http://creativecommons.org/licenses/by-nc-nd/4.0/"},

  "public domain mark": { name: "Public Domain", url: "http://creativecommons.org/publicdomain/mark/1.0"},
  "attribution-noncommercial 4.0 international": { name: "(CC-BY-NC)", url: "https://creativecommons.org/licenses/by-nc/4.0/"},
  "attribution 4.0 international": { name: "(CC-BY)", url: "https://creativecommons.org/licenses/by/4.0/"},
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
  const license = photo.license && LICENSES[photo.license.toLowerCase()];

  return (
    <BackgroundImage src={url} w="inherit" h="inherit">
      <Flex align="flex-end" w="inherit" h="inherit">
        <Group className={classes.imageAttribution} p={5} px={15}>
        <Text fz="xs">&copy; {photo.rightsHolder}</Text>
        <Text fz="xs">
          { photo.source
            ? <Link href={photo.source || "#"} target="_blank">{photo.publisher}</Link>
            : photo.publisher
          }
        </Text>
        <Text fz="xs">
          { license && license.url
            ? <Link href={license.url} target="_blank">{license.name}</Link>
            : photo.license
          }
        </Text>
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
