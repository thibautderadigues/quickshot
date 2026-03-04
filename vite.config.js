import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoWebp from './plugins/auto-webp.mjs'

export default defineConfig({
  plugins: [react(), autoWebp()],
})
