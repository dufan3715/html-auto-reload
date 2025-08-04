import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/vite.ts', 'src/webpack.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    outDir: 'dist/esm',
    outExtension({ format }) {
      return {
        js: '.mjs'
      }
    },
    external: ['vite', 'webpack']
  },
  {
    entry: ['src/index.ts', 'src/vite.ts', 'src/webpack.ts'],
    format: ['cjs'],
    dts: true,
    splitting: false,
    outDir: 'dist/cjs',
    outExtension({ format }) {
      return {
        js: '.cjs'
      }
    },
    external: ['vite', 'webpack']
  }
]) 