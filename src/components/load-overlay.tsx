import { Loader, LoadingOverlay, Paper, PaperProps, Stack, Text, useMantineTheme } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";

interface Error {
  toString(): string;
}

interface LoadOverlayProps {
  visible: boolean;
  error?: Error;
}

export function LoadOverlay({ visible, error }: LoadOverlayProps) {
  const theme = useMantineTheme();

  const loader = error ? <LoadError error={error} /> : <Loader color="moss.5" size="xl" />;

  return (
    <LoadingOverlay
      visible={visible}
      overlayProps={{ radius: "lg", blur: 2, color: theme.colors.midnight[1] }}
      transitionProps={{ transition: "fade", duration: 500 }}
      loaderProps={{ children: loader }}
    />
  );
}

interface LoadPanelProps {
  visible: boolean;
  error?: Error;
  children: React.ReactNode;
}

export function LoadPanel({ visible, error, children, ...props }: LoadPanelProps & PaperProps) {
  return (
    <Paper pos="relative" {...props}>
      <LoadOverlay visible={visible || !!error} error={error} />
      {children}
    </Paper>
  );
}

export function LoadError({ error }: { error: Error }) {
  return (
    <Stack justify="center" align="center">
      <IconMoodSad size={50} color="var(--mantine-color-bushfire-9)" />
      <Text c="bushfire.9">{error.toString()}</Text>
    </Stack>
  );
}
