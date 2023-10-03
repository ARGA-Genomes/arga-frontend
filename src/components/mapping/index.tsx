"use client";

import dynamic from "next/dynamic";

// Next.js renders components on build for SSR. We don't use that feature at all
// but it does break the build if we don't force dynamic loading of modules that
// use leaflet directly causing a cryptic "window is not defined" error.
// Where possible use these dynamic imports instead of loading the component
// straight from the module
export const ArgaMap = dynamic(() => import("./map"), { ssr: false });
export const PopupMarker = dynamic(() => import("./marker").then(mod => mod.PopupMarker), { ssr: false });
export const BioRegionLayers = dynamic(() => import("./bio-regions").then(mod => mod.BioRegionLayers), { ssr: false });
export const AnalysisMap = dynamic(() => import("./analysis-map"), { ssr: false });

export { SpecimensLayer } from "./specimens";
