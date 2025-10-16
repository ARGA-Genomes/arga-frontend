import { AccessionEvent, Maybe, NameDetails } from "@/generated/types";
import classes from "./Pills.module.css";

import { Paper, Group, Center } from "@mantine/core";
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

Pill.Empty = function PillEmpty({ variant }: PillCommonProps) {
  return <Pill className={variant ? classes[`empty-${variant}`] : classes.empty}>{"no data"}</Pill>;
};

Pill.StandardText = function PillStandardText({ value, variant }: { value?: Maybe<string> } & PillCommonProps) {
  if (value) {
    return <Pill className={variant ? classes[variant] : classes.standard}>{value}</Pill>;
  } else {
    return <Pill.Empty variant={variant} />;
  }
};

Pill.StandardNumber = function PillStandardNumber({ value, variant }: { value?: Maybe<number> } & PillCommonProps) {
  return (
    <Pill className={variant ? classes[variant] : classes.standard}>
      <Center>{value?.toString() ?? "no data"}</Center>
    </Pill>
  );
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

Pill.Id = function PillIdTitle({ value }: { value?: string }) {
  return <Pill className={classes.standard}>{value}</Pill>;
};

Pill.AssemblyType = function PillAssemblyType({ value }: { value?: Maybe<string> }) {
  return <Pill className={classes.standard}>{value}</Pill>;
};

type SpecimenAccession = Pick<AccessionEvent, "typeStatus" | "institutionCode" | "collectionRepositoryId">;

Pill.SpecimenRegistration = function PillRegistration({ accession }: { accession?: SpecimenAccession }) {
  const color = getVoucherColour(accession?.typeStatus, accession?.collectionRepositoryId);
  const registration = [accession?.institutionCode, accession?.collectionRepositoryId].join(" ");
  return <Pill className={classes[`${color}Outline`]}>{registration}</Pill>;
};

Pill.SpecimenStatus = function PillRegistration({ accession }: { accession?: SpecimenAccession }) {
  const status = getVoucherStatus(accession?.typeStatus, accession?.collectionRepositoryId);
  const color = getVoucherColour(accession?.typeStatus, accession?.collectionRepositoryId);
  return <Pill className={classes[`${color}Fill`]}>{status}</Pill>;
};
