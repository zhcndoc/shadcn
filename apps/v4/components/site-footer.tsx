// import { siteConfig } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent dark:group-has-[.section-soft]/body:bg-surface/40 group-has-[.docs-nav]/body:pb-20 group-has-[[data-slot=designer]]/body:hidden group-has-[[data-slot=docs]]/body:hidden group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-(--footer-height) items-center justify-between">
          <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
            <a
              href="https://www.zhcndoc.com"
              target="_blank"
            >
              简中文档
            </a>
            ｜
            <a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="noopener noreferrer"
            >
              沪ICP备2024070610号-3
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
