// 站点级常量:改名、换描述只动这里。
export const SITE = {
	name: 'Agent Notes',
	tagline: 'AI 编程 agent 的工作流、配置与小工具',
	description: '记录 Claude Code、Codex 等编程 agent 的实际用法:工作流、配置和顺手的小工具。',
};

export const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
