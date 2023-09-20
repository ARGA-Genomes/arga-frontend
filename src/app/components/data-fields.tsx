import { createStyles } from "@mantine/core";

export const useTableStyles = createStyles((theme, _params, _getRef) => {
  return {
    table: {
      td: {
        height: 45,
      },
      "td:first-child": {
        textAlign: "left",
        whiteSpace: "nowrap",
        width: 1,
        paddingRight: theme.spacing.xl,
        fontSize: theme.fontSizes.sm,
        fontWeight: 300,
      },
    },
  }
});
