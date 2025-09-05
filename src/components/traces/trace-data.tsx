"use client";

import { LineChart } from "@/components/graphing/line";
import { TraceData as TraceDataType } from "@/generated/types";
import { ScrollArea, Text } from "@mantine/core";
import { LoadOverlay } from "../load-overlay";
import { useTraceLoader } from "./context";

interface TraceDataProps {
  trace: TraceDataType;
}

export function TraceData(props: TraceDataProps) {
  const url = `https://app.arga.org.au/traces/${props.trace.accession}/${props.trace.traceId}/${props.trace.traceName}`;
  const { loading, error, trace } = useTraceLoader(url);

  return (
    <ScrollArea type="always">
      <LoadOverlay visible={loading} />
      {error && <Text c="red">Failed: {error.message}</Text>}
      <LineChart
        w={trace?.data.analyzed_colors.channel_1.length}
        h={150}
        data={[
          { name: "A", points: trace?.data.analyzed_colors.channel_1 || [], color: "red" },
          { name: "C", points: trace?.data.analyzed_colors.channel_2 || [], color: "blue" },
          { name: "G", points: trace?.data.analyzed_colors.channel_3 || [], color: "green" },
          { name: "T", points: trace?.data.analyzed_colors.channel_4 || [], color: "black" },
        ]}
      />
    </ScrollArea>
  );
}
