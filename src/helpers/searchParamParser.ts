import { InputQueryAttribute, SEARCH_ATTRIBUTES_MAP } from "@/components/search";
import { createParser } from "nuqs";

function escapeToken(token: string): string {
  return token.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/\|/g, "\\|");
}

function unescapeToken(token: string): string {
  let result = "";
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === "\\" && i + 1 < token.length) {
      // skip the backslash, take next char literally
      result += token[++i];
    } else {
      result += ch;
    }
  }
  return result;
}

function serializeAttribute(attr: InputQueryAttribute): string {
  const flag = attr.include ? "INCLUDE" : "EXCLUDE";
  return [escapeToken(attr.field), escapeToken(attr.value), flag].join(":");
}

function parseAttributeString(str: string): InputQueryAttribute {
  const parts: string[] = [];
  let current = "";
  let splits = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "\\" && i + 1 < str.length) {
      // include both backslash and next char so unescapeToken can handle it
      current += ch + str[++i];
    } else if (ch === ":" && splits < 2) {
      parts.push(current);
      current = "";
      splits++;
    } else {
      current += ch;
    }
  }
  parts.push(current);

  if (parts.length !== 3) {
    throw new Error(`Invalid attribute string: expected 3 parts but got ${parts.length}`);
  }

  const field = unescapeToken(parts[0]);
  const value = unescapeToken(parts[1]);
  const flag = parts[2];
  if (flag !== "INCLUDE" && flag !== "EXCLUDE") {
    throw new Error(`Invalid include flag "${flag}", expected INCLUDE or EXCLUDE`);
  }

  return { ...SEARCH_ATTRIBUTES_MAP[field], field, value, include: flag === "INCLUDE" };
}

function splitUnescaped(str: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "\\" && i + 1 < str.length) {
      // preserve the escape so downstream parsing still sees it
      current += ch + str[++i];
    } else if (ch === delimiter) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export const parseAsAttribute = createParser<InputQueryAttribute[]>({
  parse(input) {
    if (input === "") return [];
    return splitUnescaped(input, ",").map(parseAttributeString);
  },
  serialize(attributes) {
    return attributes.map(serializeAttribute).join(",");
  },
});
