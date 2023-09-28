import { LoadingOverlay, Paper, PaperProps, useMantineTheme } from "@mantine/core";


export function LoadOverlay({ visible }: { visible: boolean }) {
  const theme = useMantineTheme();

  return (
    <LoadingOverlay
      visible={visible}
      overlayProps={{ radius: 'lg', blur: 2, color: theme.colors['midnight'][1] }}
      transitionProps={{ transition: 'fade', duration: 500 }}
      loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
    />
  )
}


interface LoadPanelProps {
  visible: boolean,
  children: React.ReactNode,
}

export function LoadPanel({ visible, children, ...props }: LoadPanelProps & PaperProps) {
  return (
    <Paper p="lg" radius="lg" pos="relative" withBorder {...props}>
      <LoadOverlay visible={visible} />
      {children}
    </Paper>
  )
 }
