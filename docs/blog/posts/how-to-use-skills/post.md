---
date: 2026-8-12 12:56
title: 让 Agent 帮你使用和参与建设 BYR Docs
category: 介绍
author: Rikka

---

BYR Docs Skills 是面向 Agent 的资料服务与内容协作入口。它不仅可以帮助用户搜索、筛选和下载资料，也可以处理文件上传、元信息整理、维基真题录入以及后续的 GitHub 贡献流程。

---

<PostDetail>

## 前言

过去，[在 BYR Docs 上整理一份资料](https://blog.byrdocs.org/blog/posts/how-to-organize-test/post.html)需要检查文件、查重、上传、填写 YAML、Fork、创建 PR，似乎很多潜在贡献者都被这个流程有点吓退了，只好发送给已经对流程比较熟悉的贡献者来录入、贡献；[录入和编辑试题维基](https://blog.byrdocs.org/blog/posts/how-to-contribute-to-neowiki/post)，需要准备各种 Node 环境、用不太熟悉的自定义组件编写不太熟悉的 MDX；而且几乎所有贡献流程基于 GitHub，使得有些不熟悉相关工作流程的贡献者望而却步。

在期末复习中，我有时候也会让 Agent 通过本地的试题文件帮助我拟合往年题给出复习方案，但我仍然需要手动检索 BYR Docs 上面的试题，并逐个手动下载丢在文件夹里，而因为登录、搜索接口等问题无法让 Agent 代劳。

我们新带来的 Skills 和 CLI 就是用来解决这些问题的。你可以直接描述“找什么”“下载到哪里”“把哪份试卷贡献到哪里”“修改试题维基的哪个地方”。Agent 负责自动读取当前最新的规则、拆解流程、自行执行，结束之后检查和向你汇报结果，减少了过去繁琐、可能难理解的手工步骤。

下面我会展示几个典型的使用例，介绍如何在你的 Agent 上安装使用[新的 BYR Docs Skills](https://github.com/byrdocs/byrdocs-cli-envolved)。

## 安装

### 前置需求

- 你常用的 Agent 客户端，以及配置好的提供商（provider），能正常进行对话。下文以大家比较喜欢的 [Claude Code](https://claude.com/product/claude-code) CLI [配合 DeepSeek-V4-Pro](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code/) 为例。
- [Node.js](https://nodejs.org) 环境，用于安装 BYR Docs CLI 和运行 Skills 安装脚本。如果你安装过了 Agent CLI，那么你大概率是有的。
- 如果需要贡献，那么需要参照前言中的贡献指引链接进行对应的配置。你也可以让 Agent 代劳，贡献 Skills 运行的时候也会帮你进行检查和指引安装。

### 安装 BYR Docs Skills

很多其他的 Skills 安装教程会指引你直接发链接给 Agent 进行安装，本 Skills 也不例外，你当然也可以直接告诉你的 Agent：`帮我安装 https://github.com/byrdocs/byrdocs-cli-envolved 这个 Skills` 进行安装。

不过为了避免 Agent 误解以及消耗额外的 token，如果你有 npm，可以更“传统”地输入下面的免费命令进入交互式安装界面[^1]，下文展示这种相对可靠的、更推荐的方法：

```bash
npx skills add byrdocs/byrdocs-cli-envolved
```

稍作等待，经过一些等待和加载后，首先会出现下面的 skills 选择界面。如果只需要对主站进行操作，选择第一个 `byrdocs` 即可；如果需要操作试题维基，就也选上 `byrdocs-wiki`；不过推荐把两个都选上已获得完整体验。

下面的交互式界面中，无法使用鼠标，只能使用键盘方向键等进行操作。

> [!IMPORTANT] ⚠️ 这种复选框交互界面中，需要按空格以选择（直接按回车是没有用的）！

选好了应该如下图一样，选项前的圆圈变为实心的绿色，按回车确认进入下一步。

![最先出现的 skills 选择界面，已经全选了](image-1.png)

下一步中，选择你需要安装到的 Agent。标注了 *Universal* 的上半部分（如 Codex, OpenCode 等）是始终包含的（*always included*）；下半部分是额外选择的 Agent，如果你用的 Agent 没被包含在 *Universal* 中（如 Claude Code 等），则需要手动选择。这里的选择和上一步中一样，需要用空格键选中（*↑↓ move, space select, enter confirm*）或在搜索框中搜索。例如下图中额外选择了 Claude Code。

![agents 选择界面](image-2.png)

最后，选择安装的作用域（scope），如果你只需要在当前文件夹下使用 Skills，选择 Project；如果需要全局使用，选择 Global。

![选择 scope](image-3.png)

确认后，安装类型选择推荐即可。

![选择 symlink 安装类型](image-4.png)

回车后确认安装，出现下图界面即安装完成。

![安装完成](image-5.png)

### 验证

有些 Agent 客户端，如 Claude Code 会给使用 Skills 注册一条命令，可以尝试输入 `/byrdocs` 查看是否已经注册。如果已注册，后续可以直接使用该命令显式指定使用 BYR Docs Skills：

![Claude Code CLI 注册的命令](image-6.png)

对于其他客户端，如 Codex，可以查看 Skills 列表，搜索 `byrdocs` 检查有没有对应的 Skills。

![在 Codex 的 Skills 列表中搜索](image-7.png)

如果这些入口都找不到，或者已经确认装好了，那我们直接体验一下？

## 使用

自由地向你的 Agent 描述需求，它会按照 Skills 的指引进行工作的！

### CLI 与登录

下载文件等操作需要使用 BYR Docs CLI 进行主站登录；贡献需要使用 [`gh` CLI](https://cli.github.com/) 进行 GitHub 登录，两种登录的职责和方式不同。

但不必担心，Agent 会在需要的时候指引你安装和登录的，参见下面的使用例。

### 搜索与下载主站文件

直接给出搜索要求：

> 搜索 byrdocs 上的《大学物理 D》试题，2024 年以来的，然后下载到本目录。

![alt text](image-8.png)

一般来说，搜索会读取并调用相关的 API，同意即可。

![alt text](image-9.png)

如果需要登录，会给你一个链接，在浏览器中访问，统一认证登录即可，该登录凭据会保存到本地。然后告诉 Agent 继续即可：

![alt text](image-12.png)

这样就完成了，十分方便。

![alt text](image-13.png)

---

[^1]: 基于 npm 包 [`skills`](https://www.npmjs.com/package/skills) 安装


</PostDetail>
