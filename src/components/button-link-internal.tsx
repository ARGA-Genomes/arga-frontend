import {
  Button,
  DefaultMantineColor,
  getThemeColor,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import classes from "./button-link-internal.module.css";
import { PropsWithChildren, useMemo } from "react";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

interface ExternalLinkButtonProps {
  url: Url;
  outline?: boolean;
  icon: typeof IconExternalLink;
  acronym?: boolean;
  color?: DefaultMantineColor;
  textColor?: DefaultMantineColor;
}

export function InternalLinkButton({
  url,
  outline,
  icon: Icon,
  color,
  textColor,
  children,
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
