import { commercial } from "./commercial";
import { ecosystems } from "./ecosystems";
import { iek } from "./iek";
import { other } from "./other";
import { phenotypic } from "./phenotypic";
import { threatened } from "./threatened";

export interface GroupItem {
  category: string;
  image: string;
  source: string;
  filter?: {
    name: string;
    value: string | boolean;
  };
}

const array: GroupItem[] = [...commercial, ...ecosystems, ...iek, ...other, ...phenotypic, ...threatened];
const map = array.reduce(
  (prev, group) => ({
    ...prev,
    [group.category.replaceAll("'", "")]: group,
  }),
  {}
);

const groupInclude = ({ filter }: GroupItem) =>
  filter
    ? [
        {
          filter: "ATTRIBUTE",
          action: "INCLUDE",
          value: [filter],
        },
      ]
    : [];

const groupExclude = ({ filter }: GroupItem) =>
  filter
    ? [
        {
          filter: "ATTRIBUTE",
          action: "EXCLUDE",
          value: [filter],
        },
      ]
    : [];

export { array, groupExclude, groupInclude, map };
