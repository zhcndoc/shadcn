# shadcn CLI 参考

配置从 `components.json` 中读取。

> **重要：** 始终使用项目的包运行器来运行命令：`npx shadcn@latest`、`pnpm dlx shadcn@latest` 或 `bunx --bun shadcn@latest`。请根据项目上下文中的 `packageManager` 选择正确的运行器。下面的示例使用的是 `npx shadcn@latest`，但请替换为该项目正确的运行器。

> **重要：** 只使用下面文档中列出的标志。不要发明或猜测任何标志——如果这里没有列出某个标志，就说明它不存在。CLI 会根据项目的锁文件自动检测包管理器；不存在 `--package-manager` 标志。

## 目录

- 命令：init、apply、add（dry-run、smart merge）、search、view、docs、info、build
- 模板：next、vite、start、react-router、astro
- 预设：命名、代码、URL 格式和字段
- 切换预设

---

## 命令

### `init` — 初始化或创建项目

```bash
npx shadcn@latest init [components...] [options]
```

在现有项目中初始化 shadcn/ui，或者在提供 `--name` 时创建一个新项目。也可以在同一步骤中选择性安装组件。

| 标志                    | 简写 | 描述                                                     | 默认值 |
| ----------------------- | ---- | -------------------------------------------------------- | ------ |
| `--template <template>` | `-t` | 模板（next、start、vite、next-monorepo、react-router）   | —      |
| `--preset [name]`       | `-p` | 预设配置（named、code 或 URL）                           | —      |
| `--yes`                 | `-y` | 跳过确认提示                                             | `true` |
| `--defaults`            | `-d` | 使用默认值（`--template=next --preset=base-nova`）       | `false` |
| `--force`               | `-f` | 强制覆盖现有配置                                         | `false` |
| `--cwd <cwd>`           | `-c` | 工作目录                                                 | 当前   |
| `--name <name>`         | `-n` | 新项目名称                                               | —      |
| `--silent`              | `-s` | 静默输出                                                 | `false` |
| `--rtl`                 |      | 启用 RTL 支持                                            | —      |
| `--reinstall`           |      | 重新安装现有 UI 组件                                     | `false` |
| `--monorepo`            |      | 搭建 monorepo 项目                                        | —      |
| `--no-monorepo`         |      | 跳过 monorepo 提示                                        | —      |

`npx shadcn@latest create` 是 `npx shadcn@latest init` 的别名。

### `apply` — 将预设应用到现有项目

```bash
npx shadcn@latest apply [preset] [options]
```

将预设应用到现有项目，覆盖由预设驱动的配置、字体、CSS 变量以及检测到的 UI 组件。

| 标志                | 简写 | 描述                                   | 默认值 |
| ------------------- | ---- | -------------------------------------- | ------ |
| `--preset <preset>` | —    | 预设配置（named、code 或 URL）         | —      |
| `--yes`             | `-y` | 跳过确认提示                           | `false` |
| `--cwd <cwd>`       | `-c` | 工作目录                               | 当前   |
| `--silent`          | `-s` | 静默输出                               | `false` |

`[preset]` 是 `--preset <preset>` 的简写。如果两者都提供了，它们必须一致。
如果没有提供预设，CLI 会提示你在 `ui.shadcn.com/create` 打开自定义预设构建器。

### `add` — 添加组件

> **重要：** 要将本地组件与上游进行比较，或预览更改，务必使用 `npx shadcn@latest add <component> --dry-run`、`--diff` 或 `--view`。切勿手动从 GitHub 或其他来源获取原始文件。CLI 会自动处理注册表解析、文件路径和 CSS diff。

```bash
npx shadcn@latest add [components...] [options]
```

接受组件名称、带注册表前缀的名称（`@magicui/shimmer-button`），
GitHub 项目地址（`owner/repo/item`）、URL 或本地路径。

| 标志            | 简写 | 描述                                                                                                     | 默认值 |
| --------------- | ---- | -------------------------------------------------------------------------------------------------------- | ------ |
| `--yes`         | `-y` | 跳过确认提示                                                                                             | `false` |
| `--overwrite`   | `-o` | 覆盖现有文件                                                                                             | `false` |
| `--cwd <cwd>`   | `-c` | 工作目录                                                                                                 | 当前   |
| `--all`         | `-a` | 添加所有可用组件                                                                                         | `false` |
| `--path <path>` | `-p` | 组件的目标路径                                                                                           | —      |
| `--silent`      | `-s` | 静默输出                                                                                                 | `false` |
| `--dry-run`     |      | 预览所有更改，不写入文件                                                                                 | `false` |
| `--diff [path]` |      | 显示差异。若不提供路径，则显示前 5 个文件；若提供路径，则仅显示该文件（隐含 `--dry-run`）                 | —      |
| `--view [path]` |      | 显示文件内容。若不提供路径，则显示前 5 个文件；若提供路径，则仅显示该文件（隐含 `--dry-run`）             | —      |

#### Dry-Run 模式

使用 `--dry-run` 可以预览 `add` 会做什么，而不会写入任何文件。`--diff` 和 `--view` 都隐含 `--dry-run`。

```bash
# 预览所有更改。
npx shadcn@latest add button --dry-run

# 显示所有文件的差异（前 5 个）。
npx shadcn@latest add button --diff

# 显示特定文件的差异。
npx shadcn@latest add button --diff button.tsx

# 显示所有文件的内容（前 5 个）。
npx shadcn@latest add button --view

# 显示特定文件的完整内容。
npx shadcn@latest add button --view button.tsx

# 也适用于 URL。
npx shadcn@latest add https://api.npoint.io/abc123 --dry-run

# 也适用于公共 GitHub 注册表。
npx shadcn@latest add owner/repo/item --dry-run

# CSS 差异。
npx shadcn@latest add button --diff globals.css
```

**何时使用 dry-run：**

- 当用户问“这会添加哪些文件？”或“这会修改什么？”时——使用 `--dry-run`。
- 在覆盖现有组件之前——先使用 `--diff` 预览更改。
- 当用户想在不安装的情况下检查组件源码时——使用 `--view`。
- 当检查 `globals.css` 会产生什么 CSS 更改时——使用 `--diff globals.css`。
- 当用户要求在安装前审查或审核第三方注册表代码时——使用 `--view` 检查源码。

> **`npx shadcn@latest add --dry-run` 与 `npx shadcn@latest view`：** 当用户想预览项目变更时，优先使用 `npx shadcn@latest add --dry-run/--diff/--view`，而不是 `npx shadcn@latest view`。`npx shadcn@latest view` 只显示原始注册表元数据。`npx shadcn@latest add --dry-run` 会准确显示在用户项目中会发生什么：解析后的文件路径、与现有文件的差异，以及 CSS 更新。只有当用户想在没有项目上下文的情况下浏览注册表信息时，才使用 `npx shadcn@latest view`。

#### 来自上游的智能合并

完整工作流程请参见 [在 SKILL.md 中更新组件](./SKILL.md#updating-components)。

### `search` — 搜索注册表

```bash
npx shadcn@latest search <registries...> [options]
```

在各注册表中进行模糊搜索。也可别名为 `npx shadcn@latest list`。
支持命名空间（`@acme`）、公共 GitHub 注册表源（`owner/repo`），
以及注册表目录 URL。若不带 `-q`，则列出所有条目。

| 标志               | 简写 | 描述                 | 默认值 |
| ------------------ | ---- | -------------------- | ------ |
| `--query <query>`  | `-q` | 搜索查询             | —      |
| `--limit <number>` | `-l` | 每个注册表的最大条目数 | `100`  |
| `--offset <number>`| `-o` | 跳过的条目数         | `0`    |
| `--cwd <cwd>`      | `-c` | 工作目录             | 当前   |

### `view` — 查看条目详情

```bash
npx shadcn@latest view <items...> [options]
```

显示条目信息，包括文件内容。示例：
`npx shadcn@latest view @shadcn/button`,
`npx shadcn@latest view owner/repo/item`。

### `docs` — 获取组件文档 URL

```bash
npx shadcn@latest docs <components...> [options]
```

输出已解析的组件文档、示例和 API 参考 URL。可接受一个或多个组件名称。获取这些 URL 以得到实际内容。

`npx shadcn@latest docs input button` 的示例输出：

```
base  radix

input
  docs      https://ui.shadcn.com/docs/components/radix/input
  examples  https://raw.githubusercontent.com/.../examples/input-example.tsx

button
  docs      https://ui.shadcn.com/docs/components/radix/button
  examples  https://raw.githubusercontent.com/.../examples/button-example.tsx
```

某些组件会包含指向底层库的 `api` 链接（例如命令组件对应的 `cmdk`）。

### `diff` — 检查更新

不要使用此命令。请改用 `npx shadcn@latest add --diff`。

### `info` — 项目信息

```bash
npx shadcn@latest info [options]
```

显示项目信息和 `components.json` 配置。请先运行此命令，以发现项目的框架、别名、Tailwind 版本和已解析路径。

| 标志          | 简写 | 描述           | 默认值 |
| ------------- | ---- | -------------- | ------ |
| `--cwd <cwd>` | `-c` | 工作目录       | 当前   |

**项目资讯字段：**

| 字段                 | 类型      | 含义                                                                 |
| -------------------- | --------- | -------------------------------------------------------------------- |
| `framework`         | `string`  | 检测到的框架（`next`、`vite`、`react-router`、`start` 等）         |
| `frameworkVersion`  | `string`  | 框架版本（例如 `15.2.4`）                                            |
| `isSrcDir`          | `boolean` | 项目是否使用 `src/` 目录                                              |
| `isRSC`             | `boolean` | 是否启用 React Server Components                                      |
| `isTsx`             | `boolean` | 项目是否使用 TypeScript                                               |
| `tailwindVersion`   | `string`  | `"v3"` 或 `"v4"`                                                      |
| `tailwindConfigFile`| `string`  | Tailwind 配置文件路径                                                 |
| `tailwindCssFile`   | `string`  | 全局 CSS 文件路径                                                      |
| `aliasPrefix`       | `string`  | 导入别名前缀（例如 `@`、`~`、`@/`）                                  |
| `packageManager`    | `string`  | 检测到的包管理器（`npm`、`pnpm`、`yarn`、`bun`）                     |

**components.json 字段：**

| 字段                 | 类型      | 含义                                                                                 |
| -------------------- | --------- | ------------------------------------------------------------------------------------ |
| `base`               | `string`  | 基础库（`radix` 或 `base`）——决定组件 API 和可用属性                                |
| `style`              | `string`  | 视觉风格（例如 `nova`、`vega`）                                                       |
| `rsc`                | `boolean` | 配置中的 RSC 标志                                                                    |
| `tsx`                | `boolean` | TypeScript 标志                                                                       |
| `tailwind.config`    | `string`  | Tailwind 配置路径                                                                     |
| `tailwind.css`       | `string`  | 全局 CSS 路径——自定义 CSS 变量会放在这里                                             |
| `iconLibrary`        | `string`  | 图标库——决定图标导入包（例如 `lucide-react`、`@tabler/icons-react`）               |
| `aliases.components` | `string`  | 组件导入别名（例如 `@/components`）                                                  |
| `aliases.utils`      | `string`  | 工具导入别名（例如 `@/lib/utils`）                                                    |
| `aliases.ui`         | `string`  | UI 组件别名（例如 `@/components/ui`）                                                 |
| `aliases.lib`        | `string`  | Lib 别名（例如 `@/lib`）                                                               |
| `aliases.hooks`      | `string`  | Hooks 别名（例如 `@/hooks`）                                                          |
| `resolvedPaths`      | `object`  | 每个别名对应的绝对文件系统路径                                                       |
| `registries`         | `object`  | 已配置的自定义注册表                                                                 |

**Links 字段：**

`info` 输出包含一个 **Links** 部分，其中有用于组件文档、源码和示例的模板化 URL。对于已解析的 URL，请改用 `npx shadcn@latest docs <component>`。

### `build` — 构建自定义注册表

```bash
npx shadcn@latest build [registry] [options]
```

将 `registry.json` 构建为独立的 JSON 文件用于分发。默认输入：`./registry.json`，默认输出：`./public/r`。

关于编写规则、`include`、条目定义、`registryDependencies` 以及 GitHub 注册表行为，请参见 [registry.md](./registry.md)。

| 标志              | 简写 | 描述           | 默认值       |
| ----------------- | ---- | -------------- | ------------ |
| `--output <path>` | `-o` | 输出目录       | `./public/r` |
| `--cwd <cwd>`     | `-c` | 工作目录       | 当前         |

---

## 模板

| 值             | 框架            | 单仓库支持 |
| -------------- | -------------- | ---------------- |
| `next`         | Next.js        | 是              |
| `vite`         | Vite           | 是              |
| `start`        | TanStack Start | 是              |
| `react-router` | React Router   | 是              |
| `astro`        | Astro          | 是              |
| `laravel`      | Laravel        | 否               |

所有模板都支持通过 `--monorepo` 标志进行单仓库脚手架生成。传入后，CLI 会使用单仓库专用的模板目录（例如 `next-monorepo`、`vite-monorepo`）。当既未传入 `--monorepo` 也未传入 `--no-monorepo` 时，CLI 会以交互方式提示。Laravel 不支持单仓库脚手架生成。

---

## 预设

通过 `--preset` 指定预设的三种方式：

1. **名称：** `--preset nova` 或 `--preset lyra`
2. **代码：** `--preset a2r6bw`（带版本前缀的 base62 字符串，例如 `a2r6bw` 或 `b0`）
3. **URL：** `--preset "https://ui.shadcn.com/init?base=radix&style=nova&..."`

> **重要：** 切勿手动尝试解码、获取或解析预设代码。预设代码是透明的 —— 直接将其传递给 `npx shadcn@latest init --preset <code>`，让 CLI 处理解析。
> 当要覆盖现有项目的预设时，使用 `npx shadcn@latest apply --preset <code>`。

## 切换预设

先询问用户：**覆盖**、**合并**，还是**跳过**现有组件？

- **覆盖 / 重新安装** → `npx shadcn@latest apply --preset <code>`。用新的预设样式覆盖所有检测到的组件文件。适用于用户尚未自定义组件的情况。
- **合并** → `npx shadcn@latest init --preset <code> --force --no-reinstall`，然后运行 `npx shadcn@latest info` 获取已安装组件列表，并使用 [智能合并工作流](./SKILL.md#updating-components) 逐个更新，同时保留本地更改。适用于用户已经自定义组件的情况。
- **跳过** → `npx shadcn@latest init --preset <code> --force --no-reinstall`。仅更新配置和 CSS 变量，现有组件保持原样。

始终在用户项目目录中运行预设命令。`apply` 仅适用于包含 `components.json` 文件的现有项目。CLI 会自动保留 `components.json` 中当前的 base（`base` 或 `radix`）。如果必须使用临时/空白目录（例如用于 `--dry-run` 对比），请显式传入 `--base <current-base>` —— 预设代码不包含 base。
