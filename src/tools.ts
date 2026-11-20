// 工具清单:站内工具 = 加一行 + 在 src/pages/tools/ 下加一个页面;站外工具填 href 即可。
export const TOOLS: { slug: string; name: string; desc: string; href?: string }[] = [
	{
		slug: 'context-size',
		name: '指令文件体积估算',
		desc: '粘贴 AGENTS.md / CLAUDE.md,估算它每轮对话占用多少上下文。',
	},
	{
		slug: 'omni-tools',
		name: 'OmniTools 工具箱',
		desc: '图片、PDF、视频、JSON、文本等上百个在线小工具,在浏览器本地处理。开源项目 omni-tools 的自托管实例。',
		href: 'https://tools.ryanho.cc.cd/',
	},
];

export const toolHref = (t: (typeof TOOLS)[number]) => t.href ?? `/tools/${t.slug}/`;
