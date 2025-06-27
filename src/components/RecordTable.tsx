"use client";

import classes from "./RecordTable.module.css";

import React from "react";
import { Table, Tooltip, Group, Paper, MantineRadius, Center, MantineColor } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

export enum SortOrder {
  Ascending,
  Descending,
}

interface RecordTableProps {
  columns?: React.ReactElement<RecordTableColumnProps>[];
  children?: React.ReactNode[];
  radius?: MantineRadius;
}

export function RecordTable({ columns, children, radius }: RecordTableProps) {
  const context = {
    columns: columns?.map((column) => column.props) ?? [],
  };

  return (
    <RecordTableContext.Provider value={context}>
      <Paper radius={radius} className={classes.container}>
        <Table highlightOnHoverColor="wheat.1" withRowBorders={false} highlightOnHover striped stickyHeader>
          <Table.Thead className={classes.header}>
            <Table.Tr>{columns}</Table.Tr>
          </Table.Thead>

          <Table.Tbody>{children}</Table.Tbody>
        </Table>
      </Paper>
    </RecordTableContext.Provider>
  );
}

interface RecordTableColumnProps {
  label: string;
  tooltip?: string;
  sorting?: SortOrder;
  width?: number | string;
  color?: MantineColor;
}

export function RecordTableColumn({ label, tooltip, sorting, width }: RecordTableColumnProps) {
  return (
    <Tooltip label={tooltip} disabled={!tooltip}>
      <Table.Th w={width}>
        <Group gap="xs" wrap="nowrap" justify="center">
          {label}

          {sorting === SortOrder.Ascending && <IconSortAscending size={20} />}
          {sorting === SortOrder.Descending && <IconSortDescending size={20} />}
        </Group>
      </Table.Th>
    </Tooltip>
  );
}

interface RecordTableRowProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function RecordTableRow({ children }: RecordTableRowProps) {
  const { columns } = useRecordTable();
  const cells = Array.isArray(children) ? children : [children];

  // we can use an index for the cells because it only needs to be unique
  // within the context of the component. in this case the row.
  return (
    <Table.Tr className={classes.row}>
      {cells.map((cell, idx) => (
        <Table.Td key={`${idx}`} bg={columns[idx]?.color}>
          <Center>{cell}</Center>
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

interface RecordTableContextValue {
  columns: RecordTableColumnProps[];
}

const RecordTableContext = React.createContext<RecordTableContextValue>({ columns: [] });
const useRecordTable = () => React.useContext(RecordTableContext);

RecordTable.Column = RecordTableColumn;
RecordTable.Row = RecordTableRow;
