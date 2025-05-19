import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { useSpring, animated, to as interpolate } from "@react-spring/web";
import { VERNACULAR_GROUP_ICON } from "@/components/icon-bar";

// Data for each rendered bubble, now with group and size categories
interface CircleDatum {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  colourKey: string;
  image: string;
  label: string;
  link?: string;
  group: number;
  sizeCategory: "small" | "medium" | "large";
}

// Animated SVG primitives
const AnimatedGroup = animated(Group);
const AnimatedImage = animated("image");
const AnimatedText = animated("text");

interface FloatingCircleProps {
  datum: CircleDatum;
  hoveredId: string | null;
  hoveredPoint: CircleDatum | null;
  onHover: (id: string, meta: CircleDatum) => void;
  onLeave: () => void;
}

const FloatingCircle: React.FC<FloatingCircleProps> = ({ datum, hoveredId, hoveredPoint, onHover, onLeave }) => {
  const { id, cx, cy, radius, image, label, link } = datum;
  const isHovered = hoveredId === id;
  const router = useRouter();

  // Floating up/down
  const { floatY } = useSpring({
    from: { floatY: 0 },
    to: { floatY: 10 },
    config: { duration: 2000 + Math.random() * 1000 },
    loop: { reverse: true },
  });

  // Hover scale
  const { r } = useSpring({ r: isHovered ? radius * 1.3 : radius, config: { tension: 300, friction: 20 } });

  // Repulsion spring
  const [repelSprings, repelApi] = useSpring(() => ({ repelX: 0, repelY: 0 }));
  React.useEffect(() => {
    if (hoveredPoint && hoveredId !== id) {
      const dx = cx - hoveredPoint.cx;
      const dy = cy - hoveredPoint.cy;
      const dist = Math.hypot(dx, dy);
      const repulseRadius = hoveredPoint.radius * 8;
      if (dist > 0 && dist < repulseRadius) {
        const strength = (repulseRadius - dist) / repulseRadius;
        const repulseDist = strength * hoveredPoint.radius * 1.5;
        const ux = dx / dist;
        const uy = dy / dist;
        repelApi.start({ repelX: ux * repulseDist, repelY: uy * repulseDist });
      } else {
        repelApi.start({ repelX: 0, repelY: 0 });
      }
    } else {
      repelApi.start({ repelX: 0, repelY: 0 });
    }
  }, [hoveredPoint, hoveredId, cx, cy, radius, repelApi]);

  const transform = interpolate(
    [repelSprings.repelX, repelSprings.repelY, floatY],
    (x, y, fy) => `translate(${x},${y + fy})`
  );

  // Split label into lines for wrapping
  const maxChars = 12;
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  words.forEach((w) => {
    if ((current + " " + w).trim().length <= maxChars) current = current ? `${current} ${w}` : w;
    else {
      lines.push(current);
      current = w;
    }
  });
  if (current) lines.push(current);

  return (
    <AnimatedGroup transform={transform}>
      <AnimatedImage
        href={image}
        x={r.to((val) => cx - val)}
        y={r.to((val) => cy - val)}
        width={r.to((val) => val * 2)}
        height={r.to((val) => val * 2)}
        onMouseEnter={() => onHover(id, datum)}
        onMouseLeave={onLeave}
        onClick={() => link && router.push(link)}
        style={{ cursor: link ? "pointer" : "default" }}
      />
      <AnimatedText
        x={cx}
        y={r.to((val) => cy + val + 20)}
        textAnchor="middle"
        fontWeight={600}
        fontSize={14}
        fill="var(--mantine-color-midnight-10)"
        pointerEvents="none"
      >
        {lines.map((line, idx) => (
          <tspan key={idx} x={cx} dy={idx === 0 ? 0 : 16}>
            {line}
          </tspan>
        ))}
      </AnimatedText>
    </AnimatedGroup>
  );
};

// SVG layout component with proportional group widths
const CirclesSVG: React.FC<{
  width: number;
  height: number;
  hoveredId: string | null;
  hoveredPoint: CircleDatum | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  setHoveredPoint: React.Dispatch<React.SetStateAction<CircleDatum | null>>;
}> = ({ width, height, hoveredId, hoveredPoint, setHoveredId, setHoveredPoint }) => {
  const circles = useMemo<CircleDatum[]>(() => {
    // Extract entries with group and size
    const raw = Object.entries(VERNACULAR_GROUP_ICON).map(
      ([id, data]) =>
        ({
          id,
          colourKey: data.colour || "white-0",
          image: data.image,
          label: data.label,
          link: data.link,
          group: data.group,
          sizeCategory: data.size as "small" | "medium" | "large",
        } as Partial<CircleDatum>)
    );

    // Sort by group then arbitrary
    raw.sort((a, b) => a.group! - b.group! || 0);
    const totalCount = raw.length;
    const groups = Array.from(new Set(raw.map((e) => e.group))).sort() as number[];
    const groupCount = groups.length;
    const groupMap = Object.fromEntries(groups.map((g) => [g, raw.filter((e) => e.group === g)]));
    const counts = groups.map((g) => groupMap[g].length);

    const padding = 8;
    const labelBuffer = 14;
    const edgePadding = 36;
    const groupGap = 160;
    const availableWidth = width - edgePadding * 2 - groupGap * (groupCount - 1);

    // Compute proportional widths
    const groupWidths = counts.map((count) => (count / totalCount) * availableWidth);
    // Compute start X for each group
    const groupStarts = groupWidths.reduce<number[]>((acc, w, i) => {
      if (i === 0) return [edgePadding];
      return [...acc, acc[i - 1] + groupWidths[i - 1] + groupGap];
    }, []);

    const placed: CircleDatum[] = [];
    const sizeMap = { small: 35, medium: 40, large: 50 };
    const yCenter = height / 2;
    const yJitter = height * 0.8;

    groups.forEach((g, gi) => {
      const items = groupMap[g];
      const blockStart = groupStarts[gi];
      const blockWidth = groupWidths[gi];
      const stepX = blockWidth / items.length;

      items.forEach((item, idx) => {
        const baseRadius = sizeMap[item.sizeCategory!];
        const radius = baseRadius + (Math.random() - 0.5) * 8;
        let cx: number;
        let cy: number;
        let attempts = 0;
        do {
          cx = blockStart + stepX * idx + stepX / 2 + (Math.random() - 0.5) * stepX * 0.3;
          cy = yCenter + (Math.random() - 0.5) * yJitter;
          // Clamp within padded bounds
          cx = Math.max(radius + edgePadding, Math.min(width - radius - edgePadding, cx));
          cy = Math.max(radius + edgePadding, Math.min(height - radius - labelBuffer - edgePadding, cy));
          attempts++;
        } while (
          attempts < 200 &&
          placed.some((c) => Math.hypot(c.cx - cx, c.cy - cy) < c.radius + radius + padding + labelBuffer)
        );
        placed.push({
          id: item.id!,
          cx,
          cy,
          radius,
          colourKey: item.colourKey!,
          image: item.image!,
          label: item.label!,
          link: item.link,
          group: item.group!,
          sizeCategory: item.sizeCategory!,
        });
      });
    });

    return placed;
  }, [width, height]);

  return (
    <svg width={width} height={height}>
      <Group>
        {circles.map((d) => (
          <FloatingCircle
            key={d.id}
            datum={d}
            hoveredId={hoveredId}
            hoveredPoint={hoveredPoint}
            onHover={(id, pt) => {
              setHoveredId(id);
              setHoveredPoint(pt);
            }}
            onLeave={() => {
              setHoveredId(null);
              setHoveredPoint(null);
            }}
          />
        ))}
      </Group>
    </svg>
  );
};

// Main component
const FloatingCircles: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<CircleDatum | null>(null);

  return (
    <ParentSize>
      {({ width, height }) => (
        <CirclesSVG
          width={width}
          height={height}
          hoveredId={hoveredId}
          hoveredPoint={hoveredPoint}
          setHoveredId={setHoveredId}
          setHoveredPoint={setHoveredPoint}
        />
      )}
    </ParentSize>
  );
};

export default FloatingCircles;
