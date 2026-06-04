# 注册表编写与地址

当用户想要创建、修复、发布或推理一个 shadcn 注册表时，请参考本文档。

## 心智模型

一个注册表有两种形式：

- **源注册表**：在项目或仓库中编写的 `registry.json`。
  它可以使用 `include` 以及指向源文件的文件路径。
- **构建后的注册表**：生成的 JSON 文件，供 CLI 消费者使用，通常
  来自 `public/r`。使用 `npx shadcn@latest build` 创建这种形式。

CLI 安装器会消费注册表条目负载。源注册表是一种从真实文件编写这些负载的方式。

注册表条目不限于 React 组件。它们可以分发组件、hooks、工具函数、设计令牌、页面、配置文件、文档、规则、工作流、模板、MCP 文件以及其他项目文件。

## 根目录 `registry.json`

根注册表文件应定义注册表元数据，并且包含 `items` 或 `include` 之一。

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "absolute-url",
      "type": "registry:lib",
      "title": "Absolute URL",
      "description": "A utility to turn any path into an absolute URL.",
      "files": [
        {
          "path": "lib/absolute-url.ts",
          "type": "registry:lib"
        }
      ]
    }
  ]
}
```

根注册表规则：

- 根 `registry.json` 必须包含 `name` 和 `homepage`。
- `items` 是一个注册表条目定义数组。
- 可使用 `include` 将源注册表拆分为多个文件。
- 被包含的注册表文件可以省略 `name` 和 `homepage`。

## Include

使用 `include` 保持大型注册表的模块化。

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "include": ["registry/ui/registry.json", "registry/blocks/registry.json"]
}
```

Include 规则：

- Include 路径相对于声明它们的 `registry.json`。
- Include 路径必须明确指向一个 `registry.json` 文件。
- 不要使用远程 URL、绝对路径或父级遍历（`..`）。
- 条目文件路径相对于声明该条目的注册表文件。
- 在解析后的注册表中，重复的条目名称会失败。

示例被包含文件：

```json
{
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": [
        {
          "path": "button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

如果该文件位于 `registry/ui/registry.json`，那么 `button.tsx` 将从
`registry/ui/button.tsx` 读取，而构建后的条目路径会相对于根注册表输出。

## 条目定义

常见条目字段：

```json
{
  "name": "login-form",
  "type": "registry:block",
  "title": "Login Form",
  "description": "A login form with email and password fields.",
  "dependencies": ["zod"],
  "registryDependencies": ["button", "input", "label"],
  "files": [
    {
      "path": "blocks/login-form.tsx",
      "type": "registry:block"
    }
  ],
  "cssVars": {
    "light": {
      "brand": "oklch(0.62 0.18 250)"
    },
    "dark": {
      "brand": "oklch(0.72 0.16 250)"
    }
  }
}
```

重要字段：

- `name`：可安装的条目名称，不一定是文件路径。
- `type`：注册表条目类型之一，例如 `registry:ui`、
  `registry:block`、`registry:lib`、`registry:hook`、`registry:file`、
  `registry:page`、`registry:theme`、`registry:style`、`registry:font` 或
  `registry:item`。
- `files`：由该条目复制或生成的源文件。
- `dependencies`：npm 运行时依赖。
- `devDependencies`：npm 开发依赖。
- `registryDependencies`：该条目所需的其他注册表条目。
- `cssVars`、`css`、`tailwind`、`envVars` 和 `docs`：可选的安装时
  附加内容。

文件规则：

- 文件路径相对于声明它的 `registry.json`。
- `registry:file` 和 `registry:page` 文件需要 `target`。
- 不要在源注册表文件路径中使用远程文件 URL。
- 保持源文件可直接复制粘贴：不要有隐藏的仅应用内导入。

## 注册表依赖

`registryDependencies` 条目是条目地址，不是文件路径。

```json
{
  "name": "login-form",
  "type": "registry:block",
  "registryDependencies": ["button", "@acme/input", "acme/ui/card#v1.2.0"],
  "files": [
    {
      "path": "blocks/login-form.tsx",
      "type": "registry:block"
    }
  ]
}
```

依赖规则：

- 像 `"button"` 这样的裸名称表示官方 shadcn 条目。
- 裸名称绝不表示同注册表或同仓库条目。
- 带命名空间的依赖使用 `@namespace/item-name`。
- GitHub 依赖使用 `owner/repo/item-name`。
- 需要时可用 `owner/repo/item-name#ref` 固定 GitHub 依赖版本。
- ref 不会被继承。如果 `owner/repo/foo#v2` 依赖于同一仓库中 `v2` 版本的 `bar`，请写成 `owner/repo/bar#v2`。
- 不要使用诸如 `"./bar"` 这样的相对依赖。

## 地址方案

在推理一个注册表条目字符串时，先对其进行分类。

| 地址                                | 方案       | 含义                                                         |
| ----------------------------------- | ---------- | ------------------------------------------------------------ |
| `button`                            | shadcn     | 名为 `button` 的官方 shadcn 条目。                            |
| `@acme/button`                      | namespace   | 来自已配置注册表 `@acme` 的条目 `button`。                  |
| `@acme/ui/button`                   | namespace   | 来自已配置注册表 `@acme` 的条目 `ui/button`。               |
| `https://example.com/r/button.json` | url        | 该 URL 上的构建后注册表条目 JSON。                           |
| `./button.json`                     | file       | 磁盘上的构建后注册表条目 JSON。                               |
| `acme/ui/button`                    | github     | 来自 GitHub 仓库 `acme/ui` 的条目 `button`。                |
| `acme/ui/forms/login#main`          | github     | 来自 GitHub 仓库 `acme/ui`、引用为 `main` 的条目 `forms/login`。 |

对于 namespace 和 GitHub 地址，允许使用带斜杠的条目名；它们是条目
名称，不是文件路径。以 `.json` 结尾的地址仍优先按文件地址处理，因此 `acme/ui/data/schema.json` 会被视为文件路径，而不是 GitHub 条目地址。

## GitHub 注册表

当一个公开 GitHub 仓库具有根目录 `registry.json` 时，它可以充当源注册表。

```txt
owner/repo/item-name[#ref]
```

规则：

- 前两个路径段是 GitHub 所有者和仓库名。
- 剩余所有路径段都是注册表条目名。
- 源入口点始终是根目录 `registry.json`。
- GitHub 注册表是由 CLI 直接消费的源注册表。它们不需要 `shadcn build` 或生成的条目 JSON 文件。
- `include` 遵循与本地注册表相同的源注册表规则。
- 目前，GitHub 地址仅支持公开的 `github.com` 仓库。
- 私有仓库和 GitHub Enterprise 需要明确的产品决策。

在实现 GitHub 注册表获取时，在读取源文件之前，将 ref 解析为 commit SHA。不要直接从 `raw.githubusercontent.com` 读取移动中的 ref，因为类似分支的 ref 可能会被缓存数分钟。

推荐流程：

```txt
owner/repo[#ref]
  -> 通过 git ls-remote 解析 ref
  -> commit SHA
  -> 读取 https://raw.githubusercontent.com/{owner}/{repo}/{sha}/registry.json
  -> 从同一个 SHA 读取 include 和条目文件
```

这样可以让命令始终基于同一个一致的仓库快照。

完整的 40 字符 commit SHA 已经是稳定的，可以直接使用。分支、标签和短 ref 需要 Git，这样 CLI 才能先将它们解析为 commit SHA。

## 构建与验证

使用 CLI 构建源注册表：

```bash
npx shadcn@latest build
npx shadcn@latest build registry.json --output public/r
```

使用 CLI 命令检查结果：

```bash
npx shadcn@latest list @acme
npx shadcn@latest search @acme -q "login"
npx shadcn@latest view @acme/login-form
npx shadcn@latest add @acme/login-form --dry-run
npx shadcn@latest registry validate ./registry.json
```

对公开 GitHub 注册表可直接使用 GitHub 地址：

```bash
npx shadcn@latest list owner/repo
npx shadcn@latest search owner/repo -q "login"
npx shadcn@latest view owner/repo/item
npx shadcn@latest add owner/repo/item --dry-run
npx shadcn@latest registry validate owner/repo
```

在 shadcn/ui 代码库中进行注册表实现时：

- 保持地址解析纯粹且可测试。
- 不要给校验器添加副作用。
- 为官方 shadcn、namespace、URL 和 file 方案保留现有行为。
- 为地址解析、源加载、依赖解析、list、search、view 和 add 路径添加测试。
- 在存在多个真实提供者之前，优先使用小型源读取器抽象，而不是插件系统。
