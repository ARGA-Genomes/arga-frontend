import React, { FC, useState, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Group } from "@visx/group";
import { useRouter } from "next/navigation";
import type { IconData } from "@/components/icon-bar";
import { VERNACULAR_GROUP_ICON } from "@/components/icon-bar";
import { Stack, Text } from "@mantine/core";

// Typed animated components
const AnimatedDiv = animated("div");
const AnimatedLabel = animated("div");
const AnimatedImage = animated("image");

export const ExploreSummaries = () => {
  const [animals, producers] = useMemo(() => {
    const all = Object.values(VERNACULAR_GROUP_ICON);
    return [all.filter((item) => item.group === 1), all.filter((item) => item.group === 2 || item.group === 3)];
  }, []);

  return (
    <Stack gap="sm">
      <Text size="md" fw={600} c="midnight.9">
        Animals
      </Text>
      <VernacularCarousel items={animals} />
      <Text size="md" fw={600} c="midnight.9">
        Plants and Microbial life
      </Text>
      <VernacularCarousel items={producers} reverse />
    </Stack>
  );
};

interface VernacularCarouselProps {
  items: IconData[];
  scrollSpeed?: number;
  reverse?: boolean;
  itemWidth?: number;
  gapWidth?: number;
  fadeWidth?: number;
}

export const VernacularCarousel: FC<VernacularCarouselProps> = ({
  items,
  scrollSpeed = 50,
  reverse = false,
  itemWidth = 130,
  gapWidth = 18,
  fadeWidth = 75,
}) => {
  const totalWidth = items.length * itemWidth + gapWidth * items.length;

  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Spring for controlling scroll speed
  const [springs, api] = useSpring<{ speedFactor: number }>(() => ({
    speedFactor: 1,
    config: { tension: 120, friction: 20 },
  }));

  useEffect(() => {
    api.start({ speedFactor: isHovered ? 0 : 1 });
  }, [isHovered, api]);

  useEffect(() => {
    let frameId: number;
    let last = performance.now();
    const direction = reverse ? -1 : 1;

    const step = (now: number) => {
      const delta = now - last;
      last = now;
      const factor = springs.speedFactor.get() as number;
      setScrollOffset((prev) => {
        const next = prev + ((direction * delta * scrollSpeed) / 1000) * factor;
        return ((next % totalWidth) + totalWidth) % totalWidth;
      });
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [scrollSpeed, reverse, totalWidth, springs.speedFactor]);

  return (
    <AnimatedDiv
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative", overflow: "hidden", width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(-${scrollOffset}px)`,
          willChange: "transform",
          gap: gapWidth,
        }}
      >
        {[...items, ...items].map((icon, idx) => (
          <CarouselItem key={`${icon.label}-${idx}`} data={icon} width={itemWidth} />
        ))}
      </div>
      {/* Fade overlays */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: fadeWidth,
          pointerEvents: "none",
          background: "linear-gradient(to right, #ffffff, rgba(255,255,255,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: fadeWidth,
          pointerEvents: "none",
          background: "linear-gradient(to left, #ffffff, rgba(255,255,255,0))",
        }}
      />
    </AnimatedDiv>
  );
};

interface CarouselItemProps {
  data: IconData;
  width: number;
}

export const CarouselItem: FC<CarouselItemProps> = ({ data, width }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState<boolean>(false);

  // Spring for hover animations
  const springs = useSpring<{ scale: number; y: number; opacity: number }>({
    to: {
      scale: hovered ? 1.2 : 1,
      y: hovered ? 10 : 0,
      opacity: hovered ? 0.7 : 1,
    },
    config: { tension: 200, friction: 15 },
  });

  return (
    <AnimatedDiv
      onClick={() => {
        if (data.link) router.push(data.link);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width,
        flexShrink: 0,
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <svg width={width} height={width} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <Group>
          <AnimatedImage
            xlinkHref={data.image}
            width={100}
            height={100}
            preserveAspectRatio="xMidYMid meet"
            style={{
              transform: springs.scale.to((s) => `scale(${s})`),
              transformOrigin: "50% 50%",
              opacity: springs.opacity,
            }}
          />
        </Group>
      </svg>
      <AnimatedLabel
        style={{
          transform: springs.y.to((y) => `translateY(${y}px)`),
          opacity: springs.opacity,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          textAlign: "center",
          fontWeight: 600,
          color: "var(--mantine-color-midnight-10)",
          marginTop: 18,
        }}
      >
        {data.label}
      </AnimatedLabel>
    </AnimatedDiv>
  );
};
