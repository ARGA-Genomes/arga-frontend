'use client';

import * as Humanize from "humanize-plus";
import { Card, Image, Stack, Button, Flex, Text } from "@mantine/core"

type Props = {
  total: number,
  category: string,
};

export default function BrowseCard(props: Props) {
  return (
    <Card shadow="sm" p="lg" withBorder>
      <Card.Section>
        <Flex gap="lg" wrap="wrap" direction="row" justify="flex-start">
          <Image
            src={null}
            height={200}
            width={200}
            withPlaceholder
            bg="midnight"
          />

          <Stack align="flex-start" spacing="xs" justify="space-between" mt="md" mb="md">
            <Text weight={600} size={30}>{Humanize.compactInteger(props.total)}</Text>
            <Text weight={500} size={22}>{props.category}</Text>
            <Button color="shellfish">Browse</Button>
          </Stack>
        </Flex>
      </Card.Section>
    </Card>
  );
}
