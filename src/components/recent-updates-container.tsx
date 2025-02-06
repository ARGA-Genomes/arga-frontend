import { Grid, Text, ScrollArea, Paper } from "@mantine/core";
import updatesData from "../../public/public-changelog.json";
import classes from "./recent-updates-container.module.css";

export default function RecentUpdatesContainer() {
  const changelog = updatesData.changelog;
  return (
    <Paper
      w={600}
      h={520}
      radius="lg"
      withBorder
      className={classes.recentUpdatesContainer}
    >
      <ScrollArea h="100%" offsetScrollbars type="always">
        <Grid p={30} justify="center" columns={3}>
          {changelog.map((update, idx) => {
            return (
              <>
                <Grid.Col key={idx} span={1}>
                  <Text c="shellfish.6">{update.date}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  {update.updates.map((updateMsg, idx) => {
                    return (
                      <Text key={idx} c="midnight.3">
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
