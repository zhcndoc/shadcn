# Radix UI → Base UI 属性映射：progress、scroll-area、separator、avatar、toast、form

来源：radix-ui/website `data/primitives/docs/components/*.mdx`（完整内联属性表）和 base-ui.com `/react/components/{progress,scroll-area,separator,avatar,toast,form,field,fieldset}.md`（获取于 2026-07-02，`@base-ui/react`，原名 `@base-ui-components/react`）。

通用约定（适用于下面每一部分，不再在每个表格中重复）：

- `asChild`（布尔值）→ `render`（`ReactElement | ((props: HTMLProps, state: ReactElement) => ReactElement)`）。签名已更改：`<Part asChild><a/></Part>` → `<Part render={<a/>} />`。
- Base UI 的 `className` 和 `style` 也接受一个 `State` 对象的函数。
- 每个 Base 组件都暴露 `Part.Props` 和 `Part.State` 类型（例如 `Progress.Root.Props`）。

---

# progress

部件映射：`Progress.Root` → `Progress.Root`，`Progress.Indicator` → `Progress.Indicator`（现在必须嵌套在新的 `Progress.Track` 中）。Base UI 新增了 `Track`、`Label`、`Value` 部件。该原语会自行计算 Indicator 的填充宽度（内联样式），因此 Radix 中在 Indicator 上使用的模式 `style={{ transform: translateX(-(100 - value)%) }}` 已删除，不会迁移。

## Progress.Root → Progress.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改（见标题）。 |
| `value` | `number \| null` / - | `value` | 相同。Base UI 中为必填（默认 `null`）。在两者中，`null` 都表示不确定。 |
| `max` | `number` / - | `max` | 相同。Base UI 默认值为 `100`；Base UI 还新增了 `min`（默认 `0`）。 |
| `getValueLabel` | `(value: number, max: number) => string` / - | `getAriaValueText` | 已重命名并且签名已更改：Base UI 的签名是 `(formattedValue: string \| null, value: number \| null) => string`。百分比计算已移除；请改用 `format`/`locale` 进行格式化。 |

## 进度指示器 → 进度指示器

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 唯一的 prop。嵌套在 `Progress.Track` 内；宽度由原语设置。 |

### 仅 Base UI 需要了解的 prop

- Root：`min`（`0`）、`format`（`Intl.NumberFormatOptions`）、`locale`（`Intl.LocalesArgument`）、`aria-valuetext`。
- 新部件：`Progress.Track`（包含 Indicator）、`Progress.Label`（无障碍标签，`<span>`）、`Progress.Value`（格式化后的值文本，`<span>`，`children` 渲染函数 `(formattedValue, value) => ReactNode`）。

### 数据属性

| Radix | Base UI |
| --- | --- |
| `[data-state="loading"]` | `[data-progressing]`（布尔存在型属性取代了枚举） |
| `[data-state="complete"]` | `[data-complete]` |
| `[data-state="indeterminate"]` | `[data-indeterminate]` |
| `[data-value]`, `[data-max]` | 已移除。可在 `className`/`style` 的状态函数中读取 `value`，或自行设置属性。 |

所有 Base 属性都会同时出现在 Root、Track、Indicator、Label 和 Value 上。状态类型：`{ status: 'indeterminate' | 'progressing' | 'complete' }`。

### CSS 变量

两边都没有。

---

# 滚动区域

部件映射：`ScrollArea.Root` → `ScrollArea.Root`，`ScrollArea.Viewport` → `ScrollArea.Viewport`，`ScrollAreaScrollbar` → `ScrollArea.Scrollbar`，`ScrollAreaThumb` → `ScrollArea.Thumb`，`ScrollArea.Corner` → `ScrollArea.Corner`。Base UI 新增了 `ScrollArea.Content`（包裹 Viewport 内的内容，用于水平溢出测量）。

## ScrollArea.Root → ScrollArea.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `type` | `"auto" \| "always" \| "scroll" \| "hover"` / `"hover"` | 已移除 | 可见性由 CSS 驱动：针对 `[data-hovering]`/`[data-scrolling]`（悬停/滚动行为）为 Scrollbar 的 `opacity` 设置样式，或者为 `"always"` 使用始终可见的 CSS（并在 Scrollbar 上使用 `keepMounted`）。`"auto"` 是默认的挂载行为（仅在可滚动时挂载滚动条）。 |
| `scrollHideDelay` | `number` / `600` | 已移除 | 可通过在滚动条 `opacity` 过渡上设置 CSS `transition-delay` 来复现。 |
| `dir` | `"ltr" \| "rtl"` / - | 已移除 | Base UI 从 DOM（`dir` 属性）/其 DirectionProvider 工具读取方向；没有按组件传入的属性。 |
| `nonce` | `string` / - | 已移除 | 没有已文档化的 CSP nonce 对应项。 |

## ScrollArea.Viewport → ScrollArea.Viewport

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 相同的部件角色（可滚动容器）。当需要水平滚动时，请将子元素包裹在 `ScrollArea.Content` 中。 |

## ScrollAreaScrollbar → ScrollArea.Scrollbar

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `forceMount` | `boolean` / - | `keepMounted` | 已重命名；`boolean`，默认值为 `false`。当视口不可滚动时，仍将元素保留在 DOM 中。 |
| `orientation` | `"horizontal" \| "vertical"` / `"vertical"` | `orientation` | 相同，默认值也相同。 |

## ScrollAreaThumb → ScrollArea.Thumb

| Radix prop | 类型 / 默认值 | Base UI 等价项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 双方唯一的 prop。 |

## ScrollArea.Corner → ScrollArea.Corner

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 两侧唯一的 prop。 |

### 值得了解的 Base UI 专有 props

- Root: `overflowEdgeThreshold` (`number | Partial<{ xStart; xEnd; yStart; yEnd }>`, default `0`)，在溢出边缘属性切换之前的阈值。
- 新部件：`ScrollArea.Content`（位于 Viewport 内部的 div；与 Root 具有相同的溢出数据属性）。

### 数据属性

| Radix | Base UI |
| --- | --- |
| Scrollbar `[data-state="visible" \| "hidden"]` | 已移除。使用 Scrollbar 上的 `[data-hovering]`、`[data-scrolling]` 和 `[data-has-overflow-x/y]` 来驱动可见性样式。 |
| Scrollbar/Thumb `[data-orientation]` | 相同（Scrollbar 和 Thumb 上都有 `data-orientation`）。 |
| - | 新增，位于 Root/Content/Viewport/Scrollbar 上：`data-has-overflow-x`、`data-has-overflow-y`、`data-overflow-x-start/end`、`data-overflow-y-start/end`、`data-scrolling`；Scrollbar 还有 `data-hovering`。 |

### CSS 变量

Radix 的 scroll-area 文档没有列出任何 CSS 变量（其实现会提供未文档化的 `--radix-scroll-area-thumb-*`/`corner-*` 变量）。Base UI 文档中列出了：

| Base UI variable | Where |
| --- | --- |
| `--scroll-area-corner-width`, `--scroll-area-corner-height` | Root |
| `--scroll-area-thumb-width`, `--scroll-area-thumb-height` | Scrollbar |
| `--scroll-area-overflow-x-start/end`, `--scroll-area-overflow-y-start/end` | Viewport（到每个边缘的像素距离，非常适合滚动渐隐效果） |

---

# 分隔符

部件映射：`Separator.Root` → `Separator`（可调用的单部件，没有 `.Root`）。

## Separator.Root → Separator

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `orientation` | `"horizontal" \| "vertical"` / `"horizontal"` | `orientation` | 相同，默认值也相同（`Orientation` 类型）。 |
| `decorative` | `boolean` / - | 已移除 | Base UI 的分隔线始终是语义化的（`role="separator"`）。如果只是纯视觉分隔线，请渲染一个普通的 `<div aria-hidden="true">`，或者改用 CSS 边框。 |

### Base UI only props worth knowing

除了通用的 `className`/`style`/`render` 之外没有其他。渲染为 `<div>`。

### Data attributes

`[data-orientation]`，取值为 `horizontal | vertical`：两侧完全一致。

### CSS variables

两侧都没有。

---

# avatar

Part mapping: `Avatar.Root` → `Avatar.Root`, `Avatar.Image` → `Avatar.Image`, `Avatar.Fallback` → `Avatar.Fallback`. 结构相同。Base Root 渲染 `<span>`，Image 渲染 `<img>`，Fallback 渲染 `<span>`。

## Avatar.Root → Avatar.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 双方都唯一拥有的属性。Base Root 也可以直接接收普通子元素（例如首字母），而不需要 Image/Fallback。 |

## Avatar.Image → Avatar.Image

| Radix prop | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `onLoadingStatusChange` | `(status: "idle" \| "loading" \| "loaded" \| "error") => void` / - | `onLoadingStatusChange` | 名称相同，`ImageLoadingStatus` 联合类型也相同。 |

## Avatar.Fallback → Avatar.Fallback

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `delayMs` | `number` / - | `delay` | 已重命名，含义相同（显示 fallback 前等待的毫秒数）。 |

### 仅 Base UI 有、值得了解的 props

除了通用的三个之外没有其他内容。`State` 部分会暴露 `imageLoadingStatus`（以及 Image 上的 `transitionStatus`），供 `className`/`style` 函数使用。

### 数据属性

Radix 文档中没有。Base UI Image 额外添加了 `data-starting-style` / `data-ending-style` 用于进入/退出过渡。

### CSS 变量

两边都没有。

---

# toast

心智模型完全变了：Radix toast 是声明式的（你自己渲染 `<Toast.Root open>`），Base UI toast 则由管理器驱动。Toast 通过 `Toast.useToastManager().add({ title, description, ... })` 以命令式创建（或者使用传给 `Provider toastManager` 的全局 `Toast.createToastManager()`），然后你在 Viewport 内部渲染 `useToastManager().toasts.map((toast) => <Toast.Root key={toast.id} toast={toast} />)`。

部件映射：

| Radix part | Base UI part |
| --- | --- |
| `Toast.Provider` | `Toast.Provider`（props 差异很大） |
| `Toast.Viewport` | `Toast.Portal` + `Toast.Viewport`（新增 Portal；默认会追加到 `<body>`） |
| `Toast.Root` | `Toast.Root`（需要 `toast` 对象；通常会包裹新的 `Toast.Content`） |
| `Toast.Title` | `Toast.Title`（渲染 `<h2>`） |
| `Toast.Description` | `Toast.Description`（渲染 `<p>`） |
| `Toast.Action` | `Toast.Action`（按每个 toast 渲染；props 可以来自 `toast.actionProps`） |
| `Toast.Close` | `Toast.Close` |
| - | 新增：`Toast.Content`、`Toast.Positioner` + `Toast.Arrow`（锚定式 toast）、`Toast.createToastManager`、`Toast.useToastManager` |

## Toast.Provider → Toast.Provider

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `duration` | `number` / `5000` | `timeout` | 已重命名。默认值相同（`5000`，`0` 可禁用自动关闭）。单个 toast 的覆盖配置已移至 `add({ timeout })`。 |
| `label` (required) | `string` / `"Notification"` | 已移除 | Base UI 会在内部处理屏幕阅读器公告；单个 toast 的紧急级别可通过 `add()` 中的 `priority: 'low' \| 'high'` 设置。 |
| `swipeDirection` | `"right" \| "left" \| "up" \| "down"` / `"right"` | 已移动 | 现在位于 `Toast.Root` 上的 `swipeDirection`；可接受单个值或数组，默认 `['down', 'right']`。 |
| `swipeThreshold` | `number` / `50` | 已移除 | 不可配置。可通过 `data-base-ui-swipe-ignore` 属性将元素排除在滑动之外。 |
| `announcerContainer` | `Element \| DocumentFragment` / `document.body` | 已移除 | 最接近的对应项是 `Toast.Portal container`，用于控制视口渲染的位置。 |

## Toast.Viewport → Toast.Portal + Toast.Viewport

| Radix 属性 | 类型 / 默认值 | Base UI 对应项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 同时适用于 Portal 和 Viewport。 |
| `hotkey` | `string[]` / `["F8"]` | 已移除 | Base UI 将 F6 硬编码为聚焦 viewport 地标；不可配置。 |
| `label` | `string` / `"Notifications ({hotkey})"` | 已移除 | 地标标签由内部处理。 |

仅 Base UI：`Portal.container`（`HTMLElement | ShadowRoot | ref | null`）。

## Toast.Root → Toast.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `type` | `"foreground" \| "background"` / `"foreground"` | `add()` 选项中的 `priority` | 已移动并重命名：`foreground` ≈ `priority: 'high'`（紧急播报），`background` ≈ `'low'`（默认）。注意：Base UI 的 `toast.type` 是另一个概念（一个自由形式的样式分类，如 `'success'`，会通过 `data-type` 暴露）。 |
| `duration` | `number` / - | `add()` 选项中的 `timeout` | 已移动并重命名；可覆盖 Provider 的 `timeout`，作用于单个 toast。 |
| `defaultOpen` | `boolean` / `true` | 已移除 | 打开状态由管理器负责。使用 `add()` 创建，使用 `close(id)` 移除。 |
| `open` | `boolean` / - | 已移除 | 同上；没有受控打开模式。`add({ id })` 会在原位更新已有 toast。 |
| `onOpenChange` | `(open: boolean) => void` / - | 已移除（变通方案） | 请使用 toast 对象（`add()` 选项）中的 `onClose` / `onRemove` 回调。 |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` / - | 已移除 | 当焦点在视口中时，按 Esc 关闭仍然有效，但无法拦截。 |
| `onPause` / `onResume` | `() => void` / - | 已移除 | 计时器仍会在悬停、聚焦和窗口失焦时自动暂停，但没有回调。 |
| `onSwipeStart` / `onSwipeMove` / `onSwipeEnd` / `onSwipeCancel` | `(event: SwipeEvent) => void` / - | 已移除（变通方案） | 滑动是通过样式实现的，而不是脚本：`[data-swiping]`、`[data-swipe-direction]` 和 `--toast-swipe-movement-x/y` 取代了事件钩子。 |
| `forceMount` | `boolean` / - | 已移除 | Root 由 `toasts` 数组渲染；退出动画在移除前会获得 `data-ending-style` + `toast.transitionStatus: 'ending'`（之后触发 `onRemove`）。 |

Base UI 在 Root 上仅支持：`toast`（必需的 `Toast.Root.ToastObject`：`id`、`title`、`description`、`type`、`timeout`、`priority`、`updateKey`、`limited`、`height`、`onClose`、`onRemove`、`actionProps`、`positionerProps`、`data`），`swipeDirection`（单个或数组）。

## Toast.Title → Toast.Title

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 唯一的 prop。Base 默认渲染 `<h2>`（Radix 渲染的是 `<div>`）；传入 `render={<div />}` 可保持为 div。内容通常来自 `toast.title`。 |

## Toast.Description → Toast.Description

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 唯一的属性。Base 默认渲染 `<p>`。内容通常来自 `toast.description`。 |

## Toast.Action → Toast.Action

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `altText` (required) | `string` / - | Dropped | 没有对应的属性。通过管理器创建 toast 时，请通过 `add({ actionProps })` 传递按钮的属性（包括处理函数和 aria 属性）。 |

仅限 Base UI：`nativeButton`（`boolean`，默认 `true`，当 `render` 不是按钮时设为 `false`）。

## Toast.Close → Toast.Close

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |

Base UI only: `nativeButton`（与 Action 中相同）。

### 仅 Base UI 有的、值得了解的 props

- Provider：`limit`（`number`，默认 `3`；超出的 toast 不会被移除，而是获得 `data-limited` + `inert`），`toastManager`（来自 `Toast.createToastManager()`，用于 React 外部）。
- Manager API（`useToastManager()` 返回值 / `createToastManager()`）：`toasts`、`add(options) => id`、`close(id?)`、`update(id, options)`、`promise(promise, { loading, success, error })`。
- 新部件：`Toast.Content`（在堆栈折叠时裁剪溢出；`data-behind`、`data-expanded`），`Toast.Positioner`/`Toast.Arrow` 用于锚定 toast（完整的弹出层定位能力：`anchor`、`side` 默认 `'top'`、`align`、`sideOffset`、`alignOffset`、`collisionAvoidance`、`collisionBoundary`、`collisionPadding`、`arrowPadding`、`sticky`、`positionMethod`、`disableAnchorTracking`）。

### 数据属性

| Radix | Base UI |
| --- | --- |
| Root `[data-state="open" \| "closed"]` | `data-starting-style` / `data-ending-style`（CSS 过渡钩子） |
| Root `[data-swipe="start" \| "move" \| "cancel" \| "end"]` | 滑动时为 `[data-swiping]`；`"end"` ≈ `[data-ending-style][data-swipe-direction=...]` |
| Root `[data-swipe-direction]`（`up/down/left/right`） | 名称和值相同 |
| - | 新增：Root `data-expanded`、`data-limited`、`data-type`；Viewport `data-expanded`；Content `data-behind`、`data-expanded`；Title/Description/Close/Action `data-type`；Positioner/Arrow `data-side`、`data-align`、`data-anchor-hidden`/`data-uncentered` |

### CSS 变量

| Radix | Base UI |
| --- | --- |
| `--radix-toast-swipe-move-x` / `--radix-toast-swipe-move-y` | `--toast-swipe-movement-x` / `--toast-swipe-movement-y` |
| `--radix-toast-swipe-end-x` / `--radix-toast-swipe-end-y` | 已移除；使用移动变量通过 `[data-ending-style][data-swipe-direction=...]` 为关闭动画 |
| - | Root 新增：`--toast-index`、`--toast-offset-y`、`--toast-height`；Viewport：`--toast-frontmost-height`；Positioner：`--anchor-width/height`、`--available-width/height`、`--transform-origin` |

---

# form

Base UI 将 Radix Form 拆分为三个组件：`Form`（`@base-ui/react/form`，一个可调用的单部件，渲染 `<form>`）、`Field`（`@base-ui/react/field`：`Root`、`Label`、`Control`、`Error`、`Description`、`Validity`、`Item`）以及 `Fieldset`（`@base-ui/react/fieldset`：`Root`、`Legend`）。

部件映射：

| Radix part | Base UI part |
| --- | --- |
| `Form.Root` | `Form`（可调用，无 `.Root`） |
| `Form.Field` | `Field.Root` |
| `Form.Label` | `Field.Label` |
| `Form.Control` | `Field.Control`（或任何 Base UI 输入组件：Input、Checkbox、Select 等都可以直接在 Field 内使用） |
| `Form.Message` | `Field.Error`（校验错误）；普通提示文本使用 `Field.Description` |
| `Form.ValidityState` | `Field.Validity` |
| `Form.Submit` | 已移除；请使用普通 `<button type="submit">` |
| - | 新增：`Fieldset.Root` + `Fieldset.Legend`、`Field.Item`（用于复选框/单选框组中按项包裹） |

## Form.Root → Form

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `onClearServerErrors` | `() => void` / - | 已移除（替代方案） | 服务端错误模型已更改：向 `Form` 传入 `errors` 对象（键 = `Field.Root` `name`，值 = 消息）；在 `onFormSubmit` 中清除你自己的错误状态（Base 已为你调用 `preventDefault()`），或者在每个字段的 `onValueChange` 中清除。 |

Base UI 仅在 Form 上提供：`errors`（`Errors`）、`onFormSubmit`（`(formValues, eventDetails) => void`）、`validationMode`（`'onSubmit' | 'onBlur' | 'onChange'`，默认 `'onSubmit'`）、`actionsRef`（`{ validate(fieldName?) }`）。

## Form.Field → Field.Root

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `name` (required) | `string` / - | `name` | 作用相同（提交标识 + 匹配 `Form errors` 键）；在 Base UI 中为可选，并且优先于 `Field.Control` 上的 `name`。 |
| `serverInvalid` | `boolean` / - | 已移除（替代方案） | 可以通过 `Form errors={{ [name]: message }}` 提供消息（字段会变为无效，且 `Field.Error` 会显示它），或者通过 `Field.Root` 上的 `invalid` 布尔属性强制设置状态。 |

Base UI 仅在 Field.Root 上提供：`validate`（`(value, formValues) => string | string[] | Promise<...> | null`，Radix 函数 `match` 的自定义验证替代品）、`validationMode`、`validationDebounceTime`（`0`）、`disabled`、`invalid`、`dirty`、`touched`、`actionsRef`（`{ validate() }`）。

## Form.Label → Field.Label

| Radix prop | 类型 / 默认值 | Base UI 等效项 | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。与控件的自动关联会保留。 |

仅限 Base UI：`nativeLabel`（`boolean`，默认 `true`；当 `render` 替换为非 label 元素时设为 `false`，例如用 `<div>` 为 `<Select.Trigger>` 按钮提供标签）。

## Form.Control → Field.Control

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。对于复合组件，直接跳过 Control：Base UI 输入组件（Input、Checkbox、Select、...）直接接入 `Field.Root`，这是 Radix Form 无法做到的。 |

仅适用于 Base UI：`defaultValue`（`string | number | string[]`）、`onValueChange`（`(value, eventDetails) => void`）。

## Form.Message → Field.Error

| Radix prop | Type / default | Base UI equivalent | 迁移说明 |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | `render` | 签名已更改。 |
| `match` | `'badInput' \| 'patternMismatch' \| 'rangeOverflow' \| 'rangeUnderflow' \| 'stepMismatch' \| 'tooLong' \| 'tooShort' \| 'typeMismatch' \| 'valid' \| ((value, formData) => boolean \| Promise<boolean>)` / - | `match` | 签名已更改：Base UI 为 `boolean \| 'valid' \| 'badInput' \| 'customError' \| 'patternMismatch' \| 'rangeOverflow' \| 'rangeUnderflow' \| 'stepMismatch' \| 'tooLong' \| 'tooShort' \| 'typeMismatch' \| 'valueMissing'`。函数形式已移除：将自定义规则移到 `Field.Root` 上的 `validate`（返回错误字符串）；此后没有 `match` 的 Error 会显示这些错误。`'customError'` 匹配 `validate` 失败。 |
| `forceMatch` | `boolean` / `false` | `match={true}` | 已重命名/合并：`match` 接受 `true` 时会始终显示消息（这是面向外部库和服务端错误的已文档化用法）。 |
| `name` | `string` / - | 已移除 | `Field.Error` 不能从外部定位字段；它必须嵌套在所属的 `Field.Root` 内。 |

注意：当省略 `children` 时，Radix 会根据 `match` 渲染默认英文消息；Base UI 会渲染来自 `validate`/`Form errors` 的错误字符串，否则请提供 `children`。`Field.Description`（仅支持 className/style/render）是放置非错误辅助文本的新位置。Error 渲染为 `<div>`，Description 渲染为 `<p>`。

## Form.ValidityState → Field.Validity

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `children` | `(validity: ValidityState \| undefined) => React.ReactNode` / - | `children`（必需） | 签名已更改：`(state: Field.Validity.State) => React.ReactNode`，其中原生标志位位于 `state.validity.*`（以及 `state.errors`、`state.error`、`state.value`、`state.initialValue`）。 |
| `name` | `string` / - | 已移除 | 必须嵌套在 `Field.Root` 内。 |

## Form.Submit → （无）

| Radix prop | Type / default | Base UI equivalent | Migration note |
| --- | --- | --- | --- |
| `asChild` | `boolean` / `false` | 已移除 | 不再有 submit 部分；渲染一个普通的 `<button type="submit">`（或样式化的 Button 组件）。 |

## （新增）Fieldset.Root 和 Fieldset.Legend

没有 Radix 对应项。`Fieldset.Root` 渲染原生的 `<fieldset>`（props：`className`/`style`/`render`；状态 `{ disabled }`、`data-disabled`）。`Fieldset.Legend` 渲染一个 `<div>`，并自动关联为可访问的图例。用于将相关字段按一个标签分组。

### 值得了解的 Base UI 仅有属性（表单级）

- 验证时机可配置（`validationMode`，可在 Form 上或每个 Field 上单独设置，`validationDebounceTime`）。
- `actionsRef` 可在 Form 和 Field.Root 上以命令式方式调用 `validate()`。
- `Field.Item` 将单个复选框/单选框与其组内自己的标签/描述一起分组（`disabled` 属性）。
- 提交时焦点会移动到第一个无效字段，这与 Radix 的行为一致。

### 数据属性

| Radix (Field/Label/Control/Message) | Base UI (所有 Field 部分：Root, Item, Label, Control, Description, Error) |
| --- | --- |
| `[data-valid]` | `[data-valid]`（相同） |
| `[data-invalid]` | `[data-invalid]`（相同） |
| - | 新增：`data-dirty`、`data-touched`、`data-filled`、`data-focused`、`data-disabled`；Error 还会获得 `data-starting-style`/`data-ending-style`。 |

### CSS 变量

双方都没有。

---

# 无 Base UI 对应项

没有 Base UI 等价项的 Radix 工具，以及推荐的普通替代方案：

## 标签（radix `Label.Root`: `asChild`, `htmlFor`）

使用原生 `<label htmlFor="...">`，或者在 `Field.Root` 内部使用 `Field.Label`（它会自动建立关联，因此不需要 `htmlFor`）。Radix 唯一额外的行为（防止双击时选中文本）只需一行 CSS：`select-none` / `user-select: none`。

## AspectRatio（radix `AspectRatio.Root`：`asChild`、`ratio` 默认 `1`）

使用 CSS `aspect-ratio` 属性，这也是该属性所映射到的内容：`ratio={16 / 9}` → `aspect-video` 或 `aspect-[16/9]`（`aspect-ratio: 16 / 9`），另外在媒体子元素上加上 `w-full` 和 `object-cover`。

## VisuallyHidden（radix `VisuallyHidden.Root`：`asChild`）

在 `<span>` 上使用 Tailwind 的 `sr-only` 类（标准的 clip-rect 模式）。注意：其他文件中的某些 Base UI 弹出组件仍然需要隐藏标题以满足无障碍要求；`<span className="sr-only">` 也同样适用于这种情况。

## 可访问图标（radix `AccessibleIcon.Root`：`label` 必需）

它只是由 VisuallyHidden + `aria-hidden` 组合而成：将图标渲染为 `aria-hidden="true"`（或 `focusable="false"`），并在旁边添加 `<span className="sr-only">{label}</span>`，或者改为在交互式父元素（button/link）上设置 `aria-label={label}`。
