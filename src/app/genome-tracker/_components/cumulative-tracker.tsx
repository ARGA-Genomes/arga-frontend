"use client";
import { Chart as ChartJS, BarElement, defaults } from "chart.js";
import { Bar } from "react-chartjs-2";

import { workSans } from "../../../theme";

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

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 2",
      data: labels.map(
        (_, idx) => ((labels.length - idx - 1) / labels.length) * 100
      ),
      backgroundColor: "#d0e1b6",
    },
    {
      label: "Dataset 1",
      data: labels.map(() => 100),
      backgroundColor: "#dfe3e5",
    },
  ],
};

export function CumulativeTracker() {
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
      data={data}
    />
  );
}
