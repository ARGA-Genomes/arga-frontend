import { Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { FilterItem } from "./filters/common";
import { ReactElement, useEffect, useState } from "react";
import { DataTypeFilter, DataTypeFilters, dataTypeFiltersToQuery, DEFAULT_DATA_TYPE_FILTERS } from "./groups/data-type";
import { ClassificationFilter, ClassificationFilters, classificationFiltersToQuery } from "./groups/classification";
import { renderBoolFilterChips } from "./filters/bool";
import { renderTaxonFilterChips } from "./filters/taxon";

type FilterType = "dataType" | "classification";

interface FiltersDrawerProps {
  types: FilterType[];
  defaultFilters?: {
    dataType?: DataTypeFilter[];
  };
  onFilter: (items: FilterItem[]) => void;
  onFilterChips: (chips: ReactElement[]) => void;
}

export function FiltersDrawer({ types, defaultFilters, onFilter, onFilterChips }: FiltersDrawerProps) {
  const [opened, handlers] = useDisclosure(false);

  // Filter states
  const [dataTypeFilters, setDataTypeFilters] = useState<DataTypeFilter[]>(
    DEFAULT_DATA_TYPE_FILTERS.map((defaultFilter) => {
      const override = (defaultFilters?.dataType || []).find((filter) => filter.value === defaultFilter.value);
      return override || defaultFilter;
    })
  );

  const [classificationFilters, setClassificationFilters] = useState<ClassificationFilter[]>([]);

  const uniqueTypes = Array.from(new Set(types));

  const renderFilter = (type: FilterType) => {
    switch (type) {
      case "dataType":
        return <DataTypeFilters key={type} filters={dataTypeFilters} onChange={setDataTypeFilters} />;
      case "classification":
        return <ClassificationFilters key={type} filters={classificationFilters} onChange={setClassificationFilters} />;
    }
  };

  useEffect(() => {
    onFilter([...dataTypeFiltersToQuery(dataTypeFilters), ...classificationFiltersToQuery(classificationFilters)]);
    onFilterChips([
      ...renderBoolFilterChips(dataTypeFilters, setDataTypeFilters),
      ...renderTaxonFilterChips(classificationFilters, setClassificationFilters),
    ]);
  }, [dataTypeFilters, classificationFilters]);

  return (
    <>
      <Drawer opened={opened} onClose={handlers.close} withCloseButton={false} position="right" size="xl" keepMounted>
        <Stack pt={180}>{uniqueTypes.map(renderFilter)}</Stack>
      </Drawer>
      <Button
        variant="outline"
        color="midnight.9"
        onClick={handlers.open}
        leftSection={<IconAdjustments />}
        radius="xl"
      >
        Filters
      </Button>
    </>
  );
}
