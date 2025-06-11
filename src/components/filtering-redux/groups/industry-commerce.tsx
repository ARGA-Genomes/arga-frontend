import { useEffect } from "react";
import { FilterGroup } from "../group";

import { FilterItem, FilterType } from "../filters/common";
import { RefineTree, RefineTreeNode } from "../filters/refine";

export const industryCommerceFiltersToQuery = (filters: RefineTreeNode[]): FilterItem[] => {
  const last = filters[filters.length - 1];
  return last
    ? [
        {
          filter: FilterType.Attribute,
          action: last.include ? "INCLUDE" : "EXCLUDE",
          value: [
            {
              name: last.name,
              value: last.value,
            },
          ],
        },
      ]
    : [];
};

interface IndustryCommerceFilterProps {
  filters: RefineTreeNode[];
  onChange: (filters: RefineTreeNode[]) => void;
}

export function IndustryCommerceFilter({ filters, onChange }: IndustryCommerceFilterProps) {
  // Trigger the onChange prop when the filters change
  useEffect(() => onChange(filters), [filters, onChange]);

  return (
    <FilterGroup
      title="Industry and commerce"
      description="Filter species used in Industry and Commerce"
      icon={"/icons/list-group/List group_ Commercial and trade fishes.svg"}
    >
      <RefineTree data={DEFAULT_INDUSTRY_COMMERCE_TREE} filters={filters} onSelect={onChange} />
    </FilterGroup>
  );
}

// Example data
export const DEFAULT_INDUSTRY_COMMERCE_TREE: RefineTreeNode[] = [
  {
    name: "commercial_sector_icon",
    value: "agriculture",
    label: "Agriculture",
    include: true,
    children: [
      {
        name: "agricultural_industry_icon",
        value: "crops and cereals",
        label: "Crops and cereals",
        include: true,
      },
      {
        name: "agricultural_industry_icon",
        value: "forestry",
        label: "Forestry",
        include: true,
      },
      {
        name: "agricultural_industry_icon",
        value: "horticultural crop",
        label: "Fruits, vegetables, herbs and spices",
        include: true,
      },
      {
        name: "agricultural_industry_icon",
        value: "livestock",
        label: "Livestock",
        include: true,
        children: [
          {
            name: "wild_status",
            value: "Domestic",
            label: "Domestic",
            include: true,
          },
          {
            name: "wild_status",
            value: "Wild",
            label: "Wild",
            include: true,
          },
          {
            name: "wild_status",
            value: "Feral",
            label: "Feral",
            include: true,
          },
          {
            name: "livestock_type",
            value: "poultry",
            label: "Poultry",
            include: true,
          },
          {
            name: "exotic_status",
            value: "Exotic",
            label: "Exotic",
            include: true,
          },
          {
            name: "omnivore",
            value: true,
            label: "Omnivore",
            include: true,
          },
          {
            name: "carnivore",
            value: true,
            label: "Carnivore",
            include: true,
          },
          {
            name: "herbivore",
            value: true,
            label: "Herbivore",
            include: true,
            children: [
              {
                name: "herbivore_gut_type",
                value: "ruminant",
                label: "Ruminant",
                include: true,
              },
              {
                name: "herbivore_gut_type",
                value: "pseudoruminant",
                label: "Pseudoruminant",
                include: true,
              },
              {
                name: "herbivore_gut_type", // not working for some reason
                value: "non-ruminant",
                label: "Non-ruminant",
                include: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "commercial_sector_icon",
    value: "aquaculture",
    label: "Aquaculture",
    include: true,
    children: [
      {
        name: "commercial_and_trade_fisheries_icon",
        value: "commercial and trade fisheries",
        label: "Commercial and trade fisheries",
        include: true,
      },
      {
        name: "managed_fisheries_icon",
        value: "managed fisheries",
        label: "Managed fisheries",
        include: true,
      },
    ],
  },
];
