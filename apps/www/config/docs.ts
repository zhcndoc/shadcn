import { MainNavItem, SidebarNavItem } from "types/nav"

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  chartsNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "首页",
      href: "/",
    },
    {
      title: "文档",
      href: "/docs",
    },
    {
      title: "组件",
      href: "/docs/components/accordion",
    },
    {
      title: "区块",
      href: "/blocks",
    },
    {
      title: "图表",
      href: "/charts",
    },
    {
      title: "主题",
      href: "/themes",
    },
    {
      title: "颜色",
      href: "/colors",
    },
  ],
  sidebarNav: [
    {
      title: "开始使用",
      items: [
        {
          title: "介绍",
          href: "/docs",
          items: [],
        },
        {
          title: "安装",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "components.json",
          href: "/docs/components-json",
          items: [],
        },
        {
          title: "主题",
          href: "/docs/theming",
          items: [],
        },
        {
          title: "深色模式",
          href: "/docs/dark-mode",
          items: [],
        },
        {
          title: "CLI",
          href: "/docs/cli",
          items: [],
        },
        {
          title: "Monorepo",
          href: "/docs/monorepo",
          items: [],
        },
        {
          title: "Tailwind v4",
          href: "/docs/tailwind-v4",
          items: [],
          label: "New",
        },
        {
          title: "Next.js 15 + React 19",
          href: "/docs/react-19",
          items: [],
        },
        {
          title: "排版",
          href: "/docs/components/typography",
          items: [],
        },
        {
          title: "在 v0 中打开",
          href: "/docs/v0",
          items: [],
        },
        {
          title: "区块",
          href: "/docs/blocks",
          items: [],
        },
        {
          title: "Figma",
          href: "/docs/figma",
          items: [],
        },
        {
          title: "更新日志",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
    {
      title: "安装",
      items: [
        {
          title: "Next.js",
          href: "/docs/installation/next",
          items: [],
        },
        {
          title: "Vite",
          href: "/docs/installation/vite",
          items: [],
        },
        {
          title: "Laravel",
          href: "/docs/installation/laravel",
          items: [],
        },
        {
          title: "React Router",
          href: "/docs/installation/react-router",
          items: [],
        },
        {
          title: "Remix",
          href: "/docs/installation/remix",
          items: [],
        },
        {
          title: "Astro",
          href: "/docs/installation/astro",
          items: [],
        },
        {
          title: "Tanstack Start",
          href: "/docs/installation/tanstack",
          items: [],
        },
        {
          title: "Tanstack Router",
          href: "/docs/installation/tanstack-router",
          items: [],
        },
        {
          title: "手动安装",
          href: "/docs/installation/manual",
          items: [],
        },
      ],
    },
    {
      title: "组件",
      items: [
        {
          title: "手风琴 Accordion",
          href: "/docs/components/accordion",
          items: [],
        },
        {
          title: "警告 Alert",
          href: "/docs/components/alert",
          items: [],
        },
        {
          title: "警告对话框 Alert Dialog",
          href: "/docs/components/alert-dialog",
          items: [],
        },
        {
          title: "纵横比 Aspect Ratio",
          href: "/docs/components/aspect-ratio",
          items: [],
        },
        {
          title: "头像 Avatar",
          href: "/docs/components/avatar",
          items: [],
        },
        {
          title: "徽章 Badge",
          href: "/docs/components/badge",
          items: [],
        },
        {
          title: "面包屑 Breadcrumb",
          href: "/docs/components/breadcrumb",
          items: [],
        },
        {
          title: "按钮 Button",
          href: "/docs/components/button",
          items: [],
        },
        {
          title: "日历 Calendar",
          href: "/docs/components/calendar",
          items: [],
        },
        {
          title: "卡片 Card",
          href: "/docs/components/card",
          items: [],
        },
        {
          title: "轮播图 Carousel",
          href: "/docs/components/carousel",
          items: [],
        },
        {
          title: "图表 Chart",
          href: "/docs/components/chart",
          items: [],
        },
        {
          title: "复选框 Checkbox",
          href: "/docs/components/checkbox",
          items: [],
        },
        {
          title: "可折叠组件 Collapsible",
          href: "/docs/components/collapsible",
          items: [],
        },
        {
          title: "组合框 Combobox",
          href: "/docs/components/combobox",
          items: [],
        },
        {
          title: "命令 Command",
          href: "/docs/components/command",
          items: [],
        },
        {
          title: "上下文菜单 Context Menu",
          href: "/docs/components/context-menu",
          items: [],
        },
        {
          title: "数据表格 Data Table",
          href: "/docs/components/data-table",
          items: [],
        },
        {
          title: "日期选择器 Date Picker",
          href: "/docs/components/date-picker",
          items: [],
        },
        {
          title: "对话框 Dialog",
          href: "/docs/components/dialog",
          items: [],
        },
        {
          title: "抽屉 Drawer",
          href: "/docs/components/drawer",
          items: [],
        },
        {
          title: "下拉菜单 Dropdown Menu",
          href: "/docs/components/dropdown-menu",
          items: [],
        },
        {
          title: "表单 Form",
          href: "/docs/components/form",
          items: [],
        },
        {
          title: "悬停卡片 Hover Card",
          href: "/docs/components/hover-card",
          items: [],
        },
        {
          title: "输入 Input",
          href: "/docs/components/input",
          items: [],
        },
        {
          title: "输入一次性密码 Input OTP",
          href: "/docs/components/input-otp",
          items: [],
        },
        {
          title: "标签 Label",
          href: "/docs/components/label",
          items: [],
        },
        {
          title: "菜单栏 Menubar",
          href: "/docs/components/menubar",
          items: [],
        },
        {
          title: "导航菜单 Navigation Menu",
          href: "/docs/components/navigation-menu",
          items: [],
        },
        {
          title: "分页 Pagination",
          href: "/docs/components/pagination",
          items: [],
        },
        {
          title: "弹出框 Popover",
          href: "/docs/components/popover",
          items: [],
        },
        {
          title: "进度 Progress",
          href: "/docs/components/progress",
          items: [],
        },
        {
          title: "单选组 Radio Group",
          href: "/docs/components/radio-group",
          items: [],
        },
        {
          title: "可调整大小 Resizable",
          href: "/docs/components/resizable",
          items: [],
        },
        {
          title: "滚动区域 Scroll Area",
          href: "/docs/components/scroll-area",
          items: [],
        },
        {
          title: "选择 Select",
          href: "/docs/components/select",
          items: [],
        },
        {
          title: "分隔符 Separator",
          href: "/docs/components/separator",
          items: [],
        },
        {
          title: "抽屉 Sheet",
          href: "/docs/components/sheet",
          items: [],
        },
        {
          title: "侧边栏 Sidebar",
          href: "/docs/components/sidebar",
          items: [],
        },
        {
          title: "骨架 Skeleton",
          href: "/docs/components/skeleton",
          items: [],
        },
        {
          title: "滑块 Slider",
          href: "/docs/components/slider",
          items: [],
        },
        {
          title: "吐司 Sonner",
          href: "/docs/components/sonner",
          items: [],
        },
        {
          title: "开关 Switch",
          href: "/docs/components/switch",
          items: [],
        },
        {
          title: "表格 Table",
          href: "/docs/components/table",
          items: [],
        },
        {
          title: "标签 Tabs",
          href: "/docs/components/tabs",
          items: [],
        },
        {
          title: "文本区域 Textarea",
          href: "/docs/components/textarea",
          items: [],
        },
        {
          title: "弹窗 Toast",
          href: "/docs/components/toast",
          items: [],
        },
        {
          title: "切换 Toggle",
          href: "/docs/components/toggle",
          items: [],
        },
        {
          title: "切换组 Toggle Group",
          href: "/docs/components/toggle-group",
          items: [],
        },
        {
          title: "工具提示 Tooltip",
          href: "/docs/components/tooltip",
          items: [],
        },
      ],
    },
    {
      title: "注册表",
      label: "新",
      items: [
        {
          title: "介绍",
          href: "/docs/registry",
          items: [],
        },
        {
          title: "开始使用",
          href: "/docs/registry/getting-started",
          items: [],
        },
        {
          title: "示例",
          href: "/docs/registry/examples",
          items: [],
        },
        {
          title: "在 v0 中打开",
          href: "/docs/registry/open-in-v0",
          items: [],
        },
        {
          title: "常见问题",
          href: "/docs/registry/faq",
          items: [],
        },
        {
          title: "registry.json",
          href: "/docs/registry/registry-json",
          items: [],
        },
        {
          title: "registry-item.json",
          href: "/docs/registry/registry-item-json",
          items: [],
        },
      ],
    },
  ],
  chartsNav: [
    {
      title: "开始使用",
      items: [
        {
          title: "介绍",
          href: "/docs/charts",
          items: [],
        },
        {
          title: "安装",
          href: "/docs/charts/installation",
          items: [],
        },
        {
          title: "主题",
          href: "/docs/charts/theming",
          items: [],
        },
      ],
    },
    {
      title: "图表",
      items: [
        {
          title: "面积图",
          href: "/docs/charts/area",
          items: [],
        },
        {
          title: "柱状图",
          href: "/docs/charts/bar",
          items: [],
        },
        {
          title: "折线图",
          href: "/docs/charts/line",
          items: [],
        },
        {
          title: "饼图",
          href: "/docs/charts/pie",
          items: [],
        },
        {
          title: "雷达图",
          href: "/docs/charts/radar",
          items: [],
        },
        {
          title: "径向图",
          href: "/docs/charts/radial",
          items: [],
        },
      ],
    },
    {
      title: "组件",
      items: [
        {
          title: "Tooltip",
          href: "/docs/charts/tooltip",
          items: [],
        },
        {
          title: "Legend",
          href: "/docs/charts/legend",
          items: [],
        },
      ],
    },
  ],
}
