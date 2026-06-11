# WINTEMP AI Workbench

WINTEMP 品牌运营部内部使用的 AI 工作台。第一版提供 4 个 Agent，用于通过表单输入生成结构化 Prompt。

## First Release Agents

- 社媒运营数据分析 Agent
- 社媒内容策略与创意规划 Agent
- 安装步骤图生成 Agent
- 产品营销场景图生成 Agent

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS

## macOS 本地运行

1. 安装 Node.js 20 LTS 或更高版本。推荐直接从官网下载安装包：

```text
https://nodejs.org/
```

也可以使用 Homebrew：

```bash
brew install node
```

2. 打开 Terminal，进入项目目录：

```bash
cd "/Users/WINTEMP-Doris/Documents/温腾AI工作台/wintemp-ai-workbench"
```

3. 安装依赖：

```bash
npm install
```

4. 启动本地开发服务：

```bash
npm run dev
```

5. 在浏览器打开：

```text
http://localhost:3000
```

注意：不要输入 `www.localhost.com:3000`。本地开发地址必须是 `http://localhost:3000`。

## 接入 OpenAI API

项目已经内置服务端接口 `/api/generate`，用于调用 OpenAI Responses API。API Key 只放在本地环境变量中，不会暴露到浏览器。

1. 在项目根目录创建 `.env.local`：

```bash
cd "/Users/WINTEMP-Doris/Documents/温腾AI工作台/wintemp-ai-workbench"
cp .env.example .env.local
```

2. 打开 `.env.local`，把 `sk-your-api-key-here` 替换为你的 OpenAI API Key：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-5.5
```

3. 修改 `.env.local` 后，需要重启开发服务：

```bash
npm run dev
```

4. 页面中每个 Agent 都有两个主要按钮：

- `Generate Prompt`：只生成结构化 Prompt，不调用 AI。
- `Call AI`：生成 Prompt 并调用 OpenAI API，返回 AI 结果。

也可以直接双击项目里的 `start-macos.command`。如果系统提示没有权限，请在 Terminal 执行：

```bash
chmod +x "/Users/WINTEMP-Doris/Documents/温腾AI工作台/wintemp-ai-workbench/start-macos.command"
```

然后再双击它。

## 如果 localhost 打不开

- 先确认 Terminal 里已经执行了 `npm run dev`。
- `http://localhost:3000` 只有在开发服务运行时才会打开。
- 启动成功后，Terminal 通常会显示类似 `Local: http://localhost:3000` 的地址。
- 如果提示 `npm: command not found`，说明这台 Mac 还没有安装 Node.js/npm，安装 Node.js 后重新打开 Terminal 再执行命令。
- 如果 3000 端口被占用，Next.js 可能会提示使用 `http://localhost:3001`，以 Terminal 显示的地址为准。

## Current Scope

第一版只做表单输入和结构化 Prompt 输出，不连接 OpenAI API、真实平台后台或钉钉免登。
