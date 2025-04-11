import { Button, ButtonProps, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

import classes from "./button-link-external.module.css";
import { useMemo } from "react";

interface ExternalLinkButtonProps extends ButtonProps {
  url?: string;
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

export function ExternalLinkButton({
  url,
  externalLinkName,
  outline,
  icon: Icon,
  acronym,
  ...rest
}: ExternalLinkButtonProps) {
  const content = useMemo(
    () => (acronym ? convertToAcronym(externalLinkName || "") : externalLinkName),
    [acronym, externalLinkName]
  );

  return (
    <Button
      {...rest}
      className={classes.button}
      component="a"
      radius="xl"
      color="shellfish.6"
      size="xs"
      href={url}
      target="_blank"
      variant={outline ? "outline" : "filled"}
    >
      <Text c={outline ? "shellfish.6" : "white"} fw={600} size="sm" style={{ whiteSpace: "nowrap" }}>
        {content}
      </Text>
      {Icon && <Icon className={classes.icon} size={16} strokeWidth={3} />}
    </Button>
  );
}
