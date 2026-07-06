# 样式与自定义

有关主题、CSS 变量以及添加自定义颜色，请参阅 [customization.md](../customization.md)。

## 目录

- 语义化颜色
- 优先使用内置变体
- className 仅用于布局
- 不使用 space-x-* / space-y-*
- 尺寸相等时优先使用 size-* 而不是 w-* h-*
- 优先使用 truncate 简写
- 不手动覆盖 dark: 颜色
- 条件类名使用 cn()
- 不在覆盖层组件上手动设置 z-index
- 使用 shimmer / scroll-fade 工具类，不要自定义动画

---

## 语义颜色

**错误：**

```tsx
<div className="bg-blue-500 text-white">
  <p className="text-gray-600">次要文本</p>
</div>
```

**正确：**

```tsx
<div className="bg-primary text-primary-foreground">
  <p className="text-muted-foreground">次要文本</p>
</div>
```

---

## 状态/状态指示器不要使用原始颜色值

对于正向、负向或状态指示器，请使用 Badge 变体、像 `text-destructive` 这样的语义 token，或定义自定义 CSS 变量——不要直接使用原始的 Tailwind 颜色。

**错误：**

```tsx
<span className="text-emerald-600">+20.1%</span>
<span className="text-green-500">Active</span>
<span className="text-red-600">-3.2%</span>
```

**正确：**

```tsx
<Badge variant="secondary">+20.1%</Badge>
<Badge>Active</Badge>
<span className="text-destructive">-3.2%</span>
```

如果你需要一个语义 token 中不存在的成功/正向颜色，请使用 Badge 变体，或者询问用户是否要在主题中添加自定义 CSS 变量（参见 [customization.md](../customization.md)）。

---

## 内置变体优先

**错误：**

```tsx
<Button className="border border-input bg-transparent hover:bg-accent">
  点击我
</Button>
```

**正确：**

```tsx
<Button variant="outline">点击我</Button>
```

---

## 仅将 className 用于布局

将 `className` 用于布局（例如 `max-w-md`、`mx-auto`、`mt-4`），**不要**用于覆盖组件的颜色或排版。要更改颜色，请使用语义化 token、内置变体或 CSS 变量。

**错误：**

```tsx
<Card className="bg-blue-100 text-blue-900 font-bold">
  <CardContent>Dashboard</CardContent>
</Card>
```

**正确：**

```tsx
<Card className="max-w-md mx-auto">
  <CardContent>Dashboard</CardContent>
</Card>
```

要自定义组件的外观，请按以下顺序优先考虑这些方法：
1. **内置变体** — `variant="outline"`、`variant="destructive"` 等。
2. **语义化颜色 token** — `bg-primary`、`text-muted-foreground`。
3. **CSS 变量** — 在全局 CSS 文件中定义自定义颜色（参见 [customization.md](../customization.md)）。

---

## 不要使用 space-x-* / space-y-*

改用 `gap-*`。`space-y-4` → `flex flex-col gap-4`。`space-x-2` → `flex gap-2`。

```tsx
<div className="flex flex-col gap-4">
  <Input />
  <Input />
  <Button>提交</Button>
</div>
```

---

## 在相等时优先使用 size-* 而不是 w-* h-*

`size-10`，而不是 `w-10 h-10`。适用于图标、头像、骨架屏等。

---

## 优先使用 truncate 简写

`truncate`，而不是 `overflow-hidden text-ellipsis whitespace-nowrap`。

---

## 不要手动设置暗色：颜色覆盖

使用语义化 token——它们通过 CSS 变量处理亮色/暗色。使用 `bg-background text-foreground`，不要用 `bg-white dark:bg-gray-950`。

---

## 使用 cn() 处理条件类名

使用项目中的 `cn()` 工具来处理条件或合并后的类名。不要在 className 字符串中手动编写三元表达式。

**错误：**

```tsx
<div className={`flex items-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
```

**正确：**

```tsx
import { cn } from "@/lib/utils"

<div className={cn("flex items-center", isActive ? "bg-primary text-primary-foreground" : "bg-muted")}>
```

---

## 不要在覆盖层组件上手动设置 z-index

`Dialog`、`Sheet`、`Drawer`、`AlertDialog`、`DropdownMenu`、`Popover`、`Tooltip`、`HoverCard` 会自行处理它们的堆叠顺序。切勿添加 `z-50` 或 `z-[999]`。

---

## 使用 shimmer / scroll-fade 工具类，不要自定义动画

对于实时的“thinking…”或加载文本闪烁效果，请使用 `shimmer` 工具类。不要自行编写自定义的 `@keyframes` 或 `bg-clip-text` 渐变扫过效果。

对于滚动容器上的随滚动变化的边缘渐隐效果，请使用 `scroll-fade`（以及轴向变体 `scroll-fade-x` / `scroll-fade-b`）。不要手动编写 mask 渐变。聊天组件已经在内部应用了这些效果：`Attachment` 会在上传期间让其标题闪烁，而 `MessageScrollerViewport` 会让其边缘渐隐。

**错误：**

```tsx
<span className="animate-pulse bg-gradient-to-r from-muted-foreground/40 via-foreground/70 to-muted-foreground/40 bg-clip-text text-transparent [animation:shimmer_1.6s_infinite]">
  Thinking…
</span>
```

**正确：**

```tsx
<span className="shimmer">Thinking…</span>
```
