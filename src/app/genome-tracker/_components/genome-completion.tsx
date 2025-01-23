"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  defaults,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { workSans } from "../../../theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

defaults.font.family = workSans.style.fontFamily;
defaults.font.weight = "bold";

const labels = ["2010", "2015", "2020", "2025", "2030"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(
        (_, idx) => idx * 1000 + Math.floor(Math.random() * 1000)
      ),
      borderColor: "#d0e1b6",
      backgroundColor: "#d0e1b6",
    },
  ],
};

export function GenomeCompletion() {
  return (
    <Line
      options={{
        maintainAspectRatio: false,
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
            title: {
              display: true,
              text: "Number of genomes (log scale)",
              color: "black",
            },
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
