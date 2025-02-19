"use client";

import { gql, useQuery } from "@apollo/client";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement);

defaults.font.family = workSans.style.fontFamily;
defaults.font.weight = "bold";

const labels = ["2010", "2015", "2020", "2025", "2030"];

export const DATA = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map((_, idx) => (idx === 0 ? null : idx * 1000 + Math.floor(Math.random() * 1000))),
      borderColor: "#d0e1b6",
      backgroundColor: "#d0e1b6",
    },
  ],
};

const GET_COMPLETE_GENOMES_YEAR_STATS = gql`
  query CompleteGenomesYearStats {
    stats {
      completeGenomesByYear {
        year
        total
      }
    }
  }
`;

type CompleteGenomesYearStatsQuery = {
  stats: {
    completeGenomesByYear: {
      year: number;
      total: number;
    }[];
  };
};

export function GenomeCompletion() {
  const { data } = useQuery<CompleteGenomesYearStatsQuery>(GET_COMPLETE_GENOMES_YEAR_STATS);

  let accum = 0;
  const years = data?.stats.completeGenomesByYear.map((stat) => stat.year);
  const totals = data?.stats.completeGenomesByYear.map((stat) => {
    accum += stat.total;
    return accum;
  });

  const lineData = {
    labels: years,
    datasets: [
      {
        label: "Genome completion",
        data: totals,
        borderColor: "#d0e1b6",
        backgroundColor: "#d0e1b6",
      },
    ],
  };

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
              text: "Number of genomes",
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
      data={lineData}
    />
  );
}
