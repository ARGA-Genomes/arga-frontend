'use client';

import * as Humanize from "humanize-plus";
import { Card, Image, Stack, Text, Skeleton } from "@mantine/core"
import Link from "next/link";


type Props = {
  total: number,
  category: string,
  image: string,
  link: string
};


function BrowseCardShell({ children, link }: { children: React.ReactNode, link: string }) {
  return (
    <Link href={link}>
      <Card shadow={undefined} radius={35} pb={35} bg="#306274" sx={{'&:hover': {backgroundColor: '#285464'}}}>
        <Card.Section>
            {children}
        </Card.Section>
      </Card>
    </Link>
  );
}

function BrowseCardLoading() {
  return (
    <BrowseCardShell link="">
      <center>
        <Skeleton height={120} width={120} mt={20} circle animate={true}/>
      </center>

      <Stack align="flex-start" spacing="xs" justify="space-between" mt="md" mb="md" ml={20} pb={35}>
        <Skeleton height={8} width={100} radius="xl" animate={true} />
        <Skeleton height={8} width={100} radius="xl" animate={true} />
        <Skeleton height={8} mt={10} width="70%" radius="xl" animate={true} />
      </Stack>
    </BrowseCardShell>
  );
}

function BrowseCard(props: Props) {
  return (
    <BrowseCardShell link={props.link}>
      <center>
        <Image src={props.image} height={120} width={120} alt="" pt={20} />
      </center>

      <Stack ml={20}>
        <Text size={30} weight={500} m={0} p={0} color="white" h={20}>{Humanize.compactInteger(props.total)}</Text>
        <Text size={14} m={0} p={0} color="white">Records</Text>
        <Text size={20} weight={400} m={0} pt={0} color="white" h={62}>{props.category}</Text>
      </Stack>
    </BrowseCardShell>
  );
}


export { BrowseCard, BrowseCardLoading };
