import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { configDefaults, defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      app: path.resolve(rootDir, 'app'),
      components: path.resolve(rootDir, 'components'),
      lib: path.resolve(rootDir, 'lib'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    exclude: [...configDefaults.exclude, '.next/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
