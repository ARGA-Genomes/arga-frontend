"use client";

import { createTheme, rem } from "@mantine/core";

import localFont from "next/font/local";

const workSans = localFont({
  src: "../public/fonts/WorkSans-VariableFont_wght.ttf",
});

const gothamBold = localFont({
  src: "../public/fonts/gotham/GothamBold.ttf",
});

export const theme = createTheme({
  colors: {
    // midnight: ['#e7f4ff', '#c8dce9', '#a8c5d6', '#87aec5', '#6797b4', '#486471', '#2d4d5c', '#193d4d', '#15313f', '#001017'],
    attribute: [
      "#f5f5f5",
      "#e5e5e5",
      "#d5d5d5",
      "#c5c5c5",
      "#b5b5b5",
      "#a5a5a5",
      "#959595",
      "#858585",
      "#757575",
      "#656565",
    ],

    // https://noeldelgado.github.io/shadowlord/#233c4b
    midnight: [
      "#e9eced",
      "#d3d8db",
      "#bdc5c9",
      "#a7b1b7",
      "#919ea5",
      "#7b8a93",
      "#657781",
      "#4f636f",
      "#39505d",
      "#2F4554",
      "#233c4b", // original midnight hex
      "#203644",
      "#1A3443",
      "#1c303c",
      "#192a35",
    ],

    // https://mantine.dev/colors-generator/?color=F47C2E
    bushfire: [
      "#fff1e2",
      "#ffe2cd",
      "#fcc39f",
      "#f8a36b",
      "#f58740",
      "#f37524",
      "#f46d13",
      "#d95b06",
      "#c14f01",
      "#a94200",
    ],

    // https://mantine.dev/colors-generator/?color=FEC743
    wheat: [
      "#fff9e0",
      "#fff1ca",
      "#ffe299",
      "#fed163",
      "#fec337",
      "#febb19",
      "#feb603",
      "#e3a000",
      "#c98e00",
      "#ae7900",
    ],

    // https://mantine.dev/colors-generator/?color=A2C36E
    moss: [
      "#f3fbe8",
      "#e8f2d8",
      "#d1e2b7",
      "#b9d291",
      "#a4c471",
      "#96bb5c",
      "#8fb750",
      "#7ba13f",
      "#6c8f36",
      "#5b7c29",
    ],

    // https://mantine.dev/colors-generator/?color=58A39D
    shellfish: [
      "#e7fbf8",
      "#dbefee",
      "#bcdcda",
      "#9bc9c5",
      "#7eb8b4",
      "#6baea8",
      "#5fa9a3",
      "#4e938e",
      "#40847f",
      "#2b736d",
    ],
  },

  fontFamily: workSans.style.fontFamily,

  headings: {
    fontFamily: gothamBold.style.fontFamily,
    // fontWeight: "550",

    sizes: {
      h1: { fontSize: rem(38) },
      h2: { fontSize: rem(30) },
      h3: { fontSize: rem(24) },
    },
  },
});
