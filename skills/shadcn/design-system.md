# 根据 DESIGN.md 构建设计系统

从 preset 构建新应用，安装所有组件，根据 `DESIGN.md` 重新设置样式，然后渲染设计系统页面。

触发短语："build me a design system using <preset>"、"apply this DESIGN.md"、"create a showcase / design system page"、"make shadcn look like <brand>"。

## 目录

- 需要确认的输入
- 第 1 步：搭建项目
- 第 2 步：安装所有组件
- 第 3 步：阅读 DESIGN.md
- 第 4 步：将令牌映射到主题
- 第 5 步：将组件配方映射到变体
- 第 6 步：构建设计系统页面（[design-system-page.md](./design-system-page.md)）
- 第 7 步：验证
- 返回报告

---

## 需要确认的输入

| 输入      | 默认值                              | 说明                                                                                                                                     |
| --------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Preset    | 可选                                | Code（`b0`）、样式名称（`luma`）或 URL。直接传入，不要手动解码。没有 preset 时选择一个样式（参见第 1 步）。 |
| DESIGN.md | 必填                                | 路径、URL 或粘贴的内容。将其复制到新应用根目录并命名为 `DESIGN.md`。                                      |
| Template  | `vite`                              | 用户提到 Next.js、App Router 或 SSR 时使用 `next`。                                                  |
| 应用名称  | 从 DESIGN.md 中的品牌名推导          | 使用 kebab-case。                                                                                     |
| Base      | `base`                              | 没有 preset code 时传入 `--base`。只有用户明确要求时才使用 `radix`。初始化后通过 `info --json` 判断使用 `render` 还是 `asChild`。 |

如果无法读取 DESIGN.md 路径（某些主机上的 macOS 隐私设置会阻止访问 `~/Downloads` 和 `~/Desktop`），请让用户将其复制到工作目录。不要猜测其内容。

---

## 第 1 步：搭建项目

如果用户提供了 preset code：

```bash
npx shadcn@latest init --preset <code> --template vite --name <app> --no-monorepo -y
```

如果没有 preset code，选择几何特征最接近 DESIGN.md 的样式，并通过 `--base` 传入：

```bash
npx shadcn@latest init --base base --preset <style> --template vite --name <app> --no-monorepo -y
```

然后：

```bash
cd <app>
npx shadcn@latest info --json
```

即使传入 `-y`，`init` 既不带 `--preset` 也不带 `--base` 时仍会停在交互式库选择提示处。始终传入其中一个参数，并同时传入 `--no-monorepo`。

### 选择样式

无论如何，主题都会被 DESIGN.md 替换。样式决定 CSS 变量无法覆盖的几何特征：控件内边距、密度、组件的圆润程度和立体程度。阅读 DESIGN.md 的圆角比例、控件高度、阴影和布局密度后再选择：

| 样式   | 特征                                                  | DESIGN.md 适用情况                                                       |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `vega` | 经典的 shadcn/ui 外观。                               | 中性、传统的 SaaS 几何特征，没有极端要求。                                |
| `nova` | 减少内边距和外边距，适合紧凑布局。                      | 32–36px 控件、6–8px 圆角，以及使用细线而非阴影。                             |
| `maia` | 柔和、圆润，间距宽松。                                  | 40px 以上控件、12px 以上卡片圆角、宽松内边距和编辑式节奏。                    |
| `lyra` | 方正、锐利。                                           | 0–4px 圆角、硬朗边缘、等宽或技术感字体。                                    |
| `mira` | 紧凑。                                                 | 密集的数据界面、28–32px 控件和紧凑表格。                                    |
| `luma` | 圆润几何、柔和立体感和舒展布局。                         | 胶囊按钮、柔和的多层阴影、玻璃质感或 macOS 风格的表面。                      |
| `rhea` | 更紧凑的 Luma。                                        | Luma 的柔和感与产品界面密度并存。                                          |
| `sera` | 编辑式、重视排版。                                     | 衬线显示字体、编辑式节奏和杂志般的层级。                                    |

用一行说明所选样式及原因（"Picked maia: 40px controls, 12–16px cards, generous padding"）。如果用户指定了样式，就使用该样式。在编写任何代码前，从 `info` 中读取 `base`、`style`、`iconLibrary`、`tailwindCssFile` 和 `aliases`。

## 第 2 步：安装所有组件

```bash
npx shadcn@latest add --all -y
ls <resolvedPaths.ui>/*.tsx | wc -l
```

统计磁盘上的组件文件数量。不要凭记忆引用组件数量。

然后在应用根部接入 providers：

- 使用 `TooltipProvider` 包裹应用。
- Base UI：使用 `toast` 组件中的 `Toaster` 包裹应用，并调用 `toast.add({ title, description, type })`。Radix：渲染 `sonner` 中的 `<Toaster />`。

然后对应用源代码进行类型检查。在 Vite 应用中，根目录的 `tsc --noEmit` 不会检查任何内容，因为根 tsconfig 只有项目引用：

```bash
npx tsc -p tsconfig.app.json --noEmit   # Vite.
npx tsc --noEmit                        # Next.js.
```

继续之前，修复生成文件中未通过严格检查的问题（例如未使用的 `React` 导入），否则 `vite build` 会失败。

---

## 第 3 步：阅读 DESIGN.md

DESIGN.md 通常包含 YAML frontmatter（`colors`、`typography`、`rounded`、`spacing`、`components`）和正文部分（Overview、Colors、Typography、Layout、Elevation、Shapes、Components、Do's and Don'ts、Responsive、Known Gaps）。有些文件只有带有 `{colors.x}` 引用的正文。两种情况都要处理。

较长文件无法一次读取。先 grep 标题，再完整阅读 frontmatter、**Do's and Don'ts**、**Iteration Guide** 和 **Known Gaps**。这些部分包含覆盖默认值的规则。

编辑前先提取到工作表中：

| 提取项                | 查找内容                                                              |
| --------------------- | --------------------------------------------------------------------- |
| 画布和文字颜色        | `canvas`、`surface`、`ink`、"page floor"、"body text"                 |
| 操作颜色和状态        | `primary`、`-hover`、`-active`、`-pressed`、`-disabled`、`on-primary` |
| 次要操作              | `button-secondary` 的填充色、文字和边框                                  |
| 表面                  | 卡片填充色、柔和色带、深色产品表面                                       |
| 线条                  | `hairline`、边框透明度、"1px solid"                                     |
| 焦点                  | outline 或 ring、颜色、宽度、偏移量、透明度                               |
| 字体系列              | display、body、mono 以及文档中的 **substitutes**                       |
| 字体比例              | 每个令牌的字号、字重、行高和字距                                         |
| 圆角比例              | 每个值及其适用范围                                                      |
| 立体感                | 每个阴影层级，原样记录                                                    |
| 控件高度              | button、input、ghost、icon-button 的高度和内边距                         |
| 硬性规则              | 每个 "Don't" 和 "never"                                               |

---

## 第 4 步：将令牌映射到主题

只编辑 `tailwindCssFile`。DESIGN.md 提供十六进制值时保留这些值。不要将其转换为 OKLCH。

### 角色映射

| DESIGN.md 角色                              | shadcn 变量                                                   |
| -------------------------------------------- | ----------------------------------------------------------- |
| 画布 / 表面 / 页面底色                       | `--background`                                              |
| 墨色 / 标题文字                             | `--foreground`、`--card-foreground`、`--popover-foreground` |
| 主 CTA 填充色 / on-primary                   | `--primary` / `--primary-foreground`                        |
| 主色悬停、按下或激活填充色                   | 新增 `--primary-active`（或 `--primary-pressed`）             |
| 次要按钮填充色 / 文字                        | `--secondary` / `--secondary-foreground`                    |
| 柔和色带、交替区块                           | `--muted`                                                   |
| 次要或描述性文字                             | `--muted-foreground`                                        |
| ghost 悬停底色、激活标签页、菜单高亮         | `--accent` / `--accent-foreground`                          |
| 卡片 / 特色卡片填充色                        | `--card`                                                    |
| 浮动层（菜单、对话框）                        | `--popover`（通常为画布色）                                  |
| 细线 / 结构边框                             | `--border`、`--input`                                       |
| 焦点颜色                                    | `--ring`                                                    |
| 错误 / 校验                                  | `--destructive`                                             |
| 插图强调色                                  | `--chart-1` … `--chart-5`，以及命名令牌                       |
| 侧边栏或导航栏表面                           | `--sidebar-*`                                               |

没有对应 shadcn 插槽的每个令牌都应在 `:root` 中定义变量（值发生变化时也在 `.dark` 中定义），并在 `@theme inline` 中注册：

```css
:root {
  --primary-active: #a9583e;
  --surface-card: #efe9de;
}

@theme inline {
  --color-primary-active: var(--primary-active);
  --color-surface-card: var(--surface-card);
}
```

### 圆角

DESIGN.md 的圆角比例通常无法套用 `--radius` 的倍数。改为在 `@theme inline` 中固定每个级别。以下是 base-nova 组件使用的类：

| 类            | 使用位置                                         |
| ------------- | ----------------------------------------------- |
| `rounded-sm`  | 小型强调元素                                     |
| `rounded-md`  | 菜单、select 和 command 项                       |
| `rounded-lg`  | 按钮、输入框、select、标签页、弹出框、菜单         |
| `rounded-xl`  | 卡片、对话框、command                             |
| `rounded-2xl` | Toast、大型容器                                  |
| `rounded-4xl` | Badge（胶囊）                                    |

```css
@theme inline {
  /* DESIGN.md step → Tailwind class used by that component. */
  --radius-sm: 4px; /* xs: accents. */
  --radius-md: 6px; /* sm: menu items. */
  --radius-lg: 8px; /* md: buttons, inputs. */
  --radius-xl: 12px; /* lg: cards, dialogs. */
  --radius-2xl: 16px; /* xl: toasts, hero containers. */
  --radius-3xl: 16px;
  --radius-4xl: 9999px; /* pill: badges. */
}
```

替换 `@theme inline` 中现有的 `--radius-*` 行，不要再添加第二个代码块。确认已安装样式使用的类：

```bash
grep -ohE "rounded-(\[[^ \"]+\]|[a-z0-9]+)" <ui>/*.tsx | sort | uniq -c
```

`rounded-[min(var(--radius-md),Npx)]` 会限制小按钮和 select 触发器的圆角上限。如果 DESIGN.md 要求更圆润的小控件，请编辑这个上限。

### 立体感

在 `@theme` 中覆盖 Tailwind 的阴影比例，不要在 `@theme inline` 中覆盖。多层阴影必须原样复制。如果系统只使用细线，将 `--shadow-xs` 设置为 `0 0 #0000`，因为输入框和轮廓按钮会使用它。

```css
@theme {
  --shadow-xs: 0 0 #0000;
  --shadow-sm: 0 1px 3px rgb(20 20 19 / 0.08);
  --shadow-lg: 0 1px 3px rgb(20 20 19 / 0.08), 0 8px 24px rgb(20 20 19 / 0.06);
}
```

### 字体

品牌字体通常需要授权。使用 DESIGN.md 指定的替代字体，通过项目的包管理器从 Fontsource 安装，并在 CSS 文件顶部导入引用的每个字族：

```bash
npm install @fontsource-variable/inter @fontsource-variable/cormorant-garamond @fontsource-variable/jetbrains-mono
```

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/cormorant-garamond";
@import "@fontsource-variable/jetbrains-mono";

@theme inline {
  --font-sans: "Inter Variable", -apple-system, system-ui, sans-serif;
  --font-serif: "Cormorant Garamond Variable", Garamond, serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, monospace;
  --font-heading: var(--font-sans);
}
```

`--font-heading` 用于设置小型组件标题（`CardTitle`、`DialogTitle`、`SheetTitle`）的样式。只有当显示字体在 16px 下仍然清晰时，才将它指向显示字体；否则保持为 sans，并将显示令牌用于页面标题。

### 字号比例

将每个排版令牌转换为 `type-*` 工具类。不要为此使用 `--text-*` 主题键，因为 `cn()` 会将未知的 `text-*` 类当作颜色处理，并在它与 `text-muted-foreground` 相邻时丢弃先出现的那个类。

```css
@utility type-display-lg {
  font-family: var(--font-serif);
  font-size: clamp(34px, 3vw + 16px, 48px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.021em;
}

@utility type-caption-upper {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
```

- 限制显示字号以适配移动端。将像素字距转换为 `em`（`-1px / 48px = -0.021em`），这样字号缩小时比例仍然保持不变。
- 遵守字距（低于某个字号时不设置）和字重（显示文字永远不加粗）的规则。

### 深色模式

- **DESIGN.md 定义了深色表面**（产品模型、页脚）：将它们放入 `.dark`。由于 shadcn 的 `@custom-variant dark (&:is(.dark *))` 作用域覆盖后代元素，在任意区块上使用 `className="dark"` 都会让其中的所有组件渲染为深色令牌。将它用于深色色带、特色定价卡片和页脚。
- **DESIGN.md 仅定义了浅色模式**：根据品牌已知的深色表面推导 `.dark`，并告知用户这是推导结果。

### 焦点

匹配文档中定义的焦点样式：

- **带透明度的 Ring**（例如“3px coral at 15%”）：在字段组件（`input`、`textarea`、`input-group`、`select`、`native-select`、`combobox`、`input-otp`）中，将 `ring-ring/50` 替换为文档规定的透明度。
- **带偏移量的实线 outline**：添加未分层规则，使其优先级高于 `outline-none`，并取消 ring 阴影：

```css
:is(
  button,
  a[href],
  [role="button"],
  [role="tab"],
  [role="checkbox"],
  [role="radio"],
  [role="switch"],
  [role="slider"]
):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  --tw-ring-shadow: 0 0 #0000;
}
```

这只覆盖操作元素，字段控件继续使用 ring。如果 DESIGN.md 也将 outline 应用于字段，请将 `input, textarea, select, [role="combobox"]` 加入选择器。

---

## 第 5 步：将组件配方映射到变体

通过编辑已安装组件源代码中的 `cva` 变体重新设置样式。保留现有变体名称，以便用法保持标准。只有在 DESIGN.md 定义了独立配方时才添加变体。

| DESIGN.md 配方                        | shadcn 目标                                  |
| ------------------------------------ | -------------------------------------------- |
| `button-primary`                     | `Button` `default`                           |
| `button-secondary`（着色填充）       | `Button` `secondary`                         |
| `button-secondary`（画布 + 边框）    | `Button` `outline`                           |
| `button-ghost`、导航链接             | `Button` `ghost`                             |
| 文字链接                            | `Button` `link`                              |
| 圆形图标按钮                         | `Button` `icon*` 尺寸 + `rounded-full`       |
| `badge-pill`、`badge-<accent>`       | `Badge` `secondary`、`default`、新变体        |
| `card`、`feature-card`               | `Card`（填充色、ring、`--card-spacing`）      |
| `text-input`、`-focused`             | `Input`、`InputGroup`、`Select`、`Textarea`  |
| `category-tab`、筛选行                | `Tabs` `default` 列表 + trigger              |

**控件高度要一起调整。**按钮高度发生变化时，同时修改字段控件的高度，否则表单会错位。在 base-nova 中，默认的 32px 位于：

| 文件                | 类                               |
| ------------------- | -------------------------------- |
| `button.tsx`        | `h-8`、`size-8`（图标）           |
| `input.tsx`         | `h-8`                            |
| `input-group.tsx`   | `h-8`                            |
| `select.tsx`        | `data-[size=default]:h-8`        |
| `native-select.tsx` | `h-8`                            |
| `combobox.tsx`      | `min-h-8`（chips）                |
| `toggle.tsx`        | `h-8 min-w-8`                    |
| `input-otp.tsx`     | `size-8`（slot）                  |
| `tabs.tsx`          | `group-data-horizontal/tabs:h-8` |
| `menubar.tsx`       | `h-8`                            |
| `command.tsx`       | `h-8!`（输入组）                  |

编辑前重新 grep（`grep -n "\bh-8\b\|size-8\b" <ui>/*.tsx`）；其他样式使用不同的值。

**状态。**严格遵循文档中的状态。如果 DESIGN.md 说“仅在按下时变暗”，就使用 `active:` 而不是 `hover:`。即使规范没有写明，也要为 ghost 按钮和菜单项保留 hover，并告知用户这一点。

**硬性规则。**完成前将每一条“Don't”转换为检查项，例如：圆角不得超出比例、按钮不得使用强调色、显示文字不得加粗。

---

## 第 6 步：构建设计系统页面

遵循 [design-system-page.md](./design-system-page.md)。它规定了区块结构、各项基础的展示方式、组件分层和区块结构、固定状态矩阵、边界情况、做法/避免做法对比以及配方。

简而言之：

1. 先处理基础：将颜色角色作为经过对比度检查的配对，添加调色板、字号示例表、间距、圆角和立体感阶梯。
2. 按层级处理组件：基础组件需要变体 × 状态矩阵、尺寸阶梯和图标行；组合组件需要典型示例、逐步增加的元素和边界情况；覆盖层需要真实触发器。
3. 然后根据 DESIGN.md 的规则渲染做法/避免做法对比，使用组件重建 DESIGN.md 中命名的配方，并添加一个示例界面。

从 `assets/showcase/` 复制辅助文件（`preview-states.css`、`state-matrix.tsx`、`color-pair.tsx`）。在 Vite 中将区块放在 `src/showcase/<section>.tsx`，在 Next.js 中放在 `app/design-system/`。使用符合品牌语气的文案。

### 常见陷阱

| 组件                | 陷阱                                                                        | 修复                                                                         |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Command` 内联      | cmdk 在挂载时将第一个项目滚动到视野内，导致页面跳到该位置。                       | 使用 `value={value} onValueChange={setValue}` 控制，并将初始值设为 `"none"`。 |
| `Sidebar`           | 默认侧边栏是 `fixed`，会脱离预览框。                                           | `<SidebarProvider className="min-h-0">` + `<Sidebar collapsible="none">`。   |
| `MessageFooter`     | 放在 `MessageContent` 旁边时，会变成被挤压的 flex 列。                          | 将它放在 `MessageContent` 内。                                               |
| `Select`（base）    | `SelectValue` 显示原始值。                                                     | 为 `Select` 传入 `items`。                                                   |
| `Resizable`         | react-resizable-panels v4 移除了 `direction` 和数字尺寸。                       | 使用 `orientation="horizontal"`、`defaultSize="40%"`。                       |
| `DirectionProvider` | provider 本身不会翻转布局。                                                   | 同时在包装器上设置 `dir="rtl"`。                                             |
| `NavigationMenu`    | 内容被示例框裁剪。                                                            | 在该框中保留底部内边距。                                                      |
| Header 导航链接     | `Button` 会渲染为 `<button>`。                                                | Base：`nativeButton={false} render={<a href="#…" />}`。Radix：`asChild`。       |

### 覆盖率检查

```bash
node <skill-dir>/scripts/showcase-coverage.mjs src/components/ui src   # Vite.
node <skill-dir>/scripts/showcase-coverage.mjs components/ui app      # Next.js.
```

它会列出没有被任何展示文件导入的组件文件。修复这些问题，直到列表为空。在 Base UI 项目中，`add --all` 会同时安装 `toast` 和 `sonner`；在 Feedback 区块中将 `sonner` 放在 `toast` 旁边展示，这样列表才能清空。

---

## 第 7 步：验证

启动开发服务器并在浏览器中检查：

1. 应用类型检查通过（参见第 2 步）。
2. 没有控制台错误。
3. 在 `scrollY === 0` 处加载。任何其他值都表示组件在挂载时抢夺了滚动位置。
4. 在 375px 和 1280px 下没有水平溢出：`document.documentElement.scrollWidth <= innerWidth`。
5. 为 hero、基础、一个表单区块和一个深色色带截图。根据 DESIGN.md 比较画布颜色、CTA 颜色、显示字体、圆角和焦点 ring。
6. 切换一次深色模式。

---

## 返回报告

- 应用路径、开发 URL、从磁盘统计的组件数量。
- 选择的样式（未提供 preset 时）及原因。
- 各项映射关系：颜色、字体（及替代字体）、圆角、阴影和焦点。
- 低于 4.5:1 的对比度配对，包括 DESIGN.md 自身指定的配对。
- 修改的每个组件文件及修改原因。
- 与 DESIGN.md 的每一项有意偏差（推导的深色模式、保留的 hover、替代字体）。
