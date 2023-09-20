import { Center, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";


interface HighlightStackProps {
  spacing?: number,
  children?: React.ReactNode,
}

export function HighlightStack(props: HighlightStackProps) {
  const theme = useMantineTheme();

  return (
    <Stack
      pl={16}
      spacing={props.spacing}
      sx={{
        borderLeftWidth: 5,
        borderLeftStyle: "solid",
        borderLeftColor: theme.colors.bushfire[4],
      }}
    >
      {props.children}
    </Stack>
  )
}


interface AttributeProps {
  label: string,
  value?: string | number,
  href?: string,
}

export function Attribute({ label, value, href }: AttributeProps) {
  value ||= "No data";

  return (
    <Stack spacing={0}>
      <Text size="sm">{label}</Text>
        <Paper py={5} px={15} bg="#f5f5f5" radius="md">
          <Link href={href || "#"}>
            <Text size="lg" align="center">{value}</Text>
          </Link>
        </Paper>
    </Stack>
  )
}

const BADGE_COLOURS: Record<string, string> = {
  "yes": "moss.3",
  "no": "bushfire.3",
  "representative genome": "moss.3",
  "Full": "moss.3",
  "Partial": "bushfire.3",
  "Chromosome": "moss.3",
  "Contig": "bushfire.3",
  "haploid": "wheat.2",
  "Major": "moss.3",
}

export function AttributePill({ value }: { value: string | number | undefined }) {
  value ||= "No data";
  const color = BADGE_COLOURS[value] || "#d6e4ed";

  return (
    <Paper py={5} px={15} bg={color} radius="xl">
      <Center>
        <Text weight={600} size="sm" sx={{ whiteSpace: "nowrap" }}>{value}</Text>
      </Center>
    </Paper>
  )
}

export function AttributeValue({ label, value }: AttributeProps) {
  return (
    <Stack spacing={5}>
      <Text weight={300} size="sm">{label}</Text>
      <AttributePill value={value} />
    </Stack>
  )
}

export function AttributeLink({ label, value, href }: AttributeProps) {
  value ||= "No data";

  return (
    <Stack spacing={5}>
      <Text weight={300} size="sm">{label}</Text>
      <Center>
        <Paper py={5} px={15} bg="#d6e4ed" radius="xl">
          <Link href={href || "#"}>
            <Text weight={600} size="sm">{value}</Text>
          </Link>
        </Paper>
      </Center>
    </Stack>
  )
}

export function DataField({ value }: { value: string | number | undefined }) {
  return value
    ? <Text size="sm" weight={700}>{value}</Text>
    : <Text size="sm" weight={700} c="dimmed">No data</Text>
}


interface AttributeIconProps {
  label: string,
  icon: React.ReactNode,
}

export function AttributeIcon({ label, icon}: AttributeIconProps) {
  return (
    <Stack spacing={0}>
      <Text size="sm">{label}</Text>
        <Paper py={5} px={15} bg="#f5f5f5" radius="md">
          <Center>{icon}</Center>
        </Paper>
    </Stack>
  )
}
