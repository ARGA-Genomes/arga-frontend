'use client';

import * as Humanize from "humanize-plus";
import { Card, Image, Stack, Button, Flex, Text, Skeleton, Box } from "@mantine/core"
import Link from "next/link";


type Props = {
  total: number,
  category: string,
  image: string,
  link: string
};


function BrowseCardShell({ children }: { children: React.ReactNode }) {
  return (
    <Card shadow={undefined} radius={35} pb={35} bg="#306274">
      <Card.Section>
          {children}
      </Card.Section>
    </Card>
  );
}

function BrowseCardLoading() {
  return (
    <BrowseCardShell>
      <center>
        <Skeleton height={143} width={143} mt={20} circle animate={true}/>
      </center>

      <Stack align="flex-start" spacing="xs" justify="space-between" mt="md" mb="md" ml={20}>
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
      <center>
        <Image src={props.image} height={143} width={143} alt="" pt={20} />
      </center>

      <Stack ml={20}>
        <Text size={30} weight={500} m={0} p={0} color="white" h={20}>{Humanize.compactInteger(props.total)}</Text>
        <Text size={14} m={0} p={0} color="white">Records</Text>
        <Text size={20} weight={400} m={0} pt={10} color="white" h={62}>{props.category}</Text>
        {/*<Box h={36} />*/}
        <Link href={props.link}>
          <Button className="secondary_button" size="lg">
            <Text size={20} weight={400}>Browse</Text>
          </Button>
        </Link>
      </Stack>
    </BrowseCardShell>
  );
}


export { BrowseCard, BrowseCardLoading };
