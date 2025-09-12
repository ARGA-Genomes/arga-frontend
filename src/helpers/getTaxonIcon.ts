import { TAXON_ICONS } from "@/components/icon-bar";

const taxonIcons = Object.values(TAXON_ICONS).map((icon) => {
  const [_, rank, canonicalName] = icon.link!.split("/");
  return { rank, canonicalName, image: icon.image };
});

export const getTaxonIcon = (rank: string, canonicalName: string): string | null => {
  const found = taxonIcons.find((icon) => icon.rank === rank.toLowerCase() && icon.canonicalName === canonicalName);
  return found?.image || null;
};
