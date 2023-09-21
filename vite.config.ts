import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FE_MENTOR-interactive-comments-section/',
  resolve: {
    alias: {
      src: '/src',
    },
  }
})
