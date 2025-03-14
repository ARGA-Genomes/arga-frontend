// SVG from https://icon-sets.iconify.design/academicons/
import React from "react";
import { License } from "@/helpers/getLicense";
import { Group, MantineSpacing } from "@mantine/core";

interface LicenseIconsProps {
  license: License;
  size?: number;
  spacing?: MantineSpacing;
}

export function LicenseIcons({ spacing = "xs", size, license }: LicenseIconsProps) {
  return (
    <Group gap={spacing}>
      {license.icons.map((icon) => (
        <img
          key={icon}
          alt={license.name}
          src={`/icons/creative-commons/${icon}.svg`}
          style={{
            backgroundSize: "contain",
            width: size || 25,
            height: size || 25,
          }}
        />
      ))}
    </Group>
  );
}
