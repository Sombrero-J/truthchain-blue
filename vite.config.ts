// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';

// export default defineConfig({
// 	plugins: [sveltekit()]
// });

import { defineConfig } from 'vite';
import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ command }) => {
	const isBuild = command === 'build';

	return {
		plugins: [sveltekit()],
		define: {
			global: {}
		},
		build: {
			target: 'esnext',
			commonjsOptions: {
				transformMixedEsModules: true
			}
		},
		resolve: {
			alias: {
				'@airgap/beacon-sdk': path.resolve(
					path.resolve(),
					`./node_modules/@airgap/beacon-sdk/dist/${isBuild ? 'esm' : 'cjs'}/index.js`
				),
				// polyfills
				'readable-stream': 'vite-compatible-readable-stream',
				stream: 'vite-compatible-readable-stream'
			}
		}
	};
});
