import { Grid, Text, ScrollArea, Paper } from "@mantine/core";
import updatesData from "../../public/public-changelog.json";
import classes from "./recent-updates-container.module.css";

export default function RecentUpdatesContainer() {
  const changelog = updatesData.changelog;
  return (
    <Paper
      w={400}
      h={520}
      radius="lg"
      // shadow="lg"
      withBorder
      className={classes.recentUpdatesContainer}
    >
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
                      <Text key={update.date} c="midnight.3">
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
