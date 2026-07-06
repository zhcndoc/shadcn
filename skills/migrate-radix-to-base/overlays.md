# Radix UI → Base UI props migration mapping (overlays)

涵盖组件：dialog、alert-dialog、popover、tooltip、hover-card（Base UI：preview-card）。

来源：radix-ui.com primitives 文档（获取于 2026-07-02）以及 base-ui.com `/react/components/*.md` 端点（获取于 2026-07-02）。

适用于下面每个组件的全局约定：

- `asChild`（Radix，每个 part）→ `render`（Base UI，每个 part）。Radix：`asChild?: boolean` 将 props 合并到单个子元素上。Base UI：`render?: ReactElement | ((props: HTMLProps, state: Part.State) => ReactElement)`。对于被非 button 元素替代的按钮，还要设置 `nativeButton={false}`。
- `onOpenChange` 签名在所有地方都变了。Radix：`(open: boolean) => void`。Base UI：`(open: boolean, eventDetails: X.Root.ChangeEventDetails) => void`，其中 `eventDetails` 为 `{ reason, event, trigger, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, preventUnmountOnClose() }`。
- Radix 按交互类型区分的关闭回调（`onEscapeKeyDown`、`onPointerDownOutside`、`onFocusOutside`、`onInteractOutside`）在 Base UI 中没有 1:1 对应的 props。它们改为通过 `onOpenChange` 的 `eventDetails.reason`（`'escape-key'`、`'outside-press'`、`'focus-out'`）+ `eventDetails.cancel()` 来阻止关闭（相当于 Radix 的 `event.preventDefault()`）。
- `forceMount`（Radix，Portal/Overlay/Content）→ Base UI 仅在 `Portal` 上使用 `keepMounted`（`boolean`，默认 `false`）。对于退出动画，Base UI 不需要它：它会自行保持弹窗挂载，并暴露 `data-starting-style` / `data-ending-style`、`onOpenChangeComplete` 以及 `actionsRef.current.unmount()`，用于外部控制的动画。
- Base UI 的 `className` 和 `style` 在每个已渲染 part 上都接受状态回调（`(state) => ...`）。
- Radix `[data-state="open" | "closed"]` → Base UI 的存在性属性 `data-open` / `data-closed`。

---

# dialog

Part 映射：Root→Root，Trigger→Trigger，Portal→Portal，Overlay→Backdrop，Content→Popup（居中 modal：没有 Positioner），Title→Title，Description→Description，Close→Close。

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / -（Base 默认 `false`） | `defaultOpen` | 相同。 |
| `open` | `boolean` / - | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => void`。原因：`'trigger-press' \| 'outside-press' \| 'escape-key' \| 'close-press' \| 'focus-out' \| 'imperative-action' \| 'none'`。 |
| `modal` | `boolean` / `true` | `modal` | 已扩展：`boolean \| 'trap-focus'`，默认 `true`。`'trap-focus'` 会锁定焦点，但不会进行滚动锁定 / 阻止外部指针交互。 |

## 触发器 → 触发器

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | `render={<MyButton />}`；如果渲染出的元素不是 `<button>`，请添加 `nativeButton={false}`。 |

## Portal → Portal

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | 重命名 + 语义反转：`keepMounted?: boolean`（默认 `false`）会在隐藏时仍将 portal 保留在 DOM 中。通常可以直接去掉；Base UI 会在退出动画期间自动保持弹层挂载。 |
| `container` | `HTMLElement` / `document.body` | `container` | 名称相同，但类型更宽：`HTMLElement \| ShadowRoot \| React.RefObject<HTMLElement \| ShadowRoot \| null> \| null`。注意：Base UI Portal 会渲染一个 `<div>` 包装器（Radix Portal 对每个子元素不会额外渲染内容）。 |

## Overlay → Backdrop

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 相同模式。 |
| `forceMount` | `boolean` / - | 已移除 | Backdrop 在退出动画期间会原生保持挂载；如果你需要始终挂载的 DOM，请使用 `Portal keepMounted`。仅 Base：`forceRender`（`boolean`，默认 `false`）会强制 backdrop 渲染，即使对话框是嵌套的。 |

## Content → Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 同样的模式。 |
| `forceMount` | `boolean` / - | dropped | 见 Portal 的 `keepMounted` + `Root actionsRef.unmount()` + `onOpenChangeComplete`。 |
| `onOpenAutoFocus` | `(event: Event) => void` / - | moved to Popup `initialFocus` | 签名已更改。Radix：通过 `event.preventDefault()` 阻止。Base：`initialFocus?: boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null)`. `false` = 不移动焦点；ref/element = 聚焦目标；函数接收 `'mouse' \| 'touch' \| 'pen' \| 'keyboard'`。 |
| `onCloseAutoFocus` | `(event: Event) => void` / - | moved to Popup `finalFocus` | 形状与 `initialFocus` 相同，但用于关闭（`closeType: InteractionType`）。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | `if (eventDetails.reason === 'escape-key') eventDetails.cancel()` 取代 `event.preventDefault()`。 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | moved to Root `onOpenChange` | 原因是 `'outside-press'`；使用 `eventDetails.cancel()` 取消。声明式快捷方式：Root `disablePointerDismissal`（`boolean`，默认 `false`）。 |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / - | moved to Root `onOpenChange` | 覆盖原因 `'outside-press'` 和 `'focus-out'`（`focus-out` 适用于非模态对话框）。 |

## 标题 → 标题 / 描述 → 描述 / 关闭 → 关闭

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` (标题) | `boolean` / `false` | `render` | Base Title 渲染 `<h2>`。 |
| `asChild` (描述) | `boolean` / `false` | `render` | Base Description 渲染 `<p>`。 |
| `asChild` (关闭) | `boolean` / `false` | `render` | Base Close 渲染 `<button>`；可使用 `nativeButton`。 |

## 仅需了解的 Base UI props（dialog）

- Root: `actionsRef` (`RefObject<{ unmount(), close() }>`), `onOpenChangeComplete: (open: boolean) => void`, `disablePointerDismissal`, `modal: 'trap-focus'`, `handle` / `triggerId` / `defaultTriggerId` + `Dialog.createHandle()`（分离式和多个触发器），`children` 作为 payload 渲染函数。
- Trigger: `payload`, `handle`, `id`, `nativeButton`。
- Popup: `initialFocus`, `finalFocus`。
- Backdrop: `forceRender`。
- 新部分：`Viewport`（用于 popup 的可滚动定位容器，适合外部滚动的对话框）。

## 数据属性（dialog）

| Radix | Base UI | 位置 |
| --- | --- | --- |
| `[data-state="open"]` | `data-open` | Backdrop、Popup、Viewport（存在性属性）。 |
| `[data-state="closed"]` | `data-closed` | Backdrop、Popup、Viewport。 |
| Trigger 上的 `[data-state]` | `data-popup-open` | Trigger（存在性属性）。 |
| - | `data-disabled` | Trigger、Close。 |
| - | `data-starting-style` / `data-ending-style` | Backdrop、Popup、Viewport；用于进入/退出 CSS 过渡的钩子（替代 Radix 基于 `data-state` 的 animate 习惯用法）。 |
| - | `data-nested`、`data-nested-dialog-open` | Popup、Viewport。 |

## CSS 变量（dialog）

| Radix | Base UI |
| --- | --- |
| （无文档记录） | `--nested-dialogs`（`number`，位于 Popup 上）：嵌套在内的对话框数量。 |

---

# alert-dialog

部件映射：Root→Root，Trigger→Trigger，Portal→Portal，Overlay→Backdrop，Content→Popup，Title→Title，Description→Description，Cancel→Close，Action→无原语（渲染一个普通按钮；通过受控状态、`Root actionsRef.close()` 关闭，或在包装器中复用带有 action 语义的 `AlertDialog.Close`）。Base UI AlertDialog 始终是模态的，并且默认不会在点击外部时关闭（没有 `modal` prop，原因在类型中仍然包括 `'outside-press'`/`'focus-out'`，但按设计禁用了指针关闭）。

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / -（Base 默认值 `false`） | `defaultOpen` | 相同。 |
| `open` | `boolean` / - | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: AlertDialog.Root.ChangeEventDetails) => void`。原因与 dialog 中的联合类型相同。 |

（Radix AlertDialog.Root 没有 `modal` 属性；Base UI AlertDialog.Root 也没有。保持一致。）

## 触发器 → 触发器

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 另外还有 `nativeButton`、`payload`、`handle`、`id`。 |

## Portal → Portal

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | 与 dialog 相同。 |
| `container` | `HTMLElement` / `document.body` | `container` | 与 dialog 相同（类型更宽泛，渲染为一个 `<div>`）。 |

## Overlay → Backdrop

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 同样的模式。 |
| `forceMount` | `boolean` / - | 已移除 | Base 仅在嵌套场景下提供 `forceRender`。 |

## 内容 → 弹出层

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 相同模式。 |
| `forceMount` | `boolean` / - | 已移除 | 参见 dialog 说明。 |
| `onOpenAutoFocus` | `(event: Event) => void` / - | 移到 Popup `initialFocus` | 与 dialog 语义相同。注意：Radix alert-dialog 默认聚焦 `Cancel`；Base UI 会聚焦第一个可 Tab 聚焦元素。若要保留 Radix 行为，请传入 `initialFocus={cancelRef}`。 |
| `onCloseAutoFocus` | `(event: Event) => void` / - | 移到 Popup `finalFocus` | 与 dialog 相同。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | 移到 Root `onOpenChange` | 原因 `'escape-key'` + `eventDetails.cancel()`。 |

（Radix AlertDialog.Content 特意没有 `onPointerDownOutside`/`onInteractOutside`；无需映射。）

## 标题 → 标题 / 描述 → 描述

与对话框相同：`asChild` → `render`。标题渲染 `<h2>`，描述渲染 `<p>`。

## 取消 → 关闭

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `AlertDialog.Close` 上的 `render` | 组件部分已重命名。可使用 `nativeButton`。Radix 的“打开时默认聚焦到 Cancel”行为必须通过 Popup 的 `initialFocus` 重新实现。 |

## 操作 →（无原始项）

| Radix 属性 | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | 已移除 | Base UI 中没有对应部分。包装器会渲染一个带样式的 `<button>`；可通过受控 `open`、`actionsRef.current.close()`，或组合 `AlertDialog.Close` 并在 `onClick` 中执行操作后关闭。 |

## 值得了解的 Base UI 专有属性（alert-dialog）

- Root：`actionsRef`、`onOpenChangeComplete`、`handle` / `triggerId` / `defaultTriggerId` + `AlertDialog.createHandle()`、payload-render `children`。
- Popup：`initialFocus`、`finalFocus`。
- Backdrop：`forceRender`。新增部分：`Viewport`。

## 数据属性（alert-dialog）

与 dialog 相同的表：`data-state="open"/"closed"` → `data-open`/`data-closed`（Backdrop、Popup、Viewport）；Trigger 的 `data-state` → `data-popup-open`；仅 Base 的 `data-disabled`（Trigger、Close）、`data-starting-style`、`data-ending-style`、`data-nested`、`data-nested-dialog-open`。

## CSS 变量（alert-dialog）

| Radix | Base UI |
| --- | --- |
|（未记录）| `--nested-dialogs`（`number`，在 Popup 上）。 |

---

# popover

部分映射：Root→Root，Trigger→Trigger，Anchor→（Positioner 的 `anchor` 属性），Portal→Portal，Content→Portal>Positioner>Popup（定位属性移至 Positioner；焦点/关闭相关职责拆分到 Popup 和 Root），Close→Close，Arrow→Arrow。Base UI 还包含 Backdrop、Title、Description、Viewport 部分，在 Radix 中没有对应项。

## Root → Root

| Radix prop | 类型 / 默认值 | Base UI 等价项 | 迁移说明 |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / -（Base 默认 `false`） | `defaultOpen` | 相同。 |
| `open` | `boolean` / - | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Popover.Root.ChangeEventDetails) => void`。原因增加了 hover/focus：`'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'close-press' \| 'focus-out' \| 'imperative-action' \| 'none'`。 |
| `modal` | `boolean` / `false` | `modal` | 类型已扩展：`boolean \| 'trap-focus'`，默认值 `false`。当为 `true` 时，焦点捕获需要在 Popup 内部包含一个 `Popover.Close`（可以是 `sr-only`）。 |

## 触发器 → 触发器

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 还包括 `nativeButton`。仅在 Trigger 上有 Base 独有项：`openOnHover`（`false`）、`delay`（`300`）、`closeDelay`（`0`）、`payload`、`handle`、`id`。 |

## Anchor → Positioner `anchor` prop

| Radix prop | Type / default | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | 已移除（该部分被删除） | 不再有 Anchor 部分。将 `anchor` 传递给 Positioner：`Element \| VirtualElement \| React.RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null`。默认 anchor 为触发器。 |

## Portal → Portal

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`，默认 `false`。 |
| `container` | `HTMLElement` / `document.body` | `container` | 类型更宽（增加了 ShadowRoot/RefObject）；Portal 会渲染一个 `<div>`。 |

## 内容 → Positioner + Popup

| Radix prop | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | 相同模式。 |
| `onOpenAutoFocus` | `(event: Event) => void` / - | 移至 Popup `initialFocus` | 与 dialog 相同的形状（`boolean \| RefObject \| (openType: InteractionType) => ...`）。 |
| `onCloseAutoFocus` | `(event: Event) => void` / - | 移至 Popup `finalFocus` | 相同形状。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | 移至 Root `onOpenChange` | 原因 `'escape-key'` + `eventDetails.cancel()`。 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | 移至 Root `onOpenChange` | 原因 `'outside-press'` + `eventDetails.cancel()`。 |
| `onFocusOutside` | `(event: FocusOutsideEvent) => void` / - | 移至 Root `onOpenChange` | 原因 `'focus-out'` + `eventDetails.cancel()`。 |
| `onInteractOutside` | `(event: PointerDownOutsideEvent \| FocusOutsideEvent) => void` / - | 移至 Root `onOpenChange` | 同时处理 `'outside-press'` 和 `'focus-out'`。 |
| `forceMount` | `boolean` / - | 已移除 | 使用 Portal `keepMounted`、`onOpenChangeComplete`、`actionsRef.unmount()`。 |
| `side` | `"top" \| "right" \| "bottom" \| "left"` / `"bottom"` | 移至 Positioner `side` | 类型为 `Side`，新增了逻辑值 `'inline-start' \| 'inline-end'`。默认值为 `'bottom'`（相同）。 |
| `sideOffset` | `number` / `0` | 移至 Positioner `sideOffset` | 已扩展：`number \| OffsetFunction`，其中函数接收 `{ anchor, positioner, side, align }`。默认值 `0`（相同）。 |
| `align` | `"start" \| "center" \| "end"` / `"center"` | 移至 Positioner `align` | 值/默认值相同。 |
| `alignOffset` | `number` / `0` | 移至 Positioner `alignOffset` | 已扩展：`number \| OffsetFunction`。默认值 `0`（相同）。 |
| `avoidCollisions` | `boolean` / `true` | 移至 Positioner `collisionAvoidance` | 签名已更改。Radix 的布尔值 → Base 的 `CollisionAvoidance` 对象 `{ side?: 'flip' \| 'shift' \| 'none'; align?: 'flip' \| 'shift' \| 'none'; fallbackAxisSide?: 'start' \| 'end' \| 'none' }`。`avoidCollisions={false}` → `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`。 |
| `collisionBoundary` | `Boundary (Element \| null \| Array<Element \| null>)` / `[]` | 移至 Positioner `collisionBoundary` | 名称相同；Base 的 `Boundary` 默认值为 `'clipping-ancestors'`（Radix 默认值 = 通过 `[]` 表示的 viewport/clipping ancestors）。 |
| `collisionPadding` | `number \| Padding` / `0` | 移至 Positioner `collisionPadding` | 形状相同；默认值从 `0` 变为 `5`。 |
| `arrowPadding` | `number` / `0` | 移至 Positioner `arrowPadding` | 相同；默认值从 `0` 变为 `5`。 |
| `sticky` | `"partial" \| "always"` / `"partial"` | 已移除（名称复用） | Radix 的 `sticky` 控制对齐轴上的贴边行为；Base 对应项是 `collisionAvoidance.align`（`'shift'` ≈ sticky 行为）。注意：Base UI Positioner 还有一个 `sticky: boolean`（默认 `false`）属性，其含义不同：当锚点滚出视口后，保持 popup 仍在视口内。不要直接沿用 Radix 的值。 |
| `hideWhenDetached` | `boolean` / `false` | 已移除（有替代方案） | 当锚点被隐藏时，Positioner/Popup 会暴露 `data-anchor-hidden`；可在 Positioner 上使用 CSS 重新实现：`[data-anchor-hidden] { visibility: hidden }`。 |

## 关闭 → 关闭

| Radix prop | 类型 / 默认值 | Base UI 等价项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 以及 `nativeButton`。 |

## Arrow → Arrow

| Radix prop | Type / default | Base UI equivalent | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Radix 渲染一个 `<svg>`；Base 渲染一个 `<div>`——请提供你自己的 SVG 子元素。 |
| `width` | `number` / `10` | dropped | 通过 CSS 设置箭头元素/SVG 的大小。 |
| `height` | `number` / `5` | dropped | 通过 CSS 设置大小。Arrow 必须是 Popup 的子元素（位于 Positioner 内部）。 |

## 值得了解的 Base UI only props（popover）

- Root: `actionsRef`、`onOpenChangeComplete`、`handle` / `triggerId` / `defaultTriggerId` + `Popover.createHandle()`、payload-render `children`、`modal: 'trap-focus'`。
- Trigger: `openOnHover` + `delay` + `closeDelay`（悬停打开的 popovers）、`payload`、`nativeButton`、`id`。
- Positioner: `positionMethod`（`'absolute' \| 'fixed'`）、`disableAnchorTracking`、`anchor`、`collisionAvoidance`。
- Popup: `initialFocus`、`finalFocus`。
- 新部分: `Backdrop`、`Title`、`Description`、`Viewport`（在多个 trigger 之间切换的动画内容）。

## 数据属性（popover）

| Radix（在 Content/Trigger/Arrow 上） | Base UI | 位置 |
| --- | --- | --- |
| `[data-state="open"/"closed"]` | `data-open` / `data-closed` | Backdrop、Positioner、Popup、Arrow。 |
| Trigger 上的 `[data-state]` | `data-popup-open` | Trigger。Base 还会添加 `data-pressed`。 |
| `[data-side]` `"left" \| "right" \| "bottom" \| "top"` | `data-side` | Positioner、Popup、Arrow；取值扩展为 `'inline-start' \| 'inline-end'`。 |
| `[data-align]` `"start" \| "end" \| "center"` | `data-align` | Positioner、Popup、Arrow。 |
| - | `data-starting-style` / `data-ending-style` | Popup、Backdrop（进入/退出动画钩子）。 |
| - | `data-anchor-hidden` | Positioner（替代 `hideWhenDetached`）。 |
| - | `data-instant` (`'click' \| 'dismiss' \| 'focus' \| 'trigger-change'`) | Popup。 |
| - | `data-uncentered` | Arrow（箭头无法在锚点上居中）。 |

## CSS 变量（popover）

| Radix（在 Content 上） | Base UI（在 Positioner 上，除非另有说明） |
| --- | --- |
| `--radix-popover-content-transform-origin` | `--transform-origin` |
| `--radix-popover-content-available-width` | `--available-width` |
| `--radix-popover-content-available-height` | `--available-height` |
| `--radix-popover-trigger-width` | `--anchor-width` |
| `--radix-popover-trigger-height` | `--anchor-height` |
| - | `--positioner-width` / `--positioner-height`（Positioner），`--popup-width` / `--popup-height`（Popup，以及 Viewport 的上一个容器上） |

---

# tooltip

部分映射：Provider→Provider，Root→Root，Trigger→Trigger，Portal→Portal，Content→Portal>Positioner>Popup，Arrow→Arrow。延迟控制移动：Radix 的 `delayDuration` 位于 Provider/Root 上；Base UI 的打开/关闭延迟位于 Provider（`delay`/`closeDelay`）和 Trigger（`delay`/`closeDelay`）上。

## Provider → Provider

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `delayDuration` | `number` / `700` | `delay` | 已重命名。Base 在 Provider 上没有文档化的默认值（Trigger 默认值是 `600`）。 |
| `skipDelayDuration` | `number` / `300` | `timeout` | 已重命名 + 保持语义：如果前一个在 `timeout` 毫秒内关闭，另一个 tooltip 会立即打开。默认值 `300` → `400`。 |
| `disableHoverableContent` | `boolean` / - | 在 Provider 中移除；请参见 Root `disableHoverablePopup` | Base UI 等价项仅存在于每个 Root 中（已重命名）。 |

## Root → Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / -（Base 默认 `false`） | `defaultOpen` | 相同。 |
| `open` | `boolean` / - | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Tooltip.Root.ChangeEventDetails) => void`。原因：`'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'disabled' \| 'imperative-action' \| 'none'`。 |
| `delayDuration` | `number` / `700` | 移至 Trigger 的 `delay` | `number`，默认 `600`。`closeDelay`（默认 `0`）也在 Trigger 上。 |
| `disableHoverableContent` | `boolean` / - | `disableHoverablePopup` | 已重命名；`boolean`，默认 `false`。 |

## 触发器 → 触发器

| Radix 属性 | 类型 / 默认值 | Base UI 等价项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 仅 Base 在 Trigger 上支持：`delay`（`600`）、`closeDelay`（`0`）、`closeOnClick`（`true`）、`disabled`（`false`）、`payload`、`handle`。 |

## Portal → Portal

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`，默认 `false`。 |
| `container` | `HTMLElement` / `document.body` | `container` | 类型更宽泛；渲染为一个 `<div>`。 |

## Content → Positioner + Popup

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | 同样的模式。 |
| `aria-label` | `string` / - | dropped (plain DOM attr) | 如有需要，直接将 `aria-label` 传递给 Popup；没有特殊 prop。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | moved to Root `onOpenChange` | 原因 `'escape-key'` + `eventDetails.cancel()`。 |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` / - | moved to Root `onOpenChange` | 原因 `'outside-press'` + `eventDetails.cancel()`。 |
| `forceMount` | `boolean` / - | dropped | Portal `keepMounted` / `actionsRef.unmount()`。 |
| `side` | enum / `"top"` | moved to Positioner `side` | `Side`（新增 `'inline-start' \| 'inline-end'`）；默认值 `'top'`（相同）。 |
| `sideOffset` | `number` / `0` | moved to Positioner `sideOffset` | `number \| OffsetFunction`；默认值 `0`。 |
| `align` | enum / `"center"` | moved to Positioner `align` | 取值/默认值相同。 |
| `alignOffset` | `number` / `0` | moved to Positioner `alignOffset` | `number \| OffsetFunction`；默认值 `0`。 |
| `avoidCollisions` | `boolean` / `true` | moved to Positioner `collisionAvoidance` | 与 popover 相同的转换（`false` → 全部为 `'none'` 的对象）。 |
| `collisionBoundary` | `Boundary` / `[]` | moved to Positioner `collisionBoundary` | Base 默认值 `'clipping-ancestors'`。 |
| `collisionPadding` | `number \| Padding` / `0` | moved to Positioner `collisionPadding` | 默认值 `0` → `5`。 |
| `arrowPadding` | `number` / `0` | moved to Positioner `arrowPadding` | 默认值 `0` → `5`。 |
| `sticky` | `"partial" \| "always"` / `"partial"` | dropped (repurposed name) | 与 popover 相同的注意事项：Base `sticky: boolean` 表示“当锚点滚出视口时保持在视口内”；对齐粘连属于 `collisionAvoidance.align`。 |
| `hideWhenDetached` | `boolean` / `false` | dropped (with workaround) | 在 Positioner 上为样式 `[data-anchor-hidden]`。 |

## Arrow → Arrow

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base 会渲染 `<div>`；请自行提供 SVG。 |
| `width` | `number` / `10` | 已移除 | 使用 CSS 控制尺寸。 |
| `height` | `number` / `5` | 已移除 | 使用 CSS 控制尺寸。 |

## 仅 Base UI 中值得了解的 props（tooltip）

- Root: `trackCursorAxis`（`'none' \| 'x' \| 'y' \| 'both'`，默认 `'none'`）、`disabled`、`disableHoverablePopup`、`actionsRef`、`onOpenChangeComplete`、`handle` / `triggerId` / `defaultTriggerId` + `Tooltip.createHandle()`、payload-render `children`。
- Provider: `closeDelay`（共享关闭延迟，Radix 没有对应项）。
- Trigger: `closeOnClick`、`disabled`、`delay`、`closeDelay`、`payload`。
- Positioner: `positionMethod`、`disableAnchorTracking`、`anchor`、`collisionAvoidance`。
- 新增部分：`Viewport`。

## 数据属性（tooltip）

| Radix | Base UI | 位置 |
| --- | --- | --- |
| `[data-state]` `"closed" \| "delayed-open" \| "instant-open"`（内容） | `data-open` / `data-closed` + `data-instant`（`'delay' \| 'dismiss' \| 'focus'`） | Popup、Arrow、Positioner（打开/关闭）。延迟/即时的区别会成为 `data-instant` 的值。 |
| `[data-state]`（触发器） | `data-popup-open` | Trigger。Base 还会添加 `data-trigger-disabled`。 |
| `[data-side]` | `data-side` | Positioner、Popup、Arrow；会添加 `'inline-start' \| 'inline-end'`。 |
| `[data-align]` | `data-align` | Positioner、Popup、Arrow。 |
| - | `data-starting-style` / `data-ending-style` | Popup。 |
| - | `data-anchor-hidden` | Positioner。 |
| - | `data-uncentered` | Arrow。 |

## CSS 变量（tooltip）

| Radix（在 Content 上） | Base UI（在 Positioner 上） |
| --- | --- |
| `--radix-tooltip-content-transform-origin` | `--transform-origin` |
| `--radix-tooltip-content-available-width` | `--available-width` |
| `--radix-tooltip-content-available-height` | `--available-height` |
| `--radix-tooltip-trigger-width` | `--anchor-width` |
| `--radix-tooltip-trigger-height` | `--anchor-height` |
| - | `--popup-width` / `--popup-height`（视口的前一个容器）。 |

---

# hover-card → preview-card

部分映射：HoverCard.Root→PreviewCard.Root，Trigger→Trigger，Portal→Portal，Content→Portal>Positioner>Popup，Arrow→Arrow。延迟从 Root 移动到 Trigger。两个库都会将触发器渲染为 `<a>` 元素。

## Root → Root

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` / - (Base 默认 `false`) | `defaultOpen` | 相同。 |
| `open` | `boolean` / - | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / - | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: PreviewCard.Root.ChangeEventDetails) => void`。原因：`'trigger-hover' \| 'trigger-focus' \| 'trigger-press' \| 'outside-press' \| 'escape-key' \| 'imperative-action' \| 'none'`。 |
| `openDelay` | `number` / `700` | moved to Trigger `delay` | 已重命名并移动；默认值更改为 `700` → `600`。 |
| `closeDelay` | `number` / `300` | moved to Trigger `closeDelay` | 已移动；默认值 `300`（相同）。 |

## 触发器 → 触发器

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base Trigger 渲染 `<a>`；Base 特有：`delay`（`600`）、`closeDelay`（`300`）、`payload`、`handle`。没有 `nativeButton`（它是链接，不是按钮）。 |

## 传送门 → 传送门

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `forceMount` | `boolean` / - | `keepMounted` | `boolean`，默认 `false`。 |
| `container` | `HTMLElement` / `document.body` | `container` | 更宽泛的类型；渲染为一个 `<div>`。 |

## Content → Positioner + Popup

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` (Popup) | 相同模式。 |
| `forceMount` | `boolean` / - | 已移除 | Portal `keepMounted` / `actionsRef.unmount()` / `onOpenChangeComplete`。 |
| `side` | 枚举 / `"bottom"` | 移至 Positioner 的 `side` | `Side`（新增 `'inline-start' \| 'inline-end'`）；默认值 `'bottom'`（相同）。 |
| `sideOffset` | `number` / `0` | 移至 Positioner 的 `sideOffset` | `number \| OffsetFunction`；默认值 `0`。 |
| `align` | 枚举 / `"center"` | 移至 Positioner 的 `align` | 相同取值 / 默认值。 |
| `alignOffset` | `number` / `0` | 移至 Positioner 的 `alignOffset` | `number \| OffsetFunction`；默认值 `0`。 |
| `avoidCollisions` | `boolean` / `true` | 移至 Positioner 的 `collisionAvoidance` | 与 popover 相同的转换。 |
| `collisionBoundary` | `Boundary` / `[]` | 移至 Positioner 的 `collisionBoundary` | Base 默认值 `'clipping-ancestors'`。 |
| `collisionPadding` | `number \| Padding` / `0` | 移至 Positioner 的 `collisionPadding` | 默认值 `0` → `5`。 |
| `arrowPadding` | `number` / `0` | 移至 Positioner 的 `arrowPadding` | 默认值 `0` → `5`。 |
| `sticky` | `"partial" \| "always"` / `"partial"` | 已移除（名称复用） | 与 popover/tooltip 相同的注意事项。 |
| `hideWhenDetached` | `boolean` / `false` | 已移除（有替代方案） | 在 Positioner 上设置样式 `[data-anchor-hidden]`。 |

（Radix HoverCard.Content 未记录任何 dismiss 回调；如有需要，escape / outside 的关闭可映射到 Root 的 `onOpenChange` 原因 `'escape-key'` / `'outside-press'`。）

## Arrow → Arrow

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | Base 渲染 `<div>`。 |
| `width` | `number` / `10` | dropped | CSS 尺寸。 |
| `height` | `number` / `5` | dropped | CSS 尺寸。 |

## 值得了解的 Base UI 仅限属性（preview-card）

- 根元素：`actionsRef`、`onOpenChangeComplete`、`handle` / `triggerId` / `defaultTriggerId` + `PreviewCard.createHandle()`、payload-render `children`。
- 触发器：`payload`、`handle`、每个触发器的 `delay`/`closeDelay`。
- 定位器：`positionMethod`、`disableAnchorTracking`、`anchor`、`collisionAvoidance`。
- 新部件：`Backdrop`、`Viewport`。

## 数据属性（preview-card）

| Radix | Base UI | 位置 |
| --- | --- | --- |
| `[data-state="open"/"closed"]` | `data-open` / `data-closed` | Backdrop、Positioner、Popup、Arrow。 |
| `[data-state]` (Trigger) | `data-popup-open` | Trigger。 |
| `[data-side]` | `data-side` | Positioner、Popup、Arrow；添加 `'inline-start' \| 'inline-end'`。 |
| `[data-align]` | `data-align` | Positioner、Popup、Arrow。 |
| - | `data-starting-style` / `data-ending-style` | Popup、Backdrop。 |
| - | `data-anchor-hidden` | Positioner。 |
| - | `data-uncentered` | Arrow。 |

## CSS 变量（预览卡片）

| Radix（在 Content 上） | Base UI（在 Positioner 上） |
| --- | --- |
| `--radix-hover-card-content-transform-origin` | `--transform-origin` |
| `--radix-hover-card-content-available-width` | `--available-width` |
| `--radix-hover-card-content-available-height` | `--available-height` |
| `--radix-hover-card-trigger-width` | `--anchor-width` |
| `--radix-hover-card-trigger-height` | `--anchor-height` |
| - | `--popup-width` / `--popup-height`（视口的前一个容器）。 |
