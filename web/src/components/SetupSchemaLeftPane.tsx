"use client"

import { Braces, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useContext, useRef } from "react"
import JsonEditor from "./JsonEditor"
import { IndexDatabaseContext } from "@/contexts/IndexDatabaseContext"
import useIndexSchema from "@/hooks/useIndexSchema"
import LoadingPopup from "./LoadingPopup"
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"

import IndexError from "@/components/md/IndexError.mdx"
import DeleteSchemaButton from "./DeleteSchemaButton"

const SetupSchemaLeftPane = () => {
  const schemaEditorRef = useRef<any>(null)
  const { jsonEditorValue, setJsonEditorValue, isSchemaIndexed } =
    useContext(IndexDatabaseContext)

  const {
    indexSchema,
    indexProgress,
    isIndexing,
    error,
    resetIndex,
    deleteSchema,
    deletingSchema,
  } = useIndexSchema()

  const createSchemaButton = (
    <Button
      disabled={!Boolean(jsonEditorValue)}
      onClick={indexSchema}
      className="max-w-80 w-full rounded-none disabled:select-none"
    >
      <Plus /> Index schema
    </Button>
  )

  const deleteSchemaButton = (
    <DeleteSchemaButton isLoading={deletingSchema} onDelete={deleteSchema} />
  )

  const formatJson = () => {
    if (schemaEditorRef.current) {
      schemaEditorRef.current.formatJson()
    }
  }

  return (
    <section className="relative w-full flex flex-col items-center justify-center">
      <div className="w-full h-[42px] p-2 text-sm border-b text-gray-400 flex justify-between items-center">
        <p className="">Database schema</p>
        <Button
          variant="outline"
          asChild
          className="p-1 h-6 w-6"
          size={"icon"}
          onClick={formatJson}
        >
          <Braces />
        </Button>
      </div>
      <JsonEditor
        ref={schemaEditorRef}
        value={jsonEditorValue}
        onChange={setJsonEditorValue}
        isLocked={isSchemaIndexed}
      />
      <div className="m-2 mx-auto ">
        {!isSchemaIndexed && createSchemaButton}
        {isSchemaIndexed && deleteSchemaButton}
      </div>
      <LoadingPopup
        isOpen={isIndexing}
        progress={indexProgress}
        message="Indexing database schema..."
      />
      <Dialog open={Boolean(error)} onOpenChange={resetIndex}>
        <DialogTitle className="sr-only">Error</DialogTitle>
        <DialogContent className="sm:max-w-md">
          <article className=" mx-auto min-w-96 prose prose-sm prose-slate dark:prose-invert">
            <IndexError {...{ error }} components={{}} />
          </article>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default SetupSchemaLeftPane
