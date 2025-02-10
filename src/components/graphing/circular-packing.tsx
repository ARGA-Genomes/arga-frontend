"use client";

import { useState } from "react";
import { CirclePacking, LabelProps } from "@nivo/circle-packing";
import { motion } from "framer-motion";

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

interface CircularPackingChartProps {
  data: TreeNode;
  width: number;
  height: number;
}

export function CircularPackingChart({ data, width, height }: CircularPackingChartProps) {
  const [zoomedId, setZoomedId] = useState<string | null>(null);

  const setColors = (canonicalName: string) => {
    if (canonicalName === "Eukaryota") {
      return "hsl(204, 28%, 26%)";
    } else if (canonicalName === "Animalia") {
      return "hsl(203, 46.6%, 48.4%)";
    } else if (canonicalName === "Protista") {
      return "hsl(354, 61.8%, 52.7%)";
    } else if (canonicalName === "Plantae") {
      return "hsl(29, 96.2%, 68.8%)";
    } else if (canonicalName === "Fungi") {
      return "hsl(58, 90.4%, 83.7%)";
    } else if (canonicalName === "Chromista") {
      return "hsl(113, 45.3%, 74.9%)";
    } else {
      return "";
    }
  };

  const CustomLabelComponent = (label: LabelProps<TreeNode>) => {
    const isTopLevel = label.node.height === 2 || label.node.height === 1;
    const color = setColors(label.node.data.name);

    if (isTopLevel) {
      return (
        <motion.text
          key={label.node.id}
          /* x={label.style.x}
           * y={label.style.y} */
          fill={label.node.height === 2 ? "white" : color} // Adjust color as needed
          textAnchor="middle"
          dominantBaseline="central"
          style={{ pointerEvents: "none" }} // Prevent text from intercepting mouse events
          transform={`translate(0,${-label.node.radius - 10})`}
        >
          {label.node.data.name}
        </motion.text>
      );
    } else {
      return (
        <motion.text
          key={label.node.id}
          /* x={label.style.x}
           * y={label.style.y}
           * fill={label.style.textColor} */
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            pointerEvents: "none",
          }} // Prevent text from intercepting mouse events
        >
          {label.node.data.name}
        </motion.text>
      );
    }
  };

  return (
    <CirclePacking
      data={data}
      width={width}
      height={height}
      margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
      id="name"
      value="value"
      valueFormat={(value) => `${value} records`}
      colors={(datum) => setColors(datum.data.name)}
      inheritColorFromParent={true}
      childColor={{ from: "color", modifiers: [["brighter", 0.5]] }}
      padding={15}
      enableLabels={true}
      labelsFilter={(label) => label.node.radius > 32 || label.node.id === "Chromista"}
      // labelsFilter={(label) =>
      //   label.node.height > 0 ||
      //   (zoomedId === "Animalia" ||
      //   zoomedId === "Protista" ||
      //   zoomedId === "Fungi" ||
      //   zoomedId === "Plantae" ||
      //   zoomedId === "Chromista" ||
      //   zoomedId === label.node.id
      //     ? label.node.height === 0
      //     : false)
      // }
      // labelsSkipRadius={32}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      labelComponent={(label) => CustomLabelComponent(label)}
      borderWidth={1}
      borderColor={{
        theme: "background",
      }}
      zoomedId={zoomedId}
      motionConfig="slow"
      onClick={(node) => {
        setZoomedId(zoomedId === node.id ? null : node.id);
      }}
    />
  );
}
