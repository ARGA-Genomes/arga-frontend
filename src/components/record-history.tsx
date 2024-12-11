import { Badge, Flex, Group, Stack, Text, Timeline } from "@mantine/core";
import { IconArrowRight, IconEdit, IconPlus } from "@tabler/icons-react";
import { Operation } from "@/queries/provenance";

import * as Humanize from "humanize-plus";

import classes from "./record-history.module.css";

interface RecordHistoryProps {
  operations?: Operation[];
}

export default function RecordHistory({ operations }: RecordHistoryProps) {
  return (
    <Timeline
      bulletSize={28}
      classNames={classes}
      color="midnight.9"
      active={operations?.length || 0}
    >
      {operations?.map((operation, idx) => {
        return (
          <Timeline.Item
            fz="lg"
            fw={700}
            bullet={
              operation.action.toString() === "UPDATE" ? (
                <IconEdit size={14} />
              ) : (
                <IconPlus size={14} />
              )
            }
            key={idx}
            title={
              <Group align="center">
                <Text size="lg" fw={600} c="midnight.9">
                  {Humanize.capitalize(
                    operation.action.toString().toLowerCase()
                  )}
                </Text>
                <Badge color="shellfish" variant="light">
                  {operation.dataset.shortName}
                </Badge>
              </Group>
            }
            c="midnight.7"
          >
            <Stack gap={0}>
              {operation.action.toString() === "UPDATE" && (
                <Flex gap="xs">
                  <Text size="sm" fw={600}>
                    {operation.atom.type}
                  </Text>
                  <IconArrowRight size={18} />
                  <Text size="sm">{operation.atom.value}</Text>
                </Flex>
              )}
              <Text size="sm" c="dimmed">
                {new Date(operation.loggedAt).toLocaleString()}
              </Text>
            </Stack>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
