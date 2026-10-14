import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/domain/**', 'src/state/**', 'src/storage/**', 'src/export/**'],
      exclude: ['**/__tests__/**', 'src/domain/types.ts', 'src/state/context.tsx'],
      thresholds: {
        'src/domain/**': { statements: 90, branches: 80, functions: 90, lines: 90 },
        'src/state/**': { statements: 90, branches: 80, functions: 90, lines: 90 },
      },
    },
  },
})
