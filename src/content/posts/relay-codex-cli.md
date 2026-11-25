---
title: "接入中转站 ③：给 Codex CLI 添加 429ONE 供应商"
description: "用 config.toml 注册中转站，按次选择模型和供应商，保留原有 Codex 登录与默认设置。"
pubDate: 2026-11-25
tags: ["中转站接入", "Codex CLI"]
---

如果 `https://api.429.one/v1/responses` 已经用你的密钥返回过文本，就可以用 Codex CLI 的自定义供应商直接连接。本文按次选择供应商，适合平时还要使用原账号的人。如果你只测通了 Chat Completions，直接看文末的转换方式。[先验证接口和模型 ID](/posts/relay-first-request/)

## 1. 先让电脑认得 codex 这条命令

CLI 是「命令行界面」：你打开一个终端窗口，输入命令，按回车让电脑执行。后面会用到两个窗口：**文本编辑器**负责保存设置，**终端**负责启动 Codex。

Windows 打开开始菜单搜「PowerShell」，macOS 按 Command + 空格搜「终端」，Linux 从应用菜单打开「终端」。先输入 `codex --version` 再按回车，看到版本号就跳到第 2 步。

如果提示找不到命令，先输入 `npm --version`。npm 是安装 Codex 的工具，和 Node.js 一起提供。若 npm 也找不到，先从官网下载适合自己系统的 **Node.js LTS** 安装程序并按提示完成安装，再关掉终端重新打开。Windows 若提示脚本执行被禁止，在 PowerShell 中用 `npm.cmd` 代替 `npm`，用 `codex.cmd` 代替 `codex`。[Node.js 下载页](https://nodejs.org/en/download) · [Codex CLI 安装说明](https://github.com/openai/codex#quickstart)

在终端逐行运行：

```shell
npm install -g @openai/codex
codex --version
```

第二行应显示类似 `codex-cli` 加版本号。安装错误时先解决这一步，后面的配置只有在程序能启动后才会起作用。

## 2. 打开配置文件，把 429ONE 加到供应商列表

打开用户配置文件：默认是 macOS/Linux 的 `~/.codex/config.toml`，Windows 是 `%USERPROFILE%\.codex\config.toml`。如果你自定义过 `CODEX_HOME`，请编辑该目录下的 `config.toml`。下面的命令适用于默认路径，按你的系统选一段。

**Windows PowerShell**：逐行运行。第一行创建配置目录（已有目录也可以运行），第二行用记事本打开文件。如果询问是否新建文件，点「是」。

```powershell
New-Item -ItemType Directory -Force "$HOME/.codex" | Out-Null
notepad.exe "$HOME/.codex/config.toml"
```

**macOS / Linux**：逐行运行。第二行不会清空已有文件，第三行用终端内的 nano 编辑器打开它。

```bash
mkdir -p ~/.codex
touch ~/.codex/config.toml
nano ~/.codex/config.toml
```

有旧内容就移到末尾另起一行，保留原文。复制下方代码框**里面的五行**；第一个方括号也要复制。如果已有 `[model_providers.relay429]` 这一段，就核对原来的四个值，避免出现两段同名配置。

```toml
[model_providers.relay429]
name = "429ONE"
base_url = "https://api.429.one/v1"
wire_api = "responses"
env_key = "RELAY429_API_KEY"
```

Windows 在记事本按 Ctrl + S 保存并关闭；nano 里按 Ctrl + O、回车确认文件名，再按 Ctrl + X 返回终端。文件名应正好是 `config.toml`。如果你用记事本另存过文件，在资源管理器打开「查看 → 显示 → 文件扩展名」，确认没有多出 `.txt`。

`env_key` 填的是**环境变量名**。实际密钥在启动 Codex 的终端输入，配置文件里只保存上面四项。

## 3. 输入自己的密钥和模型，开始第一次对话

先在终端运行 `mkdir codex-demo`，再运行 `cd codex-demo`，进入一个专门练习的文件夹。如果提示已存在，继续执行第二行即可。以下命令请**一次运行一行**，遇到密钥或模型提示就先回答，再执行下一行。

**macOS、Linux 或 Git Bash**：先在终端输入 `bash` 并回车，确保接下来这些输入密钥的命令能被识别，再逐行执行：

```bash
read -rsp '429ONE API Key: ' RELAY429_API_KEY
printf '\n'
export RELAY429_API_KEY
read -rp '已测通的模型 ID: ' RELAY_MODEL
codex -c 'model_provider="relay429"' -m "$RELAY_MODEL"
```

**Windows PowerShell** 用下面四行。密钥在第一行询问时粘贴，模型 ID 在第三行询问时粘贴，均不加引号。

```powershell
$secret = Read-Host '429ONE API Key' -AsSecureString
$env:RELAY429_API_KEY = [System.Net.NetworkCredential]::new('', $secret).Password
$relayModel = Read-Host '已测通的模型 ID'
codex -c 'model_provider=relay429' -m $relayModel
```

最后一行的 `-c` 指定使用刚登记的供应商，`-m` 指定实际模型。看到 Codex 对话界面后，若询问是否信任工作目录，先核对它是刚建的练习文件夹。在 **Codex 的输入框**写「只回复 OK」然后回车，再按时间核对中转站的请求记录。出现缺少 `RELAY429_API_KEY` 时，要在**刚设置变量的同一个终端**启动 Codex。如果短请求成功而 CLI 在流式输出时失败，请核对网关是否支持 Responses 流式事件及所选模型的工具调用。

如出现 TOML 解析错误，回记事本或 nano 查报错指出的行，常见原因是复制时漏了英文双引号，或重复粘贴了同一组方括号。若返回 401，重新输入站点 Key；若提示模型不存在，对照第一篇里成功的 ID。

在 Codex 输入 `/quit` 退出会话后，直接运行 `codex` 即可沿用原来的默认配置。若还要清理本次密钥，Bash 运行 `unset RELAY429_API_KEY`，PowerShell 运行 `Remove-Item Env:RELAY429_API_KEY`。[Codex 配置参考](https://developers.openai.com/codex/config-reference/)

## 如果只测通了 Chat Completions

在 CC Switch 的 **Codex** 页添加自定义供应商，地址仍填 `https://api.429.one/v1`，输入 Key 和模型 ID，「上游格式」选 **OpenAI Chat Completions**。保存后在「路由」页点「开始路由」，选中该卡并保持 CC Switch 运行。新开终端直接运行 `codex`，让它读取 CC Switch 写入的路由设置。上面的 `-c` 参数会指向直连供应商，这种模式下应省略。[CC Switch 上游格式说明](https://github.com/farion1231/cc-switch/blob/v4.0.40/docs/user-manual/zh/2-providers/2.1-add.md)
