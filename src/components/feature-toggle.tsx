'use client';

import { Affix, Button, Menu, SegmentedControl } from "@mantine/core";
import { Flag } from "tabler-icons-react";
import { FlagOrdering, useFeatureFlag, useFlag } from "../flags";


function Ordering({ onChange }: { onChange: (value: string) => void }) {
  return (
    <>
      <Menu.Label>Ordering</Menu.Label>
      <SegmentedControl
        onChange={onChange}
        color="moss.5"
        data={[
          { label: "Total data found", value: FlagOrdering.TotalData },
          { label: "Data hierarchy", value: "", disabled: true },
          { label: "Taxonomy", value: FlagOrdering.Taxonomy },
        ]}
      />
    </>
  )
}


export default function FeatureToggleMenu() {
  let features = useFeatureFlag();

  const orderingChanged = (value: string) => {
    features.setFlag(["ordering"], value as FlagOrdering);
  };

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Menu shadow="md">
        <Menu.Target>
          <Button leftIcon={<Flag/>} />
        </Menu.Target>

        <Menu.Dropdown>
          <Ordering onChange={orderingChanged} />
        </Menu.Dropdown>
      </Menu>
    </Affix>
  );
}
