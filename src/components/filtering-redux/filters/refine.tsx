import { Checkbox, Chip, Group, Stack } from "@mantine/core";

import { ClassificationFilter } from "../groups/classification";
import { IconChevronDown, IconTrashFilled } from "@tabler/icons-react";

export interface RefineOption {
  label: string;
  key: string;
  value: string;
  options: RefineOption[];
}

export function renderRefineFilterChip(filters: RefineTreeNode[], onRemove: () => void) {
  const last = filters[filters.length - 1];
  const previous = filters[filters.length - 2];

  return last
    ? [
        <Chip
          key={`${last.name}-${last.value}`}
          checked
          icon={<IconTrashFilled size={12} />}
          color="gray"
          onClick={onRemove}
          size="xs"
        >
          Is{" "}
          {previous ? (
            <>
              <b>{previous.label}</b>
              {" > "}
              <b>{last.label}</b>
            </>
          ) : (
            <b>{last.label}</b>
          )}
        </Chip>,
      ]
    : [];
}

export interface RefineTreeNode {
  name: string;
  value: string | boolean | number;
  label: string;
  children?: RefineTreeNode[];
}

interface RefineTreeState {
  selected: RefineTreeNode[];
  setSelected: (values: RefineTreeNode[]) => void;
}

interface RefineTreeItemProps {
  state: RefineTreeState;
  node: RefineTreeNode;
  parent?: RefineTreeNode[];
  offset: number;
}

function RefineTreeItem({ offset, state, node, parent }: RefineTreeItemProps) {
  const selected = Boolean(
    state.selected.find((item) => item.label === node.label && item.name === node.name && item.value === node.value)
  );

  const toggle = () => {
    if (selected) {
      state.setSelected(parent || []);
    } else {
      state.setSelected(parent ? [...parent, node] : [node]);
    }
  };

  return (
    <>
      <Group pl={offset * 15} gap={8} align="center">
        <Checkbox radius="md" color="midnight.9" checked={selected} label={node.label} onChange={toggle} />
        {node.children && (
          <IconChevronDown
            color="grey"
            size="1rem"
            style={{ transition: "transform ease 200ms", transform: selected ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
      </Group>
      {node.children && (
        <Stack style={{ display: selected ? "flex" : "none" }} gap={8}>
          {node.children.map((childNode) => (
            <RefineTreeItem
              offset={offset + 1}
              key={`${childNode.name}:${childNode.value}`}
              state={state}
              node={childNode}
              parent={parent ? [...parent, node] : [node]}
            />
          ))}
        </Stack>
      )}
    </>
  );
}

interface RefineTreeProps {
  filters: RefineTreeNode[];
  data: RefineTreeNode[];
  onSelect: (values: RefineTreeNode[]) => void;
}

export function RefineTree({ filters, data, onSelect }: RefineTreeProps) {
  const state: RefineTreeState = {
    selected: filters,
    setSelected: onSelect,
  };

  return (
    <Stack gap="xs">
      {data.map((node) => (
        <RefineTreeItem offset={0} key={`${node.name}:${node.value}`} state={state} node={node} />
      ))}
    </Stack>
  );
}
