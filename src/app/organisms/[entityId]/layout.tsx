"use client";
import { use } from "react";

import classes from "./layout.module.css";

import { Container, Paper, Stack, Tabs } from "@mantine/core";
import { RedirectType, redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { MAX_WIDTH } from "@/app/constants";
import { PreviousPage } from "@/components/navigation-history";
import { PageCitation } from "@/components/page-citation";

function DataTabs({ entityId, children }: { entityId: string; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  function changeTab(value: string | null) {
    if (value !== null) {
      router.replace(`/organisms/${entityId}/${value}`);
    }
  }

  // based on the current url the active tab should always be
  // the fourth component in the path name
  const tab = path.split("/")[3];

  if (!tab) redirect(`/organisms/${entityId}/source`, RedirectType.replace);

  return (
    <Tabs
      variant="unstyled"
      radius={10}
      mt="sm"
      defaultValue="summary"
      classNames={classes}
      value={tab}
      onChange={changeTab}
    >
      <Container maw={MAX_WIDTH}>
        <Tabs.List>
          <Tabs.Tab value="source">Source Organism</Tabs.Tab>
        </Tabs.List>
      </Container>

      <Paper pos="relative" py="md">
        {children}
      </Paper>
    </Tabs>
  );
}

interface OrganismLayoutProps {
  params: Promise<{ entityId: string }>;
  children: React.ReactNode;
}

export default function OrganismLayout(props: OrganismLayoutProps) {
  const params = use(props.params);
  const { children } = props;

  return (
    <Stack gap={0} mt="xl">
      <Container mb={20} w="100%" maw={MAX_WIDTH}>
        <PreviousPage />
      </Container>
      <DataTabs entityId={params.entityId}>
        <Container maw={MAX_WIDTH}>{children}</Container>
      </DataTabs>
    </Stack>
  );
}
