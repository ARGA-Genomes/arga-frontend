import { AssemblyDetails } from "@/generated/types";
import { formatBases, formatDate } from "@/helpers/formatters";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { IconCircleCheck, IconDownload, IconLink } from "@tabler/icons-react";

interface AssemblyVersionSlideProps {
  assemblies: AssemblyDetails[];
}

export function AssemblyVersionsSlide({ assemblies }: AssemblyVersionSlideProps) {
  return (
    <Stack px="xl">
      <Text fz="sm" fw={400} c="midnight.7">
        This assembly has {assemblies?.length} released versions, including the current version (
        {assemblies?.at(0)?.assemblyId}).
      </Text>

      <AssemblyVersionsDetails assemblies={assemblies} />

      <Text fz="sm" fw={400} c="midnight.7">
        Assembly versions are released when significant improvements are made to sequence accuracy, gap closure,
        scaffold ordering, or structural annotations.
      </Text>
    </Stack>
  );
}

function AssemblyVersionsDetails({ assemblies }: { assemblies: AssemblyDetails[] }) {
  return (
    <Stack>
      {assemblies.map((assembly) => (
        <Version key={assembly.entityId} assembly={assembly} />
      ))}
    </Stack>
  );
}

function Version({ assembly }: { assembly: AssemblyDetails }) {
  return (
    <Paper px="md" py="xs" radius="lg" withBorder shadow="none">
      <Stack>
        <Text fw={600} fz="sm" c="midnight.9">
          {assembly.assemblyId}
        </Text>
        <Group>
          <Text fw={400} fz="xs" c="midnight.7">
            Release date
          </Text>
          <Text fw={650} fz="xs" c="midnight.7">
            {formatDate(assembly.eventDate)}
          </Text>
        </Group>

        <Group justify="space-evenly" px="md" grow>
          <Button radius="md" color="midnight.9" leftSection={<IconCircleCheck />}>
            add to list
          </Button>
          <Button radius="md" color="midnight.9" leftSection={<IconDownload />}>
            get data
          </Button>
          <Button radius="md" color="midnight.9" leftSection={<IconLink />} disabled>
            go to source
          </Button>
        </Group>

        <Group justify="space-between">
          <Group justify="start">
            <Text fw={400} fz="xs" c="midnight.7">
              BUSCO
            </Text>
            <Text fw={650} fz="xs" c="midnight.7">
              {assembly.completeness || "no data"}
            </Text>
          </Group>

          <Group justify="start">
            <Text fw={400} fz="xs" c="midnight.7">
              N50
            </Text>
            <Text fw={650} fz="xs" c="midnight.7">
              {assembly.assemblyN50 || "no data"}
            </Text>
          </Group>

          <Group justify="start">
            <Text fw={400} fz="xs" c="midnight.7">
              Genome size
            </Text>
            <Text fw={650} fz="xs" c="midnight.7">
              {formatBases(assembly.size)}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
