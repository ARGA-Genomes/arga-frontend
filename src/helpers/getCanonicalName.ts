interface Params {
  name: string;
}

export const getCanonicalName = ({ name }: Params) => {
  return decodeURIComponent(name).replaceAll("_", " ");
};
