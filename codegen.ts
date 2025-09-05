import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenv } from "dotenv";

// Load environment variables from .env files
[".env.development", ".env.local", ".env"].forEach((path) => dotenv({ path }));

const schema = process.env.NEXT_PUBLIC_ARGA_API_URL || "https://staging.arga.org.au/api";
console.log("GraphQL CodeGen using schema URL:", schema);

const config: CodegenConfig = {
  schema,
  ignoreNoDocuments: true,
  generates: {
    // Generate TypeScript types from schema only
    "src/generated/types.ts": {
      plugins: ["typescript"],
      config: {
        // Generate more precise types
        exactOptionalPropertyTypes: true,
        // Use string enums for better type safety
        enumsAsTypes: true,
        // Generate scalars as types
        scalars: {
          DateTime: "string",
          Date: "string",
          JSON: "Record<string, unknown>",
          NaiveDate: "string",
          NaiveDateTime: "string",
          NaiveTime: "string",
          UUID: "string",
        },
        // Add helpful comments
        addDocBlocks: true,
        // Better naming
        namingConvention: {
          typeNames: "pascal-case#pascalCase",
          enumValues: "upper-case#upperCase",
        },
      },
    },
  },
};

export default config;
