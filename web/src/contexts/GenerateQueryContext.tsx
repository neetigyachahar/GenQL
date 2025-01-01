"use client"

import { Table } from "@/lib/types"
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react"

interface GenerateQueryContext {
  text: string
  setText: Dispatch<SetStateAction<string>>
  generatedSql: string | null
  setGeneratedSql: Dispatch<SetStateAction<string | null>>
  searchResults: Table[] | null
  setSearchResults: Dispatch<SetStateAction<Table[] | null>>
}

const GenerateQueryContext = createContext<GenerateQueryContext>({
  text: "",
  setText: () => {},
  generatedSql: null,
  setGeneratedSql: () => {},
  searchResults: null,
  setSearchResults: () => {},
})

const GenerateQueryContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [text, setText] = useState("")
  const [generatedSql, setGeneratedSql] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Table[] | null>(null)

  return (
    <GenerateQueryContext.Provider
      value={{
        text,
        setText,
        generatedSql,
        setGeneratedSql,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </GenerateQueryContext.Provider>
  )
}

export { GenerateQueryContext, GenerateQueryContextProvider }
