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

Pill.Common = function PillCommon({ value }: { value?: string }) {
  return (
    <Pill className={classes.common}>
      <>{value}</>
    </Pill>
  );
};

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

Pill.CoordinateSystem = function PillCoordinateSystem({ value }: { value?: string }) {
  return (
    <Pill className={classes.coordSystem}>
      <>{value}</>
    </Pill>
  );
};
