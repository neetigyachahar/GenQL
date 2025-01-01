"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" />
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={cycleTheme}>
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
              } absolute`}
            />

            <Moon
              className={`h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
              } absolute`}
            />

            <Monitor
              className={`h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90"
              } absolute`}
            />

            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle theme (Light/Dark/System)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ThemeToggle
