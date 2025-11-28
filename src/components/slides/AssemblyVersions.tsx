import { Assembly } from "@/generated/types";
import { Stack, Text } from "@mantine/core";

interface AssemblyVersionSlideProps {
  assemblies: Assembly[];
}

export function AssemblyVersionsSlide({ assemblies }: AssemblyVersionSlideProps) {
  return (
    <Stack px="xl">
      <Text fz="sm" fw={400} c="midnight.7">
        This assembly has {assemblies?.length} released versions, including the current version ().
      </Text>

      <AssemblyVersionsDetails assemblies={assemblies} />

      <Text fz="sm" fw={400} c="midnight.7">
        Assembly versions are released when significant improvements are made to sequence accuracy, gap closure,
        scaffold ordering, or structural annotations.
      </Text>
    </Stack>
  );
}

function AssemblyVersionsDetails({ assemblies }: { assemblies?: Assembly[] }) {
  return <Stack></Stack>;
}
