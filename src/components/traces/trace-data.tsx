'use client'

import { LineChart } from "@/components/graphing/line";
import { ScrollArea } from "@mantine/core";
import { LoadOverlay } from "../load-overlay";
import { useTraceLoader } from "./context";
import { Trace } from "@/queries/sequence";


interface TraceDataProps {
  trace?: Trace,
}

export function TraceData(props: TraceDataProps) {
  if (!props.trace) return null;
  const url = `https://app.arga.org.au/traces/${props.trace.accession}/${props.trace.traceId}/${props.trace.traceName}`;
  const { loading, trace } = useTraceLoader(url);

  return (
    <ScrollArea type="always">
      <LoadOverlay visible={loading} />
      <LineChart w={trace?.data.analyzed_colors.channel_1.length} h={150} data={[
        { name: "A", points: trace?.data.analyzed_colors.channel_1 || [], color: "red" },
        { name: "C", points: trace?.data.analyzed_colors.channel_2 || [], color: "blue" },
        { name: "G", points: trace?.data.analyzed_colors.channel_3 || [], color: "green" },
        { name: "T", points: trace?.data.analyzed_colors.channel_4 || [], color: "black" },
      ]} />
    </ScrollArea>
  )
}
