import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_ARGA_API_URL || "http://localhost:5000/api",
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
          JSON: "any",
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
    // Generate introspection data for development tools
    "src/generated/introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: true,
      },
    },
  },
};

export default config;
