# 组件组合

## 目录

- 项目始终位于其 Group 组件内
- 提示框使用 Alert
- 空状态使用 Empty 组件
- Toast 通知使用 sonner
- 在覆盖层组件之间进行选择
- Dialog、Sheet 和 Drawer 始终需要 Title
- Card 结构
- Button 没有 isPending 或 isLoading 属性
- TabsTrigger 必须位于 TabsList 内
- Avatar 始终需要 AvatarFallback
- 使用 Separator 替代原始的 hr 或带边框的 div
- 使用 Skeleton 作为加载占位符
- 使用 Badge 替代自定义样式的 span

---

## 项目始终应放在其 Group 组件内

不要直接在内容容器内渲染项目。

**错误：**

```tsx
<SelectContent>
  <SelectItem value="apple">Apple</SelectItem>
  <SelectItem value="banana">Banana</SelectItem>
</SelectContent>
```

**正确：**

```tsx
<SelectContent>
  <SelectGroup>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectGroup>
</SelectContent>
```

这适用于所有基于 group 的组件：

| 项目 | Group |
|------|-------|
| `SelectItem`, `SelectLabel` | `SelectGroup` |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub` | `DropdownMenuGroup` |
| `MenubarItem` | `MenubarGroup` |
| `ContextMenuItem` | `ContextMenuGroup` |
| `CommandItem` | `CommandGroup` |
| `MessageScrollerItem` | `MessageScrollerContent` |
| `Message`（连续、相同发送者） | `MessageGroup` |
| `Bubble`（堆叠） | `BubbleGroup` |
| `Attachment`（在一行中） | `AttachmentGroup` |

聊天组件按固定顺序嵌套（`MessageScrollerProvider` → `MessageScroller` → `MessageScrollerViewport` → `MessageScrollerContent` → `MessageScrollerItem`）。参见 [chat.md](./chat.md)。

---

## 提示框使用 Alert

```tsx
<Alert>
  <AlertTitle>警告</AlertTitle>
  <AlertDescription>有些内容需要注意。</AlertDescription>
</Alert>
```

---

## 空状态使用 Empty 组件

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><FolderIcon /></EmptyMedia>
    <EmptyTitle>暂无项目</EmptyTitle>
    <EmptyDescription>通过创建一个新项目开始吧。</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>创建项目</Button>
  </EmptyContent>
</Empty>
```

---

## Toast 通知使用 sonner

```tsx
import { toast } from "sonner"

toast.success("更改已保存。")
toast.error("出了点问题。")
toast("文件已删除。", {
  action: { label: "撤销", onClick: () => undoDelete() },
})
```

---

## 在覆盖层组件之间进行选择

| 用例 | 组件 |
|----------|-----------|
| 需要输入的聚焦任务 | `Dialog` |
| 破坏性操作确认 | `AlertDialog` |
| 带有详情或筛选器的侧边面板 | `Sheet` |
| 以移动端优先的底部面板 | `Drawer` |
| 悬停时显示的简要信息 | `HoverCard` |
| 点击时显示的小型上下文内容 | `Popover` |

---

## 对话框、底部抽屉和抽屉始终需要标题

`DialogTitle`、`SheetTitle`、`DrawerTitle` 对于无障碍访问是必需的。如果需要视觉上隐藏，请使用 `className="sr-only"`。

```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>编辑个人资料</DialogTitle>
    <DialogDescription>更新你的个人资料。</DialogDescription>
  </DialogHeader>
  ...
</DialogContent>
```

---

## 卡片结构

使用完整组合——不要把所有内容都塞进 `CardContent` 中：

```tsx
<Card>
  <CardHeader>
    <CardTitle>团队成员</CardTitle>
    <CardDescription>管理你的团队。</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>
    <Button>邀请</Button>
  </CardFooter>
</Card>
```

---

## 按钮没有 isPending 或 isLoading 属性

使用 `Spinner` + `data-icon` + `disabled` 组合：

```tsx
<Button disabled>
  <Spinner data-icon="inline-start" />
  保存中...
</Button>
```

---

## TabsTrigger 必须位于 TabsList 内

不要直接在 `Tabs` 内渲染 `TabsTrigger`——始终将其包裹在 `TabsList` 中：

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">账户</TabsTrigger>
    <TabsTrigger value="password">密码</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
</Tabs>
```

---

## Avatar 始终需要 AvatarFallback

当图片加载失败时，始终包含 `AvatarFallback`：

```tsx
<Avatar>
  <AvatarImage src="/avatar.png" alt="用户" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## 使用现有组件而不是自定义标记

| 替代方案 | 使用 |
|---|---|
| `<hr>` 或 `<div className="border-t">` | `<Separator />` |
| 带有样式化 div 的 `<div className="animate-pulse">` | `<Skeleton className="h-4 w-3/4" />` |
| `<span className="rounded-full bg-green-100 ...">` | `<Badge variant="secondary">` |
