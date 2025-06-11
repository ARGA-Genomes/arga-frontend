import { Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
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
import { IndustryCommerceFilter, industryCommerceFiltersToQuery } from "./groups/industry-commerce";
import {
  DEFAULT_THREATENED_FILTERS,
  DEFAULT_THREATENED_LABELS,
  ThreatenedFilters,
  threatenedFiltersToQuery,
} from "./groups/threatened";
import { VernacularGroupFilter, vernacularGroupFilterToQuery } from "./groups/vernacular-group";

type FilterType =
  | "dataType"
  | "searchDataType"
  | "classification"
  | "bushfireRecovery"
  | "vernacularGroup"
  | "threatened"
  | "industryCommerce";

interface FiltersDrawerProps {
  types: FilterType[];
  defaultFilters?: {
    dataType?: BoolFilterData[];
    bushfireRecovery?: BoolFilterData[];
  };
  onFilter?: (items: FilterItem[]) => void;
  onFilterChips?: (chips: ReactElement[]) => void;
  onSearchFilter?: (items: InputQueryAttribute[]) => void;
}

export function FiltersDrawer({ types, defaultFilters, onFilter, onFilterChips, onSearchFilter }: FiltersDrawerProps) {
  const [opened, handlers] = useDisclosure(false);

  // Filter states
  const [dataTypeFilters, setDataTypeFilters] = useState<BoolFilterData[]>(
    DEFAULT_DATA_TYPE_FILTERS.map((defaultFilter) => {
      const override = (defaultFilters?.dataType || []).find((filter) => filter.value === defaultFilter.value);
      return override || defaultFilter;
    })
  );

  const [threatenedFilters, setThreatenedFilters] = useState<BoolFilterData[]>(
    DEFAULT_THREATENED_FILTERS.map((defaultFilter) => {
      const override = (defaultFilters?.bushfireRecovery || []).find((filter) => filter.value === defaultFilter.value);
      return override || defaultFilter;
    })
  );

  const [bushfireRecoveryFilters, setBushfireRecoveryFilters] = useState<BoolFilterData[]>(
    DEFAULT_BUSHFIRE_RECOVERY_FILTERS.map((defaultFilter) => {
      const override = (defaultFilters?.bushfireRecovery || []).find((filter) => filter.value === defaultFilter.value);
      return override || defaultFilter;
    })
  );

  const [classificationFilters, setClassificationFilters] = useState<ClassificationFilter[]>([]);
  const [vernacularGroupFilter, setVernacularGroupFilter] = useState<BoolFilterData | null>(null);
  const [industryCommerceFilters, setIndustryCommerceFilters] = useState<RefineTreeNode[]>([]);

  // Search filter states
  const [searchDataTypeFilters, setSearchDataTypeFilters] = useState<BoolFilterData[]>(
    DEFAULT_SEARCH_DATA_TYPE_FILTERS.map((defaultFilter) => {
      const override = (defaultFilters?.dataType || []).find((filter) => filter.value === defaultFilter.value);
      return override || defaultFilter;
    })
  );

  const uniqueTypes = Array.from(new Set(types));

  const renderFilter = (type: FilterType) => {
    switch (type) {
      case "dataType":
        return <DataTypeFilters key={type} filters={dataTypeFilters} onChange={setDataTypeFilters} />;
      case "classification":
        return <ClassificationFilters key={type} filters={classificationFilters} onChange={setClassificationFilters} />;
      case "threatened":
        return <ThreatenedFilters key={type} filters={threatenedFilters} onChange={setThreatenedFilters} />;
      case "bushfireRecovery":
        return (
          <BushfireRecoveryFilters key={type} filters={bushfireRecoveryFilters} onChange={setBushfireRecoveryFilters} />
        );
      case "vernacularGroup":
        return <VernacularGroupFilter key={type} filter={vernacularGroupFilter} onChange={setVernacularGroupFilter} />;
      case "industryCommerce":
        return (
          <IndustryCommerceFilter key={type} filters={industryCommerceFilters} onChange={setIndustryCommerceFilters} />
        );
      // Search filters
      case "searchDataType":
        return <DataTypeFilters key={type} filters={searchDataTypeFilters} onChange={setSearchDataTypeFilters} />;
    }
  };

  // Call onFilter when the filters change
  useEffect(() => {
    if (onFilter) {
      onFilter([
        ...dataTypeFiltersToQuery(dataTypeFilters),
        ...classificationFiltersToQuery(classificationFilters),
        ...threatenedFiltersToQuery(threatenedFilters),
        ...bushfireRecoveryFiltersToQuery(bushfireRecoveryFilters),
        ...vernacularGroupFilterToQuery(vernacularGroupFilter),
        ...industryCommerceFiltersToQuery(industryCommerceFilters),
      ]);
    }
    if (onFilterChips) {
      onFilterChips([
        ...renderBoolFilterChips(dataTypeFilters, ["Has", "Missing"], setDataTypeFilters),
        ...renderTaxonFilterChips(classificationFilters, setClassificationFilters),
        ...renderBoolFilterChips(
          threatenedFilters,
          ["Includes", "Excludes"],
          setThreatenedFilters,
          DEFAULT_THREATENED_LABELS
        ),
        ...renderBoolFilterChips(bushfireRecoveryFilters, ["Includes", "Excludes"], setBushfireRecoveryFilters),
        ...renderVernacularGroupFilterChip(vernacularGroupFilter, setVernacularGroupFilter),
        ...renderRefineFilterChip(industryCommerceFilters, setIndustryCommerceFilters),
      ]);
    }
  }, [
    dataTypeFilters,
    classificationFilters,
    threatenedFilters,
    bushfireRecoveryFilters,
    vernacularGroupFilter,
    industryCommerceFilters,
  ]);

  // Call onSearchFilters when the search filters change
  useEffect(() => {
    if (onSearchFilter) {
      onSearchFilter([
        ...searchDataTypeFiltersToQuery(searchDataTypeFilters),
        ...searchClassificationFiltersToQuery(classificationFilters),
      ]);
    }
  }, [searchDataTypeFilters, classificationFilters]);

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
}
