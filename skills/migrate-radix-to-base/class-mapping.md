# 类字符串重写（第 2 层）

将这些应用于所有类字符串（className、cva 定义、cn 调用），包括应用代码。它们是安全的、机械式的重写。

## 数据属性选择器

| Radix 模式 | Base UI 模式 |
|---|---|
| `data-[state=open]:` | `data-open:` |
| `data-[state=closed]:` | `data-closed:` |
| `data-[state=checked]:` | `data-checked:` |
| `data-[state=unchecked]:` | `data-unchecked:` |
| `data-[state=active]:`（选项卡） | `data-active:` |
| `data-[state=on]:`（切换） | `data-pressed:` |
| `data-[highlighted]:` | `data-highlighted:`（不变） |
| `data-[disabled]:` | `data-disabled:`（不变） |
| `data-[side=...]:` | `data-[side=...]:`（不变，仍为参数化） |
| `group-data-[state=open]` / `peer-data-[state=open]` | `group-data-open` / `peer-data-open` |
| 子菜单触发器打开标记 `data-[state=open]:` | `data-popup-open:` |

## 动画习惯用法

Radix（tw-animate/keyframes）：
`data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0`

Base UI（transition + 起始/结束样式）：
`transition-[opacity,transform] data-starting-style:opacity-0 data-ending-style:opacity-0`（以及对应的 translate/scale 版本）。

不要将 animate-in/out 工具类逐字对应翻译；应改用
`data-starting-style:` / `data-ending-style:` 过渡来重新表述其意图。当原文
使用按侧边划入的类时，保留 `data-[side=...]` 或
`data-[swipe-direction=...]` 参数化写法。

## CSS 变量

| Radix 变量 | Base UI 变量 |
|---|---|
| `--radix-<comp>-content-transform-origin` | `--transform-origin` |
| `--radix-<comp>-content-available-height` | `--available-height` |
| `--radix-<comp>-content-available-width` | `--available-width` |
| `--radix-<comp>-trigger-width` | `--anchor-width` |
| `--radix-<comp>-trigger-height` | `--anchor-height` |
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-collapsible-content-height` | `--collapsible-panel-height` |
| `--radix-navigation-menu-viewport-height/width` | `--positioner-height` / `--positioner-width` |

## 元素变化会使伪类变体失效

当某个部分渲染的元素从表单控件变为通用元素时（checkbox/switch/radio 的 Root 在 Base UI 中会渲染 `<span>`），`disabled:` 和 `:disabled` 这些 Tailwind 变体就会变成死代码。请将它们替换为等价的 `data-disabled:`。 （注意：shadcn base registry 的 checkbox 仍然带有这些失效的 `disabled:*` 类；这应视为上游的一个特例，而不是可以照搬的模式。）

## 禁用状态的 hooks

某些 Base UI 触发器会将禁用状态以 `aria-disabled` 而不是
`disabled` 属性的形式呈现（accordion trigger、tabs tab）。对于 radix 代码中
使用了 `disabled:opacity-50` 的地方，请根据包装器的参考文件添加或替换为
`aria-disabled:opacity-50`。
