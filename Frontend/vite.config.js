import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5176, // Change the port here
    host: true, // Ensure the server is accessible on the network
  },
  plugins: [react()],
})
