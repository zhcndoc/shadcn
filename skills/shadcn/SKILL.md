---
name: shadcn
description: 管理 shadcn 组件和项目 — 添加、搜索、修复、调试、样式设置和组合 UI。提供项目上下文、组件文档和使用示例。适用于使用 shadcn/ui、组件注册表、预设、--preset 代码或任何带有 components.json 文件的项目。也会在执行 "shadcn init"、"使用 --preset 创建应用" 或 "切换到 --preset" 时触发。
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# shadcn/ui

一个用于构建 UI、组件和设计系统的框架。组件通过 CLI 以源代码形式添加到用户的项目中。

> **重要：** 使用项目的包管理器运行所有 CLI 命令：`npx shadcn@latest`、`pnpm dlx shadcn@latest` 或 `bunx --bun shadcn@latest` — 基于项目的 `packageManager`。下面的示例使用 `npx shadcn@latest`，但请为项目替换正确的运行器。

## 当前项目上下文

```json
!`npx shadcn@latest info --json`
```

上面的 JSON 包含项目配置和已安装的组件。使用 `npx shadcn@latest docs <component>` 获取任意组件的文档和示例 URL。

## 原则

1. **优先使用现有组件。** 在编写自定义 UI 之前，使用 `npx shadcn@latest search` 检查注册表。也要检查社区注册表。
2. **组合，不要重复发明。** 设置页面 = 标签页 + 卡片 + 表单控件。仪表板 = 侧边栏 + 卡片 + 图表 + 表格。
3. **优先使用内置变体而非自定义样式。** `variant="outline"`、`size="sm"` 等。
4. **使用语义化颜色。** `bg-primary`、`text-muted-foreground` — 永远不要使用原始值如 `bg-blue-500`。

## 关键规则

这些规则**始终执行**。每个都链接到包含错误/正确代码对的文件。

### 样式与 Tailwind → [styling.md](./rules/styling.md)

- **`className` 用于布局，而非样式。** 永远不要覆盖组件颜色或排版。
- **不要使用 `space-x-*` 或 `space-y-*`。** 使用 `flex` 配合 `gap-*`。对于垂直堆叠，使用 `flex flex-col gap-*`。
- **当宽度和高度相等时使用 `size-*`。** `size-10` 而不是 `w-10 h-10`。
- **使用 `truncate` 简写。** 不要写 `overflow-hidden text-ellipsis whitespace-nowrap`。
- **不要手动覆盖 `dark:` 颜色。** 使用语义化标记（`bg-background`、`text-muted-foreground`）。
- **使用 `cn()` 进行条件类名处理。** 不要写手动模板字面量三元表达式。
- **不要在遮罩层组件上手动设置 `z-index`。** 对话框、工作表、弹出框等自行处理堆叠。

### 表单与输入 → [forms.md](./rules/forms.md)

- **表单使用 `FieldGroup` + `Field`。** 永远不要用原始 `div` 配合 `space-y-*` 或 `grid gap-*` 进行表单布局。
- **`InputGroup` 使用 `InputGroupInput`/`InputGroupTextarea`。** 永远不要在 `InputGroup` 内使用原始 `Input`/`Textarea`。
- **输入框内的按钮使用 `InputGroup` + `InputGroupAddon`。**
- **选项组（2-7 个选择）使用 `ToggleGroup`。** 不要用手动激活状态循环 `Button`。
- **相关复选框/单选按钮使用 `FieldSet` + `FieldLegend` 进行分组。** 不要使用带标题的 `div`。
- **字段验证使用 `data-invalid` + `aria-invalid`。** `data-invalid` 在 `Field` 上，`aria-invalid` 在控件上。对于禁用状态：`data-disabled` 在 `Field` 上，`disabled` 在控件上。

### 组件结构 → [composition.md](./rules/composition.md)

- **项目始终在其组内。** `SelectItem` → `SelectGroup`。`DropdownMenuItem` → `DropdownMenuGroup`。`CommandItem` → `CommandGroup`。
- **使用 `asChild` (radix) 或 `render` (base) 自定义触发器。** 从 `npx shadcn@latest info` 检查 `base` 字段。→ [base-vs-radix.md](./rules/base-vs-radix.md)
- **对话框、工作表和抽屉始终需要标题。** `DialogTitle`、`SheetTitle`、`DrawerTitle` 为可访问性所必需。如果视觉隐藏，使用 `className="sr-only"`。
- **使用完整的卡片组合。** `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`。不要把所有内容都堆在 `CardContent` 里。
- **按钮没有 `isPending`/`isLoading`。** 与 `Spinner` + `data-icon` + `disabled` 组合使用。
- **`TabsTrigger` 必须位于 `TabsList` 内。** 永远不要直接在 `Tabs` 中渲染触发器。
- **`Avatar` 始终需要 `AvatarFallback`。** 用于图片加载失败时。

### 使用组件，而非自定义标记 → [composition.md](./rules/composition.md)

- **优先使用现有组件而非自定义标记。** 在编写样式化的 `div` 之前检查组件是否存在。
- **提示使用 `Alert`。** 不要构建自定义样式化的 div。
- **空状态使用 `Empty`。** 不要构建自定义空状态标记。
- **通过 `sonner` 使用 Toast。** 使用 `sonner` 中的 `toast()`。
- **使用 `Separator`** 代替 `<hr>` 或 `<div className="border-t">`。
- **使用 `Skeleton`** 作为加载占位符。不要使用自定义的 `animate-pulse` div。
- **使用 `Badge`** 代替自定义样式化的 span。

### 图标 → [icons.md](./rules/icons.md)

- **按钮中的图标使用 `data-icon`。** 在图标上使用 `data-icon="inline-start"` 或 `data-icon="inline-end"`。
- **组件内的图标不要添加尺寸类。** 组件通过 CSS 处理图标尺寸。不要加 `size-4` 或 `w-4 h-4`。
- **将图标作为对象传递，而非字符串键。** `icon={CheckIcon}`，而不是字符串查找。

### CLI

- **永远不要手动解码或获取预设代码。** 直接传递给 `npx shadcn@latest init --preset <code>`。

## 关键模式

这些是与正确 shadcn/ui 代码区别最大的最常见模式。对于边缘情况，参见上面链接的规则文件。

```tsx
// 表单布局：FieldGroup + Field，而非 div + Label。
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// 验证：Field 上的 data-invalid，控件上的 aria-invalid。
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

// 按钮中的图标：data-icon，无尺寸类。
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// 间距：gap-*，而非 space-y-*。
<div className="flex flex-col gap-4">  // 正确
<div className="space-y-4">           // 错误

// 等尺寸：size-*，而非 w-* h-*。
<Avatar className="size-10">   // 正确
<Avatar className="w-10 h-10"> // 错误

// 状态颜色：Badge 变体或语义化标记，而非原始颜色。
<Badge variant="secondary">+20.1%</Badge>    // 正确
<span className="text-emerald-600">+20.1%</span> // 错误
```

## 组件选择

| 需求                       | 使用                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| 按钮/操作              | 具有适当变体的 `Button`                                                                   |
| 表单输入                | `Input`、`Select`、`Combobox`、`Switch`、`Checkbox`、`RadioGroup`、`Textarea`、`InputOTP`、`Slider` |
| 2-5 个选项之间的切换 | `ToggleGroup` + `ToggleGroupItem`                                                                   |
| 数据显示               | `Table`、`Card`、`Badge`、`Avatar`                                                                  |
| 导航                 | `Sidebar`、`NavigationMenu`、`Breadcrumb`、`Tabs`、`Pagination`                                     |
| 遮罩层                   | `Dialog` (模态框)、`Sheet` (侧面板)、`Drawer` (底部工作表)、`AlertDialog` (确认)       |
| 反馈                   | `sonner` (toast)、`Alert`、`Progress`、`Skeleton`、`Spinner`                                        |
| 命令面板            | `Dialog` 内的 `Command`                                                                           |
| 图表                     | `Chart` (封装 Recharts)                                                                            |
| 布局                     | `Card`、`Separator`、`Resizable`、`ScrollArea`、`Accordion`、`Collapsible`                          |
| 空状态               | `Empty`                                                                                             |
| 菜单                      | `DropdownMenu`、`ContextMenu`、`Menubar`                                                            |
| 工具提示/信息              | `Tooltip`、`HoverCard`、`Popover`                                                                   |

## 关键字段

注入的项目上下文包含这些关键字段：

- **`aliases`** → 使用实际别名前缀进行导入（例如 `@/`、`~/`），永远不要硬编码。
- **`isRSC`** → 当为 `true` 时，使用 `useState`、`useEffect`、事件处理器或浏览器 API 的组件需要在文件顶部添加 `"use client"`。在建议指令时始终引用此字段。
- **`tailwindVersion`** → `"v4"` 使用 `@theme inline` 块；`"v3"` 使用 `tailwind.config.js`。
- **`tailwindCssFile`** → 定义自定义 CSS 变量的全局 CSS 文件。始终编辑此文件，永远不要创建新文件。
- **`style`** → 组件视觉处理（例如 `nova`、`vega`）。
- **`base`** → 基础库 (`radix` 或 `base`)。影响组件 API 和可用属性。
- **`iconLibrary`** → 决定图标导入。`lucide` 使用 `lucide-react`，`tabler` 使用 `@tabler/icons-react` 等。永远不要假设 `lucide-react`。
- **`resolvedPaths`** → 组件、工具函数、钩子等的确切文件系统目标位置。
- **`framework`** → 路由和文件约定（例如 Next.js App Router 与 Vite SPA）。
- **`packageManager`** → 用于任何非 shadcn 依赖安装（例如 `pnpm add date-fns` 与 `npm install date-fns`）。

参见 [cli.md — `info` 命令](./cli.md) 获取完整字段参考。

## 组件文档、示例和用法

运行 `npx shadcn@latest docs <component>` 获取组件文档、示例和 API 参考的 URL。获取这些 URL 以获取实际内容。

```bash
npx shadcn@latest docs button dialog select
```

**在创建、修复、调试或使用组件时，始终先运行 `npx shadcn@latest docs` 并获取 URL。** 这确保你使用的是正确的 API 和用法模式，而不是猜测。

## 工作流

1. **获取项目上下文** — 已在上文注入。如需刷新，请再次运行 `npx shadcn@latest info`。
2. **首先检查已安装的组件** — 在运行 `add` 之前，务必从项目上下文中检查 `components` 列表，或列出 `resolvedPaths.ui` 目录。不要导入尚未添加的组件，也不要重复添加已安装的组件。
3. **查找组件** — `npx shadcn@latest search`。
4. **获取文档和示例** — 运行 `npx shadcn@latest docs <component>` 获取 URL，然后拉取它们。使用 `npx shadcn@latest view` 浏览你尚未安装的注册表项目。要预览对已安装组件的更改，请使用 `npx shadcn@latest add --diff`。
5. **安装或更新** — `npx shadcn@latest add`。更新现有组件时，请先用 `--dry-run` 和 `--diff` 预览更改（见下文[更新组件](#updating-components)）。
6. **修复第三方组件中的导入** — 从社区注册表（如 `@bundui`、`@magicui`）添加组件后，检查添加的非 UI 文件中是否存在硬编码的导入路径，如 `@/components/ui/...`。这些路径与项目的实际别名不匹配。使用 `npx shadcn@latest info` 获取正确的 `ui` 别名（如 `@workspace/ui/components`），并相应重写导入。CLI 会为其自身的 UI 文件重写导入，但第三方注册表组件可能使用与项目不匹配的默认路径。
7. **审查已添加的组件** — 从任何注册表添加组件或区块后，**务必阅读添加的文件并验证其正确性**。检查是否缺少子组件（如没有 `SelectGroup` 的 `SelectItem`）、缺少导入、组合不正确，或违反[关键规则](#critical-rules)。还要用项目上下文中的 `iconLibrary` 替换任何图标导入（例如，如果注册表项目使用 `lucide-react` 但项目使用 `hugeicons`，请相应交换导入和图标名称）。在继续之前修复所有问题。
8. **注册表必须明确** — 当用户要求添加区块或组件时，**不要猜测注册表**。如果未指定注册表（例如用户说"添加一个登录区块"但未指定 `@shadcn`、`@tailark` 等），询问应使用哪个注册表。永远不要代表用户默认选择一个注册表。
9. **切换预设** — 先询问用户：**重新安装**、**合并**还是**跳过**？
   - **重新安装**：`npx shadcn@latest init --preset <code> --force --reinstall`。覆盖所有组件。
   - **合并**：`npx shadcn@latest init --preset <code> --force --no-reinstall`，然后运行 `npx shadcn@latest info` 列出已安装的组件，接着对每个已安装的组件使用 `--dry-run` 和 `--diff` 单独进行[智能合并](#updating-components)。
   - **跳过**：`npx shadcn@latest init --preset <code> --force --no-reinstall`。仅更新配置和 CSS，保持组件原样。
   - **重要**：始终在用户的项目目录中运行预设命令。CLI 会自动从 `components.json` 保留当前的基础（`base` 与 `radix`）。如果必须使用临时目录（例如用于 `--dry-run` 比较），请显式传递 `--base <current-base>` —— 预设代码不包含基础信息。

## 更新组件

当用户要求从上游更新组件同时保留其本地更改时，请使用 `--dry-run` 和 `--diff` 进行智能合并。**永远不要手动从 GitHub 获取原始文件 —— 始终使用 CLI。**

1. 运行 `npx shadcn@latest add <component> --dry-run` 查看将受影响的所有文件。
2. 对每个文件，运行 `npx shadcn@latest add <component> --diff <file>` 查看上游与本地之间的更改。
3. 根据差异针对每个文件决定：
   - 无本地更改 → 可安全覆盖。
   - 有本地更改 → 读取本地文件，分析差异，在保留本地修改的同时应用上游更新。
   - 用户说"直接更新全部" → 使用 `--overwrite`，但需先确认。
4. **未经用户明确批准，切勿使用 `--overwrite`。**

## 快速参考

```bash
# 创建新项目。
npx shadcn@latest init --name my-app --preset base-nova
npx shadcn@latest init --name my-app --preset a2r6bw --template vite

# 创建 monorepo 项目。
npx shadcn@latest init --name my-app --preset base-nova --monorepo
npx shadcn@latest init --name my-app --preset base-nova --template next --monorepo

# 初始化现有项目。
npx shadcn@latest init --preset base-nova
npx shadcn@latest init --defaults  # shortcut: --template=next --preset=base-nova

# 添加组件。
npx shadcn@latest add button card dialog
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add --all

# 在添加/更新前预览更改。
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
npx shadcn@latest add @acme/form --view button.tsx

# 搜索注册表。
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest search @tailark -q "stats"

# 获取组件文档和示例 URL。
npx shadcn@latest docs button dialog select

# 查看注册表项目详情（适用于尚未安装的项目）。
npx shadcn@latest view @shadcn/button
```

**命名预设：** `base-nova`, `radix-nova`
**模板：** `next`、`vite`、`start`、`react-router`、`astro`（均支持 `--monorepo`）和 `laravel`（不支持 monorepo）
**预设代码：** 以 `a` 开头的 Base62 字符串（如 `a2r6bw`），来自 [ui.shadcn.com](https://ui.shadcn.com)。

## 详细参考

- [rules/forms.md](./rules/forms.md) — FieldGroup、Field、InputGroup、ToggleGroup、FieldSet、验证状态
- [rules/composition.md](./rules/composition.md) — Groups、overlays、Card、Tabs、Avatar、Alert、Empty、Toast、Separator、Skeleton、Badge、Button loading
- [rules/icons.md](./rules/icons.md) — data-icon、图标尺寸、将图标作为对象传递
- [rules/styling.md](./rules/styling.md) — 语义化颜色、变体、className、间距、尺寸、截断、暗黑模式、cn()、z-index
- [rules/base-vs-radix.md](./rules/base-vs-radix.md) — asChild 与 render、Select、ToggleGroup、Slider、Accordion
- [cli.md](./cli.md) — 命令、标志、预设、模板
- [customization.md](./customization.md) — 主题、CSS 变量、扩展组件
