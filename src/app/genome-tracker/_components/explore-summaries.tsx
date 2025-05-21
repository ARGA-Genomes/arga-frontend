import { IconData, VERNACULAR_GROUP_ICON, VernacularGrouping } from "@/components/icon-bar";
import { Stack, Text } from "@mantine/core";
import { Group } from "@visx/group";
import { animate, motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DISABLED_GROUPS = ["BACTERIA", "CYANOBACTERIA", "CONIFERS_AND_CYCADS"];

export const ExploreSummaries = () => {
  const [animals, producers] = useMemo(() => {
    const all = Object.entries(VERNACULAR_GROUP_ICON)
      .filter(([key]) => !DISABLED_GROUPS.includes(key))
      .map(([, value]) => value);

    return [
      all.filter((item) => item.grouping === VernacularGrouping.Animals),
      all.filter(
        (item) => item.grouping === VernacularGrouping.Microbes || item.grouping === VernacularGrouping.Producers
      ),
    ];
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

export const VernacularCarousel = ({
  items,
  scrollSpeed = 50,
  reverse = false,
  itemWidth = 130,
  gapWidth = 18,
  fadeWidth = 75,
}: VernacularCarouselProps) => {
  const totalWidth = items.length * (itemWidth + gapWidth);

  // MotionValue for controlling “speedFactor”
  const speedFactor = useMotionValue(1);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // on hover, animate speedFactor → 0, otherwise → 1
  useEffect(() => {
    animate(speedFactor, isHovered ? 0 : 1, {
      type: "spring",
      stiffness: 120,
      damping: 20,
    });
  }, [isHovered, speedFactor]);

  // manual RAF loop to update scrollOffset based on speedFactor
  useEffect(() => {
    let frameId: number;
    let last = performance.now();
    const direction = reverse ? -1 : 1;

    const step = (now: number) => {
      const delta = now - last;
      last = now;
      const factor = speedFactor.get();
      setScrollOffset((prev) => {
        const next = prev + ((direction * delta * scrollSpeed) / 1000) * factor;
        // wrap within [0, totalWidth)
        return ((next % totalWidth) + totalWidth) % totalWidth;
      });
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [scrollSpeed, reverse, totalWidth, speedFactor]);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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
    </motion.div>
  );
};

interface CarouselItemProps {
  data: IconData;
  width: number;
}

export const CarouselItem = ({ data, width }: CarouselItemProps) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);

  // Variants for hover animation
  const imageVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, opacity: 0.7 },
  };
  const labelVariants = {
    initial: { y: 0, opacity: 1 },
    hover: { y: 10, opacity: 0.7 },
  };

  return (
    <motion.div
      onClick={() => data.link && router.push(data.link)}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      style={{
        width,
        flexShrink: 0,
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: data.link ? "pointer" : "default",
      }}
    >
      <svg width={width} height={width} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <Group>
          <motion.image
            xlinkHref={data.image}
            width={100}
            height={100}
            preserveAspectRatio="xMidYMid meet"
            variants={imageVariants}
            initial="initial"
            animate={isHover ? "hover" : "initial"}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ originX: "50%", originY: "50%" }}
          />
        </Group>
      </svg>

      <motion.div
        variants={labelVariants}
        initial="initial"
        animate={isHover ? "hover" : "initial"}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{
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
      </motion.div>
    </motion.div>
  );
};
