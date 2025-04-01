import { Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

export function FiltersDrawer({ children }: PropsWithChildren) {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={handlers.close} withCloseButton={false} position="right" size="xl" keepMounted>
        <Stack pt={180}>{children}</Stack>
      </Drawer>
      <Button
        variant="outline"
        color="midnight.9"
        onClick={handlers.open}
        leftSection={<IconAdjustments />}
        radius="xl"
      >
        Filters
      </Button>
    </>
  );
}
