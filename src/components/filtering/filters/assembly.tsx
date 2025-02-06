import { Box, SegmentedControl, Stack, Text } from "@mantine/core";
import { Filter } from "../common";
import { useEffect, useState } from "react";

interface AssemblyFiltersProps {
  filters: Filter[];
  onChange: (items: Filter[]) => void;
}

export function AssemblyFilters({ onChange }: AssemblyFiltersProps) {
  const [level, setLevel] = useState("any");
  const [representation, setRepresentation] = useState("any");
  const [releaseType, setReleaseType] = useState("any");

  useEffect(() => {
    const filters = [];

    if (level !== "any") {
      filters.push({
        filter: "ASSEMBLY_LEVEL",
        action: "INCLUDE",
        value: level,
        editable: true,
      });
    }
    if (representation !== "any") {
      filters.push({
        filter: "GENOME_REPRESENTATION",
        action: "INCLUDE",
        value: representation,
        editable: true,
      });
    }
    if (releaseType !== "any") {
      filters.push({
        filter: "RELEASE_TYPE",
        action: "INCLUDE",
        value: releaseType,
        editable: true,
      });
    }

    onChange(filters);
  }, [level, representation, releaseType, onChange]);

  return (
    <Stack>
      <Box>
        <Text fz="sm" fw={300}>
          Assembly level
        </Text>
        <SegmentedControl
          fullWidth
          color="bushfire"
          radius="md"
          value={level}
          onChange={setLevel}
          data={[
            { label: "Any", value: "any" },
            { label: "Complete genome", value: "CompleteGenome" },
            { label: "Chromosome", value: "Chromosome" },
            { label: "Scaffold", value: "Scaffold" },
            { label: "Contig", value: "Contig" },
          ]}
        />
      </Box>
      <Box>
        <Text fz="sm" fw={300}>
          Genome representation
        </Text>
        <SegmentedControl
          fullWidth
          color="shellfish"
          radius="md"
          value={representation}
          onChange={setRepresentation}
          data={[
            { label: "Any", value: "any" },
            { label: "Complete", value: "Complete" },
            { label: "Full", value: "Full" },
            { label: "Partial", value: "Partial" },
          ]}
        />
      </Box>
      <Box>
        <Text fz="sm" fw={300}>
          Release type
        </Text>
        <SegmentedControl
          fullWidth
          color="midnight"
          radius="md"
          value={releaseType}
          onChange={setReleaseType}
          data={[
            { label: "Any", value: "any" },
            { label: "Major", value: "Major" },
            { label: "Minor", value: "Minor" },
            { label: "Patch", value: "Patch" },
          ]}
        />
      </Box>
    </Stack>
  );
}
