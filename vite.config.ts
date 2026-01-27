import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server:{
  //   host:'172.26.2.84',
  //   port:8000
  // }
})
