import { useEffect, useState } from "react";
import { Filter } from "./common";
import { Accordion, Avatar, Group, Text } from "@mantine/core";
import { AssemblyFilters } from "./filters/assembly";

interface SequenceFilters {
  assembly: Filter[];
}

interface FilterOptions {
  ecology: string[];
  ibra: string[];
  imcra: string[];
  state: string[];
  drainageBasin: string[];
}

interface SequenceFiltersProps {
  filters: SequenceFilters;
  options?: FilterOptions;
  onChange: (filters: Filter[]) => void;
}

export function SequenceFilters({ filters, onChange }: SequenceFiltersProps) {
  const [assembly, setAssembly] = useState<Filter[]>(filters.assembly);

  useEffect(() => {
    onChange([...assembly]);
  }, [assembly, onChange]);

  return (
    <Accordion defaultValue="assembly" variant="separated">
      <Accordion.Item value="assembly">
        <Accordion.Control>
          <FilterGroup
            label="Assembly filters"
            description="Sequences with specific assembly properties"
            image="/timeline-icons/assembly.svg"
          />
        </Accordion.Control>
        <Accordion.Panel>
          <AssemblyFilters filters={assembly} onChange={setAssembly} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

interface FilterGroupProps {
  label: string;
  description: string;
  image: string;
}

function FilterGroup({ label, description, image }: FilterGroupProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400} lineClamp={1}>
          {description}
        </Text>
      </div>
    </Group>
  );
}
