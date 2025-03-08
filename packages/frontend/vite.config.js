import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import optimizeTabler from './vite-plugin-optimize-tabler';

const apiurl = process.env.ASK_API_URL
	? process.env.ASK_API_URL
	: `http://localhost:3579/`;

export default defineConfig({
	plugins: [sveltekit(), optimizeTabler()],
	server: {
		proxy: {
			'/api': {
				target: apiurl,
				changeOrigin: true
			},
			'/static/custom.css': {
				target: apiurl,
				changeOrigin: true
			}
		}
	},
	css: {
		preprocessorOptions: {}
	}
});
