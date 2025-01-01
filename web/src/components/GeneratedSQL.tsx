import React, { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Card } from "@/components/ui/card"
import { Copy, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "sql-formatter"
import { useTheme } from "next-themes"

const GeneratedSQL = ({ text = "", speed = 20 }) => {
  text = format(text, {
    language: "postgresql",
    tabWidth: 2,
    linesBetweenQueries: 2,
  })

  const { resolvedTheme } = useTheme()

  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    if (!text.includes(displayedText)) {
      setDisplayedText("")
      setCurrentIndex(0)
      return
    }
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, speed])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    monaco.editor.defineTheme("transparentTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000",
      },
    })

    if (resolvedTheme !== "light") monaco.editor.setTheme("transparentTheme")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: "off",
    folding: false,
    renderValidationDecorations: "off",
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    readOnlyMessage: { value: "Generated SQL" },
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
    },
    renderLineHighlight: "none",
    cursorStyle: "hidden",
    glyphMargin: false,
    fontSize: 16,
    wordWrap: "on",
    wordWrapColumn: 60,
    wrappingIndent: "indent",
    formatOnType: true,
    formatOnPaste: true,
  }

  return (
    <Card className="relative w-full max-w-xl bg-transparent border-none shadow-none p-4  h-full overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-gray-200"
        >
          {copied ? (
            <CheckCheck className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Editor
        className="bg-transparent"
        defaultLanguage="sql"
        value={displayedText}
        theme={resolvedTheme === "light" ? "light" : "transparentTheme"}
        options={editorOptions}
        loading=""
        onMount={handleEditorDidMount}
      />
    </Card>
  )
}

export default GeneratedSQL
