"use client"

import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react"

interface IndexDatabaseContext {
  jsonEditorValue: string
  setJsonEditorValue: Dispatch<SetStateAction<any>>
  referenceId: string | null
  setReferenceId: Dispatch<SetStateAction<string | null>>
  isSchemaIndexed: boolean
}

const IndexDatabaseContext = createContext<IndexDatabaseContext>({
  jsonEditorValue: "",
  setJsonEditorValue: () => {},
  referenceId: null,
  setReferenceId: () => {},
  isSchemaIndexed: false,
})

const IndexDatabaseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [jsonEditorValue, setJsonEditorValue] = useState("")
  const [referenceId, setReferenceId] = useState<string | null>(null)

  return (
    <IndexDatabaseContext.Provider
      value={{
        jsonEditorValue,
        setJsonEditorValue,
        referenceId,
        setReferenceId,
        isSchemaIndexed: Boolean(referenceId),
      }}
    >
      {children}
    </IndexDatabaseContext.Provider>
  )
}

export { IndexDatabaseContext, IndexDatabaseProvider }
