export const RAW_COLOURS_RGB: Record<string, [number, number, number]> = {
  midnight: [35, 60, 75],
  shellfish: [88, 163, 157],
  moss: [162, 195, 110],
  bushfire: [244, 124, 46],
  wheat: [254, 199, 67],
};

export function getVoucherStatus(typeStatus?: string, collectionRepositoryId?: string) {
  const status = typeStatus?.toLowerCase();

  if (status === "holotype") return "holotype";
  else if (status === "paratype") return "paratype";
  else if (!status && collectionRepositoryId) return "registered voucher";
  else return "unregistered voucher";
}

export function getVoucherColour(typeStatus?: string, collectionRepositoryId?: string) {
  const status = getVoucherStatus(typeStatus, collectionRepositoryId);

  if (status === "holotype") return "bushfire";
  else if (status === "paratype") return "wheat";
  else if (status === "registered voucher") return "moss";
  else return "shellfish";
}

export function getVoucherRGB(typeStatus?: string, collectionRepositoryId?: string): [number, number, number] {
  const status = getVoucherStatus(typeStatus, collectionRepositoryId);

  if (status === "holotype") return RAW_COLOURS_RGB.bushfire;
  else if (status === "paratype") return RAW_COLOURS_RGB.wheat;
  else if (status === "registered voucher") return RAW_COLOURS_RGB.moss;
  else return RAW_COLOURS_RGB.shellfish;
}

export function getVoucherRGBA(
  alpha: number,
  typeStatus?: string,
  collectionRepositoryId?: string,
): [number, number, number, number] {
  return [...getVoucherRGB(typeStatus, collectionRepositoryId), alpha];
}
