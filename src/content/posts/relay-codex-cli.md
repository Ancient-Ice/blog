---
title: "接入中转站 ③：给 Codex CLI 添加 429ONE 供应商"
description: "用 config.toml 注册中转站，按次选择模型和供应商，保留原有 Codex 登录与默认设置。"
pubDate: 2026-11-25
tags: ["中转站接入", "Codex CLI"]
---

如果 `https://api.429.one/v1/responses` 已经用你的密钥返回过文本，就可以用 Codex CLI 的自定义供应商直接连接。本文按次选择供应商，适合平时还要使用原账号的人。如果你只测通了 Chat Completions，直接看文末的转换方式。[先验证接口和模型 ID](/posts/relay-first-request/)

## 注册供应商

先运行 `codex --version`。若提示找不到命令，可按官方说明安装，例如在已有 Node.js 和 npm 的电脑上运行 `npm install -g @openai/codex`。[Codex CLI 安装说明](https://github.com/openai/codex#quickstart)

打开用户配置文件：默认是 macOS/Linux 的 `~/.codex/config.toml`，Windows 是 `%USERPROFILE%\.codex\config.toml`。如果你自定义过 `CODEX_HOME`，请编辑该目录下的 `config.toml`。在文件末尾添加下表；已有同名表时，编辑原表即可。

```toml
[model_providers.relay429]
name = "429ONE"
base_url = "https://api.429.one/v1"
wire_api = "responses"
env_key = "RELAY429_API_KEY"
```

`env_key` 填的是**环境变量名**。实际密钥在启动 Codex 的终端输入，配置文件里只保存上面四项。

## 仅在本次启动使用中转站

**Bash（macOS、Linux、Git Bash 或 WSL）** 中依次运行：

```bash
read -rsp '429ONE API Key: ' RELAY429_API_KEY
printf '\n'
export RELAY429_API_KEY
read -rp '已测通的模型 ID: ' RELAY_MODEL
codex -c 'model_provider="relay429"' -m "$RELAY_MODEL"
```

**Windows PowerShell 7** 可以这样写：

```powershell
$env:RELAY429_API_KEY = Read-Host '429ONE API Key' -MaskInput
$relayModel = Read-Host '已测通的模型 ID'
codex -c 'model_provider=relay429' -m $relayModel
```

在新会话里输入「只回复 OK」，再按时间核对中转站的请求记录。出现缺少 `RELAY429_API_KEY` 时，要在**刚设置变量的同一个终端**启动 Codex。如果短请求成功而 CLI 在流式输出时失败，请核对网关是否支持 Responses 流式事件及所选模型的工具调用。

退出会话后，直接运行 `codex` 即可沿用原来的默认配置。若还要清理本次密钥，Bash 运行 `unset RELAY429_API_KEY`，PowerShell 运行 `Remove-Item Env:RELAY429_API_KEY`。[Codex 配置参考](https://developers.openai.com/codex/config-reference/)

## 如果只测通了 Chat Completions

在 CC Switch 的 **Codex** 页添加自定义供应商，地址仍填 `https://api.429.one/v1`，输入 Key 和模型 ID，「上游格式」选 **OpenAI Chat Completions**。保存后在「路由」页点「开始路由」，选中该卡并保持 CC Switch 运行。新开终端直接运行 `codex`，让它读取 CC Switch 写入的路由设置。上面的 `-c` 参数会指向直连供应商，这种模式下应省略。[CC Switch 上游格式说明](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/2-providers/2.1-add.md)
