import { NameDetails } from "@/generated/types";
import classes from "./Pills.module.css";

import { Paper, Group } from "@mantine/core";

interface PillCommonProps {
  variant?: "overview";
}

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

Pill.Common = function PillCommon({ value, variant }: { value?: string } & PillCommonProps) {
  return (
    <Pill className={variant ? classes[variant] : classes.common}>
      <>{value}</>
    </Pill>
  );
};

Pill.ScientificName = function PillScientificName({ name, variant }: { name: NameDetails } & PillCommonProps) {
  return (
    <Pill className={variant ? classes[variant] : classes.common}>
      <Group wrap="nowrap">
        <i>{name.canonicalName}</i>
        {name.authorship}
      </Group>
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
