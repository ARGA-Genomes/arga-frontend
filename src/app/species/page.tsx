'use client';

import { RedirectType, redirect } from "next/navigation";

export default function SpeciesHomePage() {
  redirect('./whole_genomes', RedirectType.replace);
}
