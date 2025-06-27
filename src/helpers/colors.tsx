import { useMantineTheme } from "@mantine/core";

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
  const theme = useMantineTheme();

  const status = getVoucherStatus(typeStatus, collectionRepositoryId);

  if (status === "holotype") return theme.other.rawColors.bushfire;
  else if (status === "paratype") return theme.other.rawColors.wheat;
  else if (status === "registered voucher") return theme.other.rawColors.moss;
  else return theme.other.rawColors.shellfish;
}

export function getVoucherRGBA(
  alpha: number,
  typeStatus?: string,
  collectionRepositoryId?: string,
): [number, number, number, number] {
  return [...getVoucherRGB(typeStatus, collectionRepositoryId), alpha];
}
