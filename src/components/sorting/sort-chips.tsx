import { Chip, ChipProps, useMantineTheme } from "@mantine/core";
import classes from "./sort-chips.module.css";

interface CustomChipProps extends ChipProps {
  value: string;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

export function SortChip({
  value,
  onClick,
  children,
  ...rest
}: CustomChipProps) {
  return (
    <Chip value={value} onClick={onClick} {...rest} classNames={classes}>
      {children}
    </Chip>
  );
}
