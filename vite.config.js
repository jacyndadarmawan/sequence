import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

let branch = '(no git)';
try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
  if (!branch) branch = '(detached)';
} catch {
  branch = '(no git)';
}

export default defineConfig({
  plugins: [react()],
  define: {
    __GIT_BRANCH__: JSON.stringify(branch),
    __APP_VERSION__: JSON.stringify('0.1.0'),
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
