import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		// 文章顶部的交互图:src/figures/<figure>.html,由 figures/<figure>/build.mjs 生成。
		figure: z.string().optional(),
	}),
});

export const collections = { posts };
