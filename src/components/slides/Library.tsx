import { Library } from "@/generated/types";
import { Button, Combobox, Group, Stack, useCombobox } from "@mantine/core";
import { useState } from "react";
import { IconLibrary } from "../ArgaIcons";
import { DataTable } from "../data-table";

interface LibrarySlideProps {
  libraries: Library[];
}

export function LibrarySlide({ libraries }: LibrarySlideProps) {
  const [library, setLibrary] = useState(libraries.at(0));

  return (
    <Stack px="xl">
      <LibraryDropdown libraries={libraries} onSelected={setLibrary} />
      <LibraryDetails library={library} />
    </Stack>
  );
}

function LibraryDetails({ library }: { library?: Library }) {
  return (
    <Stack>
      <DataTable>
        <DataTable.RowValue label="Library prep kit" />
        <DataTable.RowValue label="Library strategy">{library?.strategy}</DataTable.RowValue>
        <DataTable.RowValue label="Input DNA amount">{library?.concentration}</DataTable.RowValue>
        <DataTable.RowValue label="Sample source" />
        <DataTable.RowValue label="Library layout">{library?.layout}</DataTable.RowValue>
        <DataTable.RowValue label="Fragmentation method" />
        <DataTable.RowValue label="QC check results" />
        <DataTable.RowValue label="Data source" />
      </DataTable>
      <Group>
        <IconLibrary size={200} />
      </Group>
    </Stack>
  );
}

interface LibraryDropdownProps {
  libraries: Library[];
  onSelected: (library: Library) => void;
}

function LibraryDropdown({ libraries, onSelected }: LibraryDropdownProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      position="bottom-start"
      withArrow
      onOptionSubmit={(value) => {
        const selected = libraries.find((library) => library.entityId == value);
        if (selected) onSelected(selected);

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button
          variant="outline"
          radius="xl"
          color="midnight"
          onClick={() => combobox.toggleDropdown()}
          disabled={libraries.length == 0}
        >
          Select library
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {libraries.map((library) => (
            <Combobox.Option value={library.entityId} key={library.entityId}>
              {library.libraryId}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
