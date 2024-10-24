import {
  Center,
  MantineColor,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
  Group,
  PaperProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

interface AttributeProps {
  label?: string;
  labelColor?: MantineColor;
  children: React.ReactNode;
  group?: boolean;
}

export function Attribute({
  label,
  labelColor,
  children,
  group,
}: AttributeProps) {
  return (
    <>
      {group ? (
        <Group gap={5} grow>
          {label && (
            <Text fw={300} size="sm" c={labelColor}>
              {label}
            </Text>
          )}
          {children}
        </Group>
      ) : (
        <Stack gap={5}>
          {label && (
            <Text fw={300} size="sm" c={labelColor}>
              {label}
            </Text>
          )}
          {children}
        </Stack>
      )}
    </>
  );
}

interface AttributePillProps {
  label: string;
  value?: string | number;
  href?: string;
  italic?: boolean;
  color?: MantineColor;
  labelColor?: MantineColor;
  group?: boolean;
  miw?: number;
}

export function AttributePill({
  label,
  value,
  href,
  italic,
  color,
  labelColor,
  group,
  miw,
}: AttributePillProps) {
  const pill = (
    <AttributePillValue value={value} italic={italic} color={color} miw={miw} />
  );

  return (
    <Attribute label={label} group={group} labelColor={labelColor}>
      {href ? <Link href={href}>{pill}</Link> : pill}
    </Attribute>
  );
}

const BADGE_COLOURS: Record<string, string> = {
  yes: "moss.3",
  no: "bushfire.3",
  "representative genome": "moss.3",
  Full: "moss.3",
  Complete: "moss.3",
  Partial: "bushfire.3",
  Chromosome: "moss.3",
  Contig: "bushfire.3",
  haploid: "wheat.2",
  Major: "moss.3",
  Accepted: "moss.3",
  accepted: "moss.3",
  "Nomenclatural synonym": "wheat.2",
  "Taxonomic synonym": "wheat.2",
  "Original description": "moss.3",
  Synonymisation: "bushfire.3",
};

interface AttributePillValueProps {
  value?: string | number;
  italic?: boolean;
  color?: MantineColor;
  miw?: number;
}

export function AttributePillValue({
  value,
  italic,
  color,
  miw,
}: AttributePillValueProps) {
  const [opened, { close, open }] = useDisclosure(false);

  value ||= "No data";
  const bg = color || BADGE_COLOURS[value] || "#d6e4ed";

  return (
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      radius="md"
    >
      <Popover.Target>
        <Paper
          py={5}
          px={15}
          bg={bg}
          radius="xl"
          miw={miw}
          style={{ border: "none" }}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Center>
            <Text
              fw={600}
              size="sm"
              fs={italic ? "italic" : undefined}
              style={{ whiteSpace: "nowrap" }}
              truncate
            >
              {value}
            </Text>
          </Center>
        </Paper>
      </Popover.Target>
      <Popover.Dropdown bg={bg}>
        <Text size="xs">{value}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

interface AttributePillContainerProps extends PaperProps {
  color?: MantineColor;
  className?: string;
  children?: React.ReactNode;
}

export function AttributePillContainer({
  color,
  className,
  children,
  ...rest
}: AttributePillContainerProps) {
  return (
    <Paper
      py={5}
      px={15}
      bg={color || "#d6e4ed"}
      radius="xl"
      style={{ border: "none" }}
      className={className}
      {...rest}
    >
      <Center>{children}</Center>
    </Paper>
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
      <Paper py={5} px={15} bg="#f5f5f5" radius="md">
        <Center>{icon}</Center>
      </Paper>
    </Stack>
  );
}

interface DataFieldProps {
  value?: string | number;
  fz?: string | number;
  href?: string;
}

export function DataField({ value, fz, href }: DataFieldProps) {
  let text = href ? (
    <Link href={href} target="_blank">
      {value}
    </Link>
  ) : (
    value
  );
  return value ? (
    <Text fz={fz || "sm"} fw={700} ml="sm">
      {text}
    </Text>
  ) : (
    <Text fz={fz || "sm"} fw={700} ml="sm" c="dimmed">
      No data
    </Text>
  );
}

export function CopyableData({ value }: { value: string }) {
  return (
    <ScrollArea
      offsetScrollbars
      type="always"
      w={500}
      p={5}
      ml={12}
      style={{
        border: "1px solid #cfcfcf",
        borderRadius: 10,
      }}
    >
      <Text fw={300} fz="xs">
        {value}
      </Text>
    </ScrollArea>
  );
}
