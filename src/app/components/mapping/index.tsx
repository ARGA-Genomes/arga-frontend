"use client";

import dynamic from "next/dynamic";

export const Map = dynamic(() => import("./map"), {
    ssr: false,
    loading: () => <>Loading map...</>,
});


export { BioRegionLayers  } from "./bio-regions";
export { SpecimensLayer  } from "./specimens";
