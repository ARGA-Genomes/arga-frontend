export interface License {
  name: string;
  url: string;
  icons: string[];
}

const BASE_LICENSES: Record<string, Omit<License, "icons">> = {
  "cc-by-nc-nd": {
    name: "(CC-BY-NC-ND)",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0",
  },
  "cc-by-nc-sa": {
    name: "(CC-BY-NC-SA)",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0",
  },
  "cc-by-nc": {
    name: "(CC-BY-NC)",
    url: "http://creativecommons.org/licenses/by-nc/4.0",
  },
  "cc-by-nd": {
    name: "(CC-BY-ND)",
    url: "http://creativecommons.org/licenses/by-nd/4.0",
  },
  "cc-by-sa": {
    name: "(CC-BY-SA)",
    url: "http://creativecommons.org/licenses/by-sa/4.0",
  },
  "cc-by": {
    name: "(CC-BY)",
    url: "http://creativecommons.org/licenses/by/4.0",
  },
  cc0: {
    name: "(CC0)",
    url: "http://creativecommons.org/publicdomain/zero/1.0",
  },

  "public domain mark": {
    name: "Public Domain",
    url: "http://creativecommons.org/publicdomain/mark/1.0/",
  },
  "attribution-noncommercial 4.0 international": {
    name: "(CC-BY-NC)",
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
  },
  "attribution 4.0 international": {
    name: "(CC-BY)",
    url: "https://creativecommons.org/licenses/by/4.0/",
  },
};

const URL_LICENSES: Record<string, Omit<License, "icons">> = {
  "http://creativecommons.org/licenses/by-nc-sa/4.0/": {
    name: "(CC-BY-NC-SA)",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  "http://creativecommons.org/licenses/by-nc/4.0/": {
    name: "(CC-BY-NC)",
    url: "http://creativecommons.org/licenses/by-nc/4.0/",
  },
  "http://creativecommons.org/licenses/by/4.0/": {
    name: "(CC-BY)",
    url: "http://creativecommons.org/licenses/by/4.0/",
  },
  "http://creativecommons.org/licenses/by-nc-nd/4.0/": {
    name: "(CC-BY-NC-ND)",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0/",
  },

  "https://creativecommons.org/licenses/by-nc-sa/4.0/": {
    name: "(CC-BY-NC-SA)",
    url: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  "https://creativecommons.org/licenses/by-nc/4.0/": {
    name: "(CC-BY-NC)",
    url: "http://creativecommons.org/licenses/by-nc/4.0/",
  },
  "https://creativecommons.org/licenses/by/4.0/": {
    name: "(CC-BY)",
    url: "http://creativecommons.org/licenses/by/4.0/",
  },
  "https://creativecommons.org/licenses/by-nc-nd/4.0/": {
    name: "(CC-BY-NC-ND)",
    url: "http://creativecommons.org/licenses/by-nc-nd/4.0/",
  },

  "public domain mark": {
    name: "Public Domain",
    url: "http://creativecommons.org/publicdomain/mark/1.0/",
  },
  "attribution-noncommercial 4.0 international": {
    name: "(CC-BY-NC)",
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
  },
  "attribution 4.0 international": {
    name: "(CC-BY)",
    url: "https://creativecommons.org/licenses/by/4.0/",
  },
};

const LICENSES = { ...BASE_LICENSES, ...URL_LICENSES };

export const getLicense = (license: string): License | null => {
  const found = LICENSES[license];

  if (found) {
    const parts = found.url.split("/");
    const icons = parts[parts.length - 3].split("-");

    return { ...found, icons: ["cc", ...icons] };
  }

  return null;
};
