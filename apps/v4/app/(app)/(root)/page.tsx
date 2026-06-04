import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/styles/radix-nova/ui/button"

import { CardsDemo } from "./cards"

const title = "设计系统的基础"
const description =
  "一套精美设计的组件，您可以对其进行自定义、扩展和构建。从这里开始，然后使其成为您自己的。开源，开放代码。"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader className="md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
        <Announcement />
        <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild className="h-[31px] rounded-lg">
            <Link href="/create?preset=b27GcrRo">
              自己动手打造 <IconArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper flex-1 p-0">
        <div className="container overflow-hidden md:px-0 lg:max-w-none">
          <section className="-mx-4 w-[140vw] overflow-hidden md:hidden">
            <Image
              src="/images/full-light.png"
              width={2560}
              height={2764}
              alt="Dashboard"
              className="block h-auto w-full dark:hidden"
              priority
            />
            <Image
              src="/images/full-dark.png"
              width={2560}
              height={2764}
              alt="Dashboard"
              className="hidden h-auto w-full dark:block"
              priority
            />
          </section>
          <section className="hidden md:block">
            <CardsDemo />
          </section>
        </div>
      </div>
    </div>
  )
}
