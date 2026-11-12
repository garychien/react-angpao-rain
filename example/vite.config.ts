import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        fs: {
            // the package is linked from the parent folder (`link:..`)
            allow: ['..'],
        },
    },
    build: {
        sourcemap: true,
    },
});
