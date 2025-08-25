"use client";

import classes from "@/components/data-table.module.css";
import { Table, TableProps } from "@mantine/core";

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
    <Table withRowBorders={false} className={classes["data-table"]} {...tableProps}>
      <Table.Tbody>{children}</Table.Tbody>
    </Table>
  );
}

DataTable.Row = DataTableRow;
