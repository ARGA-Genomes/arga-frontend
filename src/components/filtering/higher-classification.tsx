import { Button, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Filter } from "./common";

interface HigherClassificationFiltersProps {
  filters: Filter[];
  onChange: (items: Filter[]) => void;
}

export function HigherClassificationFilters({ filters, onChange }: HigherClassificationFiltersProps) {
  return (
    <Stack>
      <Button color="midnight" leftSection={<IconPlus />} onClick={() => alert("To be re-implemented")}>
        Add filter
      </Button>
      <Text>{JSON.stringify(filters, null, 2)}</Text>
    </Stack>
  );
}
