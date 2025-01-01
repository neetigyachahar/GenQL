"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"
import { Info } from "lucide-react"
import { Button } from "./ui/button"

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">GenQL</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/about">
          <Button variant="outline" size="icon">
            <Info className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
