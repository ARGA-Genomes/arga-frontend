import * as Humanize from "humanize-plus";
import { Maybe } from "@/generated/types";
import { DateTime } from "luxon";

export function formatBases(bases?: number | Maybe<number>) {
  if (!bases) return;

  if (bases > 1_000_000_000) return `${(bases / 1_000_000_000).toFixed(1)} gb`;
  if (bases > 1_000_000) return `${(bases / 1_000_000).toFixed(1)} mb`;
  if (bases > 1000) return `${(bases / 1000).toFixed(1)} kb`;

  return bases.toString();
}

export function formatNumber(value?: number | Maybe<number>, decimals?: number) {
  if (!value) return;
  return Humanize.formatNumber(value, decimals);
}

/**
 * Format a yyyy-mm-dd date string into a user friendly string
 */
export function formatDate(value?: string | Maybe<string>) {
  const date = value && DateTime.fromFormat(value, "yyyy-mm-dd");
  return date?.toLocaleString({ year: "numeric", month: "long", day: "numeric" });
}
