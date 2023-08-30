import { Pagination, Paper } from "@mantine/core";


interface PaginationBarProps {
  total: number | undefined,
  page: number,
  pageSize: number,
  onChange: (page: number) => void,
}

export function PaginationBar({ total, page, pageSize, onChange }: PaginationBarProps) {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  if (totalPages <= 1) return null;

  return (
    <Paper bg="white" p={20} m={40} radius="lg">
      <Pagination
        color="attribute.2"
        size="lg"
        radius="xl"
        position="center"
        spacing="md"
        total={totalPages}
        page={page}
        onChange={onChange}
      />
    </Paper>
  )
}
