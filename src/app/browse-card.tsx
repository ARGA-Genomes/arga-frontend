'use client';

import * as Humanize from "humanize-plus";
import { Card, Image, Stack, Button, Flex, Text, Skeleton } from "@mantine/core"


type Props = {
  total: number,
  category: string,
};


function BrowseCardShell({ children }: { children: React.ReactNode }) {
  return (
    <Card shadow="sm" p="lg" withBorder>
      <Card.Section>
        <Flex gap="lg" wrap="wrap" direction="row" justify="flex-start">
          {children}
        </Flex>
      </Card.Section>
    </Card>
  );
}

function BrowseCardLoading() {
  return (
    <BrowseCardShell>
      <Skeleton height={200} width={200} animate={true}/>

      <Stack align="flex-start" spacing="xs" justify="space-between" mt="md" mb="md">
        <Skeleton height={50} width={100} mt="xs" mb="xl" radius="md" animate={true} />
        <Skeleton height={8} width={200} radius="xl" animate={true} />
        <Skeleton height={8} mt={6} radius="xl" animate={true} />
        <Skeleton height={8} mt={6} width="70%" radius="xl" animate={true} />
      </Stack>
    </BrowseCardShell>
  );
}

function BrowseCard(props: Props) {
  return (
    <BrowseCardShell>
      <Image
        src={null}
        height={200}
        width={200}
        withPlaceholder
      />

      <Stack align="flex-start" spacing="xs" justify="space-between" mt="md" mb="md">
        <Text weight={600} size={30}>{Humanize.compactInteger(props.total)}</Text>
        <Text weight={500} size={22}>{props.category}</Text>
        <Button color="shellfish">Browse</Button>
      </Stack>
    </BrowseCardShell>
  );
}


export { BrowseCard, BrowseCardLoading };
