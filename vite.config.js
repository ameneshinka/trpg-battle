import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to repo name for GitHub Pages — update this to match your repo name
  // e.g. if repo is github.com/yourname/trpg-battle, set base: '/trpg-battle/'
  base: '/trpg-battle/',
})
