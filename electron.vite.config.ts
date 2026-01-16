import { defineConfig } from 'electron-vite';
import swc from 'unplugin-swc';
import 'dotenv/config';

export default defineConfig({
    main: {
        plugins: [
            swc.vite({
                jsc: {
                    parser: { syntax: 'typescript', decorators: true },
                    transform: { legacyDecorator: true, decoratorMetadata: true }
                }
            })
        ]
    },
    preload: {},
    renderer: {}
});
