import { LoadingOverlay, useMantineTheme } from "@mantine/core";


export function LoadOverlay({ visible }: { visible: boolean }) {
  const theme = useMantineTheme();

  return (
    <LoadingOverlay
      overlayColor={theme.colors.midnight[0]}
      transitionDuration={500}
      loaderProps={{ variant: "bars", size: 'xl', color: "moss.5" }}
      visible={visible}
      radius={20}
    />
  )
}
