import { Box, Center, Pagination, Select } from "@mantine/core";
import classes from "./pagination.module.css";

interface PaginationBarProps {
  total: number | undefined;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function PaginationBar({ total, page, pageSize, onChange }: PaginationBarProps) {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  if (totalPages <= 1) return null;

  return (
    <Box p={20} mt="sm">
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
    </Box>
  );
}

interface PaginationSizeProps {
  value: number;
  onChange: (pageSize: number) => void;
  options?: number[];
}

export function PaginationSize({ value, options: rawOptions, onChange }: PaginationSizeProps) {
  const options = (rawOptions || [10, 25, 50]).map((item) => item.toString());

  return (
    <Select
      classNames={classes}
      color="midnight.9"
      radius="lg"
      value={value.toString()}
      data={options.map((item) => ({ value: item, label: `${item} items` }))}
      onChange={(_, option) => onChange(parseInt(option.value || "10", 10))}
    />
  );
}
