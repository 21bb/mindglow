# 🔧 快速修复指南

## 当前问题

你遇到的错误：
```
ApiError: API key not valid. Please pass a valid API key.
```

**原因**：`.env.local` 文件中的 API key 是占位符 `PLACEHOLDER_API_KEY`，不是真实的 API key。

## ✅ 解决方案

### 方法 1: 设置真实的 API Key（推荐）

1. **获取 Gemini API Key**
   - 访问：https://aistudio.google.com/app/apikey
   - 登录 Google 账号
   - 点击 "Create API Key" 创建新的 API Key
   - 复制生成的 API Key

2. **更新 .env.local 文件**
   
   打开项目根目录的 `.env.local` 文件，将：
   ```
   GEMINI_API_KEY=PLACEHOLDER_API_KEY
   ```
   
   替换为：
   ```
   GEMINI_API_KEY=你的真实API_KEY
   ```

3. **重启开发服务器**
   - 停止当前服务器（在终端按 `Ctrl+C`）
   - 重新运行 `npm run dev`

### 方法 2: 使用降级方案（无需 API Key）

如果暂时不想设置 API Key，应用已经添加了降级方案：

- ✅ 应用仍然可以正常工作
- ✅ 会使用简单的关键词匹配进行分类
- ⚠️ 分类准确性会降低，没有 AI 建议和书籍推荐

**注意**：第一次使用时可能会弹出提示，点击确定即可。

## 📝 验证修复

设置 API Key 后：

1. 刷新浏览器页面
2. 输入一个测试文本（如："总是想起面试搞砸的表现"）
3. 点击"释放"按钮
4. 检查浏览器控制台（F12），应该不再有 API key 错误

## 🎯 其他提示

### Tailwind CSS 警告
```
cdn.tailwindcss.com should not be used in production
```
这是开发环境的正常提示，**不影响功能**。在生产环境构建时会自动处理。

### React DevTools 提示
```
Download the React DevTools for a better development experience
```
这是开发提示，**不影响功能**。可以安装 React DevTools 浏览器扩展来获得更好的开发体验。

## 🆘 仍然有问题？

如果设置 API Key 后仍然报错：

1. 确认 `.env.local` 文件在项目根目录
2. 确认 API Key 格式正确（没有多余空格）
3. 确认已重启开发服务器
4. 检查浏览器控制台的完整错误信息

更多帮助请查看 `API_KEY_SETUP.md`

