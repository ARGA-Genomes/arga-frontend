import { Loader, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { forwardRef } from "react";
import classes from "./download-btn.module.css";

interface DownloadButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(({ onClick, loading }, ref) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton disabled={loading} opacity={loading ? 0.6 : 1} ref={ref} className={classes.btn} onClick={onClick}>
      <Stack gap={1} align="center">
        {loading ? (
          <Loader size={16} color={theme.colors.midnight[10]} />
        ) : (
          <IconDownload size={16} color={theme.colors.midnight[10]} fill="none" />
        )}
        <Text size="xs" fw={600}>
          Download
        </Text>
      </Stack>
    </UnstyledButton>
  );
});

DownloadButton.displayName = "DownloadButton";
