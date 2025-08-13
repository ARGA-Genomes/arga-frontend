"use client";

import classes from "./RecordTable.module.css";

import React from "react";
import { Table, Tooltip, Group, Paper, MantineRadius, Center, MantineColor } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { Sorting, SortOrder } from "@/queries/common";

interface RecordTableProps<Sortable> {
  columns?: React.ReactElement<RecordTableColumnProps<Sortable>>[];
  children?: React.ReactNode[];
  radius?: MantineRadius;
  sorting?: Sorting<Sortable>;
  onSort?: (sorting: Sorting<Sortable>) => void;
}

export function RecordTable<Sortable>({ columns, children, radius, sorting, onSort }: RecordTableProps<Sortable>) {
  function changeSort(key: Sortable) {
    if (onSort && sorting) {
      if (sorting.sortable !== key) {
        onSort({ sortable: key, order: SortOrder.Ascending });
      } else {
        onSort({
          sortable: key,
          order: sorting.order === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending,
        });
      }
    }
  }

  const context = {
    columns: columns?.map((column) => column.props) ?? [],
    onColumnClick: changeSort,
    sorting,
  };

  return (
    <RecordTableContext.Provider value={context}>
      <Paper radius={radius} className={classes.container}>
        <Table highlightOnHoverColor="wheatBg.1" withRowBorders={false} highlightOnHover striped stickyHeader>
          <Table.Thead className={classes.header}>
            <Table.Tr>{columns}</Table.Tr>
          </Table.Thead>

          <Table.Tbody>{children}</Table.Tbody>
        </Table>
      </Paper>
    </RecordTableContext.Provider>
  );
}

interface RecordTableColumnProps<Sortable> {
  value: Sortable;
  label: string;
  tooltip?: string;
  width?: number | string;
  color?: MantineColor;
}

export function RecordTableColumn<Sortable>({ value, label, tooltip, width }: RecordTableColumnProps<Sortable>) {
  const { sorting, onColumnClick } = useRecordTable();

  return (
    <Tooltip label={tooltip} disabled={!tooltip}>
      <Table.Th w={width} onClick={() => onColumnClick(value)}>
        <Group gap="xs" wrap="nowrap" justify="center">
          {label}

          {sorting?.sortable === value && sorting?.order === SortOrder.Ascending && <IconSortAscending size={20} />}
          {sorting?.sortable === value && sorting?.order === SortOrder.Descending && <IconSortDescending size={20} />}
        </Group>
      </Table.Th>
    </Tooltip>
  );
}

interface RecordTableRowProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function RecordTableRow({ children }: RecordTableRowProps) {
  const { columns, sorting } = useRecordTable();
  const cells = Array.isArray(children) ? children : [children];

  // we can use an index for the cells because it only needs to be unique
  // within the context of the component. in this case the row.
  return (
    <Table.Tr className={classes.row}>
      {cells.map((cell, idx) => (
        <Table.Td key={`${idx}`} bg={sorting?.sortable === columns[idx]?.value ? "wheatBg.1" : columns[idx]?.color}>
          <Center>{cell}</Center>
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

interface RecordTableContextValue<Sortable> {
  columns: RecordTableColumnProps<Sortable>[];
  onColumnClick: (value: Sortable) => void;
  sorting?: Sorting<Sortable>;
}

const RecordTableContext = React.createContext<RecordTableContextValue<any>>({ columns: [], onColumnClick: () => {} });
const useRecordTable = () => React.useContext(RecordTableContext);

RecordTable.Column = RecordTableColumn;
RecordTable.Row = RecordTableRow;
