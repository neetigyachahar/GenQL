import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Mic, History, Sparkles } from "lucide-react"
import { EXAMPLE_QUERIES, MAX_HISTORY } from "@/lib/constants"

const GenerateQueryInput = ({
  onGenerate,
  isLoading,
}: {
  onGenerate: (query: string) => void
  isLoading: boolean
}) => {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [queryHistory, setQueryHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("queryHistory")
    return saved ? JSON.parse(saved) : []
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  const toggleListening = () => {
    if (isLoading) return

    if (isListening) {
      recognition.current?.stop()
      setIsListening(false)
      return
    }

    if ("webkitSpeechRecognition" in window) {
      recognition.current = new (window as any).webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false

      recognition.current.onstart = () => setIsListening(true)
      recognition.current.onend = () => setIsListening(false)
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
      }

      recognition.current.start()
    } else {
      alert("Voice input is not supported in your browser")
    }
  }

  const addToHistory = (newQuery: string) => {
    const updatedHistory = [
      newQuery,
      ...queryHistory.filter((q) => q !== newQuery),
    ].slice(0, MAX_HISTORY)
    setQueryHistory(updatedHistory)
    localStorage.setItem("queryHistory", JSON.stringify(updatedHistory))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onGenerate(query)
      addToHistory(query)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`
          relative rounded-xl border-2 border-gray-300
          p-4 transition-all duration-300 ease-in-out
          dark:border-gray-700
        hover:border-gray-600
        dark:hover:border-gray-600
        focus-within:border-red-700
        bg-white dark:bg-[#252525] shadow-sm hover:shadow-md
        `}
      >
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your query in plain English..."
              className={`
                w-full text-lg font-medium 
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none py-2 pr-24 pl-3 rounded-lg
                bg-transparent
                transition-all duration-300
                text-gray-900 dark:text-gray-100
              `}
              disabled={isLoading}
            />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-2 bg-white dark:bg-[#252525] px-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Show history and suggestions"
              >
                <History className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`
                  text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
                  ${
                    isListening
                      ? "text-red-500 dark:text-red-400 animate-pulse"
                      : ""
                  }
                `}
                onClick={toggleListening}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className={`
              min-w-[140px] bg-gradient-to-r from-blue-500 to-blue-600
              dark:from-blue-600 dark:to-blue-700
              hover:from-blue-600 hover:to-blue-700
              dark:hover:from-blue-700 dark:hover:to-blue-800
              text-white font-semibold px-6 py-3
              transition-all duration-300 ease-in-out
              transform hover:scale-105
              disabled:opacity-80 disabled:hover:scale-100
              ${isLoading ? "animate-pulse" : ""}
            `}
            disabled={!query.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate SQL
              </>
            )}
          </Button>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-20 max-h-80 overflow-y-auto"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Suggestions
              </div>
              {EXAMPLE_QUERIES.map((example, index) => (
                <button
                  key={`example-${index}`}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
                  onClick={() => {
                    if (isLoading) return
                    setQuery(example)
                    setShowDropdown(false)
                  }}
                >
                  {example}
                </button>
              ))}
            </div>

            {queryHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recent Queries
                </div>
                {queryHistory.map((historyItem, index) => (
                  <button
                    key={`history-${index}`}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
                    onClick={() => {
                      if (isLoading) return
                      setQuery(historyItem)
                      setShowDropdown(false)
                    }}
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default GenerateQueryInput
