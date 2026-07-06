# 发布

这个 monorepo 使用 [Changesets](https://github.com/changesets/changesets) 独立发布两个包：

- **`shadcn`** —— CLI 和工具。
- **`@shadcn/react`** —— 无头 React 基础组件。

它们各自独立版本演进。对其中一个的更改不会导致另一个升级，除非 changeset 明确说明。

## 1. 添加一个 changeset

每个需要发布的更改都需要一个 changeset。运行：

```sh
pnpm changeset
```

选择受影响的 package(s) 和升级级别。一个 PR 可以为 `shadcn` 和 `@shadcn/react` 携带分别位于不同级别的独立 changeset。没有 changeset 的 PR 不会发布任何内容。

## 2. 稳定版发布

稳定版发布由 `.github/workflows/release.yml` 自动化完成（`release` 作业，在推送到 `main` 时触发）：

1. 已合并的 changeset 会累积到 `main` 上。
2. Changesets 动作会打开/更新一个 **“Version Packages”** PR，用于提升版本并生成更新日志。
3. 合并该 PR 会触发 `changeset publish`，它会构建所有包（`pnpm build:packages`），并发布任何版本号领先于 npm 的包——每个都发布到 `latest` 标签。

`pnpm build:packages`（`turbo run build --filter=./packages/*`）会构建 `shadcn` 和 `@shadcn/react`，但永远不会构建 `apps/v4`。

## 3. 预发布版本（每个 PR 的快照）

将 **`release: beta`** 或 **`release: rc`** 标签添加到一个 PR。`release.yml` 中的 `prerelease` 作业会：

1. 验证该分支是否有 changeset（版本 PR 上的标签不会有任何作用，因为它们已经被消耗了）。
2. 运行 `changeset version --snapshot <channel>` — 为每个包含 changeset 的包打上唯一的 `0.0.0-<channel>-<timestamp>` 版本号。
3. 构建并运行 `changeset publish --tag <channel> --no-git-tag`。
4. 上传已发布包列表；`prerelease-comment.yml` 会为每个包发布一行 `pnpm dlx` 安装命令，并移除该标签。

该标签用于选择 **dist-tag/channel**；分支上的 **changesets** 用于选择哪些包会发布。快照带有时间戳，因此它们永远不会触及 `latest`，也不会发生冲突。

```sh
# 从 PR 评论中安装一个快照，例如：
pnpm dlx @shadcn/react@0.0.0-beta-20260624120000
```

## 4. 预发布列车（持续的 `-beta.N` / `-rc.N`）

对于一个持续进行的发布分支（例如 `1.0.0-rc.0`、`-rc.1`，……），而不是一次性快照，请使用 Changesets 的 pre 模式：

```sh
pnpm changeset pre enter rc   # 写入 .changeset/pre.json
# ...正常的 changeset + Version PR 循环现在会在 rc 标签上生成 -rc.N 版本...
pnpm changeset pre exit       # 回到稳定版；下一个 Version PR 会在 latest 上发布 X.Y.Z
```

## 说明

- `pnpm-workspace.yaml` 设置了 `minimumReleaseAge: 2880`（48 小时），因此新发布的稳定版/测试版版本在正常安装时需要一段时间才会解析到。请使用 `pnpm dlx <pkg>@<exact-snapshot-version>` 立即进行测试。
- 发布使用 npm OIDC/provenance（`id-token: write` + `npm@latest`）；不需要 `NPM_TOKEN` 密钥。
