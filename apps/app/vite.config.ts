import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import { splashScreen } from 'vite-plugin-splash-screen'

import {
  AutoImportComponents,
  AutoImportScripts,
  IconNamesGenerator,
  ModalsGenerator,
  RouteNamesGenerator
} from './.config'

export default defineConfig({
  plugins: [
    vue(),
    splashScreen({
      logoSrc: 'images/logo.svg',
      loaderType: 'line',
      loaderBg: '#409eff',
      splashBg: '#09090b',
      minDurationMs: 250
    }),
    svgLoader(),
    tailwindcss(),
    AutoImportComponents(),
    AutoImportScripts(),
    IconNamesGenerator(),
    ModalsGenerator(),
    RouteNamesGenerator()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
