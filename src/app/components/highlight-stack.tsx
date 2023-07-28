import { Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import Link from "next/link";


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
