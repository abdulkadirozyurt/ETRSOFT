import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: "0.0.0.0",
    port: 5173,
  }
  ,
  environments: {
    production: {
      apiUrl: import.meta.env.VITE_PROD_API_URL,
    },
    development: {
      apiUrl: import.meta.env.VITE_DEV_API_URL,
    },
  }
})
