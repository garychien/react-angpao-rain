import {defineConfig, type PluginOption} from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import * as path from 'node:path';
import {visualizer} from 'rollup-plugin-visualizer';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        eslint(),
        react(),
        dts({
            insertTypesEntry: true,
            exclude: ['**/*.test.ts', '**/*.test.tsx'],
        }),
        visualizer() as PluginOption,
    ],
    css: {
        modules: {
            localsConvention: 'camelCase',
            scopeBehaviour: 'local',
            generateScopedName: 'angpao-rain__[local]',
        }
    },
    build: {
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: (format) => `react-angpao-rain.${format}.js`,
            cssFileName: 'index',
        },
        cssTarget: 'chrome61',
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'phaser'],
            output: {
                // The bundled game images live in their own chunk, loaded only when a game is mounted
                chunkFileNames: 'chunks/[name]-[hash].js',
            },
        },
    },
});
