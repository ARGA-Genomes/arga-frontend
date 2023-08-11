"use client";

import { useDisclosure, useSessionStorage } from '@mantine/hooks';
import { Modal, Button, Text, Divider, Title } from '@mantine/core';
import Link from 'next/link';

export function SurveyModal() {
  const [showSurvey, setShowSurvey] = useSessionStorage({ key: 'show-survey', defaultValue: true, getInitialValueInEffect: false });
  const [opened, { close }] = useDisclosure(showSurvey);

  const closeAndDontShowAgain = () => {
    setShowSurvey(false);
    close();
  }

  return (
    <Modal opened={opened} onClose={closeAndDontShowAgain} title={<Title order={3}>Feedback Survey</Title>} zIndex={1000} centered>
      <Text>
        This survey will help the Australian Reference Genome Atlas (ARGA) project team understand
        how the ARGA platform performs in relation to user needs and determine directions for
        future development.
      </Text>
      <Text>
        It should take roughly 5 to 10 minutes to complete.
      </Text>

      <Divider my={20} />

      <Link target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdtN135-hiFYeG0etz1Hh9M1fY52ydwg7x94QlP5Rs5xHXtFA/viewform?usp=sf_link">
        <Button onClick={closeAndDontShowAgain} fullWidth>
          Open Survey
        </Button>
      </Link>
    </Modal>
  );
}
