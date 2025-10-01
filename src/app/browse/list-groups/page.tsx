import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Badge,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { GroupCard } from "./_components/group-card";

// Data for rendering categories
import { MAX_WIDTH } from "@/app/constants";
import { IconChevronDown } from "@tabler/icons-react";

import { commercial } from "./_data/commercial";
import { ecosystems } from "./_data/ecosystems";
import { other } from "./_data/other";
import { phenotypic } from "./_data/phenotypic";
import { threatened } from "./_data/threatened";

import { groupBy } from "lodash-es";

import innerAccordionClasses from "./inner-accordion.module.css";
import outerAccordionClasses from "./outer-accordion.module.css";

const groups = {
  Ecosystems: ecosystems,
  "Industry Applications": commercial,
  "Ethnobiology and Phenotypic Traits": phenotypic,
  "Threatened and Vulnerable": threatened,
  "Other Traits": other,
};

// Optimized grouping using composite keys and functional approach
const processedGroups = Object.entries(groups)
  .filter(([, data]) => data.filter((item) => !item.disabled).length > 0)
  .map(([name, data]) => {
    // Create composite key grouping in a single pass
    const compositeGroups = groupBy(data, (item) => {
      const subcategory = item.display?.subcategory || "all";
      const order = item.display?.order || " none";
      return `${subcategory}::${order}`;
    });

    // Transform composite groups into the expected structure
    const subcategoryMap = new Map<string, Array<{ order: string; items: typeof data }>>();

    Object.entries(compositeGroups).forEach(([compositeKey, items]) => {
      const [subcategory, order] = compositeKey.split("::");

      if (!subcategoryMap.has(subcategory)) {
        subcategoryMap.set(subcategory, []);
      }

      subcategoryMap.get(subcategory)!.push({ order, items });
    });

    // Convert map to final structure with sorting
    const subcategoryGroups = Array.from(subcategoryMap.entries()).map(([subcategory, orderGroups]) => ({
      subcategory,
      isAll: subcategory === "all",
      orderGroups: orderGroups.sort(
        (a: { order: string; items: typeof data }, b: { order: string; items: typeof data }) => {
          // Sort orders: items with order come after items without order
          if (a.order === " none" && b.order !== " none") return 1;
          if (a.order !== " none" && b.order === " none") return -1;
          return 0;
        }
      ),
    }));

    return {
      name,
      subcategoryGroups: subcategoryGroups.filter(({ isAll }) => !isAll),
      allGroup: subcategoryGroups.find(({ isAll }) => isAll)!,
      count: data.length,
    };
  });

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
              radius="xl"
              classNames={outerAccordionClasses}
              chevron={<IconChevronDown style={{ color: "var(--mantine-color-midnight-10)" }} />}
              mb="md"
              defaultValue={["Ecosystems"]}
              multiple
            >
              {processedGroups.map(({ name, count, allGroup, subcategoryGroups }) => (
                <AccordionItem key={name} value={name}>
                  <AccordionControl pl="lg" py={4}>
                    <Group pr="md" align="center" justify="space-between">
                      <Title order={4} fw="bold" c="midnight.10">
                        {name}
                      </Title>
                      <Badge size="lg" variant="dot" color="midnight">
                        {count} groups
                      </Badge>
                    </Group>
                  </AccordionControl>
                  <AccordionPanel>
                    <Stack gap="xs">
                      {allGroup.orderGroups.map(({ order, items }) => (
                        <Group key={order} gap="xs" align="flex-start">
                          {items.map((group) => (
                            <GroupCard key={group.category} {...group} />
                          ))}
                        </Group>
                      ))}
                    </Stack>
                    <Stack>
                      {subcategoryGroups.length > 0 && (
                        <Grid mt="sm">
                          {subcategoryGroups.map(({ subcategory, orderGroups }) => (
                            <GridCol span={{ md: 12, lg: 6 }}>
                              <Accordion classNames={innerAccordionClasses} variant="separated" radius="lg">
                                <AccordionItem key={subcategory} value={subcategory}>
                                  <AccordionControl>
                                    <Text size="md" fw="bold" c="midnight.6">
                                      {subcategory}
                                    </Text>
                                  </AccordionControl>
                                  <AccordionPanel>
                                    <Stack gap="xs">
                                      {orderGroups.map(({ order, items }) => (
                                        <Group key={order} gap="xs" align="flex-start">
                                          {items.map((group) => (
                                            <GroupCard key={group.category} {...group} />
                                          ))}
                                        </Group>
                                      ))}
                                    </Stack>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            </GridCol>
                          ))}
                        </Grid>
                      )}
                    </Stack>
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
