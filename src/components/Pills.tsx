import classes from "./Pills.module.css";

import { Paper } from "@mantine/core";

interface PillProps {
  className?: string;
  children: React.ReactElement | string;
}

export function Pill({ className, children }: PillProps) {
  return (
    <Paper shadow="none" radius="xl" py={5} px={15} className={className}>
      {children}
    </Paper>
  );
}

Pill.Doi = function PillDoi({ url }: { url: string }) {
  const doi = url.substring(url.lastIndexOf("doi.org/") + 8);
  return (
    <a href={url} target="_blank">
      <Pill className={classes.doi}>
        <>DOI: {doi}</>
      </Pill>
    </a>
  );
};
