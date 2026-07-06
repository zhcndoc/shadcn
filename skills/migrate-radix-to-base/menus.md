# Radix → Base UI props mapping: 菜单家族

来源：radix-ui.com primitives 文档（dropdown-menu、context-menu、menubar、navigation-menu）以及 base-ui.com 的 `/react/components/{menu,context-menu,menubar,navigation-menu}.md`，抓取于 2026-07-02。

部件映射事实来源（来自我们的封装）：`Content` → `Portal > Positioner > Popup`（side/sideOffset/align/alignOffset 位于 `Positioner` 上）；`Label` → `GroupLabel`；`ItemIndicator` → `CheckboxItemIndicator`/`RadioItemIndicator`；`Sub` → `SubmenuRoot`；`SubTrigger` → `SubmenuTrigger`；navigation-menu 的 `Viewport` → `Positioner > Popup > Viewport`，`Indicator` → `Icon`；`asChild` → `render`。

跨部件规则（适用于下面每个部件）：

| Radix 模式 | Base UI 对应 |
| --- | --- |
| `asChild` (`boolean`, `false`) | `render` (`ReactElement \| ((props: HTMLProps, state) => ReactElement)`)。没有“合并到子元素”的布尔开关；直接传入元素或函数。 |
| 根组件上的 `dir` (`"ltr" \| "rtl"`) | 全部移除。Base UI 从 `<DirectionProvider>`（`@base-ui-components/react/direction-provider`）或 DOM 的 `dir` 属性中读取方向。 |
| `forceMount` (`boolean`) | `keepMounted` (`boolean`, `false`)，用于 `Portal` / 指示器部件。用途相同（动画/SEO），显示由 `data-starting-style` / `data-ending-style` 驱动，而不是 Radix 的 `data-state` + 强制挂载。 |
| `onEscapeKeyDown` / `onPointerDownOutside` / `onFocusOutside` / `onInteractOutside`（content 部件） | 作为单独属性移除。改为在 Root 上使用 `onOpenChange(open, eventDetails)`，并根据 `eventDetails.reason`（`'escape-key'`、`'outside-press'`、`'focus-out'`，等等）分支处理。调用 `eventDetails.cancel()` 可阻止关闭（替代 `event.preventDefault()`）。 |
| item 上的 `onSelect`（`(event: Event) => void`；`event.preventDefault()` 可保持菜单打开） | `onClick`（`(event: BaseUIEvent<React.MouseEvent<HTMLDivElement>>) => void`）加上 `closeOnClick`（`boolean`）来控制菜单是否关闭。 |
| item 上的 `textValue`（`string`，用于 typeahead） | `label`（`string`）。 |
| 受控回调 `(value) => void` | 所有 Base UI 变更回调都带第二个 `eventDetails` 参数（`{ reason, event, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, trigger }`）。 |

---

# dropdown-menu（Radix `DropdownMenu` → Base UI `Menu`）

## Root → Menu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / – | `defaultOpen` (`boolean`, `false`) | 相同。 |
| `open` | `boolean` / – | `open` (`boolean`) | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Menu.Root.ChangeEventDetails) => void`。`eventDetails.reason` 可能为 `'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'focus-out' \| 'list-navigation' \| 'escape-key' \| 'item-press' \| 'close-press' \| 'sibling-open' \| 'cancel-open' \| 'imperative-action' \| 'none'` 之一；`eventDetails.cancel()` 会阻止状态变更。 |
| `modal` | `boolean` / `true` | `modal` (`boolean`, `true`) | 相同。 |
| `dir` | `"ltr" \| "rtl"` / – | – | 已移除。请使用 `DirectionProvider`。 |

## 触发器 → Menu.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 参见通用规则。渲染非 button 元素时，还需设置 `nativeButton={false}`。 |

## Portal → Menu.Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | 已重命名；在隐藏时仍将 portal 保留在 DOM 中。 |
| `container` | `HTMLElement` / `document.body` | `container` (`HTMLElement \| ShadowRoot \| React.RefObject<HTMLElement \| ShadowRoot \| null> \| null`) | 相同，但类型范围更广（接受 refs 和 ShadowRoot）。 |

## Content → Menu.Portal > Menu.Positioner > Menu.Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` on `Popup` | 见交叉规则。 |
| `loop` | `boolean` / `false` | `loopFocus` on **Root** (`boolean`, `true`) | 已移动 + 重命名。默认值相反：Base UI 默认循环。 |
| `onCloseAutoFocus` | `(event: Event) => void` / – | `finalFocus` on **Popup** | 签名已更改：`boolean \| React.RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null)`，其中 `InteractionType = 'mouse' \| 'touch' \| 'pen' \| 'keyboard'`。返回 `false` 可复现 `event.preventDefault()`；返回一个元素可将焦点重定向过去。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / – | – | 已移除 → 使用 `onOpenChange` 且 `reason === 'escape-key'`。 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / – | – | 已移除 → 使用 `onOpenChange` 且 `reason === 'outside-press'`。 |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / – | – | 已移除 → 使用 `onOpenChange` 且 `reason === 'focus-out'`。 |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / – | – | 已移除 → 使用 `onOpenChange` 且 `reason === 'outside-press' \|\| 'focus-out'`。 |
| `forceMount` | `boolean` / – | `keepMounted` on **Portal** | 已移动；使用 `data-starting-style`/`data-ending-style` 做动画。 |
| `side` | `"top" \| "right" \| "bottom" \| "left"` / `"bottom"` | `side` on **Positioner** (`Side`, `'bottom'`) | 已移动。Base 还增加了逻辑值：`Side = 'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-end' \| 'inline-start'`。 |
| `sideOffset` | `number` / `0` | `sideOffset` on **Positioner** (`number \| OffsetFunction`, `0`) | 已移动；也接受 `(data: { side, align, anchor: {width,height}, positioner: {width,height} }) => number`。 |
| `align` | `"start" \| "center" \| "end"` / `"center"` | `align` on **Positioner** (`Align`, `'center'`) | 已移动，值/默认值相同。 |
| `alignOffset` | `number` / `0` | `alignOffset` on **Positioner** (`number \| OffsetFunction`, `0`) | 已移动；也接受函数形式。 |
| `avoidCollisions` | `boolean` / `true` | `collisionAvoidance` on **Positioner** (`CollisionAvoidance`) | 签名已更改：对象 `{ side?: 'flip' \| 'shift' \| 'none'; align?: 'flip' \| 'shift' \| 'none'; fallbackAxisSide?: 'start' \| 'end' \| 'none' }`。`avoidCollisions={false}` → `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`。 |
| `collisionBoundary` | `Element \| null \| Array<Element \| null>` / `[]` | `collisionBoundary` on **Positioner** (`Boundary`, `'clipping-ancestors'`) | 默认值变化：Radix 的 `[]` 表示视口/裁剪祖先；Base 默认 `'clipping-ancestors'` 等价。也接受元素或 rect。 |
| `collisionPadding` | `number \| Padding` / `0` | `collisionPadding` on **Positioner** (`Padding`, `5`) | 形状相同；默认值从 0 改为 5。 |
| `arrowPadding` | `number` / `0` | `arrowPadding` on **Positioner** (`number`, `5`) | 相同；默认值从 0 改为 5。 |
| `sticky` | `"partial" \| "always"` / `"partial"` | – (see note) | 概念不同。Radix 的 `sticky` 控制对齐轴上的粘附；Base 中最接近的选项是 `collisionAvoidance.align`（`'shift'` ≈ partial）。Base UI 自己的 `sticky`（`boolean`, `false`）则是在锚点滚出视口后仍保持弹出层在视口内，这在 Radix 中没有对应项。 |
| `hideWhenDetached` | `boolean` / `false` | – | 作为行为属性已移除。Base 始终在 Positioner/Popup 上暴露 `data-anchor-hidden`；可通过 CSS 隐藏：`[data-anchor-hidden] { visibility: hidden }`。 |

## Arrow → Menu.Arrow

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Arrow 会渲染一个由你填充 SVG 的 `<div>`（Radix 则直接渲染 svg 本身）。放置在 `Popup` 内部。 |
| `width` | `number` / `10` | – | 已移除；请使用 CSS 设置子级 SVG/元素的大小。 |
| `height` | `number` / `5` | – | 已移除；请使用 CSS 设置大小。 |

## Item → Menu.Item

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 对于链接，请使用 `Menu.LinkItem`（渲染 `<a>`）而不是 `render`。 |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | 相同。 |
| `onSelect` | `(event: Event) => void` / – | `onClick` (`(event: BaseUIEvent<React.MouseEvent<HTMLDivElement>>) => void`) | 已重命名 + 签名已更改。`onSelect` 中的 `event.preventDefault()`（保持打开）→ `closeOnClick={false}`（`boolean`，Item 上默认值为 `true`）。 |
| `textValue` | `string` / – | `label` (`string`) | 已重命名。 |

## 组 → Menu.Group

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 其他情况下相同。 |

## 标签 → Menu.GroupLabel

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 部分重命名。Base GroupLabel 必须位于 `Group` 内部（它会绑定 `aria-labelledby`）；Radix Label 可以自由悬浮。 |

## CheckboxItem → Menu.CheckboxItem

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `checked` | `boolean \| 'indeterminate'` / – | `checked` (`boolean`) | `'indeterminate'` 已移除。Base 为非受控用法新增了 `defaultChecked`（`boolean`，`false`）。 |
| `onCheckedChange` | `(checked: boolean) => void` / – | `onCheckedChange` | 签名已更改：`(checked: boolean, eventDetails: Menu.CheckboxItem.ChangeEventDetails) => void`。 |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | 相同。 |
| `onSelect` | `(event: Event) => void` / – | `onClick` + `closeOnClick` | 行为默认值发生了变化：Radix 在选择时会关闭（除非被阻止）；Base 中 `CheckboxItem` 的 `closeOnClick` 默认值为 `false`。请显式设置 `closeOnClick` 以保留 Radix 行为。 |
| `textValue` | `string` / – | `label` | 已重命名。 |

## RadioGroup → Menu.RadioGroup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `value` | `string` / – | `value` (`any`) | 类型扩展为 `any`。Base 额外添加了 `defaultValue`（`any`）和 `disabled`（`boolean`，`false`）。 |
| `onValueChange` | `(value: string) => void` / – | `onValueChange` | 签名已更改：`(value: any, eventDetails: Menu.RadioGroup.ChangeEventDetails) => void`。 |

## RadioItem → Menu.RadioItem

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `value`* | `string` / – | `value`* (`any`) | 相同（必填）；类型范围扩展。 |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | 相同。 |
| `onSelect` | `(event: Event) => void` / – | `onClick` + `closeOnClick` | `closeOnClick` 在 RadioItem 中默认为 `false`（Radix 默认关闭）。 |
| `textValue` | `string` / – | `label` | 已重命名。 |

## ItemIndicator → Menu.CheckboxItemIndicator / Menu.RadioItemIndicator

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 部件拆分：使用与父级项类型匹配的指示器。渲染 `<span>`。 |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | 已重命名。 |

## 分隔符 → Menu.Separator

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base 新增了 `orientation`（`'horizontal' \| 'vertical'`，默认 `'horizontal'`）。 |

## Sub → Menu.SubmenuRoot

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / – | `defaultOpen` (`boolean`, `false`) | 相同。 |
| `open` | `boolean` / – | `open` (`boolean`) | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Menu.SubmenuRoot.ChangeEventDetails) => void`（与 Root 的相同原因联合类型）。 |

## SubTrigger → Menu.SubmenuTrigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 渲染 `<div>`；此处 `nativeButton` 默认为 `false`。 |
| `disabled` | `boolean` / – | `disabled` (`boolean`, `false`) | 相同。 |
| `textValue` | `string` / – | `label` | 已重命名。Base 另外添加了 `openOnHover` / `delay` (`100`) / `closeDelay` (`0`) 和 `onClick`。 |

## SubContent → Menu.Portal > Menu.Positioner > Menu.Popup (inside SubmenuRoot)

与上面的 **Content** 相同的属性处理；需要注意 Radix 特有的默认值：`align` 在 SubContent 上的默认值是 `"start"`（Base Positioner 的默认值是 `'center'` —— 如果你依赖 Radix 的默认值，请显式设置 `align="start"`；实际上子菜单弹出层会锚定到触发项，并且我们的包装器已经这样设置了）。Radix SubContent 没有 `side` 属性（side 是隐含的）；Base Positioner 接受 `side`（对于支持 RTL 的子菜单使用 `'inline-end'`）。所有 outside/escape 回调、`forceMount`、`loop`、碰撞相关属性的映射都与 Content 完全一致。

## 值得了解的 Base UI 仅有属性（Menu）

- `Root`：`highlightItemOnHover`（`true`）、`actionsRef`（`{ unmount(), close() }`）、`onOpenChangeComplete(open)`（在关闭动画结束后触发；替代了 Radix 中“等待动画”的那套操作）、`closeParentOnEsc`（`false`）、`disabled`、`orientation`（`'vertical'`）、分离触发器机制：`handle`（通过 `Menu.createHandle()` 创建的 `Menu.Handle`）、`triggerId`/`defaultTriggerId`、支持 payload 的 `children` 渲染函数。
- `Trigger`：`openOnHover`、`delay`（`100`）、`closeDelay`（`0`）、`payload`、`handle`、`nativeButton`（`true`）。
- `Backdrop`：新增部件，弹出层下方的遮罩层。
- `Positioner`：`anchor`、`positionMethod`（`'absolute'`）、`disableAnchorTracking`、`sticky`（布尔值，保持视口内）。
- `Popup`：`finalFocus`。
- `Viewport`：用于在带有多个/分离触发器时为内容切换做动画的新部件。
- `LinkItem`：新部件，渲染为 `<a>` 的菜单项（`closeOnClick` 默认 `false`）。
- 所有部件：`className`/`style` 都支持状态回调形式 `(state) => ...`。

## 数据属性映射（下拉/上下文/菜单栏菜单）

| Radix | Base UI |
| --- | --- |
| Trigger `[data-state="open" \| "closed"]` | `data-popup-open`（存在即表示）+ `data-pressed` |
| Content `[data-state="open" \| "closed"]` | Positioner 和 Popup 上的 `data-open` / `data-closed` |
| – | `data-starting-style` / `data-ending-style`（CSS 过渡钩子，替代 `data-state` 上的动画状态） |
| Content `[data-side="left" \| "right" \| "bottom" \| "top"]` | Positioner/Popup/Arrow 上的 `data-side`（`'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-end' \| 'inline-start'`） |
| Content `[data-align="start" \| "end" \| "center"]` | Positioner/Popup/Arrow 上的 `data-align`（相同取值） |
| Content/Item `[data-orientation]` | 在菜单部分中移除 |
| Item `[data-highlighted]` | `data-highlighted`（相同） |
| Item `[data-disabled]` | `data-disabled`（相同） |
| Checkbox/RadioItem `[data-state="checked" \| "unchecked" \| "indeterminate"]` | `data-checked` / `data-unchecked` 存在性属性；不支持 indeterminate |
| ItemIndicator `[data-state]` | 拆分后的指示器上使用 `data-checked` / `data-unchecked` + `data-starting-style` / `data-ending-style` |
| SubTrigger `[data-state="open" \| "closed"]` | SubmenuTrigger 上的 `data-popup-open` |
| – | Popup `data-instant`（`'click' \| 'dismiss' \| 'group' \| 'trigger-change'`），Positioner `data-anchor-hidden` |

## CSS 变量映射（按菜单风格：`dropdown-menu` / `context-menu` / `menubar`）

| Radix（在 Content/SubContent 上） | Base UI（在 Positioner 上） |
| --- | --- |
| `--radix-<name>-content-transform-origin` | `--transform-origin` |
| `--radix-<name>-content-available-width` | `--available-width` |
| `--radix-<name>-content-available-height` | `--available-height` |
| `--radix-<name>-trigger-width` | `--anchor-width` |
| `--radix-<name>-trigger-height` | `--anchor-height` |

Base UI Menu.Viewport 另外还会暴露 `--popup-width` / `--popup-height`（过渡期间上一个内容的尺寸）。

---

# context-menu（Radix `ContextMenu` → Base UI `ContextMenu`）

Base UI ContextMenu 共享 Menu 的组件集合：`Root, Trigger, Portal, Backdrop, Positioner, Popup, Arrow, Item, Group, GroupLabel, Separator, SubmenuRoot, SubmenuTrigger, RadioGroup, RadioItem, RadioItemIndicator, CheckboxItem, CheckboxItemIndicator, LinkItem`。下方未列出的内容都与 dropdown-menu 章节中的映射完全一致。

## Root → ContextMenu.Root

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `dir` | `"ltr" \| "rtl"` / – | – | 已移除；使用 `DirectionProvider`。 |
| `open` | `boolean` / – | `open` (`boolean`) | 相同。Base 还新增了 `defaultOpen`（`false`），而 Radix ContextMenu 没有。 |
| `onOpenChange` | `(open: boolean) => void` / – | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: ContextMenu.Root.ChangeEventDetails) => void`（与 Menu 的联合类型原因相同）。 |
| `modal` | `boolean` / `true` | – | **已移除。**Base UI 的 ContextMenu.Root 没有 `modal` 属性（行为是固定的）。如果你依赖 `modal={false}`，没有直接对应项。 |

## Trigger → ContextMenu.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Trigger 会渲染一个 `<div>`（也会处理触摸设备上的长按）。 |
| `disabled` | `boolean` / `false` | – | **已移除。** ContextMenu.Trigger 只有 `className`/`style`/`render`。变通方案：有条件地在 Trigger 外部渲染内容，或在子元素上通过 `preventDefault` + `stopPropagation` 拦截 `onContextMenu`。 |

## Portal → ContextMenu.Portal

与 Menu.Portal 完全相同的映射（`forceMount` → `keepMounted`，`container` 已扩展）。

## Content → ContextMenu.Portal > Positioner > Popup

对于以下内容，与 dropdown-menu 的 Content 有相同的适用规则：`asChild`、`loop`（→ Root `loopFocus`）、`onCloseAutoFocus`（→ Popup `finalFocus`）、`onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside`（→ Root `onOpenChange` 的原因）、`forceMount`（→ Portal `keepMounted`）、`avoidCollisions`（→ `collisionAvoidance`）、`collisionBoundary`（默认 `[]` → `'clipping-ancestors'`）、`collisionPadding`（`0` → `5`）、`sticky`（已移除，见菜单说明）、`hideWhenDetached`（→ `data-anchor-hidden` 上的 CSS）。

Radix 特有差异：

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `alignOffset` | `number` / `0` | Positioner 上的 `alignOffset`（`number \| OffsetFunction`，`0`） | Radix ContextMenu.Content 没有 `side`/`sideOffset`/`align` 这些 props（锚定到指针）。Base Positioner 仍然接受 `side`/`align`/`sideOffset`，但默认会锚定到指针位置；通常可以不设置它们。 |
| (Content 上没有 `arrowPadding`) | – | Positioner 上的 `arrowPadding`（`5`） | 如果你添加了 Arrow，Base 中可用。 |

## 箭头 / 项目 / 组 / 标签 / CheckboxItem / RadioGroup / RadioItem / ItemIndicator / 分隔线 / Sub / SubTrigger / SubContent

与下拉菜单部分具有相同的对应关系（Label → `GroupLabel`，ItemIndicator → `CheckboxItemIndicator`/`RadioItemIndicator`，Sub → `SubmenuRoot`，SubTrigger → `SubmenuTrigger`，SubContent → `Portal > Positioner > Popup`）。Base 中的 Menubar/ContextMenu 子菜单是相同的组件，具有相同的 props（`onOpenChange` eventDetails、`label`、`onClick`/`closeOnClick`、`keepMounted`）。

## 仅 Base UI、数据属性、CSS 变量

与上面的 Menu 列表相同；ContextMenu.Root 另外支持 `handle`（`MenuHandle<unknown>`）、`triggerId`/`defaultTriggerId`、`actionsRef`、`onOpenChangeComplete`、`highlightItemOnHover`、`closeParentOnEsc`、`disabled`、`orientation`。触发器数据属性：`data-popup-open`、`data-pressed`（替代 Radix Trigger 的 `[data-state]`）。CSS 变量：在 Positioner 上，`--radix-context-menu-*` → `--transform-origin`/`--available-*`/`--anchor-*`。

---

# menubar（Radix `Menubar` → Base UI `Menubar` + `Menu`）

Base UI 的 menubar 模块只导出一个 `<Menubar>` 容器。它内部的每个菜单都由 `Menu.*` 部件构建（`Menu.Root`、`Menu.Trigger`、`Menu.Portal`、`Menu.Positioner`、`Menu.Popup`、菜单项、子菜单……）。因此，Radix 的 `Menubar.Menu/Trigger/Portal/Content/...` 各部分都映射到下拉菜单章节中的 `Menu` 组件家族。

## Root → Menubar

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 同样的模式。 |
| `defaultValue` | `string` / – | – | **已移除。** Base Menubar 没有受控/非受控的活动菜单值。要预先打开某个菜单，请在对应的 `Menu.Root` 上使用 `defaultOpen`。 |
| `value` | `string` / – | – | **已移除。** 改为控制各个 `Menu.Root` 的 `open` 属性。 |
| `onValueChange` | `(value: string) => void` / – | – | **已移除。** 请通过每个 `Menu.Root` 的 `onOpenChange` 监听。 |
| `dir` | `"ltr" \| "rtl"` / – | – | 已移除；使用 `DirectionProvider`。 |
| `loop` | `boolean` / `false` | `loopFocus` (`boolean`, `true`) | 已重命名；默认值改为 `true`。 |

Base UI 中仅适用于 `Menubar` 的属性：`modal` (`boolean`, `true`), `disabled` (`boolean`, `false`), `orientation` (`'horizontal' \| 'vertical'`, `'horizontal'`)。

## 菜单 → Menu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | – | Menu.Root 不渲染任何元素；请移除它。 |
| `value` | `string` / – | – | 随 Menubar value 系统一起移除（见 Root）。 |

注意：Menubar 中的 `Menu.Root` 接受所有 Menu.Root 属性（`open`、`defaultOpen`、`onOpenChange(open, eventDetails)`、`modal`、`loopFocus`、`orientation`、`disabled`、...）。菜单栏菜单之间的悬停切换已内置。

## 触发器 → Menu.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render`（非按钮元素需额外使用 `nativeButton={false}`） | Radix Menubar.Trigger 数据属性 `[data-state]`/`[data-highlighted]`/`[data-disabled]` → `data-popup-open`/`data-pressed`（Base trigger 没有 highlighted 状态）。 |

## Portal / Content / Arrow / Item / Group / Label / CheckboxItem / RadioGroup / RadioItem / ItemIndicator / Separator / Sub / SubTrigger / SubContent

与 **dropdown-menu** 部分完全相同（它们实际上就是同一组 Base UI `Menu` 组件）：

- `Portal.forceMount` → `keepMounted`；`container` 扩展。
- `Content`（`loop`、`onCloseAutoFocus`、外部/escape 回调、`forceMount`、`side`/`sideOffset`/`align`/`alignOffset`、`avoidCollisions`、`collisionBoundary`、`collisionPadding`、`arrowPadding`、`sticky`、`hideWhenDetached`）→ `Menu.Portal > Menu.Positioner > Menu.Popup`，并采用 dropdown-menu 的 `Content` 所列出的完全相同处理方式。
- `SubContent` 的 `align` 默认值 `"start"` 注释同样适用于 dropdown-menu。
- Items：`onSelect` → `onClick` + `closeOnClick`，`textValue` → `label`。
- Radix Menubar CheckboxItem/RadioItem `[data-state="checked" \| "unchecked"]` → `data-checked`/`data-unchecked`。

## 数据属性 / CSS 变量

- 菜单栏容器：Radix Root 没有；Base `Menubar` 暴露 `data-orientation`（`'horizontal' \| 'vertical'`）、`data-has-submenu-open`、`data-modal`。
- 菜单项属性以及 `--radix-menubar-*` CSS 变量与 dropdown-menu 表中的映射完全一致（`--transform-origin`、`--available-width/height`、`--anchor-width/height` 位于 `Menu.Positioner` 上）。

---

# navigation-menu（Radix `NavigationMenu` → Base UI `NavigationMenu`）

Base UI 部件：`Root, List, Item, Trigger, Icon, Content, Portal, Backdrop, Positioner, Popup, Arrow, Viewport, Link`。Popup 定位采用真实的锚定定位（类似 Menu）：共享的 popup 以 `Portal > Positioner > Popup > Viewport` 的结构渲染，并且每个 `Item` 的 `Content` 会在激活时移动到 `Viewport` 中。Radix 的“Viewport 渲染在列表下方”模型已被这种锚定 Positioner 模型取代（因此我们的包装器相应移除了 `viewport` 布尔属性）。

## Root → NavigationMenu.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultValue` | `string` / – | `defaultValue` (`Value \| null`, `null`) | 类型变宽（`Value = any`）；`null` = 关闭。 |
| `value` | `string` / – | `value` (`Value \| null`, `null`) | 同上；非空值 = 打开。 |
| `onValueChange` | `(value: string) => void` / – | `onValueChange` | 签名已更改：`(value: Value \| null, eventDetails: NavigationMenu.Root.ChangeEventDetails) => void`；原因：`'trigger-press' \| 'trigger-hover' \| 'outside-press' \| 'list-navigation' \| 'focus-out' \| 'escape-key' \| 'link-press' \| 'none'`。 |
| `delayDuration` | `number` / `200` | `delay` (`number`, `50`) | 已重命名；默认值 200 → 50。 |
| `skipDelayDuration` | `number` / `300` | – | **已移除。** 不再有跳过延迟窗口；Base 改为提供 `closeDelay` (`number`, `50`)。 |
| `dir` | `"ltr" \| "rtl"` / – | – | 已移除；使用 `DirectionProvider`。 |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation`（相同取值/默认值） | 相同。 |

Base UI 仅在 Root 上提供：`closeDelay`（`50`）、`actionsRef`（`{ unmount() }`）、`onOpenChangeComplete(open)`。Root 会渲染一个 `<nav>` 元素（Radix Root 也会渲染 `<nav>`；Base 在嵌套时渲染 `<div>`）。

## Sub → 嵌套的 NavigationMenu.Root

| Radix prop | Type / default | Base UI equivalent | 迁移说明 |
| --- | --- | --- | --- |
| `defaultValue` / `value` / `onValueChange` / `orientation` | 同 Root | 嵌套的 `Root` 上相同的 props | 部分已移除：在 `Content` 内嵌套整个 `NavigationMenu.Root`（包含其自己的 `List`/`Portal`/`Positioner`/`Popup`）；当嵌套时它会渲染为一个 `<div>`。与 Radix 的 Sub 不同，嵌套的 Base 菜单默认是关闭的（`null`），而不是必须始终有一个激活项。 |

## 列表 → NavigationMenu.List

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base List 渲染 `<ul>`（Radix 也为 `<ul>`）。Radix 的 `[data-orientation]` 属性已移除。 |

## 项目 → NavigationMenu.Item

| Radix prop | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Item 渲染为 `<li>`。 |
| `value` | `string` / – | `value` (`any`) | 相同；如果省略，则会自动生成。 |

## 触发器 → NavigationMenu.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render`（+ `nativeButton`，默认 `true`） | `[data-state="open" \| "closed"]` → `data-popup-open`; `[data-disabled]` 已移除（也没有 disabled 属性——请自行在 item 层级进行控制）。 |

## 内容 → NavigationMenu.Content

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | – |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / – | – | 已移除 → Root 的 `onValueChange`，当 `reason === 'escape-key'` 时调用，并执行 `eventDetails.cancel()`。 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / – | – | 已移除 → `reason === 'outside-press'`。 |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / – | – | 已移除 → `reason === 'focus-out'`。 |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / – | – | 已移除 → `'outside-press' \| 'focus-out'`。 |
| `forceMount` | `boolean` / – | `keepMounted` (`boolean`, `false`) | 已重命名，仍保留在 Content 上（关闭时将内容保留在 DOM 中，例如用于 SEO/SSR）。 |

## Link → NavigationMenu.Link

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 对于框架链接：`render={<NextLink href=... />}`。 |
| `active` | `boolean` / `false` | `active`（`boolean`，`false`） | 相同（设置 `aria-current` + `data-active`）。 |
| `onSelect` | `(event: Event) => void` / – | – | 已移除。请使用 `onClick`（原生 DOM 属性）和 `closeOnClick`（`boolean`，`false`）——注意 Radix 默认在链接选择时关闭菜单，而 Base 不会；如需保持一致，请设置 `closeOnClick`。 |

## Indicator → NavigationMenu.Icon（按包装器事实基准）

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 作用不同：Radix 的 Indicator 会跟踪 List 下方的当前激活触发器；Base 的 `Icon` 是 Trigger 内部的一个下拉箭头（当其菜单打开时带有 `data-popup-open`）。如果是锚定弹出层的指示箭头，Base 的 `Arrow`（位于 `Popup` 内，带有 `data-side`/`data-align`/`data-uncentered`）是最接近的视觉类比。Base 中没有用于沿列表跟踪当前激活触发器的部件。 |
| `forceMount` | `boolean` / – | – | 已移除（Icon 始终渲染）。 |
| `[data-state="visible" \| "hidden"]`, `[data-orientation]` | – | – | 已移除；Icon 仅暴露 `data-popup-open`。 |

## Viewport → NavigationMenu.Portal > Positioner > Popup > Viewport

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | 每个新部分上的 `render` | 一个 Radix 部分变成四个：`Portal`（属性：`container`、`keepMounted`）、`Positioner`（完整的锚定定位属性集，与 Menu.Positioner 完全相同：`side`/`sideOffset`/`align`/`alignOffset`（`number \| OffsetFunction`）、`anchor`、`collisionAvoidance`、`collisionBoundary` `'clipping-ancestors'`、`collisionPadding` `5`、`arrowPadding` `5`、`sticky` 布尔值、`positionMethod`、`disableAnchorTracking`）、`Popup`（渲染 `<nav>`）、`Viewport`（裁剪/动画化当前活动的 `Content`）。 |
| `forceMount` | `boolean` / – | **Portal** 上的 `keepMounted` | 已重命名并移至其他位置。 |

## 值得了解的 Base UI 仅有属性（NavigationMenu）

- Root：`closeDelay`、`actionsRef`、`onOpenChangeComplete`。
- 新部件：`Backdrop`、`Arrow`、`Positioner`（真正具备碰撞感知的位置计算——Radix nav-menu 没有这个）、`Icon`。
- `Content.keepMounted` 用于爬虫可见的 SSR 内容。
- `Link.closeOnClick`。
- 所有部件都支持 `className`/`style` 的状态回调形式以及 `render`。

## 数据属性映射（navigation-menu）

| Radix | Base UI |
| --- | --- |
| Root/Sub/List/Item `[data-orientation]` | 已移除。 |
| Trigger `[data-state="open" \| "closed"]` | Trigger 上的 `data-popup-open`（以及 Icon 上）。 |
| Trigger `[data-disabled]` | 已移除。 |
| Content `[data-state="open" \| "closed"]` | Content 上的 `data-open` / `data-closed`（也用于 Positioner/Popup/Backdrop 上）。 |
| Content `[data-motion="to-start" \| "to-end" \| "from-start" \| "from-end"]` | Content 上的 `data-activation-direction`（`'left' \| 'right' \| 'up' \| 'down'`）——新激活的触发器相对于前一个触发器的方向；用于进入/退出动画。 |
| Link `[data-active]` | `data-active`（相同）。 |
| Indicator `[data-state="visible" \| "hidden"]` | 无对应项（参见 Indicator 行）。Arrow 暴露 `data-open`/`data-closed`/`data-uncentered`/`data-side`/`data-align`。 |
| Viewport `[data-state]`, `[data-orientation]` | Popup/Positioner 上的 `data-open`/`data-closed` + `data-starting-style`/`data-ending-style`；Viewport 本身不暴露任何属性。 |
| – | Positioner：`data-anchor-hidden`、`data-instant`；Popup：`data-side`、`data-align`。 |

## CSS 变量映射（navigation-menu）

| Radix | Base UI |
| --- | --- |
| `--radix-navigation-menu-viewport-width`（在 Viewport 上） | `--popup-width`（`number`，在 **Popup** 上）— 弹出层的固定宽度；使用 `width: var(--popup-width)` 进行动画。 |
| `--radix-navigation-menu-viewport-height`（在 Viewport 上） | `--popup-height`（`number`，在 **Popup** 上）。 |
| – | Positioner 还暴露 `--anchor-width`、`--anchor-height`、`--available-width`、`--available-height`、`--positioner-width`、`--positioner-height`、`--transform-origin`。 |

---

## 缺口 / 注意事项

- Radix 属性描述是在 JS 弹出层中渲染的；上面的类型/默认值是从页面嵌入的类型载荷中提取的（`(open: boolean) => void`、`(checked: boolean) => void`、`(value: string) => void`、`(event: KeyboardEvent) => void`、`(event: PointerDownOutsideEvent) => void`、`(event: FocusOutsideEvent) => void`、`(event: PointerDownOutsideEvent | FocusOutsideEvent) => void`、`(event: Event) => void` 用于 `onSelect`/`onCloseAutoFocus`，`Boundary = Element | null | Array<Element | null>`，`sticky: "partial" | "always"`，`dir: "ltr" | "rtl"`）——全部都已通过抓取到的 HTML 验证过。
- Base UI 的 `ContextMenu.Root` 确实缺少 `modal`；`Menubar` 缺少 `value`/`onValueChange` 机制；`ContextMenu.Trigger` 缺少 `disabled`。这三项是无法用一句话规避的硬性缺失。
- 从 `.md` 端点获取的 Base UI 文档反映的是 Base UI 1.x（仓库当前固定在 1.6.0）。
