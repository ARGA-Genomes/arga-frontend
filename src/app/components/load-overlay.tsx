import { LoadingOverlay, Paper, PaperProps, useMantineTheme } from "@mantine/core";


export function LoadOverlay({ visible }: { visible: boolean }) {
  const theme = useMantineTheme();

  return (
    <LoadingOverlay
      overlayColor={theme.colors.midnight[0]}
      transitionDuration={500}
      loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
      visible={visible}
      radius="lg"
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
