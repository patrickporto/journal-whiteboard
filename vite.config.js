import { resolve } from 'path'
import { defineConfig } from 'vite'
import pkg from "./package.json"

export default defineConfig({
    root: 'src/',
    publicDir: resolve(__dirname, 'public'),
    base: `/modules/${pkg.name}/`,
    server: {
      port: 30001,
      open: '/game',
      proxy: {
        [`^(?!/modules/${pkg.name}/)`]: 'http://localhost:30000',
        '/socket.io': {
          target: 'ws://localhost:30000',
          ws: true,
        },
      }
    },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: './main.ts',
      name: pkg.name,
      formats: ['es'],
      fileName: pkg.name,
    },
    rollupOptions: {
      output: {
        assetFileNames: `${pkg.name}.[ext]`,
      },
    },
  },
})

