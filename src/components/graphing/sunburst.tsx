"use client";

import * as d3 from "d3";
import { animated } from "@react-spring/web";
import { useState } from "react";
import { Sunburst } from "@nivo/sunburst";
import classes from "./sunburst.module.css";
import Link from "next/link";

interface TreeNode {
  name: string;
  rank: string;
  value?: number;
  children?: TreeNode[];
}

interface SunburstChartProps {
  data: TreeNode;
  width: number;
  height: number;
}

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

function capitaliseFirstLetter(word: string) {
  if (!word) return word; // handle empty string or undefined
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function findObject(data: TreeNode[], name: string): TreeNode | undefined {
  return data.find((item) => item.name === name);
}

interface CenteredValueProps {
  centerX: number;
  centerY: number;
}

export function SunburstChart({ data, width, height }: SunburstChartProps) {
  const [chartData, setChartData] = useState<TreeNode>(data);
  const [parent, setParent] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>(["Eukaryota"]);
  const [pathRank, setPathRank] = useState<string[]>(["DOMAIN"]);

  const customColor = (numCategories: number | undefined) => {
    if (numCategories) {
      if (numCategories > 1) {
        return d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), numCategories)
          .reverse();
      } else {
        return d3.interpolateSpectral(0.5);
      }
    } else {
      return [];
    }
  };

  const CenteredValue = ({ centerX, centerY }: CenteredValueProps) => {
    return (
      <animated.g>
        <Link
          href={`/${capitaliseFirstLetter(pathRank[0])}/${path[0]}`}
          className={classes.sunburstButton}
        >
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
        </Link>
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
                if (foundObject?.children) {
                  setChartData(foundObject);
                }
              }
              const tmpPath = path.slice(1);
              const tmpPathRank = pathRank.slice(1);
              setPath(tmpPath);
              setPathRank(tmpPathRank);
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
      onClick={(clickedDatum) => {
        const foundObject = findObject(
          flatten(chartData.children),
          clickedDatum.data.name,
        );
        if (foundObject) {
          if (foundObject.children) {
            const tmpPath = [clickedDatum.data.name, ...path];
            const tmpPathRank = [clickedDatum.data.rank, ...pathRank];
            setPath(tmpPath);
            setPathRank(tmpPathRank);
            setParent(tmpPath[1]);
            setChartData(foundObject);
          } else {
            window.location.href = `/${capitaliseFirstLetter(
              foundObject.rank,
            )}/${foundObject.name}`;
          }
        }
      }}
    />
  );
}
