# 一歌会友 - 音乐社交平台

## 项目简介
一歌会友是一个专注于音乐爱好者的社交平台，让用户通过音乐建立联系，分享音乐作品，互动交流。平台支持音乐上传、社交互动、实时消息等功能，为音乐爱好者提供一个展示和交流的空间。

## 技术栈
- 前端：React 18 + TypeScript + Vite 6
- UI：TailwindCSS + Radix UI
- 状态管理：TanStack Query
- 路由：Wouter
- 表单处理：React Hook Form + Zod
- 国际化：i18next
- 构建工具：Vite
- 代码规范：ESLint + Prettier

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 本地开发
1. 克隆项目
```bash
git clone https://github.com/your-username/singing-social.git
cd singing-social
```

2. 安装依赖
```bash
npm install
```

3. 创建环境配置文件
```bash
cp .env.example .env
```
根据实际需求修改 `.env` 文件中的配置。

4. 启动开发服务器
```bash
npm run dev
```

5. 代码检查
```bash
npm run lint
npm run type-check
```

## 部署指南

### Vercel 部署（推荐）
1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 点击部署

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

### 部署检查清单
- [ ] 环境变量配置完整
- [ ] 构建测试通过
- [ ] 静态资源加载正常
- [ ] API 接口连接正常
- [ ] 性能测试通过
- [ ] 安全检查完成

## 功能特性
- 用户认证（登录/注册）
- 音乐作品上传和管理
- 社交互动（关注、点赞、评论）
- 实时消息通知
- 个人主页定制
- 多语言支持
- 响应式设计

## 配置说明
主要环境变量：
- `VITE_API_BASE_URL`: API服务器地址
- `VITE_APP_NAME`: 应用名称
- `VITE_ENABLE_SOCIAL_FEATURES`: 是否启用社交功能
- `VITE_ENABLE_MUSIC_UPLOAD`: 是否启用音乐上传
- `VITE_DEFAULT_LANGUAGE`: 默认语言设置
- `VITE_MAX_UPLOAD_SIZE`: 最大上传文件大小

## 开发规范
1. 代码风格遵循 ESLint 和 Prettier 配置
2. 组件采用函数式组件和 Hooks
3. 使用 TypeScript 类型定义
4. 遵循 Git Flow 工作流
5. 提交信息遵循 Conventional Commits 规范

## 性能优化
- 路由懒加载
- 图片懒加载
- 资源压缩
- 缓存策略
- 代码分割

## 安全措施
- XSS 防护
- CSRF 防护
- 输入验证
- 敏感数据加密
- 定期安全更新

## 维护指南
1. 定期更新依赖包
2. 监控错误日志
3. 备份重要数据
4. 性能监控
5. 用户反馈收集

## 技术支持
- 提交 Issue：https://github.com/your-username/singing-social/issues
- 邮件支持：support@example.com
- 文档中心：https://docs.example.com

## 许可证
MIT License

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
