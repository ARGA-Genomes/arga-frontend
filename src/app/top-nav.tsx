'use client';

import Link from 'next/link';
import { Flex, Grid } from '@mantine/core';

export function TopNav() {
    return (
        <Grid>
            <Grid.Col span={2}>Australian Reference Genome Atlas</Grid.Col>
            <Grid.Col span="auto">
                <Flex gap="md" justify="flex-end" align="center" direction="row">
                    <Link href="/">Home</Link>
                </Flex>
            </Grid.Col>
        </Grid>
    )
}
