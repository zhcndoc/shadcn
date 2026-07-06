# 目标包装器形状（金丝雀派生的具体细节）

通过将手动迁移与 shadcn 基础注册表包装器进行 diff 比较后学到的事实。这些内容弥补了映射表无法表达的差距：精确的类名、默认值和组合形状。在迁移 shadcn 风格的包装器时，请优先采用这些形状。

## 约定

- Positioner 部件不添加任何 `data-slot` 属性；保留 radix 包装器原本已有的 data-slot 在这些部件上。
- 菜单系列 Positioner：`className="isolate z-50 outline-none"`；Popup 也保留 `z-50` 和 `outline-none`。Tooltip：Popup 保留 `z-50`，Positioner 使用 `isolate z-50`。Select：`isolate z-50` 放在 Popup 上，Positioner 不添加 class。
- 基础注册表会在 popover、tooltip、hover-card、dropdown、context-menu、select、menubar 的弹层上，除了现有的 `cn-<comp>-content` 钩子外，还添加配套的 `cn-<comp>-content-logical`（对于 tooltip 还包括 `cn-tooltip-arrow-logical`）类。当源代码使用 cn-* 钩子时添加它们；纯 Tailwind 项目则跳过。

## 按钮

Base UI 有一个 Button 原始组件：`import { Button as ButtonPrimitive } from
"@base-ui/react/button"`。采用 Slot/asChild 习惯用法的 shadcn button.tsx
可直接迁移到 `<ButtonPrimitive>`（它支持 `render`），而不是迁移到手写的
`useRender` 包装器。将 `useRender + mergeProps` 保留给非按钮的多态组件（面包屑链接、标记）。

## 工具提示箭头（字面类名）

```tsx
<TooltipPrimitive.Arrow
  className={cn(
    "cn-tooltip-arrow cn-tooltip-arrow-logical",
    "data-[side=bottom]:top-1 data-[side=left]:right-[-13px] data-[side=left]:top-1/2! data-[side=left]:-translate-y-1/2 data-[side=right]:left-[-13px] data-[side=right]:top-1/2! data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5",
    className
  )}
/>
```

在依赖精确的像素值之前，请先根据当前基础注册表中的 tooltip 进行验证；形状（每侧偏移 + translate，无旋转）才是稳定部分。黄金默认值：`alignOffset = 0`，`sideOffset = 4`。

## DropdownMenu / ContextMenu 子内容

组合 PUBLIC Content 包装器，不要从原语重新构建：

```tsx
function DropdownMenuSubContent(props) {
  return (
    <DropdownMenuContent
      align="start"
      alignOffset={-3}
      side="right"
      sideOffset={0}
      className={cn("w-auto", props.className)}
      {...props}
    />
  )
}
```

`-3` / `0` 默认值至关重要（与父菜单的视觉对齐）。注意：实时注册表中不同菜单的 SubContent 形状不同：context-menu 是真正的最小组合（如上所示），而 dropdown-menu 的 SubContent 会复制完整的 content 类列表（包括半透明菜单样式），而不是进行组合。当存在黄金配对时，请复制黄金形状；这个示例是兜底方案。

危险——不要把 SubContent 的默认值与主 Content 的默认值混淆。上面的值仅适用于 *submenu* 包装器（DropdownMenuSubContent /
ContextMenuSubContent）。MAIN ContextMenuContent（由指针锚定的右键菜单）保留其自己的定位——不要将
`side="right"`/`alignOffset` 应用到它，否则每个右键菜单都会定位错误。
- ContextMenu SUBContent 默认值：`align="start" alignOffset={4} side="right" sideOffset={0}`。
- DropdownMenu SUBContent 默认值：`align="start" alignOffset={-3} side="right" sideOffset={0}`。
- Main Content（两者皆是）：保留包装器现有的 align/sideOffset；不要添加 side。

## SubTrigger 打开样式

基础包装器向 SubTrigger 添加 `data-popup-open:bg-accent
data-popup-open:text-accent-foreground`（没有对应的 radix 类；之前的打开样式是 data-[state=open]）。

## 选择器

- 裸重导出：`const Select = SelectPrimitive.Root`（不使用包装函数，
  Root 上没有 `data-slot`）。`SelectPrimitive.Root.Props` 是泛型
  （<Value, Multiple>），这会破坏通常的 `ComponentProps` 模式；裸重导出可以绕过它。
- 完全移除 radix 的 `position` 属性；改为暴露从 `Positioner.Props` 中提取的
  `alignItemWithTrigger`（默认 `true`），`sideOffset = 4`。
- 项目结构：`ItemText` 放在最前，使用 `cn-select-item-text shrink-0
  whitespace-nowrap`，然后是 `ItemIndicator render={<span
  className="cn-select-item-indicator" />}`。
- 滚动箭头使用 `top-0 w-full` / `bottom-0 w-full`；List 不添加任何类。

## 手风琴动画位置

`h-(--accordion-panel-height)`、`data-starting-style:h-0` 和
`data-ending-style:h-0` 都应放在 Panel 的内部 div 上（也就是
之前承载 radix 高度动画的那个元素），而不是放在 Panel 本身上。

## 选项卡

基础注册表接受 Base UI 的手动激活默认行为（不带
`activateOnFocus`），并且不会像 radix
包装器那样继续传递 `orientation`。请保持一致：标记这种行为差异，不要修补它。
