import { Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { memo, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { FilterItem } from "./filters/common";

// Filter groups
import {
  ClassificationFilter,
  ClassificationFilters,
  classificationFiltersToQuery,
  searchClassificationFiltersToQuery,
} from "./groups/classification";
import {
  DataTypeFilters,
  dataTypeFiltersToQuery,
  DEFAULT_DATA_TYPE_FILTERS,
  DEFAULT_SEARCH_DATA_TYPE_FILTERS,
  searchDataTypeFiltersToQuery,
} from "./groups/data-type";

// Chip rendering imports
import { InputQueryAttribute } from "../search";
import { BoolFilterData, renderBoolFilterChips, renderVernacularGroupFilterChip } from "./filters/bool";
import { RefineTreeNode, renderRefineFilterChip } from "./filters/refine";
import { renderTaxonFilterChips } from "./filters/taxon";
import {
  BushfireRecoveryFilters,
  bushfireRecoveryFiltersToQuery,
  DEFAULT_BUSHFIRE_RECOVERY_FILTERS,
} from "./groups/bushfire-recovery";
import { DatasetFilters, datasetFiltersToQuery } from "./groups/dataset";
import { IndustryCommerceFilter, industryCommerceFiltersToQuery } from "./groups/industry-commerce";
import { DEFAULT_OTHER_FILTERS, DEFAULT_OTHER_LABELS, OtherFilters, otherFiltersToQuery } from "./groups/other";
import {
  DEFAULT_THREATENED_FILTERS,
  DEFAULT_THREATENED_LABELS,
  ThreatenedFilters,
  threatenedFiltersToQuery,
} from "./groups/threatened";
import { VernacularGroupFilter, vernacularGroupFilterToQuery } from "./groups/vernacular-group";

type FilterType =
  | "dataType"
  | "dataset"
  | "searchDataType"
  | "classification"
  | "bushfireRecovery"
  | "vernacularGroup"
  | "threatened"
  | "other"
  | "industryCommerce";

interface FiltersDrawerProps {
  types: FilterType[];
  values?: { [key: string]: unknown };
  onFilter?: (items: FilterItem[]) => void;
  onFilterChips?: (chips: ReactElement[]) => void;
  onSearchFilter?: (items: InputQueryAttribute[]) => void;
}

export const FiltersDrawer = memo(({ types, values, onFilter, onFilterChips, onSearchFilter }: FiltersDrawerProps) => {
  const [opened, handlers] = useDisclosure(false);

  // Filter states
  const [dataTypeFilters, setDataTypeFilters] = useState<BoolFilterData[]>(DEFAULT_DATA_TYPE_FILTERS);
  const [datasetFilters, setDatasetFilters] = useState<BoolFilterData[]>([]);
  const [threatenedFilters, setThreatenedFilters] = useState<BoolFilterData[]>(DEFAULT_THREATENED_FILTERS);
  const [otherFilters, setOtherFilters] = useState<BoolFilterData[]>(DEFAULT_OTHER_FILTERS);

  const [bushfireRecoveryFilters, setBushfireRecoveryFilters] = useState<BoolFilterData[]>(
    DEFAULT_BUSHFIRE_RECOVERY_FILTERS
  );

  const [classificationFilters, setClassificationFilters] = useState<ClassificationFilter[]>([]);
  const [vernacularGroupFilter, setVernacularGroupFilter] = useState<BoolFilterData | null>(null);
  const [industryCommerceFilters, setIndustryCommerceFilters] = useState<RefineTreeNode[]>([]);

  // Search filter states
  const [searchDataTypeFilters, setSearchDataTypeFilters] = useState<BoolFilterData[]>(
    DEFAULT_SEARCH_DATA_TYPE_FILTERS
  );

  // Memoize callback handlers to prevent child re-renders
  const memoizedSetters = useMemo(
    () => ({
      setDataTypeFilters,
      setDatasetFilters,
      setThreatenedFilters,
      setOtherFilters,
      setBushfireRecoveryFilters,
      setClassificationFilters,
      setVernacularGroupFilter,
      setIndustryCommerceFilters,
      setSearchDataTypeFilters,
    }),
    []
  );

  useEffect(() => {
    setDatasetFilters(
      ((values?.datasets || []) as { id: string; name: string }[]).map((dataset) => ({
        value: dataset.id,
        label: dataset.name,
        active: false,
        disabled: false,
        include: true,
      }))
    );
  }, [values?.datasets]);

  // Memoize expensive computations
  const uniqueTypes = useMemo(() => Array.from(new Set(types)), [types]);

  const datasetLabelMap = useMemo(() => {
    return ((values?.datasets as { name: string; id: string }[]) || []).reduce(
      (prev, { name, id }) => ({ ...prev, [id]: name }),
      {}
    );
  }, [values?.datasets]);

  const renderFilter = useCallback(
    (type: FilterType) => {
      switch (type) {
        case "dataType":
          return <DataTypeFilters key={type} filters={dataTypeFilters} onChange={memoizedSetters.setDataTypeFilters} />;
        case "dataset":
          return datasetFilters.length > 0 ? (
            <DatasetFilters
              key={type}
              filters={datasetFilters}
              onChange={memoizedSetters.setDatasetFilters}
              loading={!datasetFilters.length}
            />
          ) : null;
        case "classification":
          return (
            <ClassificationFilters
              key={type}
              filters={classificationFilters}
              onChange={memoizedSetters.setClassificationFilters}
            />
          );
        case "threatened":
          return (
            <ThreatenedFilters key={type} filters={threatenedFilters} onChange={memoizedSetters.setThreatenedFilters} />
          );
        case "other":
          return <OtherFilters key={type} filters={otherFilters} onChange={memoizedSetters.setOtherFilters} />;
        case "bushfireRecovery":
          return (
            <BushfireRecoveryFilters
              key={type}
              filters={bushfireRecoveryFilters}
              onChange={memoizedSetters.setBushfireRecoveryFilters}
            />
          );
        case "vernacularGroup":
          return (
            <VernacularGroupFilter
              key={type}
              filter={vernacularGroupFilter}
              onChange={memoizedSetters.setVernacularGroupFilter}
            />
          );
        case "industryCommerce":
          return (
            <IndustryCommerceFilter
              key={type}
              filters={industryCommerceFilters}
              onChange={memoizedSetters.setIndustryCommerceFilters}
            />
          );
        // Search filters
        case "searchDataType":
          return (
            <DataTypeFilters
              key={type}
              filters={searchDataTypeFilters}
              onChange={memoizedSetters.setSearchDataTypeFilters}
              boolOptions={["Include", "Exclude"]}
            />
          );
      }
    },
    [
      dataTypeFilters,
      datasetFilters,
      classificationFilters,
      threatenedFilters,
      otherFilters,
      bushfireRecoveryFilters,
      vernacularGroupFilter,
      industryCommerceFilters,
      searchDataTypeFilters,
      memoizedSetters,
    ]
  );

  // Memoize filter items computation
  const filterItems = useMemo(
    () => [
      ...dataTypeFiltersToQuery(dataTypeFilters),
      ...datasetFiltersToQuery(datasetFilters),
      ...classificationFiltersToQuery(classificationFilters),
      ...threatenedFiltersToQuery(threatenedFilters),
      ...otherFiltersToQuery(otherFilters),
      ...bushfireRecoveryFiltersToQuery(bushfireRecoveryFilters),
      ...vernacularGroupFilterToQuery(vernacularGroupFilter),
      ...industryCommerceFiltersToQuery(industryCommerceFilters),
    ],
    [
      dataTypeFilters,
      datasetFilters,
      classificationFilters,
      threatenedFilters,
      otherFilters,
      bushfireRecoveryFilters,
      vernacularGroupFilter,
      industryCommerceFilters,
    ]
  );

  // Memoize filter chips computation
  const filterChips = useMemo(
    () => [
      ...renderBoolFilterChips(dataTypeFilters, ["Has", "Missing"], memoizedSetters.setDataTypeFilters),
      ...renderBoolFilterChips(
        datasetFilters,
        ["In dataset", "Not in dataset"],
        memoizedSetters.setDatasetFilters,
        datasetLabelMap
      ),
      ...renderTaxonFilterChips(classificationFilters, memoizedSetters.setClassificationFilters),
      ...renderBoolFilterChips(
        threatenedFilters,
        ["Includes", "Excludes"],
        memoizedSetters.setThreatenedFilters,
        DEFAULT_THREATENED_LABELS
      ),
      ...renderBoolFilterChips(
        otherFilters,
        ["Includes", "Excludes"],
        memoizedSetters.setOtherFilters,
        DEFAULT_OTHER_LABELS
      ),
      ...renderBoolFilterChips(
        bushfireRecoveryFilters,
        ["Includes", "Excludes"],
        memoizedSetters.setBushfireRecoveryFilters
      ),
      ...renderVernacularGroupFilterChip(vernacularGroupFilter, memoizedSetters.setVernacularGroupFilter),
      ...renderRefineFilterChip(industryCommerceFilters, memoizedSetters.setIndustryCommerceFilters),
    ],
    [
      dataTypeFilters,
      datasetFilters,
      classificationFilters,
      threatenedFilters,
      otherFilters,
      bushfireRecoveryFilters,
      vernacularGroupFilter,
      industryCommerceFilters,
      datasetLabelMap,
      memoizedSetters,
    ]
  );

  // Memoize search filter items computation
  const searchFilterItems = useMemo(
    () => [
      ...searchDataTypeFiltersToQuery(searchDataTypeFilters),
      ...searchClassificationFiltersToQuery(classificationFilters),
    ],
    [searchDataTypeFilters, classificationFilters]
  );

  // Call onFilter when the filters change
  useEffect(() => {
    if (onFilter) {
      onFilter(filterItems);
    }
    if (onFilterChips) {
      onFilterChips(filterChips);
    }
  }, [onFilter, onFilterChips, filterItems, filterChips]);

  // Call onSearchFilters when the search filters change
  useEffect(() => {
    if (onSearchFilter) {
      onSearchFilter(searchFilterItems);
    }
  }, [onSearchFilter, searchFilterItems]);

  return (
    <>
      <Drawer opened={opened} onClose={handlers.close} withCloseButton={false} position="right" size="xl" keepMounted>
        <Stack pt={130}>{uniqueTypes.map(renderFilter)}</Stack>
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
});

FiltersDrawer.displayName = "FiltersDrawer";
