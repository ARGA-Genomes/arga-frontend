import { commercial } from "./commercial";
import { ecosystems } from "./ecosystems";
import { iek } from "./iek";
import { other } from "./other";
import { phenotypic } from "./phenotypic";
import { threatened } from "./threatened";

const array = [...commercial, ...ecosystems, ...iek, ...other, ...phenotypic, ...threatened];
const map = array.reduce(
  (prev, group) => ({
    ...prev,
    [group.category.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")]: group,
  }),
  {}
);

export { array, map };
