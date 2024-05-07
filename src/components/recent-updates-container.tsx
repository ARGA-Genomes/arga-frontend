import { Grid, Text, ScrollArea, Paper } from "@mantine/core";
import updatesData from "../../public/public-changelog.json";

export default function RecentUpdatesContainer() {
  const changelog = updatesData.changelog;
  return (
    <Paper w={400} h={425} bg="midnight.6" radius="lg" shadow="sm">
      <ScrollArea h="100%" offsetScrollbars scrollbars="y">
        <Grid p={30} justify="center" columns={3}>
          {changelog.map((update) => {
            return (
              <>
                <Grid.Col key={update.date} span={1}>
                  <Text c="shellfish.6">{update.date}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  {update.updates.map((updateMsg) => {
                    return (
                      <Text key={update.date} c="midnight.2">
                        {updateMsg}
                      </Text>
                    );
                  })}
                </Grid.Col>
              </>
            );
          })}
        </Grid>
      </ScrollArea>
    </Paper>
  );
}
