import { Grid, Text, ScrollArea, Paper } from "@mantine/core";
import updatesData from "../../public/public-changelog.json";
import classes from "./recent-updates-container.module.css";

interface UpdateItem {
  date: string;
  updates: string[];
}

function RecentUpdatesItem({ update }: { update: UpdateItem }) {
  return (
    <>
      <Grid.Col span={1}>
        <Text c="shellfish.6">{update.date}</Text>
      </Grid.Col>
      <Grid.Col key={`desc-${update.date}`} span={2}>
        {update.updates.map((updateMsg) => {
          return (
            <Text key={`${update.date}-${updateMsg}`} c="midnight.3" dangerouslySetInnerHTML={{ __html: updateMsg }} />
          );
        })}
      </Grid.Col>
    </>
  );
}

export default function RecentUpdatesContainer() {
  const changelog: UpdateItem[] = updatesData.changelog;
  return (
    <Paper w={600} h={520} radius="lg" withBorder className={classes.recentUpdatesContainer}>
      <ScrollArea h="100%" offsetScrollbars type="always">
        <Grid p={30} justify="center" columns={3}>
          {changelog.map((update) => (
            <RecentUpdatesItem key={update.date} update={update} />
          ))}
        </Grid>
      </ScrollArea>
    </Paper>
  );
}
