import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/imf': {
        target: 'https://www.imf.org/external/datamapper/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/imf/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IMF-DataViewer/1.0)',
        }
      }
    }
  }
})
