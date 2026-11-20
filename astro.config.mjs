// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ryanho.cc.cd',
	markdown: {
		// 代码高亮跟随明暗:浅色用 github-light,暗色由 global.css 切到 --shiki-dark
		shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
	},
});
