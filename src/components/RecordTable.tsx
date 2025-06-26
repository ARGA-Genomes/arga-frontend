"use client";

import classes from "./RecordTable.module.css";

import { Table, Tooltip, Group, Paper, MantineRadius, Center } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

export enum SortOrder {
  Ascending,
  Descending,
}

interface RecordTableProps {
  columns?: React.ReactNode;
  children?: React.ReactNode[];
  radius?: MantineRadius;
}

export function RecordTable({ columns, children, radius }: RecordTableProps) {
  return (
    <Paper radius={radius} className={classes.container}>
      <Table highlightOnHoverColor="wheat.1" withRowBorders={false} highlightOnHover striped>
        <Table.Thead className={classes.header}>
          <Table.Tr>{columns}</Table.Tr>
        </Table.Thead>

        <Table.Tbody>{children}</Table.Tbody>
      </Table>
    </Paper>
  );
}

interface RecordTableColumnProps {
  label: string;
  tooltip?: string;
  sorting?: SortOrder;
}

export function RecordTableColumn({ label, tooltip, sorting }: RecordTableColumnProps) {
  return (
    <Tooltip label={tooltip} disabled={!tooltip}>
      <Table.Th>
        <Group gap="xs" wrap="nowrap" justify="center">
          {label}

          {sorting === SortOrder.Ascending && <IconSortAscending size="1rem" />}
          {sorting === SortOrder.Descending && <IconSortDescending size="1rem" />}
        </Group>
      </Table.Th>
    </Tooltip>
  );
}

interface RecordTableRowProps {
  children?: React.ReactNode | React.ReactNode[];
}

export function RecordTableRow({ children }: RecordTableRowProps) {
  const cells = Array.isArray(children) ? children : [children];

  // we can use an index for the cells because it only needs to be unique
  // within the context of the component. in this case the row.
  return (
    <Table.Tr className={classes.row}>
      {cells.map((cell, idx) => (
        <Table.Td key={`${idx}`}>
          <Center>{cell}</Center>
        </Table.Td>
      ))}
    </Table.Tr>
  );
}

RecordTable.Column = RecordTableColumn;
RecordTable.Row = RecordTableRow;
