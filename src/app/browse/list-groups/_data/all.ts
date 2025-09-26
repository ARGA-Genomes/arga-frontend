import { commercial } from "./commercial";
import { ecosystems } from "./ecosystems";
import { other } from "./other";
import { phenotypic } from "./phenotypic";
import { threatened } from "./threatened";

type GroupFilter = {
  name: string;
  value?: string | boolean | { [key: string]: string | boolean };
};

export interface GroupItem {
  category: string;
  image: string;
  source: string;
  disabled?: boolean;
  filter?: GroupFilter | GroupFilter[];
  display?: {
    subcategory?: string;
    order?: number;
  };
  href?: string;
}

const array: GroupItem[] = [...commercial, ...ecosystems, ...other, ...phenotypic, ...threatened];
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
          value: Array.isArray(filter) ? filter : [filter],
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
