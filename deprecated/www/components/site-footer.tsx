import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-6 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            <a
              href="https://www.zhcndoc.com/"
              target="_blank"
            >
              简中文档
            </a>
            ｜
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
            >
              沪ICP备2024070610号-3
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
