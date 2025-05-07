import classes from "./highlight-stack.module.css";

import { Center, Paper, Stack, StackProps, Text } from "@mantine/core";
import Link from "next/link";

interface HighlightStackProps {
  children?: React.ReactNode;
}

export function HighlightStack({ children, ...rest }: HighlightStackProps | StackProps) {
  return (
    <Stack pl={16} className={classes.highlight} {...rest}>
      {children}
    </Stack>
  );
}

const BADGE_COLOURS: Record<string, string> = {
  yes: "moss.3",
  no: "bushfire.3",
  "raw reads": "bushfire.3",
  "representative genome": "moss.3",
  Full: "moss.3",
  Partial: "bushfire.3",
  Chromosome: "moss.3",
  chromosome: "moss.3",
  Contig: "bushfire.3",
  haploid: "wheat.3",
  mitochondrion: "wheat.3",
  scaffold: "wheat.3",
  ribosome: "wheat.3",
  nuclear: "moss.3",
  Major: "moss.3",
};

export function AttributePill({ value }: { value: string | number | undefined }) {
  value ||= "No data";
  const color = BADGE_COLOURS[value] || "#d6e4ed";

  return (
    <Paper py={5} px={15} bg={color} radius="xl" style={{ border: "none" }}>
      <Center>
        <Text c="midnight.9" fw={600} size="sm" style={{ whiteSpace: "nowrap" }}>
          {value}
        </Text>
      </Center>
    </Paper>
  );
}

interface AttributeProps {
  label: string;
  value?: string | number;
  href?: string;
}

export function Attribute({ label, value, href }: AttributeProps) {
  return (
    <Stack gap={5}>
      <Text fw={300} size="sm">
        {label}
      </Text>
      {href ? (
        <Link href={href}>
          <AttributePill value={value} />
        </Link>
      ) : (
        <AttributePill value={value} />
      )}
    </Stack>
  );
}

interface DataFieldProps {
  value?: string | number;
  fz?: string | number;
}

export function DataField({ value, fz }: DataFieldProps) {
  return value ? (
    <Text fz={fz || "sm"} fw={700} pl={15}>
      {value}
    </Text>
  ) : (
    <Text fz={fz || "sm"} fw={700} pl={15} c="dimmed">
      No data
    </Text>
  );
}

interface AttributeIconProps {
  label: string;
  icon: React.ReactNode;
}

export function AttributeIcon({ label, icon }: AttributeIconProps) {
  return (
    <Stack gap={0}>
      <Text size="sm">{label}</Text>
      <Paper py={5} px={15} bg="#f5f5f5" radius="md">
        <Center>{icon}</Center>
      </Paper>
    </Stack>
  );
}
