import React, { useState, useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { useSpring, animated, to as interpolate } from "@react-spring/web";
import { VERNACULAR_GROUP_ICON } from "@/components/icon-bar";
import { useRouter } from "next/navigation";

// Data for each rendered circle
type CircleDatum = {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  colourKey: string;
  image: string;
  label: string;
  link?: string;
};

// Animated SVG primitives
const AnimatedGroup = animated(Group);
const AnimatedCircle = animated(Circle);
const AnimatedImage = animated("image");
const AnimatedText = animated("text");

interface FloatingCircleProps {
  datum: CircleDatum;
  hoveredId: string | null;
  hoveredPoint: CircleDatum | null;
  onHover: (id: string, meta: CircleDatum) => void;
  onLeave: () => void;
}

// Single bubble with float, hover, and repulsion
const FloatingCircle: React.FC<FloatingCircleProps> = ({ datum, hoveredId, hoveredPoint, onHover, onLeave }) => {
  const router = useRouter();

  const { id, cx, cy, radius, colourKey, image, label, link } = datum;
  const isHovered = hoveredId === id;

  // Float animation
  const { floatY } = useSpring({
    from: { floatY: 0 },
    to: { floatY: 10 },
    config: { duration: 2000 + Math.random() * 1000 },
    loop: { reverse: true },
  });

  // Hover scale
  const { r } = useSpring({
    r: isHovered ? radius * 1.3 : radius,
    config: { tension: 300, friction: 20 },
  });

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

  const fillVar = `var(--mantine-color-${colourKey.replace(".", "-")})`;

  const navigate = () => {
    if (link) router.push(link);
  };

  return (
    <AnimatedGroup transform={transform}>
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={r}
        fill={fillVar}
        onMouseEnter={() => onHover(id, datum)}
        onMouseLeave={onLeave}
        onClick={navigate}
        style={{ cursor: "pointer" }}
      />
      <AnimatedImage
        href={image}
        x={r.to((val) => cx - val * 0.6)}
        y={r.to((val) => cy - val * 0.6)}
        width={r.to((val) => val * 1.2)}
        height={r.to((val) => val * 1.2)}
        pointerEvents="none"
      />
      <AnimatedText
        x={cx}
        y={r.to((val) => cy + val + 18)}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill="var(--mantine-color-midnight-10)"
        pointerEvents="none"
      >
        {label}
      </AnimatedText>
    </AnimatedGroup>
  );
};

export interface FloatingCirclesProps {
  onCircleClick?: (id: string) => void;
}

// Inner responsive component that can use hooks directly
const CirclesSVG: React.FC<{
  width: number;
  height: number;
  hoveredId: string | null;
  hoveredPoint: CircleDatum | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  setHoveredPoint: React.Dispatch<React.SetStateAction<CircleDatum | null>>;
  onCircleClick: (id: string) => void;
}> = ({ width, height, hoveredId, hoveredPoint, setHoveredId, setHoveredPoint, onCircleClick }) => {
  const circles = useMemo<CircleDatum[]>(() => {
    const entries = Object.entries(VERNACULAR_GROUP_ICON);
    const placed: CircleDatum[] = [];
    const padding = 8;
    const labelBuffer = 28;

    entries.forEach(([key, data]) => {
      const radius = 30 + Math.random() * 20;
      let cx: number, cy: number;
      let attempts = 0;
      const maxAttempts = 200;
      do {
        cx = Math.random() * (width - 2 * radius) + radius;
        cy = Math.random() * (height - 2 * radius - labelBuffer) + radius;
        attempts++;
      } while (
        attempts < maxAttempts &&
        placed.some((c) => Math.hypot(c.cx - cx, c.cy - cy) < c.radius + radius + padding + labelBuffer)
      );
      placed.push({
        id: key,
        cx,
        cy,
        radius,
        colourKey: data.colour || "white-0",
        image: data.image,
        label: data.label,
        link: data.link,
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
const FloatingCircles: React.FC<FloatingCirclesProps> = ({ onCircleClick = () => {} }) => {
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
          onCircleClick={onCircleClick}
        />
      )}
    </ParentSize>
  );
};

export default FloatingCircles;
