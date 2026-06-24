# WINTEMP AI Workbench 部署到钉钉使用说明

## 当前目标

让 WINTEMP 品牌运营部同事可以在钉钉里打开同一个 AI Workbench 网页，并使用 4 个 Agent。

推荐路径：

```text
本地项目 -> GitHub -> Vercel / 云服务器 -> HTTPS 网页地址 -> 钉钉内部应用入口
```

## 重要概念

### GitHub 是什么

GitHub 用来保存项目代码，方便后续备份、协作和部署。

不要把以下内容上传到 GitHub：

```text
.env.local
OPENAI_API_KEY
任何真实 API Key
```

本项目已经在 `.gitignore` 中忽略 `.env.local`。

### Vercel 或云服务器是什么

Next.js 项目需要部署到一个线上环境，生成一个 HTTPS 地址，例如：

```text
https://wintemp-ai-workbench.vercel.app
```

钉钉内部应用需要填写的就是这个 HTTPS 地址。

### 钉钉里打开网页的方式

钉钉本身不直接运行 Next.js 项目。钉钉通常只是提供一个入口，让同事在钉钉工作台里打开一个已经部署好的 H5 网页。

## 第一步：上传代码到 GitHub

在项目目录执行：

```bash
cd "/Users/WINTEMP-Doris/Documents/温腾AI工作台/wintemp-ai-workbench"
git init
git add .
git commit -m "Initial WINTEMP AI Workbench"
```

然后在 GitHub 新建一个 repository，例如：

```text
wintemp-ai-workbench
```

再按 GitHub 页面提示执行：

```bash
git remote add origin https://github.com/你的用户名/wintemp-ai-workbench.git
git branch -M main
git push -u origin main
```

## 第二步：部署到 Vercel

推荐先用 Vercel，因为它对 Next.js 最简单。

1. 打开：

```text
https://vercel.com/
```

2. 用 GitHub 登录。
3. 点击 `Add New Project`。
4. 选择 `wintemp-ai-workbench` 这个 GitHub 仓库。
5. Framework Preset 选择 `Next.js`。
6. 如果使用 OpenAI，在 Environment Variables 添加：

```text
AI_PROVIDER=openai
OPENAI_API_KEY=你的有额度 API Key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

如果使用魔芋 API，在 Environment Variables 添加：

```text
AI_PROVIDER=moyu
MOYU_API_KEY=你的魔芋 API Key
MOYU_MODEL=gpt-4o
MOYU_BASE_URL=https://www.moyu.info
MOYU_API_FORMAT=chat
MOYU_API_PATH=/pg/chat/completions
```

如果魔芋后台给你指定了其他模型名，把 `MOYU_MODEL` 改成后台可用的模型名。

如果要启用产品营销场景图 Agent 的直接出图功能，再添加：

```text
IMAGE_MODEL=jimeng_t2i_v31
IMAGE_BASE_URL=https://www.moyu.info
IMAGE_API_PATH=/pg/images/generations
```

如果魔芋后台的图片生成模型名不同，以后台“图片生成模型”列表里的模型名为准修改 `IMAGE_MODEL`。

如果部署服务器访问 OpenAI 也需要代理，再添加：

```text
OPENAI_PROXY_URL=你的代理地址
```

注意：Vercel 海外环境通常不需要 Clash 这种本机代理。

7. 点击 Deploy。
8. 部署完成后获得一个 HTTPS 地址。

## 第三步：在钉钉里创建内部应用入口

大致流程：

1. 打开钉钉开放平台：

```text
https://open.dingtalk.com/
```

2. 进入企业后台 / 开发者后台。
3. 创建企业内部应用。
4. 应用类型选择 H5 应用或网页应用入口。
5. 应用首页地址填写 Vercel 部署出来的 HTTPS 地址。
6. 设置可见范围，例如品牌运营部。
7. 发布到工作台。

完成后，同事可以在钉钉工作台里点击 WINTEMP AI Workbench 使用。

## 第一版权限建议

第一版可以先不做钉钉免登，只控制钉钉应用可见范围。

后续再增加：

- 钉钉免登
- 用户身份识别
- 部门权限
- 操作日志
- 每个同事的使用记录
- 上传文件解析
- Agent 调用次数统计

## API Key 安全要求

API Key 只能放在：

- 本地 `.env.local`
- Vercel Environment Variables
- 云服务器环境变量

不要放在：

- GitHub 代码
- README
- 钉钉聊天
- 前端页面

## 常见问题

### ChatGPT 会员能不能给同事共用？

不能。ChatGPT 会员和 OpenAI API 是两套体系。

同事使用这个网页时，消耗的是你配置在服务器环境变量里的 OpenAI API 额度。

### 同事需要自己有 OpenAI 账号吗？

第一版不需要。

因为网页后端统一使用服务器配置的 API Key。

### 钉钉能不能直接运行本地 localhost？

不能。

`localhost` 只能在你自己的电脑上打开。同事要使用，必须部署成 HTTPS 线上地址。

### 现在能不能先内部测试？

可以。

先部署到 Vercel，拿到 HTTPS 地址后发给同事测试。等确认稳定，再接入钉钉工作台。
