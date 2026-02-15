import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Garante que process.env.API_KEY funcione no build do Vite
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})