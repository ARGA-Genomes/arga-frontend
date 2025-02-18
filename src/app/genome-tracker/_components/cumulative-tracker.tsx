"use client";

import * as Humanize from "humanize-plus";
import { Chart as ChartJS, BarElement, defaults } from "chart.js";
import { Bar } from "react-chartjs-2";

import { workSans } from "../../../theme";
import { TaxonomicRankStatistic } from "@/queries/stats";

ChartJS.register(BarElement);

defaults.font.family = workSans.style.fontFamily;
defaults.font.weight = "bold";

const labels = [
  "1 Domain",
  "5 Kingdoms",
  "52 Phyla",
  "153 Classes",
  "1025 Orders",
  "5878 Families",
  "45123 Genera",
  "175099 Species",
];

const PLURAL_RANKS: Record<string, string> = {
  DOMAIN: "Domains",
  KINGDOM: "Kingdoms",
  PHYLUM: "Phyla",
  CLASS: "Classes",
  ORDER: "Orders",
  FAMILY: "Families",
  GENUS: "Genera",
  SPECIES: "Species",
};

export const DATA = {
  labels,
  datasets: [
    {
      label: "Dataset 2",
      data: labels.map((_, idx) => ((labels.length - idx - 1) / labels.length) * 100),
      backgroundColor: "#d0e1b6",
    },
    {
      label: "Dataset 1",
      data: labels.map(() => 100),
      backgroundColor: "#dfe3e5",
    },
  ],
};

interface CumulativeTrackerProps {
  data: TaxonomicRankStatistic[];
}

export function CumulativeTracker({ data }: CumulativeTrackerProps) {
  const ranks = data.map((stat) => `${Humanize.formatNumber(stat.children)} ${PLURAL_RANKS[stat.rank]}`);
  const coverage = data.map((stat) => stat.coverage);

  const barData = {
    labels: ranks,
    datasets: [
      {
        label: "Genome coverage",
        data: coverage,
        backgroundColor: "#d0e1b6",
      },
      {
        label: "Dataset 1",
        data: labels.map(() => 100),
        backgroundColor: "#dfe3e5",
      },
    ],
  };

  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        indexAxis: "y" as const,
        responsive: true,
        scales: {
          x: {
            stacked: false,
            ticks: {
              stepSize: 50,
            },
          },
          y: {
            stacked: true,
            ticks: {},
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      }}
      data={barData}
    />
  );
}
