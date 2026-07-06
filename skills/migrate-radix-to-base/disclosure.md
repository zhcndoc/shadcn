# Radix → Base UI props mapping: disclosure + toggle family

范围：accordion、collapsible、tabs、toggle、toggle-group、toolbar。
来源：radix-ui.com primitives 文档 + base-ui.com `.md` 文档，并与已安装的 `@base-ui/react@1.6.0` `.d.ts` 文件交叉核对（已发布的 accordion 文档页有滞后；此处以类型定义为准）。

适用于下面每个组件的约定：

- `asChild`（boolean，默认 `false`）→ `render`（`ReactElement | (props: HTMLProps, state) => ReactElement`）。签名已更改：不再传入单个子元素，而是把元素传给 `render`；Base UI 会把 props 合并到该元素上。用于渲染按钮的部分还额外接受 `nativeButton`（默认 `true`），当 `render` 生成的不是 `<button>` 元素时将其设为 `false`。
- Base UI 的 `className` 和 `style` 也接受 `(state) => value` 形式的函数。
- Radix 的 `data-[state=...]` 值属性会变为 Base UI 的存在型属性（`data-open`、`data-closed`、`data-pressed`、`data-active`）。
- Base UI 的变更回调都新增了第二个 `eventDetails` 参数（`{ reason, event, cancel(), ... }`）。
- Radix 的 `dir` 属性在各处都被移除；Base UI 从 DOM 的 `dir` 属性 / `DirectionProvider` 读取方向。

---

# accordion

部件映射：`Root → Root`，`Item → Item`，`Header → Header`，`Trigger → Trigger`，`Content → Panel`。

## Accordion.Root → Accordion.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。将元素传递给 `render`，而不是包裹子元素。 |
| `type` (required) | `"single" \| "multiple"` / — | `multiple` | 签名已更改。`type="multiple"` → `multiple`（布尔值，默认 `false`）；`type="single"` → 省略。 |
| `value` | `string` (single) or `string[]` (multiple) / — | `value` | 签名已更改。Base UI 始终使用数组（`Value[]`，`Value = any`），即使在单选模式下也是如此：`value="a"` → `value={["a"]}`。 |
| `defaultValue` | `string` or `string[]` / — | `defaultValue` | 与 `value` 相同的数组注意事项。 |
| `onValueChange` | `(value: string) => void` or `(value: string[]) => void` / — | `onValueChange` | 签名已更改：`(value: Value[], eventDetails: Accordion.Root.ChangeEventDetails) => void`。始终接收数组；单选模式下请解包 `value[0]`。 |
| `collapsible` | `boolean` / `false` | — 已移除 | Base UI 的单选模式始终可折叠。若要禁止关闭最后一个已展开项（Radix 中 `collapsible={false}` 的默认行为），请控制 `value` 并忽略数组为空时的更新，或者在 `value.length === 0` 时调用 `eventDetails.cancel()`。 |
| `disabled` | `boolean` / `false` | `disabled`（默认 `false`） | 相同。 |
| `dir` | `"ltr" \| "rtl"` / `"ltr"` | — 已移除 | 使用 DOM `dir` 属性 / `DirectionProvider`。 |
| `orientation` | `"vertical" \| "horizontal"` / `"vertical"` | — 已移除（该属性仍存在，但已弃用且无实际作用） | 根据 APG 指南更新，Base UI 已移除 roving 箭头键焦点，因此 `orientation`（以及 `loopFocus`）不再影响键盘行为。不要沿用它。 |

## Accordion.Item → Accordion.Item

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `value`（必填） | `string` / — | `value` | 重命名约束：Base UI 的 `value` 是 `any` 且为可选（省略时会根据索引自动生成）。为保持一致性，请继续传入字符串。 |
| `disabled` | `boolean` / `false` | `disabled`（默认 `false`） | 相同。 |

## Accordion.Header → Accordion.Header

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。两者默认都渲染 `<h3>`。 |

## Accordion.Trigger → Accordion.Trigger

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, default `true`) | 签名已更改。 |

## Accordion.Content → Accordion.Panel

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `forceMount` | `true \| undefined` / — | `keepMounted`（boolean，默认 `false`） | 已重命名。`forceMount` → `keepMounted`（关闭的面板仍保留在 DOM 中，但处于隐藏状态）。也可在 `Root` 上使用，以应用于所有面板。 |

## 仅需了解的 Base UI 属性

- `Root.hiddenUntilFound` / `Panel.hiddenUntilFound`（默认 `false`）：使用 `hidden="until-found"`，因此浏览器的页内查找可以展开面板；会覆盖 `keepMounted`。Radix 中没有对应项。
- `Root.keepMounted`：每个面板属性的根级版本。
- `Item.onOpenChange`：`(open: boolean, eventDetails: Accordion.Item.ChangeEventDetails) => void`，每个项的打开回调。Radix 中没有对应项。
- `Trigger.nativeButton`（默认 `true`）。
- 每个部分上的 `className` / `style` 状态函数形式。

## 数据属性映射

| Radix | Base UI | 注释 |
|---|---|---|
| `Item/Header/Content [data-state="open" \| "closed"]` | `Item`, `Header`: `data-open` (presence); `Panel`: `data-open` (presence) | 折叠面板各部分没有 `data-closed`（不同于可折叠内容）；通过缺少 `data-open` 来表示关闭状态。 |
| `Trigger [data-state="open"]` | `Trigger [data-panel-open]` | 已重命名。Trigger 具体使用 `data-panel-open`，而不是 `data-open`。 |
| `[data-disabled]` | `[data-disabled]` | 相同（Root、Item、Header、Trigger、Panel）。 |
| `[data-orientation]` (all parts) | `Root`, `Panel`: `data-orientation` | 已与 orientation 一起废弃；请避免依赖它。 |
| — | `Item/Header/Panel [data-index]` | 仅 Base UI：数字项索引。 |
| — | `Panel [data-starting-style]`, `[data-ending-style]` | 仅 Base UI：CSS 过渡动画钩子（替代 Radix 的 mount/unmount 动画模式）。 |

## CSS 变量映射

| Radix | Base UI |
|---|---|
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-accordion-content-width` | `--accordion-panel-width` |

---

# 可折叠

部分映射：`Root → Root`，`Trigger → Trigger`，`Content → Panel`。

## Collapsible.Root → Collapsible.Root

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `defaultOpen` | `boolean` / — | `defaultOpen`（默认 `false`） | 相同。 |
| `open` | `boolean` / — | `open` | 相同。 |
| `onOpenChange` | `(open: boolean) => void` / — | `onOpenChange` | 签名已更改：`(open: boolean, eventDetails: Collapsible.Root.ChangeEventDetails) => void`。 |
| `disabled` | `boolean` / — | `disabled`（默认 `false`） | 相同。 |

## Collapsible.Trigger → Collapsible.Trigger

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, 默认 `true`) | 签名已更改。 |

## Collapsible.Content → Collapsible.Panel

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `forceMount` | `true \| undefined` / — | `keepMounted`（boolean，默认 `false`） | 已重命名。 |

## 值得了解的 Base UI 仅有属性

- `Panel.hiddenUntilFound`（默认 `false`）：通过 `hidden="until-found"` 提供页面内查找支持；会覆盖 `keepMounted`。
- `Trigger.nativeButton`（默认 `true`）。
- `className` / `style` 的状态函数形式。

## 数据属性映射

| Radix | Base UI | 说明 |
|---|---|---|
| `Root/Content [data-state="open" \| "closed"]` | `Panel [data-open]` / `[data-closed]` | 已重命名为存在性属性。Base UI Root 渲染为普通的 `<div>`；状态属性位于 Panel/Trigger 上。 |
| `Trigger [data-state="open"]` | `Trigger [data-panel-open]` | 已重命名；使用触发器专用名称。 |
| `[data-disabled]` | —（不会在可折叠部分上输出） | 请改为根据 `disabled` prop / Trigger 上的 `:disabled` 来控制样式。 |
| — | `Panel [data-starting-style]`, `[data-ending-style]` | 仅 Base UI：动画钩子。 |

## CSS 变量映射

| Radix | Base UI |
|---|---|
| `--radix-collapsible-content-height` | `--collapsible-panel-height` |
| `--radix-collapsible-content-width` | `--collapsible-panel-width` |

---

# 选项卡

部分映射：`Root → Root`，`List → List`，`Trigger → Tab`，`Content → Panel`。Base UI 额外添加了一个 `Indicator` 部分，在 Radix 中没有对应项。

## Tabs.Root → Tabs.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `defaultValue` | `string` / — | `defaultValue` | 签名已更改：Base UI 的值类型为 `Tabs.Tab.Value`（`any`），默认值为 `0`（默认激活第一个标签页；Radix 没有默认激活的标签页）。字符串仍可正常使用且无需更改。 |
| `value` | `string` / — | `value` | 字符串值的形状相同；类型扩大为 `any`。 |
| `onValueChange` | `(value: string) => void` / — | `onValueChange` | 签名已更改：`(value: Tabs.Tab.Value, eventDetails: Tabs.Root.ChangeEventDetails) => void`。 |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation`（默认 `'horizontal'`） | 相同。 |
| `dir` | `"ltr" \| "rtl"` / — | — 已移除 | 使用 DOM `dir` / `DirectionProvider`。 |
| `activationMode` | `"automatic" \| "manual"` / `"automatic"` | 移动并重命名为：`List.activateOnFocus`（boolean，默认 `false`） | 从 Root 移至 List，并且默认值取反：Radix 默认自动激活，Base UI 1.6.0 默认 `false`（手动）。为保留 Radix 的默认行为，请设置 `<Tabs.List activateOnFocus>`；`activationMode="manual"` → 省略。 |

## Tabs.List → Tabs.List

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `loop` | `boolean` / `true` | `loopFocus`（默认 `true`） | 已重命名。 |

## Tabs.Trigger → Tabs.Tab

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, 默认 `true`) | 签名已更改。 |
| `value` (required) | `string` / — | `value` (required) | 类型已扩展为 `Tabs.Tab.Value`（`any`）；字符串保持不变。 |
| `disabled` | `boolean` / `false` | `disabled` | 相同。 |

## Tabs.Content → Tabs.Panel

| Radix prop | Type / default | Base UI equivalent | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `value` (required) | `string` / — | `value` (required) | 类型已放宽；字符串保持不变。 |
| `forceMount` | `true \| undefined` / — | `keepMounted` (boolean, default `false`) | 已重命名。隐藏的面板会以 `data-hidden` 保留在 DOM 中。 |

## 仅需了解的 Base UI 属性

- `Tabs.Indicator`：新增部分，一个 `<span>`，用于跟踪当前活动选项卡，以实现滑动高亮界面；`renderBeforeHydration`（默认 `false`）用于避免 SSR 闪烁。会暴露下面的 `--active-tab-*` CSS 变量。
- `List.activateOnFocus`（见上文）。
- 所有部分上的 `Tab.nativeButton`、状态函数 `className`/`style`。

## 数据属性映射

| Radix | Base UI | 备注 |
|---|---|---|
| `Trigger [data-state="active" \| "inactive"]` | `Tab [data-active]`（存在即表示） | 已重命名。Inactive = `data-active` 不存在。 |
| `Content [data-state="active" \| "inactive"]` | `Panel [data-hidden]`（隐藏时存在） | 极性相反：Radix 标记的是激活状态，Base UI 标记的是隐藏状态。 |
| `[data-orientation]`（所有部分） | `[data-orientation]`（Root、List、Tab、Panel、Indicator） | 相同。 |
| `Trigger [data-disabled]` | `Tab [data-disabled]` | 相同。 |
| — | `[data-activation-direction]`（`'left' \| 'right' \| 'up' \| 'down' \| 'none'`，所有部分） | 仅 Base UI：上一次标签页切换的方向，用于方向性动画。 |
| — | `Panel [data-index]`、`[data-starting-style]`、`[data-ending-style]` | 仅 Base UI。 |

## CSS 变量映射

Radix Tabs 不暴露任何 CSS 变量。仅 Base UI（在 `Indicator` 上）：`--active-tab-left`、`--active-tab-right`、`--active-tab-top`、`--active-tab-bottom`、`--active-tab-width`、`--active-tab-height`。

---

# 切换

部分映射：`Toggle.Root → Toggle`（单部分；Base UI 导出可直接调用，没有 `.Root`）。

## Toggle.Root → Toggle

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`，默认 `true`) | 签名已更改。 |
| `defaultPressed` | `boolean` / — | `defaultPressed`（默认 `false`） | 相同。 |
| `pressed` | `boolean` / — | `pressed` | 相同。 |
| `onPressedChange` | `(pressed: boolean) => void` / — | `onPressedChange` | 签名已更改：`(pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void`。 |
| `disabled` | `boolean` / — | `disabled`（默认 `false`） | 相同。 |

## 值得了解的 Base UI only props

- `value?: string`：标识 Base UI `ToggleGroup` 内部的切换项（这取代了 Radix `ToggleGroup.Item` 的 `value`，参见下方的 toggle-group）。
- `nativeButton`（默认 `true`）、状态函数 `className`/`style`。

## 数据属性映射

| Radix | Base UI | 说明 |
|---|---|---|
| `[data-state="on" \| "off"]` | `[data-pressed]`（存在） | 已重命名。Off = `data-pressed` 不存在。 |
| `[data-disabled]` | `[data-disabled]` | 相同。 |

## CSS 变量映射

两侧都没有。

---

# toggle-group

部分映射：`ToggleGroup.Root → ToggleGroup`（可调用的单一导出），`ToggleGroup.Item → Toggle`（Base UI 将 Toggle 原语复用为分组项）。

## ToggleGroup.Root → ToggleGroup

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `type` (required) | `"single" \| "multiple"` / — | `multiple` (boolean, default `false`) | 签名已更改，与 accordion 的模式相同。 |
| `value` | `string` (single) or `string[]` (multiple) / — | `value` | 签名已更改：始终为 `readonly Value[]`（数组），即使是单选模式也是如此。`value="bold"` → `value={["bold"]}`。 |
| `defaultValue` | `string` or `string[]` / — | `defaultValue` | 同样有数组方面的注意事项。 |
| `onValueChange` | `(value: string) => void` or `(value: string[]) => void` / — | `onValueChange` | 签名已更改：`(groupValue: Value[], eventDetails: ToggleGroup.ChangeEventDetails) => void`。始终是数组；单选模式下未按下任何项 = `[]`（Radix 单选模式将其表示为 `""`）。 |
| `disabled` | `boolean` / `false` | `disabled` (default `false`) | 相同。 |
| `rovingFocus` | `boolean` / `true` | — 已移除 | Base UI 中始终启用 roving focus；无法关闭。如果你依赖 `rovingFocus={false}`（每一项都可通过 Tab 聚焦），则没有直接替代方案。 |
| `orientation` | `"horizontal" \| "vertical"` / `undefined` | `orientation` (default `'horizontal'`) | 名称相同；Base UI 有显式默认值。 |
| `dir` | `"ltr" \| "rtl"` / — | — 已移除 | 使用 DOM `dir` / `DirectionProvider`。 |
| `loop` | `boolean` / `true` | `loopFocus` (default `true`) | 已重命名。 |

## ToggleGroup.Item → Toggle

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`，默认 `true`) | 签名已更改。 |
| `value`（必需） | `string` / — | `value` | 含义相同；在 Base UI 的 `Toggle` 中，该属性在类型上是可选的，但在实际作为组成员时是必需的。 |
| `disabled` | `boolean` / — | `disabled`（默认 `false`） | 相同。 |

注意：该项还获得了完整的独立 `Toggle` API（`pressed`、`defaultPressed`、带有 `eventDetails` 的 `onPressedChange`），因为它本身就是 `Toggle` 基础组件；在组内时，组的值通常会驱动按下状态。

## 仅 Base UI 需要了解的 props

- `multiple`（上文已介绍）以及始终为数组的值模型。
- 项目是普通的 `Toggle`，因此可以为每个项目使用 `onPressedChange`。
- 状态函数形式的 `className`/`style`。

## 数据属性映射

| Radix | Base UI | 注释 |
|---|---|---|
| `Item [data-state="on" \| "off"]` | `Toggle [data-pressed]` (存在) | 已重命名。 |
| `Item [data-disabled]` | `Toggle [data-disabled]` | 相同。 |
| `Root/Item [data-orientation]` | `ToggleGroup [data-orientation]` | 仅在组上；项（Toggles）不会输出它。 |
| — | `ToggleGroup [data-disabled]`, `[data-multiple]` | 仅 Base UI。 |

## CSS 变量映射

两侧均无。

---

# 工具栏

部分映射：`Root → Root`、`Button → Button`、`Link → Link`、`Separator → Separator`。`Toolbar.ToggleGroup`/`Toolbar.ToggleItem` 作为独立部分被移除：将独立的 `ToggleGroup` 与 `<Toolbar.Button render={<Toggle />} value="...">` 作为项进行组合（Base UI 文档模式）。Base UI 还新增了 `Group` 和 `Input` 部分，Radix 中没有对应项。

## Toolbar.Root → Toolbar.Root

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation`（默认 `'horizontal'`） | 相同。 |
| `dir` | `"ltr" \| "rtl"` / — | — 已移除 | 使用 DOM `dir` / `DirectionProvider`。 |
| `loop` | `boolean` / `true` | `loopFocus`（默认 `true`） | 已重命名。 |

## Toolbar.Button → Toolbar.Button

| Radix prop | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` (+ `nativeButton`, 默认 `true`) | 签名已更改。 |

## Toolbar.Link → Toolbar.Link

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。两者都会渲染 `<a>`。 |

## Toolbar.ToggleGroup → ToggleGroup（standalone, composed）

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `type` (required) | `"single" \| "multiple"` / — | `multiple`（boolean，默认 `false`） | 已移动：在 `Toolbar.Root` 内使用独立的 `ToggleGroup` 组件；与上面的 toggle-group 映射相同。 |
| `value` / `defaultValue` | `string` or `string[]` / — | `ToggleGroup` 上的 `value` / `defaultValue` | 始终是数组（见 toggle-group）。 |
| `onValueChange` | `(value: string \| string[]) => void` / — | `ToggleGroup` 上的 `onValueChange` | `(groupValue: Value[], eventDetails) => void`。 |
| `disabled` | `boolean` / `false` | `ToggleGroup` 上的 `disabled` | 相同。 |

## Toolbar.ToggleItem → Toolbar.Button render={<Toggle />}

| Radix prop | Type / default | Base UI equivalent | Migration note |
|---|---|---|---|
| `asChild` | `boolean` / `false` | — | 已移除：组合本身就是 render prop：`<Toolbar.Button render={<Toggle />} value="bold" />`。Toolbar.Button 提供工具栏焦点行为，Toggle 提供按下状态。 |
| `value` (required) | `string` / — | `value`（在组合后的元素上） | 相同。 |
| `disabled` | `boolean` / — | `disabled`（在 `Toolbar.Button` 上，默认 `false`） | 相同；注意 `focusableWhenDisabled` 默认是 `true`（禁用项仍可聚焦，而 Radix 的禁用项不可聚焦）。 |

## Toolbar.Separator → Toolbar.Separator

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
|---|---|---|---|
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| — | — | `orientation` | 仅限 Base UI：默认为工具栏方向的相反方向（水平工具栏 → 垂直分隔符），这与 Radix 的自动行为一致；通常可省略。 |

## 值得了解的 Base UI 专属 props

- `Root.disabled`：禁用整个工具栏（Radix 中没有对应项）。
- `Toolbar.Group`（新部件）：将相关项目分组，带有组级别的 `disabled`（默认 `false`）。
- `Toolbar.Input`（新部件）：`<input>` 已接入工具栏的方向键导航；`defaultValue`、`disabled`（默认 `false`）、`focusableWhenDisabled`（默认 `true`）。
- `Button.disabled`（默认 `false`）+ `Button.focusableWhenDisabled`（默认 `true`）：被禁用的按钮仍然可以聚焦，便于发现；若要获得类似 Radix 的行为，将 `focusableWhenDisabled={false}`。
- `Button.nativeButton`（默认 `true`），所有部件都支持 state-function 形式的 `className`/`style`。

## 数据属性映射

| Radix | Base UI | 注释 |
|---|---|---|
| `[data-orientation]` (Root, Button, ToggleGroup, ToggleItem, Separator) | `[data-orientation]` (Root, Button, Link, Input, Group, Separator) | 相同；Separator 的值与工具栏垂直。 |
| `ToggleItem [data-state="on" \| "off"]` | `[data-pressed]`（存在，由组合的 `Toggle` 提供） | 已重命名。 |
| `ToggleItem [data-disabled]` | `[data-disabled]` (Root, Button, Input, Group) | 相同。 |
| — | `Button/Input [data-focusable]` | 仅 Base UI：当可在禁用状态下聚焦时存在。 |

## CSS 变量映射

两边都没有。
