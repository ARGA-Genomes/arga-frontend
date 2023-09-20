import { Box, createStyles, ScrollArea, Text } from "@mantine/core";

export const useTableStyles = createStyles((theme, _params, _getRef) => {
  return {
    table: {
      "tbody tr td": {
        height: 45,
        borderTop: 'none',
      },
      "td:first-child": {
        textAlign: "left",
        whiteSpace: "nowrap",
        width: 1,
        paddingRight: theme.spacing.xl,
        fontSize: theme.fontSizes.sm,
        fontWeight: 300,
        minWidth: 180,
      },
    },
  }
});


export function CopyableData({ value }: { value: string }) {
  return (
    <ScrollArea
      offsetScrollbars
      type="always"
      w={500}
      p={5}
      sx={{
        border: "1px solid #cfcfcf",
        borderRadius: 10,
      }}>
      <Text>{value}</Text>
    </ScrollArea>
  )
}
