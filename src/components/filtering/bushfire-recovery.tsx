import { Stack, Switch, Text } from "@mantine/core";
import { Filter } from "./common";
import { useListState } from "@mantine/hooks";
import { ChangeEvent, useEffect } from "react";

enum FilterKind {
  VulnerableToWildfire = "VulnerableToWildfire",
  FireDroughtInteractions = "FireDroughtInteractions",
  FireDiseaseInteractions = "FireDiseaseInteractions",
  HighFireSeverity = "HighFireSeverity",
  WeedInvasion = "WeedInvasion",
  ChangedTemperatureRegimes = "ChangedTemperatureRegimes",
  FireSensitivity = "FireSensitivity",
  PostFireErosion = "PostFireErosion",
  PostFireHerbivoreImpact = "PostFireHerbivoreImpact",
  CumulativeHighRiskExposure = "CumulativeHighRiskExposure",
  OtherThreats = "OtherThreats",
}

interface BushfireRecoveryFiltersProps {
  filters: Filter[];
  onChange: (items: Filter[]) => void;
}

export function BushfireRecoveryFilters({ filters, onChange }: BushfireRecoveryFiltersProps) {
  const [items, handlers] = useListState<Filter>(filters);
  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const findFilter = (value: string) => {
    // return items.find(item => item.value === value) TODO: FIX
    return [];
  };

  const addFilter = (value: string) => {
    handlers.append({
      // hasData: value,
      editable: true,
    });
  };

  const removeFilter = (value: string) => {
    // const idx = items.findIndex(item => item.value === value);
    // handlers.remove(idx);
  };

  const filterChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.checked) addFilter(ev.currentTarget.value);
    else removeFilter(ev.currentTarget.value);
  };

  return (
    <Stack>
      <Switch
        label={<Text fz="sm">Vulnerable to wildfire</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.VulnerableToWildfire}
        checked={!!findFilter(FilterKind.VulnerableToWildfire)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Interactive effects of fire and drought</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.FireDroughtInteractions}
        checked={!!findFilter(FilterKind.FireDroughtInteractions)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Fire-disease interactions</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.FireDiseaseInteractions}
        checked={!!findFilter(FilterKind.FireDiseaseInteractions)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">High fire severity</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.HighFireSeverity}
        checked={!!findFilter(FilterKind.HighFireSeverity)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Weed invasion</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.WeedInvasion}
        checked={!!findFilter(FilterKind.WeedInvasion)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Elevated winter temperatures or changed temperature regimes</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.ChangedTemperatureRegimes}
        checked={!!findFilter(FilterKind.ChangedTemperatureRegimes)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Fire sensitivity</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.FireSensitivity}
        checked={!!findFilter(FilterKind.FireSensitivity)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Post-fire erosion</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.PostFireErosion}
        checked={!!findFilter(FilterKind.PostFireErosion)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Post-fire herbivore impact</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.PostFireHerbivoreImpact}
        checked={!!findFilter(FilterKind.PostFireHerbivoreImpact)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Cumulative exposure to high risks</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.CumulativeHighRiskExposure}
        checked={!!findFilter(FilterKind.CumulativeHighRiskExposure)}
        onChange={filterChanged}
      />
      <Switch
        label={<Text fz="sm">Other plausible threats or expert-driven nominations</Text>}
        onLabel="ON"
        offLabel="OFF"
        size="lg"
        value={FilterKind.OtherThreats}
        checked={!!findFilter(FilterKind.OtherThreats)}
        onChange={filterChanged}
      />
    </Stack>
  );
}
