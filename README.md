# 一歌会友 - 音乐社交平台

## 项目简介
一歌会友是一个专注于音乐爱好者的社交平台，让用户通过音乐建立联系，分享音乐作品，互动交流。

## 技术栈
- 前端：React + TypeScript + Vite
- UI：TailwindCSS + Radix UI
- 状态管理：TanStack Query
- 路由：Wouter
- 表单处理：React Hook Form + Zod

## 本地开发
1. 安装依赖
```bash
npm install
```

2. 创建环境配置文件
复制 `.env.example` 到 `.env`，并根据需要修改配置。

3. 启动开发服务器
```bash
npm run dev
```

## 部署指南

### Vercel 部署（推荐）
1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 手动部署
1. 构建项目
```bash
npm run build
```

2. 测试构建结果
```bash
npm run preview
```

3. 部署 `dist` 目录到你的服务器

## 功能特性
- 用户认证（登录/注册）
- 音乐作品上传
- 社交互动
- 实时消息
- 个人主页定制

## 配置说明
主要环境变量：
- `VITE_API_BASE_URL`: API服务器地址
- `VITE_APP_NAME`: 应用名称
- `VITE_ENABLE_SOCIAL_FEATURES`: 是否启用社交功能
- `VITE_ENABLE_MUSIC_UPLOAD`: 是否启用音乐上传

## 注意事项
1. 确保后端服务已正确配置并运行
2. 检查环境变量配置
3. 确保有足够的存储空间用于音乐文件
4. 定期备份数据

## 技术支持
如有问题，请提交 Issue 或联系技术支持团队。

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
