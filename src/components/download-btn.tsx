import { Loader, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { forwardRef } from "react";
import classes from "./download-btn.module.css";

interface DownloadButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ onClick, loading, disabled }, ref) => {
    const theme = useMantineTheme();
    const isDisabled = disabled || loading;

    return (
      <UnstyledButton
        disabled={isDisabled}
        opacity={isDisabled ? 0.6 : 1}
        ref={ref}
        className={isDisabled ? undefined : classes.btn}
        onClick={onClick}
        style={{ cursor: isDisabled ? "default" : undefined }}
      >
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
  }
);

DownloadButton.displayName = "DownloadButton";
