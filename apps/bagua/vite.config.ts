import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署在主站 https://ryanho.cc.cd/bagua/ 下;字体等共享资源直接引用站点根路径 /fonts/。
export default defineConfig({
  base: '/bagua/',
  plugins: [react()],
});
