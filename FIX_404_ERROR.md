# 🔧 修复 index.tsx 404 错误

## 问题
```
index.tsx:1 Failed to load resource: the server responded with a status of 404
```

## 解决方案

### 方法 1: 重启开发服务器（最常见）

1. **停止当前服务器**
   - 在运行 `npm run dev` 的终端窗口按 `Ctrl + C`

2. **重新启动服务器**
   ```bash
   npm run dev
   ```

3. **刷新浏览器**
   - 按 `F5` 或 `Ctrl + R` 刷新页面
   - 或者按 `Ctrl + Shift + R` 强制刷新（清除缓存）

### 方法 2: 清除缓存并重启

```bash
# 停止服务器 (Ctrl+C)

# 清除 node_modules/.vite 缓存
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# 重新启动
npm run dev
```

### 方法 3: 检查文件路径

确认 `index.tsx` 文件在项目根目录：
```bash
# 检查文件是否存在
Test-Path index.tsx
# 应该返回 True
```

### 方法 4: 检查 Vite 配置

确认 `vite.config.ts` 中 React 插件已正确配置：
```typescript
plugins: [react()],
```

### 方法 5: 完全重新安装依赖

如果以上方法都不行：

```bash
# 停止服务器 (Ctrl+C)

# 删除 node_modules 和锁文件
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 重新安装
npm install

# 重新启动
npm run dev
```

## 验证修复

修复后，检查浏览器控制台（F12）：
- ✅ 不应该再有 404 错误
- ✅ 页面应该正常加载
- ✅ React 应用应该正常渲染

## 常见原因

1. **开发服务器未运行** - 最常见
2. **服务器需要重启** - 修改配置后需要重启
3. **浏览器缓存** - 需要强制刷新
4. **文件路径错误** - 确认文件在正确位置

## 如果仍然有问题

检查：
1. 终端是否有错误信息
2. 浏览器控制台的完整错误信息
3. 确认端口 3000 没有被其他程序占用

