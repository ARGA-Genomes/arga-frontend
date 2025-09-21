import { Image } from "@mantine/core";

interface IconImageProps {
  size?: number;
  src: string;
}

function IconImage({ size, src }: IconImageProps) {
  const h = size ?? 40;
  const w = size ?? 40;
  return <Image h={h} w={w} src={src} />;
}

interface IconProps {
  size?: number;
}

export function IconLiveState({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/live_state.svg" />;
}

export function IconSpecimenCollection({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/collecting.svg" />;
}

export function IconSpecimenRegistration({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/registration.svg" />;
}

export function IconSubsample({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/subsamples_and_tissues.svg" />;
}

export function IconOrcid({ size }: IconProps) {
  return <IconImage size={size} src="/icons/orcid.svg" />;
}
