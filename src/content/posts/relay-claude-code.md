---
title: "接入中转站 ②：在 Claude Code 中使用 429ONE"
description: "用 CC Switch 将 Claude Code 的请求转换成中转站支持的协议，配置模型映射，并验证实际用到的供应商。"
pubDate: 2026-11-25
tags: ["中转站接入", "Claude Code", "CC Switch"]
---

你可以保留 Claude Code 的终端界面，把请求交给中转站上有权限的模型处理。Claude Code 使用 Anthropic Messages；如果你在 429ONE 测通的是 OpenAI Responses 或 Chat Completions，就让本机的 CC Switch 转换协议。**Claude Code 是这里的客户端，实际模型取决于你填写的上游模型 ID。**

## 建一张中转站卡片

先准备 CC Switch（下列名称按 v4.0.40 中文界面）、能运行 `claude --version` 的 Claude Code、站点密钥，以及已经测通的模型 ID 和协议。[安装两个工具](/posts/cc-switch-guide/) · [用一条请求确认协议](/posts/relay-first-request/)

在 CC Switch 左侧打开 **Claude Code**，点 **＋** 添加供应商，选「自定义」。按下表填写：

| 字段 | 填法 |
| --- | --- |
| 名称 | `429ONE`，便于在路由页识别 |
| 端点地址 | `https://api.429.one/v1`，使用基础地址，保持「完整 URL」关闭 |
| 上游格式 | 如果测通的是 `/responses`，选 **OpenAI Responses API**；若是 `/chat/completions`，选 **OpenAI Chat Completions** |
| API Key、认证字段 | 填本站 Key。对于第一篇已验证的 Bearer 认证，选 `ANTHROPIC_AUTH_TOKEN`，让本地路由以 Bearer 方式转发 |
| 模型 | 在默认模型及本次会用到的角色映射（如 Sonnet、Haiku）中填已验证的上游 ID；首次测试可统一填同一个 ID |

## 启动路由，再发第一条消息

1. 保存卡片，在 Claude Code 页打开「路由」，点「开始路由」并确认。把路由目标选为 **429ONE**（卡片按钮为「路由到此」时点击它），确认卡片显示「路由中」。
2. 保持 CC Switch 运行。在一个测试目录新开终端，运行 `claude`，输入「只回复 OK」。
3. 检查回复，并按请求时间核对 CC Switch 的路由记录（需开启「记录请求用量」）或中转站的用量记录。要验证编程场景，可再让它「读一下 README 的第一行，不修改文件」，并与实际文件对照。普通文本成功、读文件失败时，优先检查该模型的工具调用与流式响应兼容性。

**如果报模型不存在**，看错误里出现的是哪个 ID。如果出现的是客户端默认的 Claude 模型名，回卡片补上对应角色的模型映射；如果已经是上游 ID，用相同 Key 和 ID 重跑第一篇的短请求。

**恢复原配置**时，回到 Claude Code 的「直连」页，点「回到直连」，再选之前使用的卡片，例如 `Claude Official`，重新打开 Claude Code。[CC Switch 本地路由说明](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/4-proxy/4.1-service.md)
