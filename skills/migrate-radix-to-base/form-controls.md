# Radix UI 到 Base UI 的属性映射：表单控件

范围：select、checkbox、radio-group、switch、slider。  
来源：radix-ui.com primitives 文档和 base-ui.com `/react/components/*.md`（获取于 2026-07-02）。

适用于以下各部分的全局约定：

- `asChild`（Radix，`boolean`，默认 `false`）-> `render`（Base UI，`ReactElement | ((props, state) => ReactElement)`）。每个 Base UI 部分都接受 `render`，以及 `className`/`style`，它们可以是普通值或状态回调（`(state) => ...`）。
- 渲染交互元素的 Base UI 部分接受 `nativeButton`（用于告知 Base UI `render` 目标是否为原生 `<button>`），Radix 没有对应项。
- 回调会附带第二个 `eventDetails` 参数（`{ reason, event, cancel(), allowPropagation(), isCanceled, isPropagationAllowed, trigger }`）。`eventDetails.cancel()` 替代了 Radix 中用于阻止默认组件行为的 `event.preventDefault()` 模式。
- Radix 的 `data-state="x"` 标记在 Base UI 中变为存在性属性（`data-checked`、`data-unchecked`、`data-open`，等等）。Base UI 还在各处增加了 Field 集成属性（`data-valid`、`data-invalid`、`data-dirty`、`data-touched`、`data-filled`、`data-focused`）以及动画属性（`data-starting-style`、`data-ending-style`）。
- Radix 的 `dir` 属性在 Base UI 中没有逐组件对应项，方向来自 `DirectionProvider`（或 `dir` HTML 属性）。

---

# select

部分映射：`Root -> Root`，`Trigger -> Trigger`，`Value -> Value`，`Icon -> Icon`，`Portal -> Portal`，`Content -> Portal > Positioner > Popup`（拆分为三个部分），`Viewport -> List`，`Item -> Item`，`ItemText -> ItemText`，`ItemIndicator -> ItemIndicator`，`ScrollUpButton -> ScrollUpArrow`，`ScrollDownButton -> ScrollDownArrow`，`Group -> Group`，`Label -> GroupLabel`（Base UI 的 `Select.Label` 是一个新的部分，用于标记触发器，而不是分组），`Separator -> Separator`，`Arrow -> Arrow`。

## Select.Root → Select.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `defaultValue` | `string`, 无默认值 | `defaultValue: Value[] \| Value \| null` | 名称相同，类型已扩展。值可以是任意类型（支持对象），`multiple` 时使用数组。 |
| `value` | `string`, 无默认值 | `value: Value[] \| Value \| null` | 名称相同，类型已扩展。`null` 表示“无值”（会显示占位符）。 |
| `onValueChange` | `(value: string) => void` | `onValueChange: (value: Value[] \| Value \| null, eventDetails: Select.Root.ChangeEventDetails) => void` | 签名已更改：新增第二个 `eventDetails` 参数，包含 `reason`（`'trigger-press' \| 'outside-press' \| 'escape-key' \| 'window-resize' \| 'item-press' \| 'focus-out' \| 'list-navigation' \| 'cancel-open' \| 'none'`）和 `cancel()`。 |
| `defaultOpen` | `boolean`，无默认值 | `defaultOpen: boolean`，默认 `false` | 相同。 |
| `open` | `boolean`，无默认值 | `open: boolean` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` | `onOpenChange: (open: boolean, eventDetails: Select.Root.ChangeEventDetails) => void` | 签名已更改：新增 `eventDetails`（与上面相同的 reason 联合类型）。Radix Content 的 `onEscapeKeyDown`/`onPointerDownOutside` 拦截逻辑迁移到这里（检查 `eventDetails.reason === 'escape-key'` / `'outside-press'`，调用 `eventDetails.cancel()` 可保持打开）。 |
| `dir` | `"ltr" \| "rtl"`，无默认值 | 已移除 | 使用 Base UI 的 `DirectionProvider`，或在祖先元素上使用 `dir` 属性。 |
| `name` | `string`，无默认值 | `name: string` | 相同（Base UI 会渲染一个隐藏的 `<input>`）。 |
| `disabled` | `boolean`，无默认值 | `disabled: boolean`，默认 `false` | 相同。 |
| `required` | `boolean`，无默认值 | `required: boolean`，默认 `false` | 相同。 |

Base UI `Select.Root` 不渲染任何 HTML 元素（Radix Root 也不渲染）。

## Select.Trigger → Select.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 参见全局约定。Base UI Trigger 默认渲染为 `<button>`；此处 `nativeButton` 默认值为 `true`，当通过 `render` 渲染非 button 元素时，请将其设为 `false`。 |
| (none) | - | `disabled: boolean` | Base UI 允许仅禁用触发器。 |

## Select.Value → Select.Value

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。 |
| `placeholder` | `ReactNode`，无默认值 | `placeholder: React.ReactNode` | 同名。行为变化：Radix 的 `Value` 会渲染所选 Item 的 `ItemText` 内容；Base UI 会渲染原始值字符串，除非你在 Root 上传入 `items`，或者使用 `children` 函数（`(value) => ReactNode`）。如果你的 item 标签与值不同，请在 Root 上提供 `items`，或通过 `children` 进行格式化。 |

## Select.Icon → Select.Icon

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。Base UI Icon 提供 `data-popup-open`，用于在打开时旋转的样式控制。 |

## Select.Portal → Select.Portal

| Radix prop | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `container` | `HTMLElement`，默认 `document.body` | `container: HTMLElement \| ShadowRoot \| React.RefObject<...> \| null` | 概念相同，类型范围更宽（接受 ref 和 ShadowRoot）。Base UI Portal 会渲染一个 `<div>`，并接受 `className`/`style`/`render`。 |

## Select.Content → Select.Portal > Select.Positioner > Select.Popup（拆分/移动）

Radix 的 `Content` 将定位、碰撞处理和面板本身合并在一个部分中。在 Base UI 中，定位相关的 props 放在 `Positioner` 上，面板/聚焦相关的 props 放在 `Popup` 上，关闭拦截则放在 `Root.onOpenChange` 的 eventDetails 中。

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render`（在 Positioner 和/或 Popup 上） | 同样的模式。 |
| `position` | `"item-aligned" \| "popper"`, default `"item-aligned"` | `alignItemWithTrigger: boolean` on Positioner, default `true` | 签名已变：枚举改为布尔值。`"item-aligned"` -> `alignItemWithTrigger`（true，默认值），`"popper"` -> `alignItemWithTrigger={false}`。当空间不足或在触摸输入时，Base UI 会自动禁用它。 |
| `side` | `"top" \| "right" \| "bottom" \| "left"`, default `"bottom"` | `side: Side` on Positioner, default `'bottom'` | 已移动。Base UI 额外增加了逻辑值 `'inline-start' \| 'inline-end'`。仅在 `alignItemWithTrigger` 关闭时生效（与 Radix 的 popper 模式一致）。 |
| `sideOffset` | `number`, default `0` | `sideOffset: number \| OffsetFunction` on Positioner, default `0` | 已移动，类型扩展（接受一个 `{ side, align, anchor, positioner }` 的函数）。 |
| `align` | `"start" \| "center" \| "end"`, default `"start"` | `align: Align` on Positioner, default `'center'` | 已移动。默认值不同：Radix 是 `"start"`，Base UI 是 `'center'`。如需保留 Radix 行为，请显式传入 `align="start"`。 |
| `alignOffset` | `number`, default `0` | `alignOffset: number \| OffsetFunction` on Positioner, default `0` | 已移动，类型扩展。 |
| `avoidCollisions` | `boolean`, default `true` | `collisionAvoidance: CollisionAvoidance` on Positioner | 签名已变：布尔值改为配置对象 `{ side: 'flip' \| 'shift' \| 'none', align: 'flip' \| 'shift' \| 'none', fallbackAxisSide: 'start' \| 'end' \| 'none' }`。`avoidCollisions={false}` ~ `collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}`。 |
| `collisionBoundary` | `Boundary`, default `[]` | `collisionBoundary: Boundary` on Positioner, default `'clipping-ancestors'` | 已移动，默认值不同（Radix 默认是 viewport，Base UI 默认是 clipping ancestors）。 |
| `collisionPadding` | `number \| Padding`, default `10` | `collisionPadding: Padding` on Positioner, default `5` | 已移动，默认值不同（10 -> 5）。 |
| `arrowPadding` | `number`, default `0` | `arrowPadding: number` on Positioner, default `5` | 已移动，默认值不同（0 -> 5）。 |
| `sticky` | `"partial" \| "always"`, default `"partial"` | `sticky: boolean` on Positioner, default `false` | 签名已变且语义不同：Base UI 的 `sticky` 会在锚点滚出视口后仍保持弹层在视口内。没有 `"always"` 的等价项。 |
| `hideWhenDetached` | `boolean`, default `false` | dropped (workaround) | 没有对应 prop。可根据 `data-anchor-hidden` 设置样式（当锚点隐藏时，Positioner 上会出现该属性），例如：`[data-anchor-hidden] { visibility: hidden }`。 |
| `onCloseAutoFocus` | `(event: Event) => void` | `finalFocus` on Popup | 签名已变：不再是在事件处理器中阻止默认行为，而是将 `finalFocus` 传为 `boolean \| RefObject \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null)`。`false` = 不移动焦点（相当于 `preventDefault()`），ref/element = 聚焦到它。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | moved to `Root.onOpenChange` | 检查 `eventDetails.reason === 'escape-key'`；调用 `eventDetails.cancel()` 可阻止关闭。 |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | moved to `Root.onOpenChange` | 检查 `eventDetails.reason === 'outside-press'`；调用 `eventDetails.cancel()` 可阻止关闭。 |

## Select.Viewport → Select.List（已重命名）

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 已重命名的部分，双方都没有其他 props。Radix 要求在 Content 内将 `<ScrollUpButton>`/`<Viewport>`/`<ScrollDownButton>` 作为兄弟节点；在 Base UI 中，`List` 和滚动箭头是 `Popup` 的子元素。 |

## Select.Item → Select.Item

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。另有 `nativeButton`（默认 `false`，Base UI Item 渲染为 `<div>`）。 |
| `value` | `string`，必填 | `value: any`，默认 `null` | 名称相同，类型扩展（允许对象，参见 Root `isItemEqualToValue` / `itemToString*`）。`null` 值表示占位项。 |
| `disabled` | `boolean`，无默认值 | `disabled: boolean`，默认 `false` | 相同。 |
| `textValue` | `string`，无默认值 | `label: string` | 已更名。两者都用于 typeahead 文本匹配，默认取该项的文本内容。 |

## Select.ItemText → Select.ItemText

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。注意元素更改：Radix 渲染 `<span>`，Base UI 渲染 `<div>`。 |

## Select.ItemIndicator → Select.ItemIndicator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。 |
| （隐式条件挂载） | - | `keepMounted: boolean` | Base UI 默认在未选中时会卸载，和 Radix 一样。`keepMounted` 会将其保留在 DOM 中（Radix 在 select 的 ItemIndicator 上没有 `forceMount`）。 |

## Select.ScrollUpButton / ScrollDownButton → Select.ScrollUpArrow / ScrollDownArrow（已重命名）

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 组件部分已重命名。Base UI 额外添加了 `keepMounted: boolean`（默认 `false`），用于在弹出层不可滚动时仍将箭头保留在 DOM 中。Base UI 的箭头不会在触摸输入上渲染。 |

## Select.Group → Select.Group

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同。 |

## Select.Label → Select.GroupLabel（已重命名）

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 已重命名。不要映射到 Base UI 的 `Select.Label`，它是一个新的部分，用于为选择器触发器本身添加标签（渲染在弹出层外部）。 |

## Select.Separator → Select.Separator

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同。Base UI 额外添加了 `orientation: Orientation`，默认值为 `'horizontal'`。 |

## Select.Arrow → Select.Arrow

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 相同模式。 |
| `width` | `number`，默认 `10` | 已移除 | 使用 CSS 设置箭头大小；Base UI Arrow 会渲染一个 `<div>`，你可以用自己的 SVG 填充它。 |
| `height` | `number`，默认 `5` | 已移除 | 同上。 |

## 仅需了解的 Base UI props（选取）

- `Root.multiple: boolean`（默认 `false`）：多选，使用 `Value[]` 值，Radix 中没有对应项。
- `Root.items`: `Record<string, ReactNode> | { label, value }[] | Group[]`，让 `Select.Value` 渲染标签而不是原始值。
- `Root.isItemEqualToValue`、`Root.itemToStringLabel`、`Root.itemToStringValue`：支持对象值。
- `Root.modal: boolean`（默认 `true`）：滚动锁定 + 阻止外部指针交互；Radix select 一直是偏 modal 的，设置 `modal={false}` 可实现非 modal 行为。
- `Root.readOnly`、`Root.autoComplete`、`Root.form`、`Root.inputRef`、`Root.id`、`Root.onOpenChangeComplete`、`Root.actionsRef`（`{ unmount() }`，用于外部控制退出动画）、`Root.highlightItemOnHover`（默认 `true`）。
- 新增部件：`Select.Backdrop`（弹出层下方的遮罩层）、`Select.Label`（触发器标签）、`Popup.finalFocus`。
- `Positioner.anchor`、`Positioner.positionMethod`（`'absolute' | 'fixed'`）、`Positioner.disableAnchorTracking`。

## 数据属性映射（选择）

| Radix | Base UI |
| --- | --- |
| Trigger `data-state="open" \| "closed"` | Trigger `data-popup-open`（存在即表示）以及 `data-pressed`、`data-popup-side` |
| Trigger `data-placeholder` | Trigger/Value `data-placeholder`（相同） |
| Trigger `data-disabled` | Trigger `data-disabled`（相同），以及 `data-readonly`、`data-required`、Field 属性 |
| Content `data-state="open" \| "closed"` | Positioner/Popup `data-open` / `data-closed`（存在即表示） |
| Content `data-side` (`left/right/bottom/top`) | Positioner/Popup `data-side` (`none/top/bottom/left/right/inline-start/inline-end`) |
| Content `data-align` | Positioner/Popup `data-align`（相同值） |
| Item `data-state="checked" \| "unchecked"` | Item `data-selected`（存在即表示，没有 unchecked 标记） |
| Item `data-highlighted` | Item `data-highlighted`（相同） |
| Item `data-disabled` | Item `data-disabled`（相同） |
| (none) | Popup/Backdrop/ItemIndicator/ScrollArrows `data-starting-style` / `data-ending-style`（动画钩子） |
| (none) | Positioner `data-anchor-hidden`，ScrollArrows `data-direction` / `data-visible` |

## CSS 变量映射（select）

所有 Base UI 变量都设置在 `Select.Positioner` 上（Radix 将它们设置在 Content 上，仅限 popper 模式）：

| Radix | Base UI |
| --- | --- |
| `--radix-select-trigger-width` | `--anchor-width` |
| `--radix-select-trigger-height` | `--anchor-height` |
| `--radix-select-content-available-width` | `--available-width` |
| `--radix-select-content-available-height` | `--available-height` |
| `--radix-select-content-transform-origin` | `--transform-origin` |

---

# checkbox

部分映射：`Root -> Root`, `Indicator -> Indicator`。元素变化：Radix Root 渲染一个 `<button>` 以及表单内的隐藏 input；Base UI Root 总是渲染一个 `<span>` 以及隐藏的 `<input>`（使用 `nativeButton` + `render` 来渲染一个真正的 button）。

## Checkbox.Root → Checkbox.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 参见全局约定，在渲染 `<button>` 时与 `nativeButton` 搭配使用。 |
| `defaultChecked` | `boolean \| 'indeterminate'`, no default | `defaultChecked: boolean`, default `false` | 签名已更改：`'indeterminate'` 不再是一个 checked 值。请使用单独的 `indeterminate: boolean` 属性。 |
| `checked` | `boolean \| 'indeterminate'`, no default | `checked: boolean` + `indeterminate: boolean` | 签名已更改：拆分为两个属性。Radix 的 `checked="indeterminate"` -> Base UI 的 `indeterminate`（复选框可以在不选中/选中状态之外独立处于半选状态）。 |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | `onCheckedChange: (checked: boolean, eventDetails: Checkbox.Root.ChangeEventDetails) => void` | 签名已更改：`checked` 始终为布尔值，新增了 `eventDetails`（`reason: 'none'`）。半选状态的转换由你通过 `indeterminate` 属性来管理（或在 CheckboxGroup 中通过 `parent` 管理）。 |
| `disabled` | `boolean`, no default | `disabled: boolean`, default `false` | 相同。 |
| `required` | `boolean`, no default | `required: boolean`, default `false` | 相同。 |
| `name` | `string`, no default | `name: string` | 相同。 |
| `value` | `string`, default `"on"` | `value: string` | 名称相同。Radix 文档将默认值写为 `"on"`；Base UI 文档未列出默认值，但隐藏输入的提交行为与原生 checkbox 一致（未设置时为 `"on"`）。 |

## Checkbox.Indicator → Checkbox.Indicator

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。 |
| `forceMount` | `boolean`，无默认值 | `keepMounted: boolean`，默认 `false` | 已重命名。两者都会在未选中时将元素保留在 DOM 中（用于动画）。Base UI 还会在 `indeterminate` 时渲染指示器。 |

## 值得了解的仅有 Base UI props（checkbox）

- `Root.indeterminate: boolean`（默认 `false`）：混合状态，与 `checked` 解耦。
- `Root.parent: boolean` + `CheckboxGroup`（新组件，`base-ui.com/react/components/checkbox-group`）：`<CheckboxGroup value/defaultValue/onValueChange(string[], eventDetails)/allValues/disabled>` 为一组复选框提供共享状态，并支持父级“全选”复选框。Radix 中没有对应功能，这是新能力。
- `Root.readOnly: boolean`、`Root.uncheckedValue: string`（未选中时提交的值）、`Root.form: string`、`Root.inputRef`、`Root.id`、`Root.nativeButton`。

## 数据属性映射（复选框）

| Radix | Base UI |
| --- | --- |
| `data-state="checked"` | `data-checked` |
| `data-state="unchecked"` | `data-unchecked` |
| `data-state="indeterminate"` | `data-indeterminate` |
| `data-disabled` | `data-disabled`（相同） |
| （无） | `data-readonly`、`data-required`、`data-valid`、`data-invalid`、`data-dirty`、`data-touched`、`data-filled`、`data-focused`（Field 集成） |
| （无） | 指示器 `data-starting-style` / `data-ending-style` |

任一侧都没有 CSS 变量。

---

# radio-group

部分映射：Radix 提供一个 `RadioGroup` 命名空间；Base UI 将其拆分为 `RadioGroup`（单个组件，没有子部分）和 `Radio`（`Radio.Root`、`Radio.Indicator`）。`RadioGroup.Root -> RadioGroup`，`RadioGroup.Item -> Radio.Root`，`RadioGroup.Indicator -> Radio.Indicator`。元素变化：Radix 的 Item 渲染 `<button>`；Base UI 的 `Radio.Root` 渲染 `<span>` 加上隐藏的 `<input>`（如果要使用真正的按钮，请使用 `nativeButton` + `render`）。

## RadioGroup.Root → RadioGroup

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。 |
| `defaultValue` | `string`，无默认值 | `defaultValue: Value` | 名称相同，类型扩展（任意值类型）。 |
| `value` | `string`，无默认值 | `value: Value` | 名称相同，类型扩展。 |
| `onValueChange` | `(value: string) => void` | `onValueChange: (value: Value, eventDetails: RadioGroup.ChangeEventDetails) => void` | 签名已更改：新增 `eventDetails`（`reason: 'none'`）。 |
| `disabled` | `boolean`，无默认值 | `disabled: boolean`，默认 `false` | 相同。 |
| `name` | `string`，无默认值 | `name: string` | 相同。 |
| `required` | `boolean`，无默认值 | `required: boolean`，默认 `false` | 相同。 |
| `orientation` | `enum`，默认 `undefined` | 已移除 | Base UI 的方向键导航会自动处理两个轴；没有 orientation 属性（如有需要，请自行设置 `aria-orientation` 以供辅助技术使用）。 |
| `dir` | `"ltr" \| "rtl"`，无默认值 | 已移除 | 使用 `DirectionProvider`。 |
| `loop` | `boolean`，默认 `true` | 已移除 | 焦点环绕已内置，且不可配置。 |

## RadioGroup.Item → Radio.Root（已移至 Radio 命名空间）

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 相同模式，并增加 `nativeButton`（默认 `false`）。 |
| `value` | `string`，必填 | `value: Value`，必填 | 名称相同，类型范围更宽。 |
| `disabled` | `boolean`，无默认值 | `disabled: boolean` | 相同。 |
| `required` | `boolean`，无默认值 | `required: boolean` | 相同。 |

## RadioGroup.Indicator → Radio.Indicator（已移动到 Radio 命名空间）

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 相同模式。 |
| `forceMount` | `boolean`，无默认值 | `keepMounted: boolean`，默认 `false` | 已重命名。 |

## 仅 Base UI 需要了解的属性（radio-group）

- `RadioGroup.readOnly`、`RadioGroup.form`、`RadioGroup.inputRef`（该组拥有一个隐藏输入）。
- `Radio.Root.readOnly`、`Radio.Root.inputRef`、`Radio.Root.nativeButton`。

## 数据属性映射（radio-group）

| Radix | Base UI |
| --- | --- |
| Root `data-disabled` | RadioGroup `data-disabled`（相同） |
| Item/Indicator `data-state="checked"` | Radio.Root/Indicator `data-checked` |
| Item/Indicator `data-state="unchecked"` | Radio.Root/Indicator `data-unchecked` |
| Item/Indicator `data-disabled` | `data-disabled`（相同） |
| （无） | `data-readonly`、`data-required`、Field 属性（`data-valid`、`data-invalid`、`data-dirty`、`data-touched`、`data-filled`、`data-focused`） |
| （无） | Indicator `data-starting-style` / `data-ending-style` |

双方都没有 CSS 变量。

---

# switch

部分映射：`Root -> Root`，`Thumb -> Thumb`。元素变化：Radix Root 在表单中渲染 `<button>` + 隐藏输入；Base UI Root 总是渲染 `<span>` + 隐藏 `<input>`（使用 `nativeButton` + `render` 来实现真正的按钮）。

## Switch.Root → Switch.Root

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 相同模式，配合 `nativeButton` 使用。 |
| `defaultChecked` | `boolean`，无默认值 | `defaultChecked: boolean`，默认 `false` | 相同。 |
| `checked` | `boolean`，无默认值 | `checked: boolean` | 相同。 |
| `onCheckedChange` | `(checked: boolean) => void` | `onCheckedChange: (checked: boolean, eventDetails: Switch.Root.ChangeEventDetails) => void` | 签名已变更：新增了 `eventDetails`（`reason: 'none'`）。 |
| `disabled` | `boolean`，无默认值 | `disabled: boolean`，默认 `false` | 相同。 |
| `required` | `boolean`，无默认值 | `required: boolean`，默认 `false` | 相同。 |
| `name` | `string`，无默认值 | `name: string` | 相同。 |
| `value` | `string`，默认 `"on"` | `value: string` | 同名。Base UI 默认提交 `"on"`，与原生复选框行为一致。 |

## Switch.Thumb → Switch.Thumb

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式，仅在任一侧作为 prop。 |

## 仅 Base UI 值得了解的 props（switch）

- `Root.readOnly: boolean`，`Root.uncheckedValue: string`，`Root.form: string`，`Root.inputRef`，`Root.id`，`Root.nativeButton`（默认 `false`）。

## 数据属性映射（switch）

| Radix | Base UI |
| --- | --- |
| Root/Thumb `data-state="checked"` | `data-checked` |
| Root/Thumb `data-state="unchecked"` | `data-unchecked` |
| Root/Thumb `data-disabled` | `data-disabled`（相同） |
| （无） | `data-readonly`、`data-required`、Field 属性（`data-valid`、`data-invalid`、`data-dirty`、`data-touched`、`data-filled`、`data-focused`） |

两边都没有 CSS 变量。

---

# 滑块

部件映射：`Root -> Root`、`Track -> Track`、`Range -> Indicator`（已重命名）、`Thumb -> Thumb`，以及一个新的必需 `Control` 部件：Base UI 的结构为 `Root > Control > Track > (Indicator, Thumb)`。`Control` 是可点击/可拖动的表面（Radix 的 Root 自行处理指针交互）。Base UI 还新增了 `Value` 和 `Label` 部件。元素变化：Radix 的 Thumb 渲染为一个普通元素，外层包裹一个不可见的 span，表单中包含一个隐藏 input；Base UI 的 Thumb 渲染为一个 `<div>`，其中嵌套一个 `<input type="range">`。

## Slider.Root → Slider.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 同样的模式。 |
| `defaultValue` | `number[]`，无默认值 | `defaultValue: number \| number[]` | 名称相同，但已扩展：单个 `number` 会生成单滑块（不需要数组包装）。 |
| `value` | `number[]`，无默认值 | `value: number \| number[]` | 同样，已扩展。范围滑块仍然使用数组。 |
| `onValueChange` | `(value: number[]) => void` | `onValueChange: (value: number \| number[], eventDetails: Slider.Root.ChangeEventDetails) => void` | 签名已更改：value 会与传入的形状一致（单个时为 number），并新增 `eventDetails`，其中包含 `reason: 'input-change' \| 'track-press' \| 'drag' \| 'keyboard' \| 'none'` 和 `activeThumbIndex: number`。 |
| `onValueCommit` | `(value: number[]) => void` | `onValueCommitted: (value: number \| number[], eventDetails: Slider.Root.CommitEventDetails) => void` | 已重命名（`Commit` -> `Committed`），且签名已更改（与上面的 shape/eventDetails 说明相同）。如果值未发生变化，Base UI 不会触发它。 |
| `name` | `string`，无默认值 | `name: string` | 同样。 |
| `disabled` | `boolean`，默认 `false` | `disabled: boolean`，默认 `false` | 同样。 |
| `orientation` | `"horizontal" \| "vertical"`，默认 `"horizontal"` | `orientation: Orientation`，默认 `'horizontal'` | 同样。 |
| `dir` | `"ltr" \| "rtl"`，无默认值 | 已移除 | 使用 `DirectionProvider`。 |
| `inverted` | `boolean`，默认 `false` | 已移除（变通方案） | 没有对应项。对于水平滑块，可包裹在 `DirectionProvider dir="rtl"` 中（基于方向的反转）；垂直滑块没有内置反转方式。 |
| `min` | `number`，默认 `0` | `min: number`，默认 `0` | 同样。 |
| `max` | `number`，默认 `100` | `max: number`，默认 `100` | 同样。 |
| `step` | `number`，默认 `1` | `step: number`，默认 `1` | 同样。 |
| `minStepsBetweenThumbs` | `number`，默认 `0` | `minStepsBetweenValues: number`，默认 `0` | 已重命名（`Thumbs` -> `Values`）。 |
| `form` | `string`，无默认值 | `form: string` | 同样。 |

## Slider.Track → Slider.Track（移入 Control 内）

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 相同模式。结构性变更：Track 现在必须嵌套在新的 `Slider.Control` 部分中，并且 `Thumb` 移入 `Track` 内部（Radix 中 Thumb 是 Root 下与 Track 同级的兄弟元素）。 |

## Slider.Range → Slider.Indicator（已重命名）

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean`，`false` | `render` | 已重命名的部分，作用相同（显示填充部分），仍然是 Track 的子元素。 |

## Slider.Thumb → Slider.Thumb

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean`, `false` | `render` | 同样的模式。 |
| （通过 aria 属性进行每个滑块的可访问性设置） | - | `index: number`、`getAriaLabel(index)`、`getAriaValueText(formattedValue, value, index)`、`aria-valuetext` | Base UI 的滑块需要 `index`（多滑块范围滑块的 SSR 必需），以及无障碍格式化函数。此外，`disabled`、`inputRef`、`tabIndex`、`onFocus`/`onBlur`/`onKeyDown` 会传递给嵌套的 `<input type="range">`。 |

## （新部分）Slider.Control

Radix 中没有对应项。接收指针事件的交互表面；用它包裹 `Track`。属性：仅 `className`/`style`/`render`。

## 仅在 Base UI 中值得了解的 props（slider）

- `Root.thumbAlignment: 'center' | 'edge' | 'edge-client-only'`（默认 `'center'`）：拇指的中心或边缘在最小/最大值时是否与控件边缘对齐。Radix 一直通过 CSS 表现得更接近 `'edge'`；Base UI 默认是 `'center'`，设置 `thumbAlignment="edge"` 可让拇指保持在轨道边界内。
- `Root.thumbCollisionBehavior: 'push' | 'swap' | 'none'`（默认 `'push'`）：范围滑块拇指碰撞处理方式（Radix 的行为最接近 `'none'`）。
- `Root.largeStep: number`（默认 `10`）：Page Up/Down 和 Shift+Arrow 的增量。
- `Root.format: Intl.NumberFormatOptions` 和 `Root.locale: Intl.LocalesArgument`：用于 `Slider.Value` 和 `aria-valuetext` 的值格式化。
- 新增部件：`Slider.Value`（渲染 `<output>`，`children: (formattedValues: string[], values: number[]) => ReactNode`）、`Slider.Label`（自动关联的标签）。

## 数据属性映射（滑块）

| Radix | Base UI |
| --- | --- |
| `data-disabled`（所有部分） | `data-disabled`（相同，所有部分） |
| `data-orientation`（`horizontal/vertical`，所有部分） | `data-orientation`（相同取值，所有部分） |
| （无） | `data-dragging`（拖动时存在于所有部分） |
| （无） | Thumb `data-index`（范围滑块中的 thumb 索引） |
| （无） | 所有部分上的 Field 属性（`data-valid`、`data-invalid`、`data-dirty`、`data-touched`、`data-focused`） |

任一侧都没有 CSS 变量（Radix 滑块通过内联样式定位 thumb；Base UI 也是如此）。
