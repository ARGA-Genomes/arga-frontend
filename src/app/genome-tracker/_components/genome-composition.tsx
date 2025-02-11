"use client";

import { useRef, useEffect, useMemo } from "react";
import D3Funnel from "d3-funnel";
import * as Humanize from "humanize-plus";
import { SummaryDataType } from "../page";
import { useMantineTheme } from "@mantine/core";

interface GenomeCompositionProps {
  data: SummaryDataType;
}

export const GenomeComposition = ({
  data: rawData,
}: GenomeCompositionProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();
  const colors = useMemo(
    () => [
      theme.colors["moss"],
      theme.colors["moss"],
      theme.colors["moss"],
      theme.colors["wheat"],
      theme.colors["wheat"],
      theme.colors["wheat"],
      theme.colors["bushfire"],
      theme.colors["bushfire"],
    ],
    [theme.colors]
  );

  useEffect(() => {
    const data = rawData.map(({ key, value }, idx) => ({
      label: Humanize.capitalize(key),
      value,
      backgroundColor: colors[idx][2],
    }));
    const options = {
      block: {
        dynamicHeight: false,
        minHeight: 15,
      },
      chart: {
        inverted: true,
        height: 350,
      },
      label: {
        format: "{f}",
      },
    };

    const chart = new D3Funnel(chartRef.current);
    chart.draw(data, options);

    window.onresize = () => chart.draw(data, options);
  }, [rawData, colors]);

  return <div ref={chartRef} />;
};
