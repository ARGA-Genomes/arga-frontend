'use client';

import { Box, Container, Paper, Title } from "@mantine/core";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


// TODO: switch out the dummy data for the real data once we know what to display
const data = {
  labels: ['Australia', 'United States', 'United Kingdom', 'Europe', 'Asia'],
  datasets: [
    {
      label: 'Visits',
      data: [45, 30, 15, 5, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderColor: [
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      position: "left" as const,
    }
  }
}

export default function VisitorGraph() {
  return (
    <Paper radius="lg">
      <Title order={2} align="center" pt={40}>Top 5 national and international visitors</Title>
      <Container px={100} sx={{ maxHeight: 454 }}>
        <Pie options={options} data={data} />
      </Container>
    </Paper>
  );
}
