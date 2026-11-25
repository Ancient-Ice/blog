---
title: "接入中转站 ①：先用一个请求确认地址、密钥和模型"
description: "用 curl 测试 api.429.one 的模型列表和生成接口，再决定 Claude Code、Codex 或 Harness 该怎么填。"
pubDate: 2026-11-25
tags: ["中转站接入"]
---

在客户端里同时填地址、密钥和模型名，遇到报错很难判断是哪一项出了问题。先在终端里让一个模型回复一次，再把同一套参数搬进客户端。你需要的是 **429ONE 中转站签发的 API Key**，以及这个 Key 有权调用的模型。基础地址是 `https://api.429.one/v1`。[中转站入口](https://api.429.one/)

## 第一步：取一个真实的模型 ID

以下命令适用于 **Bash**，macOS 可先运行 `bash`，Windows 可使用 Git Bash 或 WSL。需要 curl 和 Python 3（命令名为 `python3`）。在同一个终端逐段运行。输入密钥时屏幕不会显示字符，粘贴后按回车即可。

```bash
BASE='https://api.429.one/v1'
read -rsp '429ONE API Key: ' RELAY_KEY
printf '\n'
curl -sS -w '\nHTTP %{http_code}\n' "$BASE/models" \
  -H "Authorization: Bearer $RELAY_KEY"
```

如果得到 HTTP 200，在 JSON 的 `data` 数组中复制一个 `id`，保留大小写和前缀。如果模型列表接口返回 404，可从中转站给你的用模说明中复制模型 ID，继续测试生成接口。模型列表只说明账号能看到哪些名称，实际能否调用要看下一步。

## 第二步：按客户端需要的协议发一条消息

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

| 测试结果 | 下一步 |
| --- | --- |
| 401 或 403 | 查看错误正文，核对密钥、分组和模型权限。若响应来自公司代理或网关，先确认请求是否到达中转站。 |
| 404、405 或返回 HTML | 检查 URL 是否重复了 `/v1`，以及当前模型开放的是哪种协议。 |
| 提示模型不存在 | 对照模型列表或站点说明，逐字核对 ID。 |
| 429 | 查看响应正文和站点额度，区分余额、并发限制与短时限流。 |

## 第三步：选一个客户端继续

| 你想用的工具 | 配置入口 |
| --- | --- |
| 在终端用 Claude Code | [② 通过 CC Switch 转换协议](/posts/relay-claude-code/) |
| 在终端用 Codex CLI | [③ 用自定义供应商接入 Responses](/posts/relay-codex-cli/) |
| 在浏览器里用 DeepSeek Harness | [④ 添加自定义模型 API](/posts/relay-deepseek-harness/) |
| 在 Android 手机上用 DSH Go | [⑤ 添加 429ONE 渠道](/posts/relay-dsh-go/) |

测试结束可运行 `unset RELAY_KEY RELAY_MODEL BASE` 清理当前 Bash 会话的变量。分享排错信息时，只需保留路径、状态码和脱敏后的错误正文。
