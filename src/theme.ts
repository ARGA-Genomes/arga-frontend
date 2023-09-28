'use client';

import { createTheme, rem } from '@mantine/core';

import localFont from 'next/font/local'

const workSans = localFont({ src: '../public/fonts/WorkSans-VariableFont_wght.ttf' })


export const theme = createTheme({
  colors: {
    midnight: ['#e7f4ff', '#c8dce9', '#a8c5d6', '#87aec5', '#6797b4', '#486471', '#2d4d5c', '#193d4d', '#15313f', '#001017'],
    shellfish: ['#e1f9f7', '#c6e6e3', '#a8d3cf', '#89c0bc', '#6aafa9', '#509590', '#3d7470', '#295450', '#133331', '#001411'],
    moss: ['#f0fae4', '#daeac4', '#c4daa3', '#aecb80', '#97bc5d', '#7da243', '#627e33', '#455a23', '#283612', '#0b1300'],
    bushfire: ['#ffeedd', '#ffd0b1', '#fbb284', '#f79554', '#f47625', '#da5d0b', '#af7a58', '#7a3303', '#4b1d00', '#1f0700'],
    wheat: ['#f3e6c4', '#ffe8af', '#fed97f', '#fcc743', '#febb1e', '#e4a107', '#b27e01', '#7f5a00', '#4d3600', '#1c1200'],
    attribute: ["#f5f5f5", "#e5e5e5", "#d5d5d5", "#c5c5c5", "#b5b5b5", "#a5a5a5", "#959595", "#858585", "#757575", "#656565"],
  },

  fontFamily: workSans.style.fontFamily,

  headings: {
    fontFamily: workSans.style.fontFamily,
    fontWeight: '550',

    sizes: {
      h1: { fontSize: rem(38) },
      h2: { fontSize: rem(30) },
      h3: { fontSize: rem(24) },
    },
  },
});
