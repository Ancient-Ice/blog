---
title: "接入中转站 ④：在 DeepSeek Harness 网页版添加 429ONE 模型"
description: "用自定义模型 API 填写基础地址、选择协议，验证工作区会话并恢复原模型。"
pubDate: 2026-11-25
tags: ["中转站接入", "DeepSeek Harness"]
---

如果你喜欢在浏览器里看对话和项目文件，可以直接在 DeepSeek Harness 的「设置 → 模型」添加 429ONE。准备好中转站密钥、一个可调用的模型 ID，以及它支持的协议。[先确认模型和协议](/posts/relay-first-request/)

## 1. 先准备一个练习文件夹

Harness 会读取你选中的文件夹，也就是下文的「工作区」。第一次试用，可以专门建一个文件夹，里面只放一份自己认识的文件。按系统选一种方法：

**Windows**：开始菜单搜索「Windows PowerShell」，打开后逐行执行。第一行在你的用户目录下创建文件夹，第三行写一份测试文件。使用一个新的练习目录，以免替换同名文件。

```powershell
New-Item -ItemType Directory "$HOME/429one-harness-demo"
Set-Location "$HOME/429one-harness-demo"
Set-Content -Encoding utf8 README.md '# My 429ONE test'
Get-Location
```

**macOS 或 Linux**：打开「终端」，在新的练习目录中逐行执行。如果下面的目录已经用来存放其他文件，请换一个新名字。

```bash
mkdir ~/429one-harness-demo
cd ~/429one-harness-demo
printf '%s\n' '# My 429ONE test' > README.md
pwd
```

最后一行会打印文件夹的完整位置。稍后网页让你选择工作区时，就选这个位置。

## 2. 在这台电脑上打开 Harness 网页

留在刚才的终端。先运行 `node -v`，再运行 `npm -v`。两者都打印版本号才继续。本文参考的 Harness 版本 `0.2.2-rc.5` 要求 Node.js 至少为 24.9.0；若命令不存在或版本过低，从 Node.js 官网安装符合要求的 LTS 版本。安装后重新打开终端，回到刚才的练习目录。[Node.js 下载页](https://nodejs.org/en/download)

如果你已经装有 Harness，运行 `dsh web`。首次使用可以直接复制下面的命令，若 npm 询问是否安装这个包，核对包名后输入 `y` 并回车。Windows PowerShell 若提示禁止运行 npx 脚本，把命令开头换成 `npx.cmd`。

```shell
npx @deepseek-ai/dsh@0.2.2-rc.5 web
```

等终端打印网址。浏览器通常会自动打开；没有打开，就复制终端里的网址粘贴到**同一台电脑**的浏览器地址栏，默认是 `http://127.0.0.1:3080`。这个地址用于打开你电脑上的聊天界面；429ONE 的地址稍后填在该界面里。聊天期间请保留这个终端窗口。[Harness 安装说明](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/README.zh.md)

## 3. 给模型添加一个新的提供商

打开 **设置 → 模型 → 添加模型提供商 → 自定义模型 API**。这里可以指定 429ONE 的地址；页面上单独的「DeepSeek API」密钥框留给 DeepSeek 官方服务。

| 表单字段 | 示例或填写方法 |
| --- | --- |
| Provider ID / 显示名称 | ID 用小写 `relay429`，名称填 `429ONE`。会话会引用 ID，保存前先确认拼写 |
| 基础 URL | `https://api.429.one/v1` |
| API 协议 | 第一篇测通 `/responses` 就选 **OpenAI Responses**；测通 `/chat/completions` 就选 **OpenAI Chat Completions** |
| API 密钥 | 粘贴 429ONE 为你签发的 Key |
| 模型目录 | 点「获取可用模型」，勾选所需模型并更新列表；如果站点没有提供列表接口，手动添加已验证的完整模型 ID |

例如第一篇中成功的命令发到了 `/v1/responses`，这里就把「API 协议」选为 **OpenAI Responses**，地址仍只填到 `/v1`。手动添加模型时，把自己的完整模型 ID 填在 ID 一栏，显示名称可用你容易识别的名字。不要把 `relay429` 也复制进模型 ID 栏，它是这家提供商的名字。

想对照界面时，可以打开[项目手册里的中文表单截图](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers-custom-form.zh.png)。

检查字段后保存。一个提供商条目对应一种协议；若两个模型分别使用不同协议，可以用不同的 Provider ID 创建两张卡。[Harness 自定义模型配置说明](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/providers.zh.md)

## 4. 用刚才那份文件验证工作区和模型

1. 回到聊天页，点「选择工作区」，添加并选中 `429one-harness-demo`。路径可以对照第一步终端打印的最后一行。
2. 新建会话，打开模型选择器，点 **429ONE** 下刚添加的模型。先发「只回复 OK」验证聊天，再试文件读取。
3. 发送「只读取 README.md，原样返回第一行」。回复应含 `# My 429ONE test`，即你在第一步写下的那行。先核对文字，再按时间核对中转站的用量记录。

完成练习后可以关闭网页，再切回启动 Harness 的终端按 Ctrl + C 停止服务。下次想继续，回到练习目录再运行同一条启动命令。

**如果浏览器说「拒绝连接」**，看启动命令的窗口是否还开着，以及终端打印的端口是不是 3080；重新打开网页时以终端当次显示的完整地址为准。如果输入框不可用，先确认已选工作区和模型。如果能聊天但读不了文件，检查是否选错目录、是否有待确认的读取操作，以及当前模型是否支持工具调用。要换回原模型，开一个新会话，在选择器里选回之前的提供商和模型即可。[Harness 工作区指南](https://github.com/deepseek-ai/DeepSeek-Harness/blob/4b399c39a6d1479cd84ca591b4d7c88e24d38a96/docs/user/guide/index.zh.md)
