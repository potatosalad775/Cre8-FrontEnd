import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //mkcert({certFileName: './localhost.pem', keyFileName: './localhost-key.pem'})
  ],
  server: {
    https: true,
    port: 3000,
  }
})
