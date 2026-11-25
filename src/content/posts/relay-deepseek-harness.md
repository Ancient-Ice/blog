---
title: "接入中转站 ④：在 DeepSeek Harness 网页版添加 429ONE 模型"
description: "用自定义模型 API 填写基础地址、选择协议，验证工作区会话并恢复原模型。"
pubDate: 2026-11-25
tags: ["中转站接入", "DeepSeek Harness"]
---

如果你喜欢在浏览器里看对话和项目文件，可以直接在 DeepSeek Harness 的「设置 → 模型」添加 429ONE。准备好中转站密钥、一个可调用的模型 ID，以及它支持的协议。[先确认模型和协议](/posts/relay-first-request/)

## 在模型页填好一张卡片

在准备测试的项目目录里打开终端。如果已经安装 Harness，运行 `dsh web`；也可以在满足当前包版本要求的 Node.js 环境里运行 `npx @deepseek-ai/dsh web`。打开终端打印的本机地址，默认是 `http://127.0.0.1:3080`。[Harness 安装说明](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/README.zh.md)

打开 **设置 → 模型 → 添加模型提供商 → 自定义模型 API**。这里可以指定 429ONE 的地址；页面上单独的「DeepSeek API」密钥框留给 DeepSeek 官方服务。

| 表单字段 | 示例或填写方法 |
| --- | --- |
| Provider ID / 显示名称 | ID 用小写 `relay429`，名称填 `429ONE`。会话会引用 ID，保存前先确认拼写 |
| 基础 URL | `https://api.429.one/v1` |
| API 协议 | 第一篇测通 `/responses` 就选 **OpenAI Responses**；测通 `/chat/completions` 就选 **OpenAI Chat Completions** |
| API 密钥 | 粘贴 429ONE 为你签发的 Key |
| 模型目录 | 点「获取可用模型」，勾选所需模型并更新列表；如果站点没有提供列表接口，手动添加已验证的完整模型 ID |

检查字段后保存。一个提供商条目对应一种协议；若两个模型分别使用不同协议，可以用不同的 Provider ID 创建两张卡。[Harness 自定义模型配置说明](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers.zh.md)

## 用一个文件验证工作区和模型

1. 在测试目录里准备一个 `README.md`，第一行写一个好辨认的标题，例如 `# 我的 429ONE 测试`。
2. 在 Harness 点「选择工作区」，添加并选中这个目录。新建会话，在模型选择器选 **429ONE** 下刚添加的模型。
3. 发送「只读取 README.md，原样返回第一行」。把结果和文件对照，再按时间核对中转站的用量记录。

如果输入框不可用，先确认已选工作区和模型。如果能聊天但读不了文件，检查是否选错目录、是否有待确认的读取操作，以及当前模型是否支持工具调用。要换回原模型，开一个新会话，在选择器里选回之前的提供商和模型即可。[Harness 工作区指南](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/index.zh.md)
