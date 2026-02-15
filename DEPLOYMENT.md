# 部署指南 / Deployment Guide

## 中文指南

### 快速开始

本应用已经配置好一键部署到 Cloudflare Workers 的所有必要文件。

### 方式 1: Cloudflare Dashboard 部署（最简单，推荐给新手）

#### 1. Fork 仓库
1. 点击本仓库右上角的 "Fork" 按钮
2. Fork 到你自己的 GitHub 账号下

#### 2. 注册/登录 Cloudflare
1. 访问 https://dash.cloudflare.com/
2. 如果没有账号，点击 "Sign Up" 免费注册
3. 登录你的 Cloudflare 账号

#### 3. 创建 D1 数据库
1. 在左侧菜单找到 **Workers & Pages**
2. 点击 **D1** 标签
3. 点击 **Create database** 按钮
4. 数据库名称输入：`tell_db`
5. 点击 **Create** 创建
6. **重要**：记下创建后显示的 **Database ID**（格式类似：`2d489408-c599-47f2-9094-45ba8077fb91`）

#### 4. 初始化数据库表结构
1. 在 D1 数据库详情页，点击 **Console** 标签
2. 复制仓库中 `schema.sql` 文件的全部内容
3. 粘贴到控制台中
4. 点击 **Execute** 执行，创建 `users` 和 `messages` 表

#### 5. 连接 GitHub 部署
1. 返回 **Workers & Pages** 主页
2. 点击 **Create application** 按钮
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**
5. 选择 **GitHub**，授权 Cloudflare 访问你的 GitHub
6. 在仓库列表中找到并选择你 Fork 的 `tell-box` 仓库
7. 点击 **Begin setup**

#### 6. 配置构建设置
由于这是一个 Worker 项目，不是 Pages 项目，我们需要使用 Workers 方式：

**正确方式：**
1. 返回 **Workers & Pages** 主页
2. 点击 **Create application** 
3. 选择 **Workers** 标签
4. 点击 **Create Worker**
5. 给 Worker 起个名字（例如：`tell-box` 或 `my-tell-box`）
6. 点击 **Deploy**

#### 7. 上传代码
1. 在 Worker 创建完成后，点击 **Quick edit**
2. 删除默认代码
3. 复制你仓库中的 `worker.js` 全部内容
4. 粘贴到编辑器中
5. 点击 **Save and Deploy**

#### 8. 绑定 D1 数据库
1. 点击上方的 **Settings** 标签
2. 在左侧找到 **Variables** 
3. 滚动到 **D1 Database Bindings** 部分
4. 点击 **Add binding** 按钮
5. 填写：
   - **Variable name**: `DB`（必须完全一致）
   - **D1 database**: 选择你之前创建的 `tell_db`
6. 点击 **Save**

#### 9. 完成！
1. 点击顶部的 **Worker name** 链接回到概览页
2. 你会看到类似 `https://your-worker.workers.dev` 的访问地址
3. 点击这个地址即可访问你部署的应用！

### 方式 2: Wrangler CLI 部署（适合开发者）

#### 前置要求
- 已安装 Node.js (v16.13.0 或更高版本)
- 有 Cloudflare 账号

#### 步骤

1. **克隆仓库**
```bash
git clone https://github.com/你的用户名/tell-box.git
cd tell-box
```

2. **安装 Wrangler**
```bash
npm install -g wrangler
# 或者使用本地安装
npm install
```

3. **登录 Cloudflare**
```bash
wrangler login
```
这会打开浏览器让你授权

4. **创建 D1 数据库**
```bash
wrangler d1 create tell_db
```

执行后会看到类似输出：
```
🌀 Creating database tell_db
✨ Success!
Add the following to your wrangler.toml:
[[d1_databases]]
binding = "DB"
database_name = "tell_db"
database_id = "2d489408-c599-47f2-9094-45ba8077fb91"
```

5. **更新 wrangler.toml**
编辑 `wrangler.toml` 文件，将 `database_id` 替换为上一步获得的实际 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "tell_db"
database_id = "2d489408-c599-47f2-9094-45ba8077fb91"  # 替换为你的实际 ID
```

6. **初始化数据库表结构**
```bash
wrangler d1 execute tell_db --file=./schema.sql
```

这会在数据库中创建 `users` 和 `messages` 表。

7. **部署到 Cloudflare**
```bash
wrangler deploy
```

8. **完成！**
部署成功后会显示你的 Worker 地址，类似：
```
Published tell-box (0.01 sec)
  https://tell-box.你的用户名.workers.dev
```

### 本地开发

如果你想在本地测试修改：

```bash
# 启动本地开发服务器
wrangler dev

# 或使用 npm 脚本
npm run dev
```

访问 `http://localhost:8787` 即可看到本地运行的应用。

**注意**：本地开发时，D1 数据库会使用本地模拟，数据不会同步到线上。

### 自定义域名

如果你想使用自己的域名：

1. 确保你的域名已经添加到 Cloudflare（使用 Cloudflare 作为 DNS）
2. 在 Worker 设置页面，找到 **Triggers** → **Custom Domains**
3. 点击 **Add Custom Domain**
4. 输入你的域名或子域名（例如：`tell.yourdomain.com`）
5. 等待 DNS 记录生效（通常几分钟）

### 更新应用

#### 使用 Dashboard 更新：
1. 复制新版本的 `worker.js` 代码
2. 在 Worker 页面点击 **Quick edit**
3. 粘贴新代码
4. 点击 **Save and Deploy**

#### 使用 Wrangler CLI 更新：
```bash
# 拉取最新代码
git pull

# 部署更新
wrangler deploy
```

---

## English Guide

### Quick Start

This application is pre-configured for one-click deployment to Cloudflare Workers.

### Method 1: Cloudflare Dashboard Deployment (Easiest, Recommended for Beginners)

#### 1. Fork the Repository
1. Click the "Fork" button in the top right
2. Fork to your own GitHub account

#### 2. Register/Login to Cloudflare
1. Visit https://dash.cloudflare.com/
2. Sign up for free if you don't have an account
3. Log in to your Cloudflare account

#### 3. Create D1 Database
1. Find **Workers & Pages** in the left menu
2. Click the **D1** tab
3. Click **Create database**
4. Name it: `tell_db`
5. Click **Create**
6. **Important**: Note down the **Database ID** (format: `2d489408-c599-47f2-9094-45ba8077fb91`)

#### 4. Initialize Database Schema
1. In the D1 database details page, click **Console** tab
2. Copy all content from `schema.sql` file in your repository
3. Paste into the console
4. Click **Execute** to create `users` and `messages` tables

#### 5. Create Worker
1. Go back to **Workers & Pages** home
2. Click **Create application**
3. Select **Workers** tab
4. Click **Create Worker**
5. Name your worker (e.g., `tell-box`)
6. Click **Deploy**

#### 6. Upload Code
1. After worker is created, click **Quick edit**
2. Delete default code
3. Copy all content from `worker.js` in your repository
4. Paste into the editor
5. Click **Save and Deploy**

#### 7. Bind D1 Database
1. Click **Settings** tab
2. Find **Variables** in the left sidebar
3. Scroll to **D1 Database Bindings**
4. Click **Add binding**
5. Fill in:
   - **Variable name**: `DB` (must be exact)
   - **D1 database**: Select your `tell_db` database
6. Click **Save**

#### 8. Done!
1. Click the **Worker name** link at the top to return to overview
2. You'll see an access URL like `https://your-worker.workers.dev`
3. Click it to access your deployed app!

### Method 2: Wrangler CLI Deployment (For Developers)

#### Prerequisites
- Node.js installed (v16.13.0 or higher)
- Cloudflare account

#### Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/tell-box.git
cd tell-box
```

2. **Install Wrangler**
```bash
npm install -g wrangler
# or install locally
npm install
```

3. **Login to Cloudflare**
```bash
wrangler login
```

4. **Create D1 Database**
```bash
wrangler d1 create tell_db
```

5. **Update wrangler.toml**
Edit `wrangler.toml` and update the `database_id` with your actual database ID.

6. **Initialize Database Schema**
```bash
wrangler d1 execute tell_db --file=./schema.sql
```

7. **Deploy**
```bash
wrangler deploy
```

### Local Development

```bash
# Start local dev server
wrangler dev

# or use npm script
npm run dev
```

Visit `http://localhost:8787`

### Custom Domain

1. Ensure your domain is added to Cloudflare
2. Go to Worker settings → **Triggers** → **Custom Domains**
3. Click **Add Custom Domain**
4. Enter your domain
5. Wait for DNS propagation

### Updating the App

**Via Dashboard:**
1. Copy new `worker.js` code
2. Click **Quick edit** in Worker page
3. Paste new code
4. Click **Save and Deploy**

**Via CLI:**
```bash
git pull
wrangler deploy
```

---

## 故障排除 / Troubleshooting

### 问题：访问 Worker 地址显示 "Error 1101"
**解决**：检查是否已正确绑定 D1 数据库，变量名必须是 `DB`

### 问题：无法发送或接收消息
**解决**：
1. 确认 D1 数据库已创建并绑定
2. 确认已执行 `schema.sql` 初始化数据库表结构
3. 检查浏览器控制台是否有错误
4. 确认 Worker 代码已正确部署

### 问题：Wrangler 命令找不到
**解决**：确保已全局安装 wrangler: `npm install -g wrangler`

### 问题：登录 Cloudflare 时出错
**解决**：尝试 `wrangler logout` 后重新 `wrangler login`

---

## 技术支持 / Support

- 文档问题: 在 GitHub 仓库提 Issue
- Cloudflare 平台问题: 访问 [Cloudflare 开发者文档](https://developers.cloudflare.com/workers/)
- Wrangler 问题: 查看 [Wrangler 文档](https://developers.cloudflare.com/workers/wrangler/)
