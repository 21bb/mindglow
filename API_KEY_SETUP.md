# API Key 设置指南

## 问题说明

如果看到以下错误：
```
ApiError: API key not valid. Please pass a valid API key.
```

说明需要设置 Gemini API Key。

## 解决步骤

### 1. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录你的 Google 账号
3. 点击 "Create API Key" 创建新的 API Key
4. 复制生成的 API Key

### 2. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```
GEMINI_API_KEY=你的API_KEY_在这里
```

**重要提示：**
- `.env.local` 文件不会被提交到 Git（已在 .gitignore 中）
- 不要将 API Key 分享给他人
- 如果 API Key 泄露，请立即在 Google AI Studio 中重新生成

### 3. 重启开发服务器

设置环境变量后，需要重启开发服务器：

1. 停止当前服务器（在终端按 `Ctrl+C`）
2. 重新运行 `npm run dev`

### 4. 验证设置

在浏览器中测试输入一个想法，如果不再出现 API key 错误，说明设置成功。

## 降级方案

如果没有设置 API Key，应用仍然可以工作，但会使用简单的关键词匹配进行分类，而不是 AI 智能分类。

## 常见问题

### Q: 为什么需要 API Key？
A: AI 分类功能需要调用 Google Gemini API，这需要有效的 API Key。

### Q: API Key 是免费的吗？
A: Google Gemini API 提供免费额度，对于个人使用通常足够。查看 [定价页面](https://ai.google.dev/pricing) 了解详情。

### Q: 如何检查 API Key 是否有效？
A: 在浏览器控制台（F12）中查看，如果没有 API key 错误，说明设置成功。

### Q: 可以不用 API Key 吗？
A: 可以，应用会使用简单的关键词匹配作为降级方案，但分类准确性会降低。

