export enum SortOrder {
  Ascending = "ASCENDING",
  Descending = "DESCENDING",
}

export interface Sorting<T> {
  sortable: T;
  order: SortOrder;
}

export function getEnumKeyByValue<T extends object>(enumObj: T, value: string): keyof T | undefined {
  const keys = Object.keys(enumObj) as Array<keyof T>;
  return keys.find((key) => enumObj[key] === value);
}
