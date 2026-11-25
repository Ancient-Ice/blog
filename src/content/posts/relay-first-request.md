---
title: "接入中转站 ①：先用一个请求确认地址、密钥和模型"
description: "从认识 API 密钥开始，在 Windows、Mac 或手机上找到模型，发出第一条消息，再选适合自己的工具。"
pubDate: 2026-11-25
tags: ["中转站接入"]
---

如果你只用过网页版聊天，第一次接 API 可以从一个很小的目标开始：让自己的手机或电脑通过 429ONE 发出「请只回复 OK」，收到一句回答。完成这一件事，后面的软件就有了一套可以照填的配置。

## 先准备三样东西

1. **地址**。打开浏览器，访问站点首页并登录自己的账号。之后在软件的「基础地址」或「Base URL」栏，统一复制 `https://api.429.one/v1`。直接把这个地址放进浏览器不会出现聊天窗口。[429ONE 首页](https://api.429.one/)
2. **密钥（API Key）**。它让站点知道这笔调用记到谁的账户。登录后在账户控制台找管理 API 密钥或令牌的入口；如果还没有可用密钥，按站内提示创建并复制完整值。界面上只剩星号时，使用创建时保存的原值，或另建一枚。密钥栏只填密钥本身，不加引号，不填网页登录密码，也不要发给别人。
3. **模型 ID 和协议**。ID 是软件向站点请求的模型名称，要完整复制，包括可能出现的前缀和横线。「协议」是发消息时使用的格式。本系列会用到 Responses 和 Chat Completions 两种；同一枚 Key 能用哪些模型、支持哪种格式，以该账号的站内说明和实际返回为准。找不到说明时，可以先做下面的测试。

**只有安卓手机，或想全程点按钮？** 记下基础地址，复制 Key，直接去[手机教程的「添加 429ONE 渠道」](/posts/relay-dsh-go/)。客户端可以帮你获取模型并发送测试消息。使用电脑的读者可以选下面对应自己系统的一条路线，无须两条都做。

## Windows：用自带的 PowerShell 发第一条消息

点击开始菜单，搜索 **Windows PowerShell** 并打开。看到类似 `PS C:\Users\你的名字>` 的提示符就可以输入。下面每个代码框单独复制，粘贴后按回车；提示符和代码框边缘不用复制。整个测试用同一个窗口。

**先读模型列表。** 运行下一行，窗口询问 API Key 时才粘贴密钥并按回车。输入时出现星号或看不到字符都是正常的。

```powershell
$secret = Read-Host '429ONE API Key' -AsSecureString
```

然后运行这三行。输出应当是一列模型名称。挑一个账号有权使用的，复制整行名称。

```powershell
$base = 'https://api.429.one/v1'
$headers = @{ Authorization = 'Bearer ' + [System.Net.NetworkCredential]::new('', $secret).Password }
(Invoke-RestMethod -Uri "$base/models" -Headers $headers).data | Select-Object -ExpandProperty id
```

如果只在列表这一步遇到 404，可以从站内用模说明取得模型 ID 再继续。接下来运行这一行，出现提示后粘贴模型 ID 并回车：

```powershell
$model = Read-Host 'Model ID'
```

**测试 Responses**（使用 Codex 建议先选它）。整段原样复制。这里的 `$model` 代表刚才输入的值，`Reply only OK` 是发给模型的消息。这次生成可能消耗少量额度。

```powershell
$body = @{ model = $model; input = 'Reply only OK' } | ConvertTo-Json
$r = Invoke-RestMethod -Method Post -Uri "$base/responses" -Headers $headers -ContentType 'application/json' -Body $body
$r.output | ForEach-Object { $_.content } | ForEach-Object { $_.text }
```

看到模型返回的文字后，记下「这个 ID，Responses 可用」。如果站内说明要求 **Chat Completions**，或上一步返回接口不存在，改用下面这段。有文字返回，就记下「这个 ID，Chat Completions 可用」。

```powershell
$body = @{ model = $model; messages = @(@{ role = 'user'; content = 'Reply only OK' }) } | ConvertTo-Json -Depth 5
$r = Invoke-RestMethod -Method Post -Uri "$base/chat/completions" -Headers $headers -ContentType 'application/json' -Body $body
$r.choices[0].message.content
```

确认结果后关掉 PowerShell 窗口即可清除本次会话的变量。接下来按文末的表选一个客户端。

## macOS 或 Linux：在终端里做同一个测试

macOS 按 Command + 空格，搜「终端」并打开，输入 `bash` 后回车。Linux 从应用菜单打开「终端」，同样输入 `bash`。先分别运行 `curl --version` 和 `python3 --version`；两者都显示版本号才能运行这条路线。缺 Python 时可安装 Python 3 后重新打开终端，或直接用第四篇的图形界面「获取可用模型」。[Python 下载页](https://www.python.org/downloads/) · [网页版教程](/posts/relay-deepseek-harness/)

第一行保存地址，第二行提示你输入密钥。请逐行执行，输完密钥按回车，再继续下一段。

```bash
BASE='https://api.429.one/v1'
read -rsp '429ONE API Key: ' RELAY_KEY
printf '\n'
```

接下来整段复制。它只查询模型名称：

```bash
curl -sS -w '\nHTTP %{http_code}\n' "$BASE/models" \
  -H "Authorization: Bearer $RELAY_KEY"
```

如果得到 HTTP 200，在 JSON 的 `data` 数组中复制一个 `id`，保留大小写和前缀。比如看到下面这种结构，就复制 `id` 后面双引号里的文字，不复制引号。这里的名字仅演示读法，实际测试请使用你屏幕上的值。

```json
{"data":[{"id":"示例模型名称","object":"model"}]}
```

如果模型列表接口返回 404，可从中转站给你的用模说明中复制模型 ID，继续测试生成接口。模型列表只说明账号能看到哪些名称，实际能否调用要看下一步。

### 从列表选一个模型，用它发消息

先输入刚才复制的模型 ID：

```bash
read -rp '模型 ID: ' RELAY_MODEL
```

**准备用 Codex CLI，先测 Responses。** 这条命令会发送一个可能计费的短请求：

```bash
python3 -c 'import json,sys; print(json.dumps({"model":sys.argv[1],"input":"请只回复 OK"}))' "$RELAY_MODEL" |
  curl -sS -w '\nHTTP %{http_code}\n' "$BASE/responses" \
    -H "Authorization: Bearer $RELAY_KEY" -H 'Content-Type: application/json' --data-binary @-
```

预期结果是 HTTP 200，且 `output` 里有模型生成的文本。如果站点为你的模型提供的是 **Chat Completions**，改测下面这一条。它使用不同的路径和请求体：

```bash
python3 -c 'import json,sys; print(json.dumps({"model":sys.argv[1],"messages":[{"role":"user","content":"请只回复 OK"}]}))' "$RELAY_MODEL" |
  curl -sS -w '\nHTTP %{http_code}\n' "$BASE/chat/completions" \
    -H "Authorization: Bearer $RELAY_KEY" -H 'Content-Type: application/json' --data-binary @-
```

Chat Completions 成功时，回复通常在 `choices[0].message.content`。记下**成功的协议和模型 ID**。基础地址只填到 `/v1`；上面两条完整路径专供手动测试，客户端的「基础 URL」字段会自己拼接路径。

## 如果屏幕上显示错误

先读第一条错误。拿到正常回复后就可以停止测试，不需要把两种协议都跑通。

| 测试结果 | 下一步 |
| --- | --- |
| 401 或 403 | 查看错误正文，核对密钥、分组和模型权限。若响应来自公司代理或网关，先确认请求是否到达中转站。 |
| 404、405 或返回 HTML | 检查 URL 是否重复了 `/v1`，以及当前模型开放的是哪种协议。 |
| 提示模型不存在 | 对照模型列表或站点说明，逐字核对 ID。 |
| 429 | 查看响应正文和站点额度，区分余额、并发限制与短时限流。 |

## 测通以后，按设备和用途选一篇

| 你想用的工具 | 配置入口 |
| --- | --- |
| 在终端用 Claude Code | [② 通过 CC Switch 转换协议](/posts/relay-claude-code/) |
| 在终端用 Codex CLI | [③ 用自定义供应商接入 Responses](/posts/relay-codex-cli/) |
| 在浏览器里用 DeepSeek Harness | [④ 添加自定义模型 API](/posts/relay-deepseek-harness/) |
| 在 Android 手机上用 DSH Go | [⑤ 添加 429ONE 渠道](/posts/relay-dsh-go/) |

如果使用上面的 Bash 路线，测试结束可运行 `unset RELAY_KEY RELAY_MODEL BASE` 清理当前 Bash 会话的变量。分享排错信息时，只需保留路径、状态码和脱敏后的错误正文。
