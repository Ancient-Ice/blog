---
title: "CC Switch 使用指南：给 Claude Code 换一个模型供应商"
description: "用 CC Switch 给 Claude Code 切换供应商，或接入 DeepSeek Harness，在新会话里验证模型。"
pubDate: 2026-11-24
tags: ["CC Switch", "Claude Code", "DeepSeek Harness"]
---

假设你平时用 Claude 官方账号写代码，今天想在同一个终端里试试另一家供应商提供的模型。两边的登录方式、接口地址和模型名称可能都不同。试用结束后，你还得记得怎么切回来。CC Switch 就是为这种场景准备的。

## CC Switch 是什么？

CC Switch 是一个开源桌面应用，可以管理 Claude Code、Codex、Gemini CLI 等工具的配置。你可以把里面的一张「供应商」卡片理解为一套连接设置：请求发到哪里、用什么凭据、调用哪个模型。

本文用 **CC Switch v4.0.40、Claude Code 和直连模式**走一遍完整流程。在这个模式下，点击「切换」，CC Switch 会把所选配置写进 Claude Code；下次提问时，Claude Code 直接向供应商发送请求。模型访问权限、额度和计费由你选择的供应商提供。

如果你用的是 DeepSeek Harness，可以直接跳到[接入 DeepSeek Harness](#接入-deepseek-harness)。这一节可以单独照做。

## 1. 安装，并确认两个工具都能打开

从官方发布页选择与你的系统和处理器架构匹配的安装包。Windows 下载 `.msi` 并运行；macOS 下载 `.dmg`，打开后把应用拖进「应用程序」；Ubuntu 或 Debian 下载 `.deb`，用系统的软件安装器打开。安装完成后，启动 CC Switch。[官方安装包](https://github.com/farion1231/cc-switch/releases/tag/v4.0.40)

在你准备使用 Claude Code 的终端运行：

```shell
claude --version
```

看到版本号就可以继续。如果提示找不到命令，打开 CC Switch 左侧栏底部的「应用」，找到 **Claude Code**，点击安装。完成后新开一个终端，再运行一次上面的命令。

## 2. 添加第一张供应商卡片

先在供应商控制台准备一枚可用的 API Key，并确认该套餐支持 **Claude Code 直连**。如果同一家提供按量 API 和单独的编程套餐，记下密钥属于哪一种，下一步要选对应的预设。

1. 在 CC Switch 左侧选 **Claude Code**，打开「直连」页。
2. 点击右上角的 **＋**，在「预设供应商」里搜索供应商名称。比如你的密钥来自智谱，就搜索「智谱」，再核对套餐和地区。
3. 选中匹配的预设，保留预设填好的端点地址，在 **API Key** 一栏粘贴密钥。若需要填写模型名，照供应商文档复制你有权调用的模型 ID。
4. 点击「添加」。回到列表后，找到刚添加的卡片，点击「切换」，确认卡片显示 **「使用中」**。

如果卡片标有「需要路由」，说明这套配置需要 CC Switch 在本机转发请求。要跟着本文验证直连，请选用供应商明确列为支持 Claude Code 直连的预设。密钥只填在本机配置中，分享截图时记得遮住它。

## 3. 发一次请求，确认切换成功

打开终端，运行 `claude`。在 Claude Code 的对话框里输入：

> 请只回复「连接成功」。

收到正常回答，说明客户端能完成一次模型请求。要进一步确认**这次请求用了刚选的供应商**，打开该供应商控制台的调用记录，核对刚才的时间和模型。如果控制台只展示汇总用量，等它刷新后再查看。模型在回答里自报的名称不能验证请求发到了哪里。

## 4. 切回原来的配置

回到 CC Switch 的 **Claude Code → 直连**，找到之前使用的卡片，点击「切换」。如果你原来用的是 Claude 官方账号，就选 **Claude Official**。重新打开 Claude Code，按提示完成官方登录。以后在这两套配置之间切换时，可以直接复用已保存的卡片。

## 接入 DeepSeek Harness

DeepSeek Harness（命令名 `dsh`）是 DeepSeek 的开源智能体工具，可以在你选择的项目目录里读文件、回答问题和执行任务。它在 CC Switch 侧栏里有自己的入口。你在这里添加账号或供应商，再到 Harness 的会话里选择模型。下面以本机网页版为例。

### 1. 安装 Harness

使用 CC Switch **v4.0.22 或更高版本**。打开左侧栏底部的「应用」，找到 **DeepSeek Harness**，点击安装，并让它显示在侧栏。安装依赖 Node.js 和 npm；以 `@deepseek-ai/dsh@0.2.2-rc.5` 为例，要求 Node.js **24.9.0 或以上**。新开终端运行 `node -v` 可以检查版本。[CC Switch 接入说明](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/release-notes/v4.0.22-zh.md#deepseek-harness) · [Harness 安装说明](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/README.zh.md)

### 2. 选择一种接入方式

- **有 DeepSeek 账号**：在 CC Switch 侧栏选「DeepSeek Harness」，添加供应商时选「DeepSeek 官方登录」。进入授权中心后，在浏览器完成登录。回到 CC Switch，检查「已添加」列表顶部是否出现 DeepSeek 官方账号卡片。
- **有第三方供应商的 API Key**：在同一个 Harness 页面点击 **＋**，选择与密钥匹配的供应商预设，填写密钥并核对模型 ID。保存后确认卡片位于「已添加」列表；若仍显示「添加」，点击它。你可以同时添加多家供应商，随后在 Harness 里按名称选模型。
- **已有 DeepSeek 官方 API Key**：直接进行下一步，启动 Harness 后打开 **设置 → 模型 → DeepSeek API**，填入密钥并保存。这个入口适合想使用自己 API 账户额度的读者。[Harness 模型配置指南](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers.zh.md)

### 3. 打开工作区，验证第一次请求

在你想阅读的项目目录里打开终端，启动网页版：

```shell
dsh web
```

浏览器通常会自动打开；也可以访问终端打印的地址，默认是 `http://127.0.0.1:3080`。点 **「选择工作区」**，添加并选中当前项目目录，然后新建会话。在模型选择器中选中刚接入的供应商和模型，再发送：

> 请列出当前项目根目录中的三个文件或目录，简单说明它们的用途。只读取，不修改文件。

把回答中的文件名和本地目录对照一下。若输入框不可用，先检查是否选中了工作区和模型；若能发送但返回 401，则回到刚才采用的登录或密钥入口检查凭据。你也可以先用一个只有 README 的目录练习，把提示改成「用一句话概括 README」。[Harness 网页版操作指南](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/index.zh.md)

**想切回原模型时**，在 Harness 里新建会话并选回原模型即可。已经发送过请求的会话会保留自己的模型记录。结束本次本地预览时，在运行 `dsh web` 的终端按 `Ctrl+C`。

## 如果 Claude Code 的第一条请求失败

| 你看到的现象 | 先检查什么 |
| --- | --- |
| 卡片显示「使用中」，请求却返回 401 | 卡片状态表示已选中配置。检查密钥是否有效，以及密钥所属套餐、地区是否与预设一致。 |
| 返回「模型不存在」或「无权访问模型」 | 到供应商控制台核对账号可用的模型 ID，再回到卡片编辑模型名。 |
| 切换后似乎仍连到旧地址 | 检查终端启动配置里是否还设置了旧的 `ANTHROPIC_BASE_URL` 或认证变量。确认是旧配置后移除对应设置，新开终端再试。 |

本文的界面名称和操作顺序依据 v4.0.40 中文手册整理。[快速上手](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/1-getting-started/1.4-quickstart.md) · [切换供应商](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/2-providers/2.2-switch.md)
