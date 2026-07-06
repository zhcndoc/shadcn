# 聊天与消息

用于对话和聊天 UI 的组件。请组合使用这些组件，而不是手动编写气泡、滚动容器、分隔线或附件卡片。

安装：`npx shadcn@latest add message-scroller message bubble attachment marker`

相同的组件名称和 props 同时适用于 `base` 和 `radix`；只有组合方式不同（`render` vs `asChild`）。参见 [base-vs-radix.md](./base-vs-radix.md)。

## 目录

- 可滚动线程使用 MessageScroller
- 消息行使用 Message
- 消息气泡使用 Bubble
- 附件使用 Attachment
- 系统备注和分隔线使用 Marker
- 内置流式传输、锚定和跳转到最新
- 逃生通道：滚动器 hooks

---

## 可滚动线程使用 MessageScroller

会滚动、跟随新消息、恢复位置，或跳转到某条消息的对话应使用 `MessageScroller`。不要自己搭建一个原始的 overflow 容器并手动连接滚动逻辑，也不要直接使用 `ScrollArea`。

各个部分需要按固定顺序嵌套。内容区的每个直接子元素都要包在 `MessageScrollerItem` 中，这样 scroller 才能测量、锚定、保持位置、跟踪可见性并跳转到它。`MessageScrollerButton` 位于 `MessageScroller` 内部，viewport 之后。

**不正确：**

```tsx
// 手写的滚动容器，带有手动的滚动到底部逻辑。
<div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
  <div className="flex flex-col gap-6 p-4">
    {messages.map((m) => (
      <ChatMessage key={m.id} message={m} />
    ))}
  </div>
</div>
```

**正确：**

```tsx
<MessageScrollerProvider autoScroll>
  <MessageScroller>
    <MessageScrollerViewport>
      <MessageScrollerContent>
        {messages.map((message) => (
          <MessageScrollerItem
            key={message.id}
            messageId={message.id}
            scrollAnchor={message.role === "user"}
          >
            <Message align={message.role === "user" ? "end" : "start"}>
              {/* ...消息内容... */}
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

---

## Message 行使用 Message

`Message` 布局单行：头像、标题、内容、页脚，并带有
对齐。使用 `MessageGroup` 将同一发送者连续的多行分组。不要
用 flex div 重新构建这一行。

`align="end"` 表示当前用户一侧；`align="start"` 表示其他所有人。

```tsx
<Message align="start">
  <MessageAvatar>
    <Avatar>
      <AvatarImage src={sender.avatar} alt={sender.name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  </MessageAvatar>
  <MessageContent>
    <MessageHeader>{sender.name}</MessageHeader>
    <Bubble>
      <BubbleContent>{text}</BubbleContent>
    </Bubble>
    <MessageFooter>{time}</MessageFooter>
  </MessageContent>
</Message>
```

---

## 消息表面使用 Bubble

有颜色的消息表面是 `Bubble` + `BubbleContent`，绝不是带有 `bg-muted` / `bg-primary` 并手动管理圆角的 styled `div`。

- `variant`：`default`、`secondary`、`muted`、`tinted`、`outline`、`ghost`、`destructive`。
- `align`：`start` 或 `end`（与 `Message` 的侧边一致）。

`BubbleReactions` 用于渲染反应集合。`side`（`top` | `bottom`）和 `align`（`start` | `end`）用于将其定位到气泡旁边。不要用绝对定位的 `Badge` 来布局反应。

**错误：**

```tsx
<div className="w-fit rounded-2xl bg-primary px-3 py-2 text-primary-foreground">
  {text}
</div>
```

**正确：**

```tsx
<Bubble variant="default" align="end">
  <BubbleContent>{text}</BubbleContent>
  <BubbleReactions side="bottom" align="end">
    <Badge variant="secondary">👍 2</Badge>
  </BubbleReactions>
</Bubble>
```

---

## 附件使用 Attachment

文件和图片附件使用 `Attachment`，而不是 `Item` 或自定义卡片。它会
携带上传状态，因此请将 `state` 绑定到真实状态，而不是单独渲染一个
spinner。

- `state`：`idle`、`uploading`、`processing`、`error`、`done`。`uploading` 和
  `processing` 会自动将 `shimmer` 动画应用到标题上。
- `size`：`default`、`sm`、`xs`。`orientation`：`horizontal`、`vertical`。
- 使用 `AttachmentGroup` 将多个附件排布在可滚动的一行中。

```tsx
<Attachment state="done">
  <AttachmentMedia variant="icon">
    <FileTextIcon />
  </AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>homepage-feedback.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction>
      <DownloadIcon />
    </AttachmentAction>
  </AttachmentActions>
</Attachment>
```

对于图片，请使用带有 `img` 子元素的 `<AttachmentMedia variant="image">`。

---

## 系统注释和分隔线使用 Marker

状态行（“Sarah joined the conversation”）、日期分隔符（“Today”）和
带标签的分隔符是 `Marker`，而不是 `Separator` 加一个居中的 span。

- `variant`：`default`（普通行）、`separator`（带两侧横线的居中标签）、`border`（带底部边框的行）。
- `MarkerIcon` 用于放置前置图标；`MarkerContent` 用于放置标签。

**错误：**

```tsx
<div className="flex items-center gap-3 py-2">
  <Separator className="flex-1" />
  <span className="text-xs text-muted-foreground">今天</span>
  <Separator className="flex-1" />
</div>
```

**正确：**

```tsx
<Marker variant="separator">
  <MarkerContent>Today</MarkerContent>
</Marker>
```

---

## 流式传输、锚定和跳转到最新内容都已内置

`MessageScroller` 处理了聊天 UI 通常会重复实现的行为。不要再写 `useStickToBottom` hook、`ResizeObserver`，或者手动计算 `scrollTop`。

- **在流式传输时跟随实时边缘。** 带有 `autoScroll` 的 `MessageScrollerProvider` 会让视图持续固定到新内容上，并在用户向上滚动时立即让出控制权。最后一条消息在流式 token 更新中持续变长时，也会自动跟随。
- **锚定一轮对话。** `MessageScrollerItem` 上的 `scrollAnchor` 会标记需要保持在视图中的那一行（通常是发起这一轮对话的用户消息）。
- **跳转到最新内容。** 当用户滚离当前视图时，`MessageScrollerButton` 会出现，并在点击后滚回去。`direction="end"`（默认）或 `direction="start"`。它是一个自主管理的控件，所以不要用你自己的滚动位置状态去控制它的显示。

如果要在模型生成时显示 “thinking…” 指示器，请对文本应用 `shimmer` 工具类。不要自己编写自定义 keyframe 动画。请参见
[styling.md](./styling.md)。

---

## 逃生通道：滚动器钩子

对于这些部分未暴露的行为，请从钩子中读取状态，而不是重新实现滚动器：`useMessageScroller`、
`useMessageScrollerVisibility` 和 `useMessageScrollerScrollable`。它们来自自动安装的 `@shadcn/react` 依赖，因此无需额外安装。只有在组合方式无法表达你的需求时，才使用它们。
