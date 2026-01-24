# 示例

此目录包含组件文档的演示组件。

## 目录结构

```
examples
├── base
│   ├── ui           # 由 build-registry.mts 自动生成
│   ├── lib          # 由 build-registry.mts 自动生成
│   ├── hooks        # 由 build-registry.mts 自动生成
│   ├── button-demo.tsx
│   └── ...
├── radix
│   ├── ui           # 由 build-registry.mts 自动生成
│   ├── lib          # 由 build-registry.mts 自动生成
│   ├── hooks        # 由 build-registry.mts 自动生成
│   └── ...
└── __index__.tsx     # 由 build-registry.mts 自动生成
```

## 添加新示例

1. 在 `examples/base` 或 `examples/radix` 中创建一个新的 `.tsx` 文件：

```tsx
// examples/base/button-loading.tsx
import { Button } from "@/examples/base/ui/button"

export function ButtonLoading() {
  return <Button disabled>加载中...</Button>
}
```

2. 运行示例构建以重新生成索引：

```bash
pnpm examples:build
```

3. 通过引用示例名称（文件名去掉 `.tsx`）在文档中使用该示例：

```tsx
<ComponentPreview name="button-loading" />
```

## 备注

- `ui`、`lib` 和 `hooks` 目录是在执行 `pnpm registry:build` 期间自动生成的。请勿直接编辑这些目录下的文件。
- 示例文件应直接放置在 `examples/base` 或 `examples/radix` 目录中，不要放在子目录内。
- 支持命名导出和默认导出。
- 添加或删除示例后，运行 `pnpm examples:build` 以更新索引。