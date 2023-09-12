'use client';

import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider, MantineThemeOverride } from '@mantine/core';

import localFont from '@next/font/local'

// Serve the fonts ourselves in case blockers reject requests to google font
const workSans = localFont({ src: '../../public/fonts/WorkSans-VariableFont_wght.ttf' })
const gothamBook = localFont({ src: '../../public/fonts/gotham/GothamBook.ttf' })

// All global styles should be defined here as a theme override for mantine.
// This is used as a root theme provider element in the layout and applies
// to the entire app
export const argaBrand: MantineThemeOverride = {
  colorScheme: 'light',

  colors: {
    successGreen: ['#008000'],
    midnight: ['#e7f4ff', '#c8dce9', '#a8c5d6', '#87aec5', '#6797b4', '#486471', '#2d4d5c', '#193d4d', '#15313f', '#001017'],
    shellfish: ['#e1f9f7', '#c6e6e3', '#a8d3cf', '#89c0bc', '#6aafa9', '#509590', '#3d7470', '#295450', '#133331', '#001411'],
    moss: ['#f0fae4', '#daeac4', '#c4daa3', '#aecb80', '#97bc5d', '#7da243', '#627e33', '#455a23', '#283612', '#0b1300'],
    bushfire: ['#ffeedd', '#ffd0b1', '#fbb284', '#f79554', '#f47625', '#da5d0b', '#af7a58', '#7a3303', '#4b1d00', '#1f0700'],
    wheat: ['#f3e6c4', '#ffe8af', '#fed97f', '#fcc743', '#febb1e', '#e4a107', '#b27e01', '#7f5a00', '#4d3600', '#1c1200'],
    grey: ['#ffffff', '#f1f1f1', '#e4e4e4', '#d3d3d3', '#a8a8a8', '#939393', '#3f3f3f', '#000000' ]
  },

  fontFamily: workSans.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',

  headings: {
    fontFamily: gothamBook.style.fontFamily,
    sizes: {
      h1: { fontSize: 38, fontWeight: "bold" },
      h2: { fontSize: 30 },
    },
  },

  globalStyles: (theme) => ({
    a: {
      outline: "none",
      textDecoration: "none",
      color: theme.colors["bushfire"][6],

      "&:hover, &:focus": {
        textDecoration: "none",
      },
    },
    '.primary_button': {
      backgroundColor: "#3C6377 !important",
      border: "1px solid !important",
      borderColor: "#3C6377 !important",
      borderRadius: "8px !important",

      "&:hover, &:focus": {
        backgroundColor: "#233C4B !important",
      },

      span: {
        fontSize: "18px !important",
        color: "#ffffff !important",
        fontFamily: gothamBook.style.fontFamily,
        paddingTop: "10px"
      }
    },
    '.secondary_button': {
      backgroundColor: "#ffffff !important",
      border: "1px solid !important",
      borderColor: "#000000 !important",
      borderRadius: "8px !important",

      "&:hover, &:focus": {
        backgroundColor: "#EFEFEF !important",
      },

      span: {
        fontSize: "18px !important",
        color: "#000000 !important",
        fontFamily: gothamBook.style.fontFamily,
      }
    },
    '.mantine-Accordion-chevron	': {
      paddingTop: '20px',
      fill: '#C1C1C1',
      '&:hover': {
        fill: '#3c6377'
      },
    },
    '.mantine-Accordion-item': {
      minHeight: '100px',
      '&:hover': {
        '.mantine-Accordion-chevron': {
          fill: '#3c6377'
        }
      },
      '& .subspeciesAccordion': {
        display: 'none'
      },
      '&[data-active]': {
        '& .synonymClosed': {
          display: 'none'
        },
        '& .subspeciesAccordion': {
          display: 'block'
        },
        '& .synonymOpened': {
          display: 'block'
        },
      },
    },
    '.synonymOpened':{
      display: 'none'
    },

    // Mantine v5 does not have options to tweak next, and previous arrows, as well as individual buttons
    // Using CSS to individually modify the arrows. When we upgrade to V6, please remove this and use the built in pagination options instead
    '.mantine-Pagination-item': {
      border: "none !important",
      '&[data-active]': {
        color: 'black !important',
      },
      '&[disabled]': {
        opacity: '0.2 !important',
      },
      '&: first-of-type': {
        '& svg': {
          transform: 'rotate(180deg)',
          '& path': {
            d: 'path("")',//blank svg to override the default mantine arrow svg, then replace by the svg below
          },
          backgroundImage: 'url("search-icons/pagination-arrow.svg")',
        }
      },
      '&: last-of-type': {
        '& svg': {
          '& path': {
            d: 'path("")',//blank svg to override the default mantine arrow svg, then replace by the svg below
          },
          backgroundImage: 'url("search-icons/pagination-arrow.svg")',
        }
      },
    },
    '.mantine-Carousel-control': {
      backgroundColor: `${theme.colors["shellfish"][4]} !important`,
      border: 'none !important',
      color: 'white !important',
      marginLeft: '-80px',
      marginRight: '-80px',
      '& svg': {
        width:'32px',
        height: '32px',
      }
    }
  }),
};

export const argaBrandDark: MantineThemeOverride = {
  ...argaBrand,

  colors: {
    ...argaBrand.colors,
    link: ["#e7f4ff"],
    attribute: ["#f5f5f5", "#e5e5e5", "#d5d5d5", "#c5c5c5", "#b5b5b5", "#a5a5a5", "#959595", "#858585", "#757575", "#656565"],
  },

  globalStyles: (theme) => ({
    ...(argaBrand.globalStyles ? argaBrand.globalStyles(theme) : {}),

    body: {
      ...theme.fn.fontStyles(),
      backgroundColor: theme.colors["midnight"][7],
      color: "white",
    },

  }),
};

export const argaBrandLight: MantineThemeOverride = {
  ...argaBrand,

  colors: {
    ...argaBrand.colors,
    link: ["#3C6377"],
    attribute: ["#f5f5f5", "#e5e5e5", "#d5d5d5", "#c5c5c5", "#b5b5b5", "#a5a5a5", "#959595", "#858585", "#757575", "#656565"],
  },

  globalStyles: (theme) => ({
    ...(argaBrand.globalStyles ? argaBrand.globalStyles(theme) : {}),

    body: {
      ...theme.fn.fontStyles(),
      backgroundColor: "#f0f0f0",
    },

    a: {
      color: theme.colors["link"][0],
    },
  }),
};


// The caching root theme provider element.
export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  cache.compat = true;

  return (
    <CacheProvider value={cache}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={argaBrandDark}>
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
