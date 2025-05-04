"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"
import { Info } from "lucide-react"
import { Button } from "./ui/button"
import ProductHuntLabel from "./ProductHuntLabel"
import { FaGithub } from "react-icons/fa"

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">GenQL</h1>
      </Link>
      <div className="flex items-center gap-4">
        <ProductHuntLabel />
        <Link href="/about">
          <Button variant="outline">
            <Info className="h-[1.2rem] w-[1.2rem]" />
            Learn more
          </Button>
        </Link>
        <Link target="_blank" href="https://github.com/neetigyachahar/genql">
          <Button variant="outline">
            <FaGithub className="h-[1.2rem] w-[1.2rem]" />
            Repo
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
