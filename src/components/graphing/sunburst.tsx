"use client";

import * as d3 from "d3";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { Sunburst, ResponsiveSunburst, ComputedDatum } from "@nivo/sunburst";
import classes from "./sunburst.module.css";

type TreeNode = {
  name: string;
  value?: number;
  children?: TreeNode[];
};

type SunburstChartProps = {
  data: TreeNode;
  width: number;
  height: number;
};

function flatten(data: TreeNode[] | undefined): TreeNode[] {
  return (
    data?.reduce((acc, item) => {
      if (item.children) {
        return [...acc, item, ...flatten(item.children)];
      }
      return [...acc, item];
    }, [] as TreeNode[]) ?? []
  );
}

function findObject(data: TreeNode[], name: string): TreeNode | undefined {
  return data.find((item) => item.name === name);
}

type CenteredValueProps = {
  centerX: number;
  centerY: number;
};

export function SunburstChart({ data, width, height }: SunburstChartProps) {
  const [chartData, setChartData] = useState<TreeNode>(data);
  const [parent, setParent] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>(["Eukaryota"]);

  const customColor = (numCategories: number | undefined) => {
    if (numCategories) {
      return d3
        .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), numCategories)
        .reverse();
    } else {
      return [];
    }
  };

  const CenteredValue = ({ centerX, centerY }: CenteredValueProps) => {
    return (
      <animated.g>
        <text
          x={centerX}
          y={centerY}
          fill="white"
          textAnchor="middle"
          dominantBaseline="top"
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          {path[0]}
        </text>
        {parent && (
          <text
            x={centerX}
            y={centerY + 25}
            fill="white"
            textAnchor="middle"
            dominantBaseline="bottom"
            // going up one taxonomic level
            onClick={() => {
              if (parent === "Eukaryota") {
                setChartData(data);
              } else {
                const foundObject = findObject(flatten(data.children), parent);
                if (foundObject && foundObject.children) {
                  setChartData(foundObject);
                }
              }
              const tmpPath = path.slice(1);
              setPath(tmpPath);
              setParent(tmpPath[1]);
            }}
            className={classes.sunburstButton}
          >
            Back to {parent}
          </text>
        )}
      </animated.g>
    );
  };
  return (
    <Sunburst
      data={chartData}
      width={width}
      height={height}
      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      id="name"
      value="value"
      valueFormat=" >-,"
      cornerRadius={20}
      colors={customColor(chartData.children?.length)}
      colorBy="id"
      inheritColorFromParent={true}
      childColor={{ from: "color", modifiers: [["brighter", 0.5]] }}
      borderWidth={0}
      borderColor={"#233c4b"}
      enableArcLabels={true}
      arcLabel="id"
      arcLabelsSkipAngle={20}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
      layers={["arcs", "arcLabels", CenteredValue]}
      // going down one taxonomic level
      onClick={(clickedDatum, event) => {
        const foundObject = findObject(
          flatten(chartData.children),
          clickedDatum.data.name
        );
        if (foundObject && foundObject.children) {
          const tmpPath = [clickedDatum.data.name, ...path];
          setPath(tmpPath);
          setParent(tmpPath[1]);
          setChartData(foundObject);
        }
      }}
    />
  );
}
