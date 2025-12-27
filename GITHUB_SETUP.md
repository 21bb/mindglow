# 📤 将项目推送到 GitHub 指南

## 前置准备

### 1. 安装 Git

如果系统提示 `git` 命令未找到，需要先安装 Git：

**Windows:**
- 下载：https://git-scm.com/download/win
- 安装后重启终端/PowerShell

**验证安装:**
```bash
git --version
```

### 2. 配置 Git（首次使用）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 📋 推送步骤

### 步骤 1: 检查项目状态

```bash
# 检查是否已有 git 仓库
git status
```

### 步骤 2: 初始化 Git 仓库（如果还没有）

如果项目还没有初始化 Git：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: MindGlow 专注与心灵空间应用"
```

### 步骤 3: 确保敏感文件不被提交

检查 `.gitignore` 文件，确保包含：
- `.env.local` (包含 API Key)
- `node_modules/`
- `dist/`
- 其他临时文件

**重要**: 永远不要提交包含真实 API Key 的 `.env.local` 文件！

### 步骤 4: 在 GitHub 上创建仓库

1. 登录 GitHub: https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `mindglow` (或你喜欢的名字)
   - Description: "沉浸专注与心灵空间 - 一个帮助管理思绪和专注的应用"
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize with README"（因为本地已有代码）
4. 点击 "Create repository"

### 步骤 5: 连接本地仓库到 GitHub

GitHub 创建仓库后会显示命令，类似这样：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 或者使用 SSH（如果已配置 SSH key）
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

### 步骤 6: 推送代码

```bash
# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

如果遇到认证问题，可能需要：
- 使用 Personal Access Token（推荐）
- 或配置 SSH key

## 🔐 GitHub 认证设置

### 方法 1: Personal Access Token（推荐）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 设置权限：至少勾选 `repo`
4. 生成后复制 token
5. 推送时使用 token 作为密码

### 方法 2: SSH Key

```bash
# 生成 SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 添加到 GitHub: Settings → SSH and GPG keys → New SSH key
```

## 📝 更新项目到 GitHub

以后更新代码时：

```bash
# 查看更改
git status

# 添加更改的文件
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push
```

## ⚠️ 重要提示

### 不要提交的文件

确保以下文件在 `.gitignore` 中：
- `.env.local` - 包含 API Key
- `node_modules/` - 依赖包
- `dist/` - 构建输出
- 临时文件和日志

### 如果误提交了敏感信息

如果已经提交了 `.env.local`：

```bash
# 从 Git 历史中移除（但保留本地文件）
git rm --cached .env.local
git commit -m "Remove .env.local from repository"

# 如果已经推送到 GitHub，需要强制推送
git push --force
```

**注意**: 如果 API Key 已经泄露，请立即在 Google AI Studio 中重新生成新的 API Key！

## 🎯 快速命令参考

```bash
# 初始化仓库
git init
git add .
git commit -m "Initial commit"

# 连接 GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送
git branch -M main
git push -u origin main

# 后续更新
git add .
git commit -m "Update: 描述更改"
git push
```

## 📚 有用的 Git 命令

```bash
# 查看状态
git status

# 查看更改内容
git diff

# 查看提交历史
git log

# 撤销未提交的更改
git restore <file>

# 查看远程仓库
git remote -v
```

## 🆘 常见问题

### Q: 推送时提示认证失败？
A: 使用 Personal Access Token 或配置 SSH key

### Q: 如何更新 README？
A: 编辑 README.md 后提交并推送

### Q: 如何添加项目描述和标签？
A: 在 GitHub 仓库页面点击 ⚙️ Settings → 编辑描述和主题

### Q: 如何设置开源许可证？
A: 在 GitHub 仓库页面点击 ⚙️ Settings → 添加 LICENSE 文件

