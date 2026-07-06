# Radix -> Base UI 迁移映射

来源：（1）`apps/v4/registry/bases/{radix,base}/ui/` 中 61 个组件对的机械 diff（真实来源，由我们编写），（2）`radix-ui@1.4.3` 包导出，（3）`@base-ui/react@1.6.0` 的 base-ui.com 文档索引。构建于 2026-07-02，作为迁移代理 `primitives/` 技能的知识库。

## 覆盖矩阵

所有 radix-ui 导出项，按迁移分类：

| Radix primitive | Base UI target | Class |
|---|---|---|
| Accordion | Accordion | 直接（Content->Panel） |
| AlertDialog | Alert Dialog | 重构（Overlay->Backdrop，Content->Popup，Cancel->Close，Action 删除） |
| AspectRatio | none | 缺失：普通 div + CSS `aspect-ratio`（`--ratio` 变量） |
| Avatar | Avatar | 直接 |
| Checkbox | Checkbox | 直接（最干净的 1:1） |
| Collapsible | Collapsible | 直接（Content->Panel） |
| ContextMenu | Context Menu | 重构（菜单映射） |
| Dialog | Dialog | 重构（Overlay->Backdrop，Content->Popup） |
| DropdownMenu | Menu | 重命名 + 重构（规范化菜单映射） |
| Form | Form + Field + Fieldset | 重构（拆分为三个） |
| HoverCard | Preview Card | 重命名 + 定位器模型 |
| Label | none | 缺失：原生 `<label>`（表单内使用 Field.Label） |
| Menubar | Menubar + Menu | 重构（仅 menubar 根节点；menus 委派给 Menu） |
| NavigationMenu | Navigation Menu | 大幅重构（Viewport -> Positioner/Popup/Viewport，Indicator->Icon） |
| Popover | Popover | 定位器模型（Anchor 删除；请根据文档核对） |
| Progress | Progress | 重构（新增 Track/Label/Value 部件，无需手动转换） |
| RadioGroup | Radio Group + Radio | 重构（Item -> Radio.Root，两个子路径导入） |
| ScrollArea | Scroll Area | 直接（Scrollbar/Thumb 重命名） |
| Select | Select | 重构（Viewport->List，ScrollButtons->ScrollArrows，alignItemWithTrigger） |
| Separator | Separator | 直接（可调用；`decorative` 删除） |
| Slider | Slider | 重构（Range->Indicator，新增 Control，thumbAlignment） |
| Switch | Switch | 直接（1:1） |
| Tabs | Tabs | 直接（Trigger->Tab，Content->Panel） |
| Toast | Toast | 重构（不在我们的 registry 配对中；来自文档规范；shadcn 用户大多使用 sonner） |
| Toggle | Toggle | 直接（可调用） |
| ToggleGroup | Toggle Group + Toggle | 直接（items 使用 Toggle primitive） |
| Toolbar | Toolbar | 基本直接（不在我们的配对中；来自文档规范） |
| Tooltip | Tooltip | 定位器模型（delayDuration->Provider 上的 delay） |
| unstable_OneTimePasswordField | OTP Field | 来自文档（我们的 registry 使用 input-otp 替代） |
| unstable_PasswordToggleField | none | 缺失：Input + 自定义切换 |

工具类：

| Radix utility | Base UI equivalent |
|---|---|
| Slot / asChild | `render` prop；手动 Slot 习惯用法使用 `useRender` + `mergeProps` |
| Portal | 无独立项；各组件内的 `Portal` 部件 |
| VisuallyHidden | 无；`sr-only` class |
| AccessibleIcon | 无；`aria-label` + `sr-only` 文本 |
| Direction | Direction Provider |

仅 Base UI 提供（新增能力，不是迁移目标）：Autocomplete、Combobox、
Input、Number Field、Checkbox Group、Meter、Filter、CSP Provider。

更正（dry-run 发现）：Base UI 还提供一个 `Button` primitive
（`@base-ui/react/button`），支持 `render`。使用 Slot/asChild 习惯用法的 shadcn button.tsx 会直接迁移到 `<ButtonPrimitive>`，而不是迁移到手写的 useRender 包装器。useRender + mergeProps 仍然适用于非 button 的多态组件（breadcrumb link、marker）。

迁移中完全不涉及（双方都是第三方）：cmdk（command）、vaul*
（drawer；见 drawer 部分：我们的 base drawer 已从 vaul 移到 `@base-ui/react/drawer`）、
sonner、input-otp、react-day-picker（calendar）、recharts（chart）。

## 通用模式（适用于所有组件）

### 导入
Radix 有两种导入形式；两者都映射到同一个 Base UI 子路径：
- 统一包（当前 shadcn）：
  `import { X as XPrimitive } from "radix-ui"` ->
  `import { X as XPrimitive } from "@base-ui/react/<kebab-name>"`.
- 单独包（旧版/2024 时代，例如 fixture 03）：
  `import * as XPrimitive from "@radix-ui/react-<name>"` ->
  `import { X as XPrimitive } from "@base-ui/react/<kebab-name>"`.
  （命名空间 `* as` 导入会变成命名导入；从 package.json 中移除单独的
  `@radix-ui/react-*` 包。）
无论哪种方式，每个组件都对应一个子路径。
- 类型：`React.ComponentProps<typeof XPrimitive.Part>` -> `XPrimitive.Part.Props`。
  通过 `Pick<XPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">` 获取 Positioner props。
- 单部分原语是可调用的：radix `XPrimitive.Root` -> `XPrimitive`
  （separator、toggle、toggle-group root、radio-group root、menubar root）。

### asChild -> render
- `<Primitive.Close asChild><Button/></Primitive.Close>` ->
  `<Primitive.Close render={<Button/>}>...</Primitive.Close>`.
- 手写 Slot 惯用法（`const Comp = asChild ? Slot.Root : "a"`） ->
  使用 `@base-ui/react/use-render` /
  `@base-ui/react/merge-props` 中的 `useRender` + `mergeProps`；prop 类型为 `useRender.ComponentProps<"a">`。

### Portal / 定位模型（最大的结构性变化）
- Radix：`Portal > Content`，定位 props 放在 Content 上。
- Base UI：`Portal > Positioner > Popup`。`side`、`sideOffset`、`align`、
  `alignOffset`（以及 select 的 `alignItemWithTrigger`）移动到 Positioner；
  Popup 是带样式的盒子。Positioner 通常使用 `isolate z-50`。
- `Overlay` -> `Backdrop`（dialogs、sheets、drawers）。居中的模态框
  （dialog/alert-dialog）使用没有 Positioner 的 Popup。

### 数据属性 / class 钩子
- `data-[state=open]` -> `data-open`; `data-[state=closed]` -> `data-closed`。
- 进入/退出动画：`data-[state=open]:animate-in` /
  `data-[state=closed]:animate-out` -> `data-starting-style:*` /
  `data-ending-style:*`（基于 transition，而不是 keyframes）。
- 新的 Base UI 钩子：`data-popup-open`（打开子菜单/触发器标记）。
- 一些触发器会在 `disabled:*` 之外新增 `aria-disabled:*` 变体
  （accordion、tabs）。

### CSS 自定义属性
- `--radix-<comp>-content-transform-origin` -> `--transform-origin`
- `--radix-<comp>-content-available-height` -> `--available-height`
- `--radix-<comp>-trigger-width` -> `--anchor-width`
- `--radix-accordion-content-height` -> `--accordion-panel-height`
- nav-menu `--radix-navigation-menu-viewport-height/width` ->
  `--positioner-height/width`, `--popup-height/width`, `--available-width`

### Props
- Tooltip Provider：`delayDuration` -> `delay`。
- Select：`position="popper"|"item-aligned"` -> `alignItemWithTrigger` 布尔值。
- Slider：新增 `thumbAlignment`（"edge"）；`Range` -> `Indicator` + 新的 `Control`。
- Navigation Menu：移除 `viewport` 布尔值；`align` 传递给 Positioner。
- `value` / `defaultValue` / `onOpenChange` 签名在包装层保持不变
  （在编写规范时请根据文档逐个验证回调签名；包装器并不会全部覆盖它们）。

## 部分重命名速查

| radix part | Base UI part |
|---|---|
| `*.Root`（单部分组件） | 可调用的 `*Primitive` |
| `Overlay` | `Backdrop` |
| `Content`（overlay 组件） | `Popup`（位于 `Positioner` 内） |
| `Content`（accordion/collapsible/tabs） | `Panel` |
| tabs `Trigger` | `Tab` |
| menu `Label` | `GroupLabel` |
| menu `ItemIndicator` | `CheckboxItemIndicator` / `RadioItemIndicator` |
| `Sub` / `SubTrigger` | `SubmenuRoot` / `SubmenuTrigger` |
| slider `Range` | `Indicator`（+ 新的 `Control`） |
| select `Viewport` | `List` |
| select `ScrollUp/DownButton` | `ScrollUp/DownArrow` |
| scroll-area `ScrollAreaScrollbar` / `ScrollAreaThumb` | `Scrollbar` / `Thumb` |
| nav-menu `Indicator` | `Icon` |
| nav-menu `Viewport` | `Positioner > Popup > Viewport` |
| hover-card `HoverCard*` | `PreviewCard*` |
| radio-group `Item` / `Indicator` | `Radio.Root` / `Radio.Indicator` |
| popover `Anchor` | 已移除（请对照文档确认） |
| alert-dialog `Cancel` / `Action` | `Close` / 已移除（普通 `Button`） |
| separator `decorative` prop | 已移除 |
| Label primitive | 原生 `<label>` |

## 各组件说明

### accordion
Root/Item/Header/Trigger 保持不变；Content -> Panel。Trigger 的 `disabled:*` ->
`aria-disabled:*`。高度变量 -> `--accordion-panel-height`；新增
`data-starting-style:h-0 data-ending-style:h-0`。

### dialog / alert-dialog / sheet
Overlay -> Backdrop，Content -> Popup，Close 保持不变（`asChild` -> `render`）。
Alert-dialog：Cancel -> Close；Action 没有原语（普通 Button）。
Sheet：滑动动画从 animate-in/out 重写为
`data-starting-style` / `data-ending-style`，并根据 `data-[side=...]`
显式设置 translate。居中模态框：没有 Positioner。

### drawer (vaul -> Base UI) — 仅可选，不属于 radix 迁移的一部分
Vaul 不是 radix：在 radix -> base-ui 迁移期间，保持 drawer.tsx
不变并将其报告出来（这是 SKILL.md 中的硬性规则）。此映射仅在
用户明确要求也将 drawer 从 vaul 迁移出去时才适用。
Root 新增 `modal`、`snapPoints`、`swipeDirection`（默认 "down"）、
`showSwipeHandle`。Content（单个）-> `Viewport > Popup > Content`。
`data-[vaul-drawer-direction=...]` -> `data-[swipe-direction=...]` /
`data-[swipe-axis=...]` + `--drawer-*` 变量。新增 SwipeHandle 部件和我
们封装中的一个上下文提供器。这是一次 vaul 迁移，不是 radix 迁移。

### popover / tooltip / hover-card
Portal > Positioner > Popup。Popover：去掉 Anchor，Title 现在是一个真正的
原语部件。Tooltip：Provider 的 `delayDuration` -> `delay`；Content 增加
side/align/alignOffset；默认 sideOffset 从 0 -> 4；Arrow 增加显式的
按侧定位类。HoverCard：原语重命名为 PreviewCard（公开包装器名称仍保持 HoverCard*）。

### menus (dropdown-menu -> Menu; context-menu; menubar)
标准映射：Label -> GroupLabel，ItemIndicator ->
CheckboxItemIndicator/RadioItemIndicator，Sub -> SubmenuRoot，SubTrigger ->
SubmenuTrigger，Content -> Portal > Positioner > Popup，SubContent 由 Content 组件重建。
Content 向上提取 align/alignOffset/side/sideOffset。SubTrigger 打开标记：
`data-popup-open`。Context-menu 有自己的子路径
（`@base-ui/react/context-menu`），结构相同。Menubar：只有 root 以及复选/单选项
是 menubar/menu 原语；其余全部委托给 Menu 包装器（radix Menubar.Menu -> Menu.Root）。

### select
Label -> GroupLabel，Viewport -> List，ScrollUp/DownButton ->
ScrollUp/DownArrow。Icon/ItemIndicator 的 `asChild` -> `render`。
`position` -> `alignItemWithTrigger`（默认 true），用于 Positioner。变量 ->
`--available-height` / `--anchor-width` / `--transform-origin`。

### form controls
Checkbox：1:1。Switch：1:1。Radio group：来自
`@base-ui/react/radio-group` 的 group（可调用），条目来自 `@base-ui/react/radio`
（`Radio.Root` + `Radio.Indicator`）。Slider：`Root > Control > Track >
Indicator` + Thumbs，`thumbAlignment="edge"`；布局类从 Root 移到 Control。Toggle/toggle-group：可调用原语；group items 复用 Toggle。

### tabs / collapsible / progress / separator / scroll-area / label
Tabs：Trigger -> Tab，Content -> Panel，新增 `aria-disabled:*`。Collapsible：
Content -> Panel。Progress：新增 Track/Label/Value 部件；原语负责计算
fill（去掉手动的 translateX）。Separator：可调用，移除 `decorative`。Scroll-area：
仅重命名 Scrollbar/Thumb。Label：没有原语；使用原生 `<label>`。

### navigation-menu
Viewport 从 Root 中移出到 `Portal > Positioner > Popup > Viewport`
（我们的 NavigationMenuPositioner）。Indicator -> Icon。`viewport` 布尔属性已移除；
`align` 透传给 Positioner。新增 `data-instant`、
`data-activation-direction` 钩子；变量 -> `--positioner-height/width`、
`--popup-height/width`。

### breadcrumb / marker (Slot users)
`Slot.Root` + `asChild` -> `useRender` + `mergeProps`
（`useRender.ComponentProps<"a">`、`render` 属性、`state.slot`）。

## 文档校验待办事项（在规格最终确定之前）

1. 浮层锚点：确认 Base UI 是否没有对应的 anchor；Positioner 可能接受一个 `anchor` 属性；我们的封装只是省略了该部分。
2. 回调签名：radix 的 `onOpenChange(open)` 与 Base UI 的 `onOpenChange(open, event, reason)` 之类存在差异；封装会直接透传，因此成对差异无法看出这些不同。请按每个原语单独检查。
3. Toast、Toolbar、Form/Field/Fieldset、OTP Field：这些未包含在我们的配对中；请仅根据文档为它们编写这些规格。
4. 菜单/选择器上的受控属性名（`open`、`value`、`highlighted`）以及任何 `defaultChecked`/`checked` 的细微差别。
5. 焦点/关闭行为开关（`onInteractOutside`、`onEscapeKeyDown` -> Base UI 对应项），这些在我们的封装中没有暴露。

## Slot -> useRender：工作示例（避免 mergeProps 陷阱）

Radix:
```tsx
import { Slot } from "radix-ui"
function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return <Comp data-slot="breadcrumb-link" className={cn("...", className)} {...props} />
}
```

Base UI:
```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      // 陷阱：当 data-* 属性作为对象字面量传入 mergeProps 时，
      // 会因超额属性检查失败（它们只在 JSX 中被特殊处理）。
      // 将该字面量进行类型断言：
      { "data-slot": "breadcrumb-link", className: cn("...", className) } as React.ComponentProps<"a">,
      props
    ),
  })
}
```

两个规则：
1. 这种模式仅适用于非 button 的多态组件（breadcrumb
   link、marker、badge、item...）。`button.tsx` 会迁移到真正的
   `@base-ui/react/button` 原语，它原生支持 `render`。
2. 始终将包含 `data-*` 键并传给 `mergeProps` 的对象字面量进行类型断言
   （`as React.ComponentProps<"tag">`），否则 tsc 会在每一个地方都报错。

## 定位器 props：Pick 表示转发

当一个包装器通过
`Pick<XPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">`
暴露定位相关 props 时，你必须在包装器中逐个解构这些 props，并将它们显式传递给
`<XPrimitive.Positioner>`。如果你忘了这样做，它们就会通过
`...props` 传递到 Popup（错误的 DOM 节点）上，定位会悄无声息地失效。
这种问题不会被任何 JSX 级别的类型错误捕获；只能靠包装器自身严格的解构纪律和浏览器检查发现。每个覆盖层包装器的检查清单：
声明 -> 解构 -> 转发。每次都要这三步。
