'use client';

import { Card, Container, Grid, TextInput, Image, Title } from "@mantine/core";
import { Search } from "tabler-icons-react";
import BrowseData from './browse-data';


export default function HomePage() {
  return (
    <div>
      <Card pt={80} pb={80} bg="midnight">
        <Container>
          <Grid align="center" gutter={40}>
            <Grid.Col span={4}>
              <Image src="logo_reversed.png" />
            </Grid.Col>
            <Grid.Col span="auto">
              <TextInput
                placeholder="Search"
                radius="md"
                size="lg"
                rightSection={<Search size={28} />}
                rightSectionWidth={50}
              />
            </Grid.Col>
          </Grid>
        </Container>
      </Card>

      <section>
        <Title order={2} mt={20}>Browse data</Title>
        <BrowseData/>
      </section>
    </div>
  );
}
