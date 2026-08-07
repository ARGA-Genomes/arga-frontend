"use client";

import { Anchor, Flex, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useDisclosure, useSessionStorage } from "@mantine/hooks";
import { IconSpeakerphone } from "@tabler/icons-react";

export function AnnouncementModal() {
  const [showAnnouncement, setShowAnnouncement] = useSessionStorage({
    key: "show-announcement",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [opened, { close }] = useDisclosure(showAnnouncement);

  const closeAndDontShowAgain = () => {
    setShowAnnouncement(false);
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={closeAndDontShowAgain}
      size="xl"
      radius="xl"
      centered
      zIndex={3000}
      title={
        <Flex align="center" pt="sm">
          <ThemeIcon size="xl" color="wheat.4" variant="transparent">
            <IconSpeakerphone size="3rem" style={{ transform: "rotate(-25deg)" }} />
          </ThemeIcon>
          <Text px="sm" ff="heading" component="span" fw={700} fz="1.5rem" c="wheat.4">
            Important announcement
          </Text>
        </Flex>
      }
      transitionProps={{ transition: "pop", duration: 300 }}
      styles={{
        content: { backgroundColor: "var(--mantine-color-shellfish-6)" },
        header: { backgroundColor: "var(--mantine-color-shellfish-6)" },
        close: { color: "var(--mantine-color-wheat-4)" },
      }}
    >
      <Stack px="sm" pb="md" gap="md">
        <Title order={4} c="white">
          Our Australian Reference Genome Atlas (ARGA) pilot project has now concluded.
        </Title>
        <Text c="white">
          You may continue to access ARGA until 31 August 2026. Open-access software, documentation and other project
          artefacts remain available through ARGA&apos;s{" "}
          <Anchor c="wheat.4" href="https://github.com/ARGA-Genomes" target="_blank" underline="always">
            GitHub repository
          </Anchor>{" "}
          and{" "}
          <Anchor c="wheat.4" href="https://osf.io/nc7tp/" target="_blank" underline="always">
            OSF project page
          </Anchor>
          .
        </Text>
        <Text c="white">
          We thank all our infrastructure partners, in particular the{" "}
          <Anchor c="wheat.4" href="https://ala.org.au" target="_blank" underline="always">
            Atlas of Living Australia
          </Anchor>
          , the{" "}
          <Anchor c="wheat.4" href="https://www.biocommons.org.au/" target="_blank" underline="always">
            Australian BioCommons
          </Anchor>{" "}
          and{" "}
          <Anchor c="wheat.4" href="https://bioplatforms.com/" target="_blank" underline="always">
            BioPlatforms Australia
          </Anchor>
          , as well as the{" "}
          <Anchor c="wheat.4" href="https://ardc.edu.au/" target="_blank" underline="always">
            Australian Research Data Commons
          </Anchor>
          . ARGA was enabled by funding from the{" "}
          <Anchor c="wheat.4" href="https://www.education.gov.au/ncris" target="_blank" underline="always">
            National Collaborative Research Infrastructure Strategy
          </Anchor>
          . Through many conversations and page visits here, you have helped us create a vision for genomics data
          sharing. All of us here at the ARGA team thank each and every one of you for your insights, time and support.
        </Text>
      </Stack>
    </Modal>
  );
}
