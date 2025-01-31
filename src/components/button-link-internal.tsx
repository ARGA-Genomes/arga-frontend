import {
  Button,
  ButtonProps,
  DefaultMantineColor,
  getThemeColor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import classes from "./button-link-internal.module.css";
import { MouseEventHandler, PropsWithChildren, useMemo } from "react";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

interface ExternalLinkButtonProps {
  url: Url;
  outline?: boolean;
  icon: typeof IconExternalLink;
  acronym?: boolean;
  color?: DefaultMantineColor;
  textColor?: DefaultMantineColor;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function InternalLinkButton({
  url,
  outline,
  icon: Icon,
  color,
  textColor,
  children,
  onMouseEnter,
  onMouseLeave,
}: PropsWithChildren<ExternalLinkButtonProps>) {
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
        size="sm"
        style={{ whiteSpace: "nowrap" }}
      >
        {children}
      </Text>
      {Icon && (
        <Icon
          color={getThemeColor(textColor, theme)}
          className={classes.icon}
          size={16}
          strokeWidth={3}
        />
      )}
    </Button>
  );
}
