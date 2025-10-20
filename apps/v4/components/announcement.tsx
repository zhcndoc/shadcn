import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="rounded-full">
      <Link href="/docs/changelog">
        <span className="flex size-2 rounded-full bg-blue-500" title="New" />
        新组件：字段、输入组、项目等 <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
