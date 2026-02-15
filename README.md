# tell-box

一个基于 Cloudflare Workers 的匿名加密消息应用，支持端到端加密的悄悄话功能。

## 🚀 一键部署到 Cloudflare Workers

### 方法一：通过 Cloudflare Dashboard 部署（推荐）

1. **Fork 这个仓库**
   - 点击页面右上角的 "Fork" 按钮
   - 将仓库 Fork 到你自己的 GitHub 账号

2. **登录 Cloudflare**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 登录你的账号（没有账号的话免费注册一个）

3. **创建 KV 命名空间**
   - 进入左侧菜单：**Workers & Pages** → **KV**
   - 点击 **Create namespace**
   - 命名空间名称输入：`TELL_DB`
   - 创建完成后，记下生成的 **Namespace ID**（类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

4. **部署 Worker**
   - 返回 **Workers & Pages** 页面
   - 点击 **Create application** → **Create Worker**
   - 或者点击 **Connect to Git** (连接 Git)
   - 选择你 Fork 的 `tell-box` 仓库
   - Cloudflare 会自动检测到 `wrangler.toml` 配置

5. **配置 KV 绑定**
   - 在 Worker 设置页面，找到 **Settings** → **Variables**
   - 在 **KV Namespace Bindings** 部分
   - 添加绑定：
     - Variable name: `TELL_DB`
     - KV namespace: 选择刚才创建的 `TELL_DB`
   - 保存配置

6. **部署完成**
   - 点击 **Save and Deploy**
   - 你会获得一个 `*.workers.dev` 域名
   - 访问这个域名即可使用应用

### 方法二：使用 Wrangler CLI 部署

如果你熟悉命令行，可以使用 Wrangler CLI 进行部署：

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 创建 KV 命名空间
wrangler kv:namespace create "TELL_DB"

# 4. 复制返回的 ID，更新 wrangler.toml 中的 id = "placeholder"

# 5. 部署
wrangler deploy
```

## 📝 后续开发和更新

### 通过 GitHub 自动部署

配置完成后，每次你推送代码到 GitHub 仓库，Cloudflare 会自动检测更新并重新部署。

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/tell-box.git
cd tell-box

# 2. 本地运行（需要先安装 Wrangler）
wrangler dev

# 3. 修改 worker.js 进行开发
# 保存后会自动热重载
```

### 自定义域名

1. 在 Cloudflare Dashboard 中，进入你的 Worker
2. 点击 **Settings** → **Triggers** → **Add Custom Domain**
3. 输入你的域名（需要已经添加到 Cloudflare）
4. 等待 DNS 生效

## 🔧 配置说明

### wrangler.toml

核心配置文件，包含以下设置：

- `name`: Worker 名称
- `main`: 入口文件（worker.js）
- `compatibility_date`: 兼容性日期
- `kv_namespaces`: KV 存储绑定配置

### KV 存储

应用使用 Cloudflare KV 存储：

- `pubkey:{id}` - 用户公钥
- `profile:{id}` - 用户资料（昵称、头像）
- `msg:{addr}:{timestamp}_{random}` - 加密消息（7天自动过期）

## 🌟 功能特性

- ✅ 端到端加密通信
- ✅ 完全匿名发送
- ✅ 自动生成分享二维码
- ✅ 暗黑模式支持
- ✅ 移动端适配
- ✅ 无需数据库，基于 Cloudflare KV
- ✅ 全球 CDN 加速

## 📄 技术栈

- Cloudflare Workers - 无服务器计算平台
- Cloudflare KV - 键值存储
- Web Crypto API - 端到端加密
- Tailwind CSS - 样式框架
- QRCode.js - 二维码生成

## 📮 API 接口

- `POST /api/register` - 注册用户（保存公钥和资料）
- `GET /api/resolve?id=xxx` - 解析用户资料
- `POST /api/send` - 发送加密消息
- `GET /api/inbox?addr=xxx` - 获取收件箱

## 📜 开源协议

MIT License

---

## English

An anonymous encrypted messaging app based on Cloudflare Workers, supporting end-to-end encrypted whispers.

## 🚀 One-Click Deployment to Cloudflare Workers

### Method 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Fork this repository**
2. **Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)**
3. **Create KV namespace**
   - Go to **Workers & Pages** → **KV**
   - Click **Create namespace**, name it `TELL_DB`
4. **Deploy Worker**
   - Go to **Workers & Pages** → **Create application**
   - Choose **Connect to Git** and select your forked repository
5. **Configure KV binding**
   - In Worker settings → **Variables** → **KV Namespace Bindings**
   - Add binding: Variable name `TELL_DB`, select the namespace you created
6. **Deploy**

### Method 2: Deploy with Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Create KV namespace
wrangler kv:namespace create "TELL_DB"

# Update the ID in wrangler.toml

# Deploy
wrangler deploy
```

## 📝 Development

```bash
# Local development
wrangler dev

# Deploy after changes
wrangler deploy
```