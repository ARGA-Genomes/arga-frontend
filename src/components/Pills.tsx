import { AccessionEvent, Maybe, NameDetails } from "@/generated/types";
import classes from "./Pills.module.css";

import { Paper, Group } from "@mantine/core";
import { getVoucherColour, getVoucherStatus } from "@/helpers/colors";

interface PillCommonProps {
  variant?: "overview";
}

interface PillProps {
  className?: string;
  children?: React.ReactElement | Maybe<string>;
}

export function Pill({ className, children }: PillProps) {
  return (
    <Paper shadow="none" radius="xl" py={5} px={15} className={className}>
      {children}
    </Paper>
  );
}

Pill.Common = function PillCommon({ value, variant }: { value?: Maybe<string> } & PillCommonProps) {
  return <Pill className={variant ? classes[variant] : classes.common}>{value}</Pill>;
};

Pill.StandardText = function PillStandardText({ value }: { value?: Maybe<string> }) {
  return <Pill className={classes.standard}>{value ?? "no data"}</Pill>;
};

Pill.StandardNumber = function PillStandardNumber({ value, variant }: { value?: Maybe<number> } & PillCommonProps) {
  return <Pill className={variant ? classes[variant] : classes.standard}>{value?.toString() ?? "no data"}</Pill>;
};

Pill.ScientificName = function PillScientificName({
  name,
  variant,
}: { name: Pick<NameDetails, "canonicalName" | "authorship"> } & PillCommonProps) {
  return (
    <Pill className={variant ? classes[variant] : classes.standard}>
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
  return <Pill className={classes.coordSystem}>{value}</Pill>;
};

Pill.IdTitle = function PillIdTitle({ value }: { value?: string }) {
  return <Pill className={classes.idTitle}>{value}</Pill>;
};

Pill.AssemblyType = function PillAssemblyType({ value }: { value?: Maybe<string> }) {
  return <Pill className={classes.standard}>{value}</Pill>;
};

Pill.SpecimenRegistration = function PillRegistration({ accession }: { accession?: Maybe<AccessionEvent> }) {
  const color = getVoucherColour(accession?.typeStatus, accession?.collectionRepositoryId);
  return <Pill className={classes[`${color}Outline`]}>{accession?.collectionRepositoryId}</Pill>;
};

Pill.SpecimenStatus = function PillRegistration({ accession }: { accession?: Maybe<AccessionEvent> }) {
  const status = getVoucherStatus(accession?.typeStatus, accession?.collectionRepositoryId);
  const color = getVoucherColour(accession?.typeStatus, accession?.collectionRepositoryId);
  return <Pill className={classes[`${color}Fill`]}>{status}</Pill>;
};
