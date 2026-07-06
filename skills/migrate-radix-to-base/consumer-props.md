# 消费端属性变更（调用点，不包括包装器）

shadcn 包装器的名称在 radix -> base-ui 迁移后仍然保留，但这些属性会在应用代码的调用点发生变化或消失。迁移包装器后，请检查每一个使用方是否涉及此列表中的内容。所有条目都已在真实迁移中根据 @base-ui/react@1.6.0 的类型定义进行验证；如有疑问，请检查 node_modules/@base-ui/react/**/*.d.ts，切勿猜测。

## 通用

| Radix | Base UI | 调用处操作 |
|---|---|---|
| `asChild`（任意包装器） | `render` 属性 | `<Trigger asChild><Button/></Trigger>` -> `<Trigger render={<Button/>}>...` |

## 按组件

| 组件 | Radix 属性 | Base UI 去向 | 调用处操作 |
|---|---|---|---|
| Accordion | `type="single"\|"multiple"` + `collapsible` | 已移除；`value`/`defaultValue` 始终是数组；通过 `multiple` 支持多项展开 | `type="single" collapsible` -> 同时移除两者；将值包装成数组；`type="multiple"` -> `multiple` |
| Tabs | `activationMode="manual"` | 已移除；Base UI 默认使用手动激活 | 移除该属性；近似的按需启用方式是 `Tabs.List activateOnFocus`（行为差异：标记说明，不要自动添加） |
| Select | `position="popper"\|"item-aligned"` | `alignItemWithTrigger` 布尔值（在 Positioner 上；包装层会暴露它） | `position="popper"` -> `alignItemWithTrigger={false}`；`item-aligned` -> `alignItemWithTrigger`（默认） |
| TooltipProvider | `delayDuration`, `skipDelayDuration` | `delay`；跳过延迟的概念已移除 | 重命名 / 移除 |
| Tooltip | `disableHoverableContent` | 没有对应项 | 移除；在报告中标记该行为变化 |
| Avatar.Image | `delayMs` | `delay` | 重命名 |
| ScrollArea | `type="always"\|"scroll"\|...` | 已移除 | 移除 |
| Separator | `decorative` | 已移除 | 移除 |
| Checkbox | `checked="indeterminate"` | `indeterminate` 是一个单独的布尔属性 | `checked="indeterminate"` -> `indeterminate` + 布尔 `checked` |
| Slider | `onValueChange(value)` | 签名增加事件详情；另外 `inverted` 也已移除 | 检查处理函数参数个数；移除 `inverted`（标记垂直反向使用） |
| Select | `onValueChange(value: string)` | 扩展为 `(value: Value \| null, eventDetails)` | `useState<string>` + `onValueChange={setState}` 会出问题：将状态扩展为 `string \| null`，或者包一层 setter |
| Slider | `onValueCommit` | `onValueCommitted` | 重命名 |
| ToggleGroup | `type="single"\|"multiple"` | `multiple` 布尔值；值的形状为数组 | 与 Accordion 采用相同处理 |
| ToggleGroup / Toolbar | `rovingFocus={false}` | 已移除（始终启用 roving focus）；`loop` -> `loopFocus` | 移除 / 重命名 |
| Menubar | `value`/`onValueChange`（活动菜单） | 已移除；按 Menu.Root 的 `open` 单独控制 | 如有使用需要重构；通常未使用 |
| Menubar | `loop` | `loopFocus` | 重命名 |
| ContextMenu.Root | `modal` | 已移除 | 移除 |
| ContextMenu.Trigger | `disabled` | 已移除 | 移除；自行控制触发器是否可用 |
| DropdownMenu/ContextMenu items | （Radix 在选择时关闭菜单） | `closeOnClick` 在 CheckboxItem/RadioItem 上默认 FALSE | 行为差异：标记；仅在用户要求时添加 `closeOnClick` |
| NavigationMenu | `delayDuration`(200), `skipDelayDuration`, `viewport` | `delay`(50) + `closeDelay`；`viewport` 属性已移除（由 Positioner 处理） | 重命名/移除；标记 200->50 的悬停延迟体感变化 |
| Popover / HoverCard | Root 上的 `openDelay`/`closeDelay` | 移到 TRIGGER 上，作为 `delay`/`closeDelay` | 将属性从 Root 挪到 Trigger |
| Dialog / AlertDialog | `onOpenAutoFocus` | `initialFocus`（基于 element/ref，而非事件） | 重新结构：传入目标而不是 `preventDefault` 处理器 |
| Dialog / AlertDialog | `onCloseAutoFocus` | `finalFocus` | 同样重新结构 |
| Dialog family | `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside` | 已整合；精确的各部分签名请参考 overlays 引用文档 | 查看 overlays.md；不要猜测 |
| DirectionProvider | `dir` | `direction` | 重命名 |

## 回调签名规则

Base UI 回调通常会增加一个事件详情参数：
`onOpenChange(open, eventDetails)`, `onValueChange(value, eventDetails)`。
传递现有的单参数处理函数仍然是类型安全的；那些使用了
Radix 事件参数的处理函数需要根据 family reference 文件进行检查。

## 扫描流程

1. grep app code（components/ui 之外）中上面每个 LHS token，再加上
   `asChild`。
2. 按文件逐个修复调用点；每修完一个文件就进行 typecheck。
3. 此列表中任何标记为 FLAG 的内容都要作为行为差异写入迁移报告，绝不悄悄修补。
