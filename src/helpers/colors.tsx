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
