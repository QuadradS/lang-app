import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";

export default defineConfig({
  base: '/lang-app',
  build: {
    outDir: 'dist',
  },
  plugins: [react(), tailwindcss()],
})
