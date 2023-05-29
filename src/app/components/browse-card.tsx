'use client';

import * as Humanize from "humanize-plus";
import { Card, Image, Stack, Button, Flex, Text, Skeleton, Box } from "@mantine/core"
import Link from "next/link";


type Props = {
  total: number,
  category: string,
  image: string,
};


function BrowseCardShell({ children }: { children: React.ReactNode }) {
  return (
    <Card shadow={undefined} withBorder radius={35} mih={325} px={20} pt={20} pb={25}>
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
      <Skeleton height={143} width={143} ml={20} mt={20} circle animate={true}/>

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
      <Image src={props.image} height={143} width={143} alt="" pl={20} pt={20} />

      <Stack mx={20} w={200}>
        <Text size={40} weight={500} m={0} p={0}>{Humanize.compactInteger(props.total)}</Text>
        <Text size={20} weight={400} h={83} m={0} p={0}>{props.category}</Text>
        <Box h={36} />
        <Link href="/browse/Conservation_NT">
          <Button color="midnight.5" radius={10} h={60} w={200}>
            <Text size={20} weight={400}>Browse</Text>
          </Button>
        </Link>
      </Stack>
    </BrowseCardShell>
  );
}


export { BrowseCard, BrowseCardLoading };
