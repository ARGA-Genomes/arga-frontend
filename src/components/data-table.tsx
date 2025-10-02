"use client";

import classes from "@/components/data-table.module.css";
import { Group, Table, TableProps, Text } from "@mantine/core";

interface DataTableRowProps {
  label?: string;
  children?: React.ReactNode;
}

export function DataTableRow({ label, children }: DataTableRowProps) {
  return (
    <Table.Tr>
      <Table.Td>{label}</Table.Td>
      <Table.Td>{children}</Table.Td>
    </Table.Tr>
  );
}

interface DataTableProps {
  children: React.ReactNode;
}

export function DataTable({ children, ...tableProps }: DataTableProps | TableProps) {
  return (
    <Table withRowBorders={false} verticalSpacing={4} className={classes["data-table"]} {...tableProps}>
      <Table.Tbody>{children}</Table.Tbody>
    </Table>
  );
}

interface DataTableRowProps {
  label?: string;
  children?: React.ReactNode;
  grow?: boolean;
}

export function DataTableRowValue({ label, children, grow }: DataTableRowProps) {
  return (
    <DataTable.Row label={label}>
      <Text fw={600} fz="sm" c="midnight.8">
        {grow && children}
        {!grow && <Group>{children}</Group>}
      </Text>
    </DataTable.Row>
  );
}

DataTable.Row = DataTableRow;
DataTable.RowValue = DataTableRowValue;
