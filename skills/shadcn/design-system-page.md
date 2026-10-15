# 设计系统页面

设计系统页面应包含什么内容，以及如何展示这些内容。本指南提炼自 Primer、Carbon、Atlassian、GitLab Pajamas、Cloudscape、Twilio Paste、Salesforce Lightning、Material 3、Evergreen 和 Orbit，也参考了 EightShapes 的组件文档指南。

## 内容

- 原则
- 页面结构
- 基础
- 组件：分层和区块结构
- 无交互状态
- 边界情况
- 做法与避免做法
- 配方和示例界面
- 辅助文件
- 检查清单

---

## 原则

1. **先基础，再组件，最后组合。**每个成熟系统都遵循这个顺序（Primer、Carbon、Paste、Cloudscape、M3）。
2. **展示角色，而不是调色板。**将每种颜色展示为与前景色配对的表面，并显示测得的对比度。原始调色板放在后面。
3. **从典型情况开始。**每个组件先展示真实内容中最常见的用法，然后按优先级展示变体，再展示共用维度（尺寸、图标），最后展示状态。
4. **固定状态，让评审者一眼看到。**无需交互并排渲染 hover、focus 和 pressed。使用统一标签，永远不要将状态名称放进组件内部。
5. **不要渲染所有组合。**基础组件使用变体 × 状态矩阵；组合组件使用典型示例并逐步增加内容。穷举组合应放在测试中（Material 3 已将组件列表从 700 多个变体缩减到约 45 个）。
6. **使用符合品牌语气的真实内容。**不要使用 lorem ipsum。包含棘手情况：长文本、空状态、错误和加载中。
7. **组合才能证明系统。**以 DESIGN.md 自身的配方和一个仅使用这些令牌与组件构建的真实界面收尾。
8. **让 DESIGN.md 的规则可见。**将其中的 Do's and Don'ts 转换为渲染出来的做法/避免做法对比。

---

## 页面结构

| #   | 区块                       | 内容                                                                                                                                  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Header                     | 系统名称、“Themed from DESIGN.md”、区块锚点、浅色/深色切换、主要 CTA。                                                               |
| 2   | Overview                   | DESIGN.md 的 hero 配方：显示字体、一行品牌个性和标志性产物。                                                                        |
| 3   | Foundations                | 颜色角色、调色板、排版、间距、圆角、立体感、动效（如有指定）和图标。                                                                  |
| 4   | Actions                    | Button、ButtonGroup、Toggle、ToggleGroup、Badge、Kbd。                                                                                |
| 5   | Inputs                    | Field、Input、InputGroup、Textarea、Select、NativeSelect、Combobox、Checkbox、RadioGroup、Switch、Slider、InputOTP、Calendar、Label。 |
| 6   | Navigation                | Tabs、Breadcrumb、Pagination、NavigationMenu、Menubar、Sidebar。                                                                      |
| 7   | Data display              | Card、Table、Chart、Item、Avatar、Accordion、Collapsible、Carousel、ScrollArea、Resizable、AspectRatio、Separator。                   |
| 8   | Feedback                  | Alert、toast（Base UI 项目还包括 Sonner）、Progress、Spinner、Skeleton、Empty。                                                        |
| 9   | Overlays                  | Dialog、AlertDialog、Sheet、Drawer、Popover、HoverCard、Tooltip、DropdownMenu、ContextMenu、Command。                                |
| 10  | Conversation              | MessageScroller、Message、Bubble、Attachment、Marker、Questionnaire。参见 [rules/chat.md](./rules/chat.md)。                         |
| 11  | Do and Don't              | 针对 DESIGN.md 规则渲染的对比。                                                                                                      |
| 12  | Recipes and example screen | DESIGN.md 中命名的组件，以及一个真实界面。                                                                                            |
| 13  | Footer                    | DESIGN.md 的页脚配方。                                                                                                                |

在 RTL 有意义的地方使用 DirectionProvider（例如 Inputs 或 Navigation 中的 RTL 行）。

交替的区块表面应体现 DESIGN.md 对色带的节奏安排。在区块上使用 `className="dark"`，即可用相同组件渲染深色色带。

---

## 基础

### 颜色角色

使用配对网格：每一项都将表面渲染为对应前景色的“Aa”，并显示令牌名称、解析后的值和测得的对比度（Paste、Material 3、Pajamas）：

| 配对                                  | 必需         |
| ------------------------------------- | ------------ |
| `background` / `foreground`           | 是           |
| `card` / `card-foreground`            | 是           |
| `popover` / `popover-foreground`      | 是           |
| `primary` / `primary-foreground`      | 是           |
| `secondary` / `secondary-foreground`  | 是           |
| `muted` / `muted-foreground`          | 是           |
| `accent` / `accent-foreground`        | 是           |
| `destructive` on `background`         | 是           |
| `background` 上的每个额外文字令牌       | 已定义时     |

使用辅助文件中的 `ColorPair`。它会实时测量对比度，并在主题变化时重新测量。即使 DESIGN.md 有所规定，也要报告正文大小文字低于 4.5:1 的任何配对。品牌主色在 14px 标签下只有 3:1 是一个真实问题。

### 调色板

按照 DESIGN.md 的分组方式展示色板（品牌、表面、文字、状态、强调色）。为每个色板标注 DESIGN.md 中的名称和令牌，例如“Warm Stone · `surface-warm`”。这里也要展示 `border`、`input`、`ring`、`chart-1…5` 和 `sidebar-*`。

### 排版

使用字号示例表，每个类型令牌占一行（Cloudscape、Carbon、Atlassian）：

| 列        | 内容                                              |
| -------- | ------------------------------------------------- |
| Token    | `type-display-lg`                                 |
| 规格     | size / line height / weight / tracking            |
| 用途     | 从 DESIGN.md 中提取的“Section heads”              |
| 示例     | 使用该令牌设置的真实文案，截断为一行               |

按 display → title → body → label/caption → code 的顺序排列各行。在表格下方展示一段正文大小的连续文字，其中包含链接和内联代码，以便观察行长和节奏。

### 间距

先以带标签的水平条展示基础单位和比例（Carbon、Atlassian），再展示语义阶梯：组件内部、相关项目之间、分组之间、区块之间（Pajamas）。如果 DESIGN.md 没有定义间距，则跳过此项。

### 圆角

使用同一个方框展示每个级别，并标注令牌、值和使用位置（Material 3）。例如：`md · 8px · buttons, inputs`。

### 立体感

将每个级别展示为承载相应组件的凸起表面（Pajamas、Material 3）：画布和色带使用 flat，卡片使用 hairline，弹出框和菜单使用 soft，对话框使用 deep。

### 动效和图标

只有在 DESIGN.md 定义了时长或缓动时才展示动效：使用表格列出令牌、毫秒数和用途。对于图标，按组件使用的每个尺寸展示一行图标库，并分别使用 `foreground` 和 `muted-foreground`。

---

## 组件：分层和区块结构

### 分层

| 层级         | 组件                                                                                                                                                                                                                  | 展示方式                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 基础组件      | Button、Badge、Toggle、ToggleGroup、Input、Textarea、Select、NativeSelect、Checkbox、RadioGroup、Switch、Slider、Tabs                                                                                                  | 变体 × 状态矩阵、尺寸阶梯、图标行。                                  |
| 字段          | Field、InputGroup、Combobox、InputOTP、Calendar、Label                                                                                                                           | 典型字段，然后是描述、错误、禁用和必填状态。                          |
| 组合组件      | Card、Table、Item、Avatar、Alert、Empty、toast、Sonner、Accordion、Collapsible、Breadcrumb、Pagination、Progress、Skeleton、Spinner、Carousel、Chart、ScrollArea、Resizable、AspectRatio、Separator、Kbd、ButtonGroup | 典型示例，然后逐项增加元素，最后展示边界情况。 |
| 覆盖层        | Dialog、AlertDialog、Sheet、Drawer、Popover、HoverCard、Tooltip、DropdownMenu、ContextMenu、Menubar、NavigationMenu、Command                                                                                           | 每个覆盖层使用一个真实触发器，并标注它打开的内容。                      |
| 外壳          | Sidebar、DirectionProvider                                                                                                                                                                                            | 在带框预览中内联展示（`collapsible="none"`）。                        |
| 对话          | MessageScroller、Message、Bubble、Attachment、Marker、Questionnaire                                                                                                                                                   | 一个真实对话线程，然后是变体行。                                      |

### 区块结构

每个组件区块按以下顺序排列。不适用的部分可以跳过：

1. **名称和一句用途说明。**如果 DESIGN.md 中有对应配方，使用其中的措辞。
2. **典型示例**，使用真实内容。
3. **变体**，按优先级排列（primary 在 secondary 之前，secondary 在 ghost 之前），每个变体附一行“何时使用”。
4. **尺寸**，从小到大排列。
5. **带图标**：前置、后置和仅图标。
6. **状态**：基础组件使用矩阵，其他组件使用单个示例。
7. **边界情况**（见下文）。

宽组件（Table、NavigationMenu、Menubar、Sidebar、Chart、MessageScroller）横跨整行。

---

## 无交互状态

使用 `data-preview` 属性固定交互状态。覆盖 hover、focus-visible 和 active 变体，使它们也匹配该属性。将 [assets/showcase/preview-states.css](./assets/showcase/preview-states.css) 复制到 `tailwindCssFile`：

```css
@custom-variant hover {
  @media (hover: hover) {
    &:hover {
      @slot;
    }
  }
  &[data-preview~="hover"] {
    @slot;
  }
}
@custom-variant focus-visible (&:focus-visible, &[data-preview~="focus"]);
@custom-variant active (&:active, &[data-preview~="active"]);
```

如果主题添加了未分层的焦点规则（例如 outline 样式的焦点），也要将 `[data-preview~="focus"]` 加入其选择器。

使用辅助文件中的 `StateMatrix` 和 `previewState` 渲染矩阵：

```tsx
const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const

<StateMatrix
  rows={variants}
  render={(variant, state) => (
    <Button variant={variant} {...previewState(state)}>
      Save draft
    </Button>
  )}
/>
```

列为 default、hover、focus、active 和 disabled。Button 需要使用 Spinner + `disabled` 添加 `loading`，字段需要使用 `invalid`（`aria-invalid`）：

```tsx
<StateMatrix
  rows={["input"] as const}
  states={["default", "hover", "focus", "disabled", "invalid"]}
  render={(_, state) => (
    <Input
      placeholder="you@company.com"
      aria-invalid={state === "invalid" || undefined}
      {...previewState(state)}
    />
  )}
/>
```

如果 DESIGN.md 表示某个状态不会变化（“primary 仅在按下时变暗”），就让该列保持不变。矩阵可以证明实现遵循规范。

---

## 边界情况

在承受这些情况的组件旁边展示它们：

| 情况       | 位置                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| 长文本     | 按钮标签、Badge、Item 标题、表格单元格、Breadcrumb（截断）。              |
| 空状态     | 没有行的 Table → Empty、没有匹配项的 Combobox、空的 Command。             |
| 错误       | 带 FieldError 的字段、destructive Alert、`state="error"` 的 Attachment。 |
| 加载中     | 带 Spinner 的按钮、Card 和 Item 的 Skeleton、Progress、加载中的 toast。   |
| 大量项目   | 带计数的 AvatarGroup、带省略号的 Pagination、ScrollArea 列表。             |
| 缺少图片   | 回退到 AvatarFallback 的 Avatar。                                       |
| 禁用       | 每个字段及其 Field 的 `data-disabled`。                                  |
| RTL        | DirectionProvider 中带 `dir="rtl"` 的一行。                              |

---

## 做法与避免做法

选择两到四条最容易违反的 DESIGN.md 规则，并将每条渲染为一组对比（Primer、Orbit、Carbon）：

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <Example title="Do">
    <Button>Get started</Button>
    <Button variant="outline">Contact sales</Button>
  </Example>
  <Example title="Don't">
    <Button>Get started</Button>
    <Button>Contact sales</Button>
  </Example>
</div>
```

为每组添加一行规则说明，例如“每组只能有一个主要操作”。使用 `destructive` 文字标记 Don't，不要新增颜色。

---

## 配方和示例界面

**配方。**使用 shadcn 组件和令牌构建 DESIGN.md 中命名的每个组件（`hero-band`、`feature-card`、`pricing-tier-card`、`callout-card-coral`、`footer`）。这些是规范的验收测试。如果某个配方必须使用原始值才能构建，说明令牌映射不完整。

**示例界面。**在品牌所属领域中构建一个真实界面（Cloudscape 演示、Paste 页面模板）：可以是设置页面（FieldGroup、Switch、Select、Button），也可以是列表视图（Table、Badge、Pagination、Empty）。只使用令牌和组件。

---

## 辅助文件

将 `assets/showcase/` 中的文件复制到展示目录：

| 文件                 | 用途                                                                     |
| -------------------- | ------------------------------------------------------------------------ |
| `preview-states.css` | 通过 `data-preview` 固定 hover、focus 和 active 的变体覆盖。               |
| `state-matrix.tsx`   | `StateMatrix`（带标签的变体 × 状态表）和 `previewState(state)`。           |
| `color-pair.tsx`     | `ColorPair`：带实时对比度和 WCAG 等级的表面 + 前景色。                    |

这些文件从 `@/lib/utils` 导入 `cn`。将该路径改写为项目的 `utils` 别名。

---

## 检查清单

- [ ] 每个已安装组件都能渲染（运行覆盖率脚本）。
- [ ] 颜色角色以配对形式展示并带有对比度；报告中记录所有低于 4.5:1 的配对。
- [ ] 字号示例覆盖 DESIGN.md 中的每个类型令牌，并使用真实文案。
- [ ] 圆角和立体感阶梯标明使用每个级别的组件。
- [ ] 基础组件拥有状态矩阵；Button 和字段包含 loading 与 invalid。
- [ ] 边界情况包括长文本、空状态、错误、加载中和缺少图片。
- [ ] 针对 DESIGN.md 关键规则提供 Do/Don't 对比。
- [ ] 重建 DESIGN.md 配方，并添加一个示例界面。
- [ ] 页面级主题切换有效；如果 DESIGN.md 有深色表面，至少包含一个作用域内的深色色带。
- [ ] 不使用 lorem ipsum，组件内部也不显示状态名称。
