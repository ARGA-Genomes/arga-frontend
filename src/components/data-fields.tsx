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
import { IconInfoCircle } from "@tabler/icons-react";
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
  Unaccepted: "bushfire.3",
};

interface AttributePillValueProps {
  value?: string | number;
  popoverLabel?: string | number;
  popoverDisabled?: boolean;
  italic?: boolean;
  color?: MantineColor;
  textColor?: MantineColor;
  hoverColor?: MantineColor;
  icon?: typeof IconInfoCircle;
  showIconOnHover?: boolean;
  miw?: number;
}

interface AttributePillProps extends AttributePillValueProps {
  label: string;
  href?: string;
  labelColor?: MantineColor;
  group?: boolean;
}

export function AttributePill({
  label,
  href,
  labelColor,
  group,
  ...rest
}: AttributePillProps) {
  const pill = <AttributePillValue {...rest} />;

  return (
    <Attribute label={label} group={group} labelColor={labelColor}>
      {href ? <Link href={href}>{pill}</Link> : pill}
    </Attribute>
  );
}

export function AttributePillValue({
  value,
  popoverLabel,
  popoverDisabled = false,
  italic,
  color,
  hoverColor,
  textColor,
  icon: Icon,
  showIconOnHover = false,
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
      disabled={popoverDisabled}
    >
      <Popover.Target>
        <Paper
          py={5}
          px={15}
          bg={opened && hoverColor ? hoverColor : bg}
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
              style={{
                whiteSpace: "nowrap",
                transition: "ease all 250ms",
                marginLeft: Icon && !opened ? 18 : 0,
              }}
              c={textColor}
              truncate
            >
              {value}
            </Text>
            {Icon && (
              <Icon
                size={16}
                strokeWidth={3}
                style={{
                  transition: "ease all 250ms",
                  marginLeft: showIconOnHover && !opened ? 0 : 18,
                  transform:
                    showIconOnHover && !opened ? "scale(0)" : "scale(1)",
                }}
              />
            )}
          </Center>
        </Paper>
      </Popover.Target>
      <Popover.Dropdown bg={bg}>
        <Text size="xs">{popoverLabel || value}</Text>
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
