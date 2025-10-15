// Import and initialize brotli-wasm
import { ApolloClient } from "@apollo/client";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import get from "lodash-es/get";

export const generateCSV = async (base64: string) => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    throw new Error("generateCSV can only be executed on the client side");
  }

  // Dynamic import to ensure client-side only execution
  const brotliPromise = (await import("brotli-wasm")).default;
  const brotli = await brotliPromise;

  // Convert the Base64 string into a binary array
  const binaryString = atob(base64);
  const compressedData = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    compressedData[i] = binaryString.charCodeAt(i);
  }

  // The decompress function returns a Uint8Array of the decompressed bytes.
  const decompressedData = await brotli.decompress(compressedData);
  const csvContent = new TextDecoder("utf-8").decode(decompressedData);

  return csvContent;
};

export const downloadCSV = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: () => Promise<ApolloClient.QueryResult<unknown>>,
  name: string,
  fields: { key: string; name: string }[],
) => {
  const { data: raw } = await fetch();

  // Generate the content for all of the CSV files
  const csvFiles = await Promise.all(
    fields.map(({ key }) => generateCSV(get(raw, key))),
  );

  // Create a ZIP archive and add CSV files
  const zip = new JSZip();
  fields.forEach(({ name: fileName }, idx) => {
    zip.file(`arga-${name}-${fileName}.csv`, csvFiles[idx]);
  });

  // Generate the ZIP and trigger download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `arga-${name}-raw-data-${new Date().toLocaleString()}.zip`);
};
