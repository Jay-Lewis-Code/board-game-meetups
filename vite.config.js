import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  //base: '/~lewisj628/CS295R/board-game-meetups/', // adjust to the folder that contains index.html
  base: '/', // served from http://citweb.lanecc.edu:5028/  
  plugins: [
    react(),
    tailwindcss(),
  ],
})
