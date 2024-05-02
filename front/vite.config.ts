import { fileURLToPath, URL } from 'node:url'
import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => ({
    plugins: [ vue(), ],
    root: path.resolve( __dirname, './src' ),
    server: {
        port: 3000,
        watch: {
            usePolling: true,
        }
    },
    optimizeDeps: {
        include: [ 'vue', 'vue-router', ]
    },
    resolve: {
        alias: {
            '@': fileURLToPath( new URL( './src', import.meta.url ) )
        }
    }
} ));
