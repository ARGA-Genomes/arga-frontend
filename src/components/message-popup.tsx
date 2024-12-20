"use client";

import { Anchor, Center, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDna } from "@tabler/icons-react";
import localFont from "next/font/local";
import { useEffect } from "react";

const gothamBold = localFont({
  src: "../../public/fonts/gotham/GothamBold.ttf",
});

export function MessagePopup() {
  const date = new Date().getDate().toString();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const seen = window.localStorage.getItem("arga-popup-seen") === date;
    if (!seen) open();
  }, []);

  return (
    <Modal
      radius="lg"
      zIndex={3000}
      opened={opened}
      onClose={() => {
        window.localStorage.setItem("arga-popup-seen", date);
        close();
      }}
      size="xl"
      withCloseButton={false}
      centered
    >
      <Stack p="sm">
        <Group align="flex-start">
          <Text
            style={{
              fontFamily: gothamBold.style.fontFamily,
              fontSize: 32,
            }}
          >
            ARGA Maintenance
          </Text>
          <Modal.CloseButton />
        </Group>
        <Text>
          We are currently updating the ARGA database and UI. There may be some
          disruptions to service during this time, and users may experience
          issues with inconsistent information availability.
        </Text>
        <Text>
          We anticipate a return to normal services in January 2025. Thank you
          for your patience and understanding while we refactor ARGA to make it
          better for you.
        </Text>
        <Text>
          In the meantime, if you have any comments or queries, please contact
          us using the contact form:{" "}
          <Anchor href="https://arga.org.au/contact/" target="_blank">
            https://arga.org.au/contact/
          </Anchor>
        </Text>
        <Text>Best wishes for the coming holidays,</Text>
        <Group gap="xs">
          <IconDna />
          <Text>The ARGA Team</Text>
        </Group>
      </Stack>
    </Modal>
  );
}
