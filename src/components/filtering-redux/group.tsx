import { Accordion, Box, Center, Divider, Flex, Image, Loader, Stack, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import classes from "./group.module.css";

interface FilterGroupProps extends PropsWithChildren {
  title: string;
  description: string;
  icon: string;
  loading?: boolean;
}

export function FilterGroup({ title, description, icon, loading, children }: FilterGroupProps) {
  const isLoading = loading !== undefined ? loading : false;
  return (
    <Accordion classNames={classes} variant="contained" radius="xl">
      <Accordion.Item value={title}>
        <Accordion.Control
          disabled={isLoading}
          icon={
            !isLoading ? (
              <Image w={50} h={50} src={icon} />
            ) : (
              <Box w={50} h={50} bg="gray.0" style={{ borderRadius: 25 }}>
                <Center w={50} h={50}>
                  <Loader color="midnight.10" size="sm" />
                </Center>
              </Box>
            )
          }
        >
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
