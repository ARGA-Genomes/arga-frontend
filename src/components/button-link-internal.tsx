import { Button, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import classes from "./button-link-internal.module.css";
import { useMemo } from "react";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";

interface ExternalLinkButtonProps {
  url: Url;
  externalLinkName?: string;
  outline?: boolean;
  icon: typeof IconExternalLink;
  acronym?: boolean;
}

function convertToAcronym(str: string) {
  // Check if the string consists only of full words with spaces
  if (/^[a-zA-Z\s]+$/.test(str.trim())) {
    // Convert to acronym by taking the first letter of each word
    return str
      .trim() // Remove extra spaces
      .split(/\s+/) // Split by one or more spaces
      .map((word) => word.charAt(0).toUpperCase()) // Take the first letter and capitalize
      .join(""); // Join to form the acronym
  }
  // If not full words with spaces, return the original string
  return str;
}

export function InternalLinkButton({
  url,
  externalLinkName,
  outline,
  icon: Icon,
  acronym,
}: ExternalLinkButtonProps) {
  const content = useMemo(
    () =>
      acronym ? convertToAcronym(externalLinkName || "") : externalLinkName,
    [acronym, externalLinkName]
  );

  return (
    <Button
      className={classes.button}
      component={Link}
      radius="xl"
      color="midnight.8"
      size="xs"
      href={url}
      variant={outline ? "outline" : "filled"}
    >
      <Text
        c={outline ? "midnight.8" : "white"}
        fw={600}
        size="sm"
        style={{ whiteSpace: "nowrap" }}
      >
        {content}
      </Text>
      {Icon && <Icon className={classes.icon} size={16} strokeWidth={3} />}
    </Button>
  );
}
