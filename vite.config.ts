import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 使用相对路径 base，保证构建产物（dist）可直接部署到
// GitHub Pages / Cloudflare Pages，不会出现静态资源 404。
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
