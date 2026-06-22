# shadcn MCP 服务器

CLI 包含一个 MCP 服务器，可让 AI 助手搜索、浏览、查看并从注册源中安装项目。

---

## 设置

```bash
shadcn mcp        # 启动 MCP 服务器（stdio）
shadcn mcp init   # 为你的编辑器写入配置
```

编辑器配置文件：

| 编辑器        | 配置文件                      |
| ------------- | ----------------------------- |
| Claude Code   | `.mcp.json`                   |
| Cursor        | `.cursor/mcp.json`            |
| VS Code       | `.vscode/mcp.json`           |
| OpenCode      | `opencode.json`              |
| Codex         | `~/.codex/config.toml`（手动） |

---

## 工具

> **提示：** MCP 工具负责注册源操作（搜索、查看、安装）。对于项目配置（别名、框架、Tailwind 版本），请使用 `npx shadcn@latest info` —— 这里没有 MCP 对应项。

### `shadcn:get_project_registries`

返回 `components.json` 中的注册源名称。如果不存在 `components.json`，则报错。

**输入：** 无

### `shadcn:list_items_in_registries`

列出一个或多个注册源中的所有项目。注册源可以是已配置的命名空间，例如 `@acme`，公共 GitHub 源例如 `owner/repo`，或者注册目录 URL。省略 `registries` 可列出 `components.json` 中配置的所有注册源。

**输入：** `registries`（string[]，可选——省略则表示所有已配置项）、`types`（string[]，可选——例如 `["ui", "block"]`）、`limit`（number，可选，默认 100）、`offset`（number，可选）

### `shadcn:search_items_in_registries`

跨注册源进行模糊搜索。注册源可以是已配置的命名空间、公共 GitHub 源，或者注册目录 URL。省略 `registries` 可搜索 `components.json` 中配置的所有注册源——例如在所有已配置的注册源中“帮我找一个 hero”。

**输入：** `registries`（string[]，可选——省略则表示所有已配置项）、`query`（string）、`types`（string[]，可选——例如 `["ui", "block"]`）、`limit`（number，可选，默认 100）、`offset`（number，可选）

### `shadcn:view_items_in_registries`

查看项目详情，包括完整文件内容。

**输入：** `items`（string[]）—— 例如
`["@shadcn/button", "@shadcn/card", "owner/repo/item"]`

### `shadcn:get_item_examples_from_registries`

查找带有源代码的使用示例和演示。省略 `registries` 可搜索 `components.json` 中配置的所有注册源。

**输入：** `registries`（string[]，可选——省略则表示所有已配置项）、`query`（string）—— 例如 `"accordion-demo"`、`"button example"`

### `shadcn:get_add_command_for_items`

返回 CLI 安装命令。

**输入：** `items`（string[]）—— 例如 `["@shadcn/button"]`

### `shadcn:get_audit_checklist`

返回用于验证组件的检查清单（导入、依赖、lint、TypeScript）。

**输入：** 无

---

## 配置注册源

命名空间和已认证的注册源在 `components.json` 中设置。`@shadcn` 注册源始终内置可用。只要仓库根目录下有 `registry.json`，公共 GitHub 注册源也可以直接作为 `owner/repo` 注册源使用；它们不需要 `components.json` 配置。

```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@private": {
      "url": "https://private.com/r/{name}.json",
      "headers": { "Authorization": "Bearer ${MY_TOKEN}" }
    }
  }
}
```

- 名称必须以 `@` 开头。
- URL 必须包含 `{name}`。
- `${VAR}` 引用会从环境变量中解析。

社区注册源索引：`https://ui.shadcn.com/r/registries.json`
