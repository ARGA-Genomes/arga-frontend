'use client';

import { CacheProvider } from '@emotion/react';
import { useEmotionCache, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';

import localFont from '@next/font/local'

// Serve the fonts ourselves in case blockers reject requests to google font
const workSans = localFont({ src: '../../public/fonts/WorkSans-VariableFont_wght.ttf' })
const gothamBook = localFont({ src: '../../public/fonts/gotham/GothamBook.ttf' })

// All global styles should be defined here as a theme override for mantine.
// This is used as a root theme provider element in the layout and applies
// to the entire app
const argaBrand: MantineThemeOverride = {
  colorScheme: 'light',

  colors: {
    midnight: ['#e7f4ff', '#c8dce9', '#a8c5d6', '#87aec5', '#6797b4', '#3A637C', '#2d4d5c', '#193d4d', '#15313f', '#001017'],
    shellfish: ['#e1f9f7', '#c6e6e3', '#a8d3cf', '#89c0bc', '#6aafa9', '#509590', '#3d7470', '#295450', '#133331', '#001411'],
    moss: ['#f0fae4', '#daeac4', '#c4daa3', '#aecb80', '#97bc5d', '#7da243', '#627e33', '#455a23', '#283612', '#0b1300'],
    bushfire: ['#ffeedd', '#ffd0b1', '#fbb284', '#f79554', '#f47625', '#da5d0b', '#af7a58', '#7a3303', '#4b1d00', '#1f0700'],
    wheat: ['#fff7dc', '#ffe8af', '#fed97f', '#fcc743', '#febb1e', '#e4a107', '#b27e01', '#7f5a00', '#4d3600', '#1c1200'],
  },

  fontFamily: workSans.style.fontFamily,
  fontFamilyMonospace: 'Monaco, Courier, monospace',

  headings: {
    fontFamily: gothamBook.style.fontFamily,
    sizes: {
      h1: { fontSize: 30 },
    },
  },

  globalStyles: (theme) => ({
    body: {
      ...theme.fn.fontStyles(),
      backgroundColor: theme.colors["midnight"][7],
    },

    a: {
      outline: "none",
      textDecoration: "none",
      color: theme.colors["bushfire"][6],
    }
  }),
};


// The caching root theme provider element.
export default function RootStyleRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  cache.compat = true;

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={argaBrand}>
        {children}
      </MantineProvider>
    </CacheProvider>
  );
}
