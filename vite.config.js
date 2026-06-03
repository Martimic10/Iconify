import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteApiPlugin } from './scripts/vite-api-plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteApiPlugin(mode)],
}))
