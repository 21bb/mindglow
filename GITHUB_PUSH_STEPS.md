# 📤 推送到 GitHub 的步骤

## 快速步骤

### 1. 检查 Git 状态
```bash
git status
```

### 2. 如果还没有初始化 Git 仓库
```bash
# 初始化仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: MindGlow 专注与心灵空间应用"
```

### 3. 在 GitHub 上创建仓库
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `mindglow` (或你喜欢的名字)
   - Description: "沉浸专注与心灵空间应用"
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize with README"
4. 点击 "Create repository"

### 4. 连接本地仓库到 GitHub
```bash
# 替换 YOUR_USERNAME 和 REPO_NAME 为你的实际信息
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### 5. 推送代码
```bash
# 设置主分支
git branch -M main

# 推送到 GitHub
git push -u origin main
```

## 如果遇到认证问题

### 方法 1: 使用 Personal Access Token（推荐）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成后复制 token
5. 推送时，用户名用你的 GitHub 用户名，密码用 token

### 方法 2: 使用 GitHub CLI
```bash
# 安装 GitHub CLI 后
gh auth login
```

## 后续更新代码

以后修改代码后，使用以下命令更新：

```bash
# 查看更改
git status

# 添加更改的文件
git add .

# 提交更改
git commit -m "描述你的更改内容"

# 推送到 GitHub
git push
```

## ⚠️ 重要提示

- ✅ `.env.local` 文件已在 `.gitignore` 中，不会被提交
- ✅ `node_modules` 和 `dist` 文件夹也不会被提交
- ❌ **永远不要**提交包含真实 API Key 的文件

## 示例提交信息

```bash
git commit -m "修复 404 错误和 Tailwind CSS 警告"
git commit -m "添加 Tailwind CSS PostCSS 配置"
git commit -m "改进错误处理和降级方案"
```

