import { Center, Pagination, Paper } from "@mantine/core";


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
    <Paper bg="white" p={20} my={40} radius="lg">
      <Center>
      <Pagination
        color="attribute.2"
        size="lg"
        radius="xl"
        gap="md"
        total={totalPages}
        value={page}
        onChange={onChange}
      />
      </Center>
    </Paper>
  )
}
