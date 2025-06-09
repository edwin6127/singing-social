import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    publicDir: 'public',
    assetsInclude: ['**/*.mp3'],
    server: {
        fs: {
            strict: false
        },
        middlewareMode: false
    }
});
