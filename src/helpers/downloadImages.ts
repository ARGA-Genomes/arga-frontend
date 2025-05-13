import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadImages = async (name: string) => {
  const images = Array.from(document.querySelectorAll("[data-downloadname]")) as HTMLElement[];

  const canvases = await Promise.all(
    images.map((image) =>
      html2canvas(image, {
        onclone: (document) => {
          Array.from(document.querySelectorAll("*")).forEach((e) => {
            const existingStyle = e.getAttribute("style") || "";
            e.setAttribute("style", existingStyle + "; font-family: Helvetica, sans-serif !important");
          });
        },
      })
    )
  );

  const zip = new JSZip();

  await Promise.all(
    canvases.map(async (canvas, i) => {
      const blob: Blob = await new Promise((resolve) => canvas.toBlob((imageBlob) => resolve(imageBlob!)));
      const downloadName = images[i].dataset.downloadname?.toLocaleLowerCase().replaceAll(" ", "-");
      const fileName = `arga-${name}-${downloadName}.png`;

      zip.file(fileName, blob);
    })
  );

  const zipBlob: Blob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `arga-${name}-images-${new Date().toLocaleString()}.zip`);
};
