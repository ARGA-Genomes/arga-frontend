import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Container,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

import { GroupCard } from "./group-card";

// Data for rendering categories
import { MAX_WIDTH } from "@/app/constants";
import { IconChevronDown } from "@tabler/icons-react";

import { commercial } from "./_data/commercial";
import { ecosystems } from "./_data/ecosystems";
import { iek } from "./_data/iek";
import { other } from "./_data/other";
import { phenotypic } from "./_data/phenotypic";
import { threatened } from "./_data/threatened";

import classes from "./page.module.css";

const groups = {
  Ecosystems: ecosystems,
  "Industry Applications": commercial,
  "Indigenous Ecological Knowledge": iek,
  "Phenotypic Traits": phenotypic,
  "Threatened and Vulnerable": threatened,
  "Other Traits": other,
};

export default function AllGroups() {
  return (
    <>
      <Stack gap="md" py="xl">
        <Paper py={30}>
          <Container maw={MAX_WIDTH}>
            <Stack gap={0}>
              <Text c="dimmed" fw={400}>
                DATA GROUPINGS
              </Text>
              <Text fz={38} fw={700}>
                ARGA Trait and Ecological Groups
              </Text>
            </Stack>
          </Container>
        </Paper>
        <Paper py="xl">
          <Container fluid maw={MAX_WIDTH}>
            <Accordion
              variant="separated"
              radius="lg"
              classNames={classes}
              chevron={<IconChevronDown style={{ color: "var(--mantine-color-midnight-10)" }} />}
              mb="md"
              defaultValue={["Ecosystems"]}
              multiple
            >
              {Object.entries(groups).map(([name, data]) => (
                <AccordionItem key={name} value={name}>
                  <AccordionControl>
                    <Text fw="bold" fz="var(--mantine-h4-font-size)" c="black">
                      {name}
                    </Text>
                  </AccordionControl>
                  <AccordionPanel>
                    <Group gap="xs" align="flex-start">
                      {data.map((group) => (
                        <GroupCard key={group.category} {...group} />
                      ))}
                    </Group>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Paper>
      </Stack>
    </>
  );
}
