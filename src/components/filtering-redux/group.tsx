import { Accordion, Divider, Flex, Image, Stack, Text } from "@mantine/core";
import classes from "./group.module.css";
import { PropsWithChildren } from "react";

interface FilterGroupProps extends PropsWithChildren {
  title: string;
  description: string;
  icon: string;
}

export function FilterGroup({ title, description, icon, children }: FilterGroupProps) {
  return (
    <Accordion classNames={classes} variant="contained" radius="xl">
      <Accordion.Item value="test">
        <Accordion.Control icon={<Image w={50} h={50} src={icon} />}>
          <Flex align="center">
            <Text fw={600}>{title}</Text>
            <Text c="dimmed" size="sm" pl="md" pr="xs" lineClamp={1}>
              {description}
            </Text>
          </Flex>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <Divider variant="dashed" />
            <Stack gap="xs">{children}</Stack>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
