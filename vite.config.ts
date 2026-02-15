import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    define: {
      // Polyfill simples para o objeto process.env para evitar crash se acessado diretamente
      'process.env': {},
    }
  }
})