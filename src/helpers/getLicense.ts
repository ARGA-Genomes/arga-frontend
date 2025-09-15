export interface License {
  key: string;
  name: string;
  url: string;
  icons: string[];
}

const LICENSES: Omit<License, "icons">[] = [
  {
    key: "cc-by-nc-nd",
    name: "(CC-BY-NC-ND)",
    url: "creativecommons.org/licenses/by-nc-nd/4.0",
  },
  {
    key: "cc-by-nc-sa",
    name: "(CC-BY-NC-SA)",
    url: "creativecommons.org/licenses/by-nc-sa/4.0",
  },
  {
    key: "cc-by-nc",
    name: "(CC-BY-NC)",
    url: "creativecommons.org/licenses/by-nc/4.0",
  },
  {
    key: "cc-by-nd",
    name: "(CC-BY-ND)",
    url: "creativecommons.org/licenses/by-nd/4.0",
  },
  {
    key: "cc-by-sa",
    name: "(CC-BY-SA)",
    url: "creativecommons.org/licenses/by-sa/4.0",
  },
  {
    key: "cc-by",
    name: "(CC-BY)",
    url: "creativecommons.org/licenses/by/4.0",
  },
  {
    key: "cc0",
    name: "(CC-ZERO)",
    url: "creativecommons.org/publicdomain/zero/1.0",
  },
  {
    key: "public domain mark",
    name: "Public Domain",
    url: "creativecommons.org/publicdomain/mark/1.0",
  },
  {
    key: "attribution-noncommercial 4.0 international",
    name: "(CC-BY-NC)",
    url: "creativecommons.org/licenses/by-nc/4.0",
  },
  {
    key: "attribution 4.0 international",
    name: "(CC-BY)",
    url: "creativecommons.org/licenses/by/4.0",
  },
];

export const getLicense = (license: string): License | null => {
  const found = LICENSES.find(
    (findLicense) => license.toLowerCase() === findLicense.key || license.includes(findLicense.url)
  );

  if (found) {
    const iconParts = found.url.split("/");
    return { ...found, url: `https://${found.url}`, icons: ["cc", ...iconParts[iconParts.length - 2].split("-")] };
  }

  return null;
};
