import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Polyfill simples para o objeto process.env para evitar crash se acessado diretamente
      'process.env': {},
      // Substituição direta da chave específica
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  }
})