
import { Library } from "@/generated/types";
import { Group, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { IconSubsample } from "../ArgaIcons";
import { EventDetails, PublicationDetails, SlideNavigation } from "./common";
import { DataTable } from "../data-table";

interface LibrarySlideProps {
  libraries: Library[];
}

export function LibrarySlide({ libraries }: LibrarySlideProps) {
  const [library, setLibrary] = useState(libraries.at(0));

  return (
    <SlideNavigation
      icon={<IconSubsample size={200} />}
      records={libraries}
      selected={library}
      onSelected={(record) => setLibrary(record)}
      getLabel={(record) => record.libraryId}
    >
      {library && (
        <Stack w="100%">
          <Group wrap="nowrap">
            <EventDetails version="" />
            <PublicationDetails publication={library.publication} />
          </Group>
          <LibraryDetails library={library} />
        </Stack>
      )}
    </SlideNavigation>
  );
}

function LibraryDetails({ library }: { library: Library }) {
  return (
    <Stack>
      <Text fw={700} fz="md" c="midnight.7">
        Library preparation
      </Text>
      <DataTable>
        <DataTable.RowValue label="Prep kit" />
        <DataTable.RowValue label="Strategy">{library.strategy}</DataTable.RowValue>
        <DataTable.RowValue label="Input DNA amount">{library.concentration}</DataTable.RowValue>
        <DataTable.RowValue label="Sample source" />
        <DataTable.RowValue label="Library layout">{library.layout}</DataTable.RowValue>
        <DataTable.RowValue label="Fragmentation method" />
        <DataTable.RowValue label="QC check results" />
      </DataTable>
    </Stack>
  );
}
