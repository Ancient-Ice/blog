---
title: "接入中转站 ②：在 Claude Code 中使用 429ONE"
description: "用 CC Switch 将 Claude Code 的请求转换成中转站支持的协议，配置模型映射，并验证实际用到的供应商。"
pubDate: 2026-11-25
tags: ["中转站接入", "Claude Code", "CC Switch"]
---

你可以保留 Claude Code 的终端界面，把请求交给中转站上有权限的模型处理。Claude Code 使用 Anthropic Messages；如果你在 429ONE 测通的是 OpenAI Responses 或 Chat Completions，就让本机的 CC Switch 转换协议。**Claude Code 是这里的客户端，实际模型取决于你填写的上游模型 ID。**

## 1. 在电脑上装好两个工具

**CC Switch** 是你用鼠标填地址和密钥的桌面软件；**Claude Code** 是稍后输入问题的命令行程序。下面先把两者打开一次，再接中转站。用手机的读者可以改看[安卓教程](/posts/relay-dsh-go/)。

1. 下载 CC Switch。Windows 通常选与系统架构匹配的 `.msi`，双击后按安装向导继续；macOS 打开 `.dmg`，将 CC Switch 拖到「应用程序」再打开。本文的按钮名按 v4.0.40 中文界面。[安装包与其他系统的步骤](/posts/cc-switch-guide/)
2. 在 CC Switch 左侧栏底部点击「应用」。找到 **Claude Code**，如果旁边显示「安装」就点它，等到能看到版本。已有 Claude Code 的读者可以跳过安装。
3. Windows 按开始菜单搜索「PowerShell」；Mac 按 Command + 空格搜索「终端」。打开一个新窗口，输入下面这行并按回车：

```shell
claude --version
```

看到版本号就说明电脑能找到 Claude Code。若显示「无法识别」或 `command not found`，先关掉旧终端重新打开；仍然失败就回「应用」页检查安装结果。版本号出来后再继续。

## 2. 给 429ONE 建一张配置卡片

先从第一篇准备好三项：429ONE 的 Key、账号可用的模型 ID、刚才测通的协议。**模型 ID 是你要复制的真实名称**，下面表格里的 Sonnet、Haiku 是 Claude Code 自己的角色名称。模型映射会告诉它，每个角色实际该向中转站请求哪个 ID。[找出自己的模型 ID 和协议](/posts/relay-first-request/)

回到 CC Switch 窗口，左侧点 **Claude Code**，右上点 **＋**，选择「自定义」。按表格从上到下填；除密钥和模型 ID 外，名称和地址都可以照抄。

| 字段 | 填法 |
| --- | --- |
| 名称 | `429ONE`，便于在路由页识别 |
| 端点地址 | `https://api.429.one/v1`，使用基础地址，保持「完整 URL」关闭 |
| 上游格式 | 如果测通的是 `/responses`，选 **OpenAI Responses API**；若是 `/chat/completions`，选 **OpenAI Chat Completions** |
| API Key、认证字段 | 填本站 Key。对于第一篇已验证的 Bearer 认证，选 `ANTHROPIC_AUTH_TOKEN`，让本地路由以 Bearer 方式转发 |
| 模型 | 在默认模型及本次会用到的角色映射（如 Sonnet、Haiku）中填已验证的上游 ID；首次测试可统一填同一个 ID |

## 3. 先看卡片状态，再打开 Claude Code

这里的「路由」是让 CC Switch 在你电脑上转发并转换请求。消息先到本机的 CC Switch，再到 429ONE，所以试用期间请让 CC Switch 保持运行。

1. 保存卡片，在 Claude Code 页打开「路由」，点「开始路由」并确认。把路由目标选为 **429ONE**（卡片按钮为「路由到此」时点击它），确认卡片显示「路由中」。
2. 在刚才显示版本号的终端，逐行输入下面三行。第一行创建练习文件夹，第二行进入它，第三行启动 Claude Code。如果文件夹已存在，直接从第二行开始。首次出现工作区信任提示时，核对路径末尾是你刚建的 `relay-demo` 再继续。

   ```shell
   mkdir relay-demo
   cd relay-demo
   claude
   ```

   等 Claude Code 出现自己的输入框，在那里输入「只回复 OK」并回车。这句话要写在 Claude Code 会话里；如果还看到普通的 `PS …>` 或终端提示符，先检查上一行启动命令是否报错。
3. 检查回复，并按请求时间核对 CC Switch 的路由记录（需开启「记录请求用量」）或中转站的用量记录。要验证编程场景，可在练习文件夹里用文本编辑器新建 `hello.txt`，第一行写「第一条测试」。再问「请读出 hello.txt 的第一行，不修改文件」，把回复和文件对照。普通文本成功、读文件失败时，优先检查该模型的工具调用与流式响应兼容性。

**如果报模型不存在**，看错误里出现的是哪个 ID。如果出现的是客户端默认的 Claude 模型名，回卡片补上对应角色的模型映射；如果已经是上游 ID，用相同 Key 和 ID 重跑第一篇的短请求。

**恢复原配置**时，回到 Claude Code 的「直连」页，点「回到直连」，再选之前使用的卡片，例如 `Claude Official`，重新打开 Claude Code。[CC Switch 本地路由说明](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/4-proxy/4.1-service.md)
