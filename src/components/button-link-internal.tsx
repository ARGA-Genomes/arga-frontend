"use client";

import { Button, DefaultMantineColor, getThemeColor, MantineSize, Text, useMantineTheme } from "@mantine/core";

import { IconArrowUpRight } from "@tabler/icons-react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { PropsWithChildren } from "react";
import classes from "./button-link-internal.module.css";

interface InternalLinkButtonProps {
  url: Url;
  outline?: boolean;
  acronym?: boolean;
  color?: DefaultMantineColor;
  textColor?: DefaultMantineColor;
  textSize?: MantineSize;
  p?: MantineSize;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function InternalLinkButton({
  url,
  outline,
  color,
  textColor,
  textSize,
  children,
  onMouseEnter,
  onMouseLeave,
}: PropsWithChildren<InternalLinkButtonProps>) {
  const theme = useMantineTheme();

  return (
    <Button
      className={classes.button}
      component={Link}
      radius="xl"
      color={color || "midnight.8"}
      size="xs"
      href={url}
      variant={outline ? "outline" : "filled"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Text
        c={textColor || (outline ? color || "midnight.8" : "white")}
        fw={600}
        size={textSize || "sm"}
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </Text>
      <IconArrowUpRight color={getThemeColor(textColor, theme)} className={classes.icon} size={16} strokeWidth={3} />
    </Button>
  );
}
