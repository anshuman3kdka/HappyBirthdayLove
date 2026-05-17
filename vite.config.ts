import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Custom plugin to discover assets in public/assets
      {
        name: 'asset-discovery-plugin',
        resolveId(id) {
          if (id === 'virtual:assets') return '\0' + 'virtual:assets';
        },
        load(id) {
          if (id === '\0' + 'virtual:assets') {
            const assetsBaseDir = path.resolve(__dirname, 'public/assets');
            const assets = [];
            function scanDir(dir, relativePath) {
              if (!fs.existsSync(dir)) return;
              fs.readdirSync(dir).forEach(file => {
                const fullPath = path.join(dir, file);
                const relPath = path.join(relativePath, file);
                if (fs.statSync(fullPath).isDirectory()) scanDir(fullPath, relPath);
                else if (!file.startsWith('.') && file !== '.keep') {
                  const ext = path.extname(file).toLowerCase();
                  let type = '';
                  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'].includes(ext)) type = 'image';
                  else if (['.mp4', '.webm', '.mov', '.m4v', '.ogg'].includes(ext)) type = 'video';
                  else if (['.mp3', '.wav', '.m4a'].includes(ext)) type = 'audio';
                  if (type) {
                    const basePath = relPath.replace(/\.[^/.]+$/, "");
                    assets.push({ fullPath: relPath, basePath, type });
                  }
                }
              });
            }
            scanDir(assetsBaseDir, '/assets');
            return `export const ALL_ASSETS = ${JSON.stringify(assets)};`;
          }
        }
      },
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp3,wav,mp4,webm,webp,avif,woff,woff2,ttf,glb,gltf}'],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
        },
        manifest: {
          name: 'Nemo',
          short_name: 'Nemo',
          description: 'A digital birthday experience.',
          theme_color: '#faf9f6',
          background_color: '#faf9f6',
          display: 'standalone',
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
