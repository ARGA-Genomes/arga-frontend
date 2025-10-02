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

export function IconSourceOrganism({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/source_organism.svg" />;
}

export function IconExtraction({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/extraction.svg" />;
}

export function IconGenomicDataProducts({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/genomic_data_processing.svg" />;
}

export function IconLibrary({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/library.svg" />;
}

export function IconContigs({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/contigs.svg" />;
}

export function IconScaffolds({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/scaffolds.svg" />;
}

export function IconHiC({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/hi_c.svg" />;
}

export function IconChromosomes({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/chromosomes.svg" />;
}

export function IconAssembly({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/assembly.svg" />;
}

export function IconAnnotation({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/annotation.svg" />;
}

export function IconDeposition({ size }: IconProps) {
  return <IconImage size={size} src="/icons/slides/deposition.svg" />;
}

export function IconOrcid({ size }: IconProps) {
  return <IconImage size={size} src="/icons/orcid.svg" />;
}
