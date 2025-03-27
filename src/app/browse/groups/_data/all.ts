import { commercial } from "./commercial";
import { ecosystems } from "./ecosystems";
import { iek } from "./iek";
import { other } from "./other";
import { phenotypic } from "./phenotypic";
import { threatened } from "./threatened";

interface GroupItem {
  category: string;
  image: string;
  source: string;
  filter?: {
    name: string;
    value: {
      string: string;
    };
  };
}

const array: GroupItem[] = [...commercial, ...ecosystems, ...iek, ...other, ...phenotypic, ...threatened];
const map = array.reduce(
  (prev, group) => ({
    ...prev,
    [group.category.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")]: group,
  }),
  {}
);

export { array, map };
