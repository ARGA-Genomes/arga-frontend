import { Stack, Switch, Text } from "@mantine/core";
import { Filter } from "./common";


interface BushfireRecoveryFiltersProps {
  value?: string,
  onChange: (item: Filter | undefined) => void,
}

export function BushfireRecoveryFilters({ value, onChange }: BushfireRecoveryFiltersProps) {
  const changeFilter = (value: boolean) => {
    onChange({
      filter: "BUSHFIRE_RECOVERY",
      action: "INCLUDE",
      value: value ? "true" : "false",
      editable: true,
    })
  }

  return (
    <Stack>
    <Switch
      label={<Text fz="sm">Vulnerable to wildfire</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Interactive effects of fire and drought</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Fire-disease interactions</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">High fire severity</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Weed invasion</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Elevated winter temperatures or changed temperature regimes</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Fire sensitivity</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Post-fire erosion</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Cumulative exposure to high risks</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    <Switch
      label={<Text fz="sm">Other plausible threats or expert-driven nominations</Text>}
      onLabel="ON"
      offLabel="OFF"
      size="lg"
      checked={value == "true" ? true : false}
      onChange={ev => changeFilter(ev.currentTarget.checked)}
    />
    </Stack>
  )
}
