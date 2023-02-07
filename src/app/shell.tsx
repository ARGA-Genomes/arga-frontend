'use client';

import { AppShell, Header } from '@mantine/core';
import { TopNav } from './top-nav';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="md" bg="midnight">
          <TopNav />
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
