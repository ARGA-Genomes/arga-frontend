import { Stack, Text, UnstyledButton, UnstyledButtonProps, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import classes from "./download-btn.module.css";
import { forwardRef } from "react";

interface DownloadButtonProps {
  onClick?: () => void;
}

export const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(({ onClick }, ref) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton ref={ref} className={classes.btn} onClick={onClick}>
      <Stack gap={1} align="center">
        <IconDownload size={16} color={theme.colors.midnight[10]} fill="none" />
        <Text size="xs" fw={600}>
          Download
        </Text>
      </Stack>
    </UnstyledButton>
  );
});
