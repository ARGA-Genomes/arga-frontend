"use client";

import { Maybe, SpeciesPhoto as SpeciesPhotoType } from "@/generated/types";
import { MantineStyleProp } from "@mantine/core";
import { ContainedImage } from "./contained-image";

const FLAT_BOTTOM = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

interface SpeciesPhotoProps {
  photo?: Maybe<SpeciesPhotoType>;
  flatBottom?: boolean;
  style?: MantineStyleProp;
}

export function SpeciesPhoto({ photo, flatBottom, style }: SpeciesPhotoProps) {
  return <ContainedImage photo={photo || null} style={{ ...(flatBottom ? FLAT_BOTTOM : {}), ...(style || {}) }} />;
}
