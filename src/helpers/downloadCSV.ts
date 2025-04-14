// Import and initialize brotli-wasm
import brotliPromise from "brotli-wasm";

export const downloadCSV = async (base64: string) => {
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

  // Create a Blob from the CSV content.
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element for the download, set the URL and file name,
  // then trigger a programmatic click to start the download.
  const downloadLink = document.createElement("a");
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = `arga-species-${new Date().toLocaleString()}.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
