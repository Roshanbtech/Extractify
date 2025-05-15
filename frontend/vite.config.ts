import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.min.js': '/node_modules/pdfjs-dist/build/pdf.worker.min.js'
    }
  },  
  plugins: [react(), tailwindcss()],
})