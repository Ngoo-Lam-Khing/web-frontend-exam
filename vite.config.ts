import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig({
  base: '/web-frontend-exam/',
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
