"use client";

import { Maybe, SpeciesPhoto as SpeciesPhotoType } from "@/generated/types";

import { BackgroundImageProps } from "@mantine/core";
import { ContainedImage } from "./contained-image";

const FLAT_BOTTOM = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

interface SpeciesPhotoProps extends Omit<BackgroundImageProps, "src"> {
  photo?: Maybe<SpeciesPhotoType>;
  flatBottom?: boolean;
}

export function SpeciesPhoto({ photo, flatBottom, ...rest }: SpeciesPhotoProps) {
  return <ContainedImage photo={photo || null} style={{ ...(flatBottom ? FLAT_BOTTOM : {}) }} />;
}
